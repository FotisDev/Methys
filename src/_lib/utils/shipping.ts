export const FREE_SHIPPING_THRESHOLD = 150;
export const SHIPPING_FEE = 4.95;

// Single source of truth for shipping. The cart, checkout summary and the
// Stripe session all use this, so the shown fee is always the charged fee.
// The threshold applies to the subtotal before discount codes.
export function getShipping(subtotal: number) {
  const isFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const remaining = isFree
    ? 0
    : Math.round((FREE_SHIPPING_THRESHOLD - subtotal) * 100) / 100;
  const progress = Math.min(Math.max(subtotal / FREE_SHIPPING_THRESHOLD, 0), 1);

  return { fee: isFree ? 0 : SHIPPING_FEE, isFree, remaining, progress };
}
