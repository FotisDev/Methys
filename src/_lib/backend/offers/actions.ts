"use server";

import { createSupabaseServerClient } from "@/_lib/supabase/server";
import { supabasePublic } from "@/_lib/supabase/client";
import type { ProductInDetails } from "@/_lib/types";
import { unstable_cache } from "next/cache";

export interface ProductWithDiscount extends ProductInDetails {
  discountedPrice: number;
  discountPercent: number;
}

const getOfferProducts = unstable_cache(
  async (): Promise<ProductInDetails[]> => {
    const { data, error } = await supabasePublic
      .from("products")
      .select(
        `
        id, name, slug, price, description, size_description,
        product_details, image_url, is_offer,
        categoryformen:category_men_id!inner (
          id, name, slug,
          parent:parent_id (id, name, slug)
        ),
        product_variants (size, price, quantity)
      `,
      )
      .eq("is_offer", true)
      .overrideTypes<ProductInDetails[], { merge: false }>();

    if (error) {
      console.error("Supabase error in getOfferProducts:", error.message);
      return [];
    }

    return data ?? [];
  },
  ["offer-products"],
  { revalidate: 3600, tags: ["offer-products"] },
);

export async function fetchOffers(): Promise<ProductWithDiscount[]> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const offerProducts = await getOfferProducts(); 

  if (offerProducts.length === 0) {
    return [];
  }

  const discountPercent = 20;

  return offerProducts.map((p) => ({
    ...p,
    discountedPrice: p.price * (1 - discountPercent / 100),
    discountPercent,
  }));
}