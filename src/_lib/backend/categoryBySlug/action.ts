import { supabase } from "@/_lib/supabase/client";
import { CategoryBackendType } from "@/_lib/types";

export async function getCategoryBySlug(
  slug: string,
  parentId?: number | null
): Promise<CategoryBackendType | null> {
  try {
    
    let query = supabase
      .from("categoriesformen")
      .select("id, name, parent_id, slug")
      .eq("slug", slug);

    if (typeof parentId === "number") {
      query = query.eq("parent_id", parentId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error(
        `[Supabase] Error fetching category with slug "${slug}":`,
        error.message
      );
      return null;
    }

    if (!data) {
      console.warn(`[Supabase] No category found with slug "${slug}"`);
      return null;
    }

    return data as CategoryBackendType;
  } catch (err) {
    console.error("[Supabase] Unexpected error in getCategoryBySlug:", err);
    return null;
  }
}
