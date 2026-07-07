"use server";

import { supabasePublic } from "@/_lib/supabase/client";
import { CategoryBackendType } from "@/_lib/types";
import { unstable_cache } from "next/cache";

export const getCategoryByName = unstable_cache(
  async (
    categoryName: string,
    parentId?: number | null,
  ): Promise<CategoryBackendType | null> => {
    try {
      let query = supabasePublic
        .from("categoriesformen")
        .select("id, name, parent_id, image_url, slug")
        .ilike("name", categoryName);

      if (parentId !== null && parentId !== undefined) {
        query = query.eq("parent_id", parentId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Supabase error in getCategoryByName:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        return null;
      }

      if (data && data.length > 0) {
        return data[0] as CategoryBackendType;
      }

      return null;
    } catch (error) {
      console.error("Unexpected error in getCategoryByName:", error);
      return null;
    }
  },
  ["category-by-name"],
  {
    revalidate: 3600, 
    tags: ["categories"],
  },
);