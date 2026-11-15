// Short, human-friendly order number from a Stripe Checkout Session id.
// "cs_live_a1B2c3D4e5F6..." -> "A1B2C3D4E5"
export function orderReference(sessionId: string) {
  return sessionId
    .replace(/^cs_(test|live)_/, "")
    .slice(0, 10)
    .toUpperCase();
}

export const FULFILLMENT_STATUSES = [
  "processing",
  "shipped",
  "delivered",
  "canceled",
] as const;
export type FulfillmentStatus = (typeof FULFILLMENT_STATUSES)[number];

export function isFulfillmentStatus(
  value: unknown,
): value is FulfillmentStatus {
  return (
    typeof value === "string" &&
    (FULFILLMENT_STATUSES as readonly string[]).includes(value)
  );
}

// What a customer sees on their account page. A refund overrides shipping.
export function displayOrderStatus(order: {
  status: string;
  fulfillment_status?: string | null;
}): FulfillmentStatus | "refunded" {
  if (order.status === "refunded") return "refunded";
  return isFulfillmentStatus(order.fulfillment_status)
    ? order.fulfillment_status
    : "processing";
}

// Only allow http(s) links in emails and on the account page.
export function safeTrackingUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export type OrderItem = {
  id: number;
  name: string;
  selectedSize?: string;
  quantity: number;
  price: number | null;
  image_url?: string | null;
};
