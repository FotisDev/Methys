// Short, human-friendly order number from a Stripe Checkout Session id.
// "cs_live_a1B2c3D4e5F6..." -> "A1B2C3D4E5"
export function orderReference(sessionId: string) {
  return sessionId
    .replace(/^cs_(test|live)_/, "")
    .slice(0, 10)
    .toUpperCase();
}

// What a customer sees on their account page: orders are saved once Stripe
// confirms the payment, so an order is either paid or (later) refunded.
export function displayOrderStatus(order: { status: string }) {
  return order.status === "refunded" ? "refunded" : "paid";
}

// Only allow http(s) links (e.g. a collaborator's website).
export function safeHttpUrl(value: unknown): string | null {
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
