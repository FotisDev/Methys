"use server";

import { supabase } from "@/_lib/supabase/client";
import { ProductInDetails } from "@/_lib/types";

export async function fetchProducts(): Promise<ProductInDetails[] | null> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      description,
      size_description,
      product_details,
      image_url,
      is_offer,
      categoryformen:category_men_id!inner (
        id,
        name,
        slug,
        parent:parent_id!inner (
          id,
          name,
          slug
        )
      ),
      product_variants (
        size,
        price,
        quantity
      )
    `)
    .overrideTypes<ProductInDetails[], { merge: false }>(); 

  if (error) {
    console.error("Error fetching products:", error.message);
    return null;
  }

  if (!data || data.length === 0) return [];

  // Perfectly typed, no mapping needed
  return data;
}