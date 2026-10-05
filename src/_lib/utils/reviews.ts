export type ProductReview = {
  id: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string;
  created_at: string;
};

export function summarizeReviews(reviews: Pick<ProductReview, "rating">[]) {
  const count = reviews.length;
  const average =
    count === 0
      ? 0
      : Math.round(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10,
        ) / 10;
  return { count, average };
}

type OrderItems = { items: unknown };

// orders.items is the cart snapshot saved by the Stripe webhook: [{ id, ... }].
export function hasPurchasedProduct(orders: OrderItems[], productId: number) {
  return orders.some(
    (order) =>
      Array.isArray(order.items) &&
      order.items.some(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          Number((item as { id?: unknown }).id) === productId,
      ),
  );
}

// "Fotis Lirakis" -> "Fotis L." so reviews don't publish full names.
export function reviewAuthorName(
  firstName: unknown,
  lastName: unknown,
  fallback: string,
) {
  const first = typeof firstName === "string" ? firstName.trim() : "";
  const last = typeof lastName === "string" ? lastName.trim() : "";
  if (!first) return fallback;
  return last ? `${first} ${last[0].toUpperCase()}.` : first;
}
