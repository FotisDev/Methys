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
