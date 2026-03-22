import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/_lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function fulfillOrder(session: Stripe.Checkout.Session) {
  const shippingInfo = session.metadata?.shipping_info
    ? JSON.parse(session.metadata.shipping_info)
    : {};

  const cartItems = session.metadata?.cart_items
    ? JSON.parse(session.metadata.cart_items)
    : [];

  const { error } = await supabaseAdmin.from("orders").insert({
    user_id: session.metadata?.user_id ?? null,
    stripe_session_id: session.id,
    stripe_payment_intent_id: session.payment_intent,
    status: "paid",
    total_amount: (session.amount_total ?? 0) / 100,
    currency: session.currency ?? "eur",
    customer_info: shippingInfo,
    items: cartItems,
  });

  if (error) {
    console.error("Failed to save order to Supabase:", error.message);
    throw new Error(error.message);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.log('failed',err)
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      await fulfillOrder(session);
      break;

    case "charge.refunded":
      const charge = event.data.object as Stripe.Charge;
      await supabaseAdmin 
        .from("orders")
        .update({ status: "refunded" })
        .eq("stripe_payment_intent_id", charge.payment_intent);
      break;

    case "payment_intent.payment_failed":
      break;
  }

  return NextResponse.json({ received: true });
}
