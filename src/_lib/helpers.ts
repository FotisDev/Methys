
import { CategoryBackendType } from "./types";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { supabasePublic } from "./supabase/client";

export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string | null;
  birthday: string | null;
};


export const fetchCategories = cache(
  unstable_cache(
    async (): Promise<CategoryBackendType[] | null> => {
      const { data, error } = await supabasePublic
        .from("categoriesformen")
        .select("id, name, parent_id, image_url, slug")
        .order("id", { ascending: true });

      if (error || !data) {
        console.error("Error fetching categories:", error?.message);
        return null;
      }

      return data as CategoryBackendType[];
    },
    ["categories-hub"],
    { revalidate: 3600, tags: ["categories"] },
  ),
);

export async function getCategoryById(
  categoryId: number,
): Promise<CategoryBackendType | null> {
  const { data, error } = await supabasePublic
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
  categoryId: number,
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
  categoryId: number,
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
