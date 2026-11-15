export const LOW_STOCK_THRESHOLD = 5;

type Variant = { quantity: number };

// Total stock across all sizes, and whether it is low enough to tell
// shoppers ("Only 3 left") without revealing large stock counts.
export function getStockStatus(variants: Variant[] | null | undefined) {
  const total = (variants ?? []).reduce(
    (sum, v) => sum + Math.max(v.quantity, 0),
    0,
  );

  return {
    total,
    isSoldOut: total === 0,
    isLowStock: total > 0 && total <= LOW_STOCK_THRESHOLD,
  };
}

// Below this, the product page says "Only 2 left in M".
export const LOW_SIZE_STOCK_THRESHOLD = 3;

type SizedVariant = { size: string; quantity: number };

export function getSizeQuantity(
  variants: SizedVariant[] | null | undefined,
  size: string | null | undefined,
) {
  if (!size) return null;
  const variant = (variants ?? []).find((v) => v.size === size);
  return variant ? Math.max(variant.quantity, 0) : null;
}

type CartLine = { id: number; selectedSize?: string; quantity?: number };
type StockedProduct = {
  name: string;
  product_variants?: SizedVariant[] | null;
};

// The first cart line that asks for more than is in stock, as "Name (M)".
// Products without variants aren't tracked by size, so they always pass.
export function findStockProblem(
  cart: CartLine[],
  productsById: Map<number, StockedProduct>,
): string | null {
  for (const line of cart) {
    const product = productsById.get(line.id);
    if (!product) continue;
    const variants = product.product_variants ?? [];
    if (variants.length === 0 || !line.selectedSize) continue;

    const available = getSizeQuantity(variants, line.selectedSize) ?? 0;
    const wanted = Math.max(1, Math.floor(line.quantity ?? 1));
    if (wanted > available) return `${product.name} (${line.selectedSize})`;
  }
  return null;
}
