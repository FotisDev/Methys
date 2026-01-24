"use server";

import { createSupabaseServerClient } from "@/_lib/supabase/server";
import type { ProductInDetails } from "@/_lib/types";

export interface ProductWithDiscount extends ProductInDetails {
  discountedPrice: number;
  discountPercent: number;
}

export async function fetchOffers(): Promise<ProductWithDiscount[]> {
  const supabaseClient = await createSupabaseServerClient();

  const { data: { user } } = await supabaseClient.auth.getUser();

  if (!user) {
    return [];
  }
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
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
        parent:parent_id (
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
    `
    )
    .eq("is_offer", true)
    .overrideTypes<ProductInDetails[], { merge: false }>();

  if (error) {
    console.error("Supabase error in fetchOffers:", error.message);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  const discountPercent = 20;

  const productsWithDiscount: ProductWithDiscount[] = data.map((p) => {
    const originalPrice = parseFloat(p.price as unknown as string) || 0;
    const discountedPrice = originalPrice * (1 - discountPercent / 100);

    return {
      ...p,
      discountedPrice,
      discountPercent,
    };
  });

  return productsWithDiscount;
}
