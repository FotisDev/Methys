import { MainCategoryData } from "@/_lib/interfaces";
import { supabasePublic } from "@/_lib/supabase/client";
import { CategoryBackendType } from "@/_lib/types";
import { getAllCategoriesWithSubcategories } from "@/_lib/backend/CategoriesWithSubcategoriesAction/action";
import { unstable_cache } from "next/cache";
import { cache } from "react";

export const getCategoryBySlug = cache(
  unstable_cache(
    async (
      slug: string,
      parent_id?: number | null,
    ): Promise<CategoryBackendType | null> => {
      let query = supabasePublic
        .from("categoriesformen")
        .select("id, name, parent_id, slug, image_url")
        .eq("slug", slug);

      if (parent_id !== null && parent_id !== undefined) {
        query = query.eq("parent_id", parent_id);
      }
      const { data, error } = await query.maybeSingle();
      if (error) {
        console.error("Supabase error in getCategoryBySlug", error);
        return null;
      }
      return data ?? null;
    },
    ["category-by-slug"],
    { revalidate: 3600, tags: ["categories"] },
  ),
);

// Derived from the shared cached category list instead of a second query/cache entry.
export const getMainCategories = cache(async (): Promise<MainCategoryData[]> => {
  const data = await getAllCategoriesWithSubcategories();

  const subcategoriesByParent = new Map<number, CategoryBackendType[]>();
  for (const cat of data) {
    if (cat.parent_id === null) continue;
    const list = subcategoriesByParent.get(cat.parent_id) ?? [];
    list.push(cat);
    subcategoriesByParent.set(cat.parent_id, list);
  }

  return data
    .filter((cat) => cat.parent_id === null)
    .map((mainCat) => ({
      id: String(mainCat.id),
      name: mainCat.name,
      image_url: mainCat.image_url,
      subcategories: (subcategoriesByParent.get(mainCat.id) ?? []).map((subCat) => ({
        id: String(subCat.id),
        name: subCat.name,
        parent_id: String(subCat.parent_id),
      })),
    }));
});
