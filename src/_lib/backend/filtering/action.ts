import { getProductsWithStructure } from "@/_lib/backend/ProductWithStructure/action";
import { ProductInDetails } from "@/_lib/types";

type filterProps = {
  parentSlug: string;
  categorySlug: string;
  min?: string;
  max?: string;
  size?: string;
};

// type SupabaseProductResponse = {
//   id: number;
//   name: string;
//   slug: string | null;
//   price: string;
//   description: string | null;
//   size_description: string | null;
//   product_details: string | null;
//   image_url: string[] | null;
//   is_offer: boolean;
//   categoryformen: {
//     id: number;
//     name: string;
//     slug: string | null;
//     parent: {
//       id: number;
//       name: string;
//       slug: string | null;
//     } | null;
//   } | null;
//   product_variants: {
//     size: string;
//     price: string | null;
//     quantity: number;
//   }[];
// };

export async function FilteredProducts({
  parentSlug,
  categorySlug,
  min,
  max,
  size,
}: filterProps): Promise<ProductInDetails[] | null> {
  const data = await getProductsWithStructure(); 
  
  if (!data) {
    console.error("Error fetching products for filtering");
    return null;
  }

  if (data.length === 0) {
    return [];
  }

  const categoryFilteredData = data.filter((product) => {
    const category = product.categoryformen;
    const parent = category?.parent;

    const matchesCategory = category?.slug === categorySlug;
    const matchesParent = parent?.slug === parentSlug;

    return matchesCategory && matchesParent;
  });

  const minNum = min ? parseFloat(min) : undefined;
  const maxNum = max ? parseFloat(max) : undefined;

  const filteredData = categoryFilteredData.filter((product) => {
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

  return filteredData;
}