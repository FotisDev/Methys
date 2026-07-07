"use server";

import { supabasePublic } from "@/_lib/supabase/client";
import { ProductInDetails } from "@/_lib/types";
import { unstable_cache } from "next/cache";

export const getProductsWithStructure = unstable_cache(
  async (): Promise<ProductInDetails[] | null> => {
    const { data, error } = await supabasePublic
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
    `,
      )
      .overrideTypes<ProductInDetails[], { merge: false }>();

    if (error) {
      console.error("Supabase error:", error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data;
  },
  ['all-products'],
  {
    revalidate:3600,
    tags:['products-with-structure']
  }
);

function createSeasonalFetcher(column: string, cacheKey: string, tag: string) {
  return unstable_cache(
    async (): Promise<ProductInDetails[] | null> => {
      const { data, error } = await supabasePublic
        .from("products")
        .select(`id,name,slug,price,description,size_description,product_details,image_url,${column},
          categoryformen:category_men_id!inner(id,name,slug,
          parent:parent_id!inner(id,name,slug)),
          product_variants(size,price,quantity)`)
        .eq(column, true)
        .limit(7)
        .overrideTypes<ProductInDetails[], { merge: false }>();

      if (error) {
        console.error("supabase error", error.message);
        return null;
      }
      return data ?? [];
    },
    [cacheKey],
    { revalidate: 3600, tags: [tag] },
  );
}

export const ProductBySpringSeason = createSeasonalFetcher("is_spring", "products-spring", "products-by-spring-season");
export const ProductByWinterSeason = createSeasonalFetcher("is_winter", "products-winter", "products-by-winter-season");
export const ProductByAutumnSeason = createSeasonalFetcher("is_autumn", "products-autumn", "products-by-autumn-season");
export const ProductBySummerSeason = createSeasonalFetcher("is_summer", "products-summer", "products-by-summer-season");

export const fetchOnlineExclusive = unstable_cache(
  async (): Promise<ProductInDetails[] | null> => {
    const { data, error } = await supabasePublic
      .from("products")
      .select(
        `id,name,slug,price,description,size_description,product_details,image_url,
      categoryformen:category_men_id!inner(id,name,slug,
      parent:parent_id!inner(id,name,slug)),
      product_variants(size,price,quantity)`,
      )
      .eq("online_exclusive", true)
      .overrideTypes<ProductInDetails[], { merge: false }>();

    if (error) {
      console.error("supabase error", error.message);
    }
    if (!data || data.length === 0) {
      return [];
    }
    return data;
  },
  ["products-online-exclusive"],
  {
    revalidate: 3600,
    tags: ["fetch-online-exclusive"],
  },
);
