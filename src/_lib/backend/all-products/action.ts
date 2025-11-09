import { Product } from "@/_lib/types";
import { supabase } from "@/_lib/supabaseClient";

export type ProductWithVariants = Product & {
  product_variants: ProductVariant[];
};
type ProductVariant = {
  quantity: number;
  size:number;
};

export async function fetchAllProducts(): Promise<ProductWithVariants[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`*,product_variants(size, quantity )`);

  if (error) {
    console.error("Error fetching Products:", error);
    return [];
  }

  return data ?? [];
}
