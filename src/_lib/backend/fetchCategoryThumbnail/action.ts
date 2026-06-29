"use server";

import { supabasePublic } from "@/_lib/supabase/client";
import { unstable_cache } from "next/cache";

type ThumbnailRow = {
  image_url: string[] | null;
  blur_data_url: string | null;
  category_men_id: number;
};

type ThumbnailMap = Record<number, { url?: string; blur?: string }>;

export const fetchProductThumbnailsByCategoryIds = unstable_cache(
  async (categoryIds: number[]): Promise<ThumbnailMap> => {
    if (categoryIds.length === 0) return {};

    const { data, error } = await supabasePublic
      .from("products")
      .select("image_url, blur_data_url, category_men_id")
      .in("category_men_id", categoryIds)
      .not("image_url", "is", null);

    if (error) {
      console.error("Error Fetching thumbnails: ", error.message);
      return {};
    }

    const map: ThumbnailMap = {};
    for (const row of (data as ThumbnailRow[]) ?? []) {
      if (!map[row.category_men_id] && row.image_url?.[0]) {
        map[row.category_men_id] = {
          url: row.image_url[0],
          blur: row.blur_data_url ?? undefined,
        };
      }
    }
    return map;
  },
  ["category-thumbnails"],
  { revalidate: 600, tags: ["products"] },
);