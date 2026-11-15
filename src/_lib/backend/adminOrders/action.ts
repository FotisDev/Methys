"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/_lib/backend/auth";
import { supabaseAdmin } from "@/_lib/supabase/admin";
import { sendShippingNotification } from "@/_lib/backend/email/transactional";
import {
  FULFILLMENT_STATUSES,
  orderReference,
  safeTrackingUrl,
} from "@/_lib/utils/orders";

const schema = z.object({
  orderId: z.string().min(1),
  fulfillmentStatus: z.enum(FULFILLMENT_STATUSES),
  trackingNumber: z.string().trim().max(100).optional(),
  trackingUrl: z.string().trim().max(500).optional(),
});

// Saves status + tracking. Moving an order to "shipped" for the first time
// emails the customer.
export async function updateOrderFulfillment(formData: FormData) {
  await requireAdmin();

  const parsed = schema.safeParse({
    orderId: formData.get("orderId"),
    fulfillmentStatus: formData.get("fulfillmentStatus"),
    trackingNumber: formData.get("trackingNumber") ?? undefined,
    trackingUrl: formData.get("trackingUrl") ?? undefined,
  });
  if (!parsed.success) throw new Error("Invalid order update");

  const { orderId, fulfillmentStatus, trackingNumber } = parsed.data;
  const trackingUrl = safeTrackingUrl(parsed.data.trackingUrl);

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select(
      "id, stripe_session_id, fulfillment_status, shipped_at, customer_info, locale",
    )
    .eq("id", orderId)
    .single();
  if (error || !order) throw new Error("Order not found");

  const firstTimeShipped = fulfillmentStatus === "shipped" && !order.shipped_at;

  const { error: updateError } = await supabaseAdmin
    .from("orders")
    .update({
      fulfillment_status: fulfillmentStatus,
      tracking_number: trackingNumber || null,
      tracking_url: trackingUrl,
      ...(firstTimeShipped && { shipped_at: new Date().toISOString() }),
    })
    .eq("id", orderId);
  if (updateError) throw new Error(updateError.message);

  const customer = (order.customer_info ?? {}) as {
    name?: string;
    email?: string;
  };
  if (firstTimeShipped && customer.email) {
    try {
      await sendShippingNotification({
        email: customer.email,
        name: customer.name ?? "",
        locale: order.locale,
        reference: orderReference(order.stripe_session_id),
        trackingNumber: trackingNumber || null,
        trackingUrl,
      });
    } catch (err) {
      console.error(`Shipping email failed for order ${orderId}:`, err);
    }
  }

  revalidatePath("/[lang]/admin/orders", "page");
  revalidatePath("/[lang]/account", "page");
}
