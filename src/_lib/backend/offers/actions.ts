"use server";

import { supabase } from "@/_lib/supabaseClient";
import type { Product } from "@/_lib/types";

export interface ProductWithDiscount extends Product {
  discountedPrice: number;
  discountPercent: number;
}

export async function fetchOffers(): Promise<ProductWithDiscount[]> {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_offer", true);

  if (error) {
    console.error("Error fetching offers:", error);
    return [];
  }

  const discountPercent = 20;

  const productsWithDiscount = (products || []).map((p) => {

    const originalPrice = parseFloat(p.price) || 0;
    const discountedPrice =
      originalPrice > 0 ? originalPrice * (1 - discountPercent / 100) : 0;

    return {
      ...p,
      discountedPrice,
      discountPercent,
    };
  });

  return productsWithDiscount;
}
