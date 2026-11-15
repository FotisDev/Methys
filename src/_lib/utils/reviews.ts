export type ProductReview = {
  id: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string;
  created_at: string;
  photo_urls?: string[] | null;
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

export const MAX_REVIEW_PHOTOS = 3;
export const MAX_REVIEW_PHOTO_BYTES = 5 * 1024 * 1024;

// Identifies JPEG, PNG and WebP from their first bytes. The browser-supplied
// MIME type can't be trusted, so uploads are checked by content.
export function detectImageType(
  bytes: Uint8Array,
): "jpeg" | "png" | "webp" | null {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "jpeg";
  }
  if (
    bytes.length >= 8 &&
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (b, i) => bytes[i] === b,
    )
  ) {
    return "png";
  }
  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  ) {
    return "webp";
  }
  return null;
}
