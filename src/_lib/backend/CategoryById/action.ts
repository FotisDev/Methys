import { supabase } from "@/_lib/helpers";
import { CategoryBackendType } from "@/_lib/types";

export async function getCategoryByName(categoryName: string, parentId?: number | null): Promise<CategoryBackendType | null> {
 
  try {
    let query = supabase
      .from("categoriesformen")
      .select("id, name, parent_id, image_url, slug")
      .ilike("name", categoryName);

    if (parentId !== null && parentId !== undefined) {
      console.log(`Filtering by parent_id: ${parentId}`);
      query = query.eq("parent_id", parentId);
    } else {
      console.log('No parentId filter applied');
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error in getCategoryByName:", {
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return null;
    }

    console.log(`Found ${data?.length || 0} categories matching "${categoryName}"`);
    
    if (data && data.length > 0) {
      console.log("Found categories:", data);
      return data[0] as CategoryBackendType;
    }

    console.log(`No category found with name "${categoryName}" and parentId ${parentId}`);
    return null;
  } catch (error) {
    console.error("Unexpected error in getCategoryByName:", error);
    return null;
  }
}