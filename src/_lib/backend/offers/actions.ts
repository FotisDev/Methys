"use server";

import { createSupabaseServerClient } from "@/_lib/supabase/server";
import type { ProductInDetails } from "@/_lib/types";
import {
  DISCOUNT_PERCENT,
  getProductPricing,
} from "@/_lib/utils/discountUtil/discountUtils";

export interface ProductWithDiscount extends ProductInDetails {
  discountedPrice: number;
  discountPercent: number;
}

export async function fetchOffers(): Promise<ProductWithDiscount[]> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, name, slug, price, description, size_description,
      product_details, image_url, is_offer,
      categoryformen:category_men_id (
        id, name, slug,
        parent:parent_id (id, name, slug)
      ),
      product_variants (size, price, quantity)
    `,
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

  return data.map((p) => ({
    ...p,
    discountedPrice: getProductPricing(p).finalPrice,
    discountPercent: DISCOUNT_PERCENT,
  }));
}
