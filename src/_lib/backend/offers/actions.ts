"use server";

import { createSupabaseServerClient } from "@/_lib/supabase/server";
import type { Product } from "@/_lib/types";

export interface ProductWithDiscount extends Product {
  discountedPrice: number;
  discountPercent: number;
}

export async function fetchOffers(): Promise<ProductWithDiscount[]> {
  const supabase = await createSupabaseServerClient();  

  const { data: { user } } = await supabase.auth.getUser();
  console.log("User authenticated:", !!user);
  console.log("User ID:", user?.id);

  console.log("Fetching offers...");
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_offer", true);

  if (error) {
    console.error("Error fetching offers:", error);
    return [];
  }

  if (!products || products.length === 0) {
    console.log("No offer products found in database");
    return [];
  }

  const discountPercent = 20;

  const productsWithDiscount: ProductWithDiscount[] = products.map((p) => {
    const originalPrice = parseFloat(p.price as string) || 0;
    const discountedPrice = originalPrice * (1 - discountPercent / 100);

    return {
      ...p,
      discountedPrice,
      discountPercent,
    };
  });

  return productsWithDiscount;
}