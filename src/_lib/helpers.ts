import { createClient } from "@supabase/supabase-js";
import { CategoryBackendType } from "./types";

export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string | null;
  birthday: string | null;
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchCategories(): Promise<CategoryBackendType[] | null> {
  const { data, error } = await supabase
    .from("categoriesformen")
    .select("id, name, parent_id, image_url")
    .order("id", { ascending: true });

  if (error || !data) {
    console.error("Error fetching categories:", error?.message);
    return null;
  }

  return data as CategoryBackendType[];
}

export async function getSubcategories(
  parentId: number
): Promise<CategoryBackendType[]> {
  const { data, error } = await supabase
    .from("categoriesformen")
    .select("id, name, parent_id, slug,image_url")
    .eq("parent_id", parentId)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }

  return data || [];
}

export async function getCategoryBySlug(
  slug: string,
  parentId?: number | null
): Promise<CategoryBackendType | null> {
  let query = supabase
    .from("categoriesformen")
    .select("id, name, parent_id, slug,image_url")
    .eq("slug", slug);

  if (parentId !== null && parentId !== undefined) {
    query = query.eq("parent_id", parentId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("Supabase error in getCategoryBySlug:", error);
    return null;
  }

  return data ?? null;
}

export async function getCategoryById(
  categoryId: number
): Promise<CategoryBackendType | null> {
  const { data, error } = await supabase
    .from("categoriesformen")
    .select("id,name, parent_id,image_url")
    .eq("id", categoryId)
    .maybeSingle();

  if (error || !data) {
    console.error("Category not found:", error?.message);
    return null;
  }

  return data as CategoryBackendType;
}

export async function getCategoryPath(
  categoryId: number
): Promise<CategoryBackendType[]> {
  const path: CategoryBackendType[] = [];
  let currentId = categoryId;

  while (currentId) {
    const category = await getCategoryById(currentId);
    if (!category) break;

    path.unshift(category);
    currentId = category.parent_id || 0;
  }

  return path;
}

export async function getCategoryHierarchy(
  categoryId: number
): Promise<CategoryBackendType[]> {
  return await getCategoryPath(categoryId);
}

export async function getSellerName(users: User | User[] | null) {
  if (!users) return "Άγνωστος";
  if (Array.isArray(users)) {
    return users.length > 0
      ? `${users[0].firstname} ${users[0].lastname}`
      : "Άγνωστος";
  }
  return `${users.firstname} ${users.lastname}` || "Άγνωστος";
}

export const getValidImage = (url?: string | null) => {
  if (!url || url.trim() === "") {
    return "/Casual.jpg";
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/")) {
    return url;
  }
  return `/images/${url}`;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Problem Found";
};
