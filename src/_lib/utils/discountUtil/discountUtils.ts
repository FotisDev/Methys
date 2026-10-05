export const DISCOUNT_PERCENT = 20;

export function calculateDiscountPrice(
  originalPrice: number,
  isOffer?: boolean,
): number {
  if (!isOffer || originalPrice <= 0) return originalPrice;
  return originalPrice * (1 - DISCOUNT_PERCENT / 100);
}

type PricedProduct = {
  price: number | string;
  is_offer?: boolean | null;
  product_variants?: { size: string; price?: number | string | null }[] | null;
};

// Single source of truth for what a product costs. Every page, the cart and the
// Stripe checkout use this, so the shown price is always the charged price.
export function getProductPricing(
  product: PricedProduct,
  selectedSize?: string | null,
) {
  const variantPrice = selectedSize
    ? product.product_variants?.find((v) => v.size === selectedSize)?.price
    : null;

  const originalPrice = Number(variantPrice || product.price) || 0;
  const isDiscounted = !!product.is_offer && originalPrice > 0;
  const finalPrice =
    Math.round(calculateDiscountPrice(originalPrice, isDiscounted) * 100) / 100;

  return { originalPrice, finalPrice, isDiscounted };
}
