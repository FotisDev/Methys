import { getProductsByCategoryId } from "@/_lib/backend/ProductWithStructure/action";
import { ProductInDetails } from "@/_lib/types";

type filterProps = {
  categoryId: number;
  min?: string;
  max?: string;
  size?: string;
};

export async function FilteredProducts({
  categoryId,
  min,
  max,
  size,
}: filterProps): Promise<ProductInDetails[] | null> {
  const data = await getProductsByCategoryId(categoryId);

  if (!data) {
    console.error("Error fetching products for filtering");
    return null;
  }

  const minNum = min ? parseFloat(min) : undefined;
  const maxNum = max ? parseFloat(max) : undefined;

  if (minNum === undefined && maxNum === undefined && !size) {
    return data;
  }

  return data.filter((product) => {
    if (minNum !== undefined && product.price < minNum) return false;
    if (maxNum !== undefined && product.price > maxNum) return false;

    if (size) {
      const hasSize = product.product_variants.some(
        (v) => v.size === size && v.quantity > 0,
      );
      if (!hasSize) return false;
    }

    return true;
  });
}
