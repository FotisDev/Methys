import Stripe from "stripe";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/_lib/supabase/admin";
import { getStripe } from "@/_lib/backend/stripe/client";
import { sendOrderConfirmation } from "@/_lib/backend/email/transactional";
import {
  toOrderLines,
  unpackMetadata,
  type OrderLine,
} from "@/_lib/utils/stripeMetadata";
import { orderReference, type OrderItem } from "@/_lib/utils/orders";
import { env } from "@/env";

type ShippingInfo = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
};

// Names, images and paid prices for the order snapshot. Prices come from
// Stripe's line items (what the customer actually paid), in the same order the
// checkout created them.
async function buildOrderItems(
  sessionId: string,
  lines: OrderLine[],
): Promise<OrderItem[]> {
  const [{ data: products }, lineItems] = await Promise.all([
    supabaseAdmin
      .from("products")
      .select("id, name, image_url")
      .in(
        "id",
        lines.map((l) => l.id),
      ),
    getStripe()
      .checkout.sessions.listLineItems(sessionId, { limit: 100 })
      .then((res) => res.data)
      .catch(() => [] as Stripe.LineItem[]),
  ]);

  const byId = new Map(
    (products ?? []).map(
      (p: { id: number; name: string; image_url: unknown }) => [p.id, p],
    ),
  );
  const pricesMatch = lineItems.length === lines.length;

  return lines.map((line, i) => {
    const product = byId.get(line.id);
    const lineItem = pricesMatch ? lineItems[i] : undefined;
    const image = Array.isArray(product?.image_url)
      ? (product.image_url[0] ?? null)
      : null;
    return {
      id: line.id,
      name: product?.name ?? lineItem?.description ?? `#${line.id}`,
      ...(line.size && { selectedSize: line.size }),
      quantity: line.quantity,
      price: lineItem?.price?.unit_amount
        ? lineItem.price.unit_amount / 100
        : null,
      image_url: image,
    };
  });
}

async function fulfillOrder(session: Stripe.Checkout.Session) {
  const metadata = session.metadata ?? {};
  const shippingInfo =
    unpackMetadata<ShippingInfo>(metadata, "shipping", "shipping_info") ?? {};
  const lines = toOrderLines(
    unpackMetadata(metadata, "cart", "cart_items") ?? [],
  );
  const userId = metadata.user_id || null;
  const locale = metadata.locale || "en";
  const items = await buildOrderItems(session.id, lines);

  // Stripe can deliver the same event more than once. ignoreDuplicates makes
  // the insert a no-op for a session we already saved, and then nothing is
  // returned, so stock and emails are handled exactly once.
  const { data: inserted, error } = await supabaseAdmin
    .from("orders")
    .upsert(
      {
        user_id: userId,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
        status: "paid",
        total_amount: (session.amount_total ?? 0) / 100,
        currency: session.currency ?? "eur",
        customer_info: shippingInfo,
        items,
        locale,
      },
      { onConflict: "stripe_session_id", ignoreDuplicates: true },
    )
    .select("id");

  if (error) {
    console.error("Failed to save order to Supabase:", error.message);
    // A 500 makes Stripe retry later.
    throw new Error(error.message);
  }
  if (!inserted || inserted.length === 0) return; // already fulfilled

  const orderId = inserted[0].id;

  const { error: stockError } = await supabaseAdmin.rpc("decrement_stock", {
    items: lines.filter((l) => l.size),
  });
  if (stockError) {
    // The payment went through; don't fail the webhook over bookkeeping.
    console.error(`Stock update failed for order ${orderId}:`, stockError);
  }
  revalidateTag("products", { expire: 0 });

  if (userId) {
    await supabaseAdmin.from("saved_carts").delete().eq("user_id", userId);
  }

  const email = session.customer_details?.email ?? shippingInfo.email;
  if (!email) return;

  try {
    await sendOrderConfirmation({
      email,
      name: shippingInfo.name ?? session.customer_details?.name ?? "",
      locale,
      reference: orderReference(session.id),
      items,
      total: (session.amount_total ?? 0) / 100,
      currency: session.currency ?? "eur",
      address: [
        shippingInfo.address,
        [shippingInfo.zipCode, shippingInfo.city].filter(Boolean).join(" "),
      ]
        .filter(Boolean)
        .join(", "),
    });
    await supabaseAdmin
      .from("orders")
      .update({ confirmation_sent_at: new Date().toISOString() })
      .eq("id", orderId);
  } catch (err) {
    console.error(`Confirmation email failed for order ${orderId}:`, err);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!signature) throw new Error("Missing stripe-signature header");
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Stripe webhook signature check failed:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Delayed payment methods complete later via async_payment_succeeded.
        if (session.payment_status !== "unpaid") await fulfillOrder(session);
        break;
      }

      case "checkout.session.async_payment_succeeded":
        await fulfillOrder(event.data.object as Stripe.Checkout.Session);
        break;

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await supabaseAdmin
          .from("orders")
          .update({ status: "refunded" })
          .eq("stripe_payment_intent_id", charge.payment_intent);
        break;
      }
    }
  } catch (err) {
    console.error(`Stripe webhook ${event.type} failed:`, err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
