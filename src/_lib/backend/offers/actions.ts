"use server";

import { supabase } from "@/_lib/supabaseClient";
import type { Product } from "@/_lib/helpers";

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
  console.log("Raw products from DB:", JSON.stringify(products, null, 2));

  const discountPercent = 20;

  const productsWithDiscount = (products || []).map((p) => {
    
    console.log(`Product "${p.name}" raw price:`, p.price, typeof p.price);
    const originalPrice = parseFloat(p.price) || 0;
    const discountedPrice =
      originalPrice > 0 ? originalPrice * (1 - discountPercent / 100) : 0;

    console.log(
      `  → Calculated: original=${originalPrice}, discounted=${discountedPrice}`
    );

    return {
      ...p,
      discountedPrice,
      discountPercent,
    };
  });

  return productsWithDiscount;
}
