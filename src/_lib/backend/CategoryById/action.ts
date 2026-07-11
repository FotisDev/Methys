"use server";

import { MainCategoryData } from "@/_lib/interfaces";
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

export const getMainCategories = unstable_cache(
  async (): Promise<MainCategoryData[]> => {
    const { data, error } = await supabasePublic
      .from("categoriesformen")
      .select("id,name,parent_id,image_url")
      .order("parent_id", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching main categories", error.message);
    }

    if (!data) return [];

    const mainCats = data.filter((cat) => cat.parent_id === null);
    const subCats = data.filter((cat) => cat.parent_id !== null);

    return mainCats.map((mainCat) => ({
      id: String(mainCat.id),
      name: mainCat.name,
      image_url: mainCat.image_url,
      subcategories: subCats
        .filter((subCat) => subCat.parent_id === mainCat.id)
        .map((subCat) => ({
          id: String(subCat.id),
          name: subCat.name,
          parent_id: String(subCat.parent_id),
        })),
    }));
  },
  ["main-categories"],
  {
    revalidate: 86000,
    tags: ["categories"],
  },
);
