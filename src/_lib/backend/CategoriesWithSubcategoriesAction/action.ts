"use server";
import { supabasePublic } from "@/_lib/supabase/client";
import { CategoryBackendType } from "@/_lib/types";
import { unstable_cache } from "next/cache";
import { cache } from "react";

export const getAllCategoriesWithSubcategories = cache(
  unstable_cache(
    async (): Promise<CategoryBackendType[]> => {
      try {
        const { data, error } = await supabasePublic
          .from("categoriesformen")
          .select("id, name, parent_id, slug, image_url")
          .order("parent_id", { ascending: true, nullsFirst: true })
          .order("name", { ascending: true });

        if (error) {
          console.error("[Supabase] Error fetching categories:", error.message);
          return [];
        }

        return data as CategoryBackendType[];
      } catch (err) {
        console.error(
          "[Supabase] Unexpected error in getAllCategoriesWithSubcategories:",
          err,
        );
        return [];
      }
    },
    ["all-categories"],
    { revalidate: 3600, tags: ["categories"] },
  ),
);