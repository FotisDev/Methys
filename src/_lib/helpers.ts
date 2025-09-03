import { createClient } from "@supabase/supabase-js";

// Define interfaces
export interface CategoryBackendType {
  id: number;
 name: string;
  parent_id?: number | null;
  image_url?: string;
  slug?:string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  created_at: string;
  image_url: string;
  category_men_id: number;
  slug: string;
  is_offer?: boolean;
  categories?: CategoryBackendType | CategoryBackendType[] | null;
}

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string | null;
  birthday: string | null;
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchCategories(): Promise<CategoryBackendType[] | null> {
  const { data, error } = await supabase
    .from("categoriesformen")
    .select("id, name, parent_id")
    .order("id", { ascending: true });

  if (error || !data) {
    console.error("Error fetching categories:", error?.message);
    return null;
  }

  return data as CategoryBackendType[];
}

export async function fetchProducts(): Promise<Product[] | null> {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, price, created_at, image_url, category_men_id, slug, is_offer")
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching products:", error?.message);
    return null;
  }

  return data as Product[];
}

// Get main categories (level 1: Mens, Womens, Kids)
export async function getMainCategories(): Promise<CategoryBackendType[]> {
  const { data, error } = await supabase
    .from("categoriesformen")
    .select("id, name, parent_id")
    .is("parent_id", null)
    .order("id", { ascending: true });

  if (error || !data) {
    console.error("Error fetching main categories:", error?.message);
    return [];
  }

  return data as CategoryBackendType[];
}

// Get subcategories for a parent category
export async function getSubcategories(parentId: number): Promise<CategoryBackendType[]> {
  const { data, error } = await supabase
    .from("categoriesformen")
    .select("id,name, parent_id")
    .eq("parent_id", parentId)
    .order("id", { ascending: true });

  if (error || !data) {
    console.error("Error fetching subcategories:", error?.message);
    return [];
  }

  return data as CategoryBackendType[];
}

// Find category by name (case insensitive)
export async function getCategoryByName(categoryName: string , parentId: number | null = null): Promise<CategoryBackendType | null> {
  const { data, error } = await supabase
    .from("categoriesformen")
    .select("id, name, parent_id")
    .ilike("name", categoryName)
    .maybeSingle();

  if (error || !data) {
    console.error("Category not found:", error?.message);
    return null;
  }

  return data as CategoryBackendType;
}

// Get category by ID
export async function getCategoryById(categoryId: number): Promise<CategoryBackendType | null> {
  const { data, error } = await supabase
    .from("categoriesformen")
    .select("id,name, parent_id")
    .eq("id", categoryId)
    .maybeSingle();

  if (error || !data) {
    console.error("Category not found:", error?.message);
    return null;
  }

  return data as CategoryBackendType;
}

// Get products by category ID (for final level categories)
export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, description, price, created_at, image_url, category_men_id, slug, is_offer")
    .eq("categoriesformen", categoryId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching products:", error?.message);
    return [];
  }

  return data as Product[];
}

// Get full category path (breadcrumb)
export async function getCategoryPath(categoryId: number): Promise<CategoryBackendType[]> {
  const path: CategoryBackendType[] = [];
  let currentId = categoryId;

  while (currentId) {
    const category = await getCategoryById(currentId);
    if (!category) break;
    
    path.unshift(category); // Add to beginning
    currentId = category.parent_id || 0;
  }

  return path;
}

// Check if category has subcategories
export async function hasSubcategories(categoryId: number): Promise<boolean> {
  const { data, error } = await supabase
    .from("categoriesformen")
    .select("id")
    .eq("parent_id", categoryId)
    .limit(1);

  return !error && data && data.length > 0;
}

// Check if category has products
export async function hasProducts(categoryId: number): Promise<boolean> {
  const { data, error } = await supabase
    .from("products")
    .select("id")
    .eq("category_men_id", categoryId)
    .limit(1);

  return !error && data && data.length > 0;
}

export async function fetchProductBySlug(
  categoryId: number,
  slug: string
): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        price,
        description,
        image_url,
        slug,
        created_at,
        category_men_id,
        is_offer
      `)
      .eq("slug", slug)
      .eq("category_men_id", categoryId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching product by slug:", error.message);
      return null;
    }

    if (!data) {
      console.error(`Product with slug "${slug}" and category_men_id "${categoryId}" not found`);
      return null;
    }

    console.log("Fetched product:", data);
    return data as Product;
  } catch (error) {
    console.error("Unexpected error fetching product by slug:", error);
    return null;
  }
}

// Legacy functions for compatibility
export async function getCategoryId(categoryName: string) {
  const category = await getCategoryByName(categoryName);
  return { data: category, error: category ? null : new Error("Category not found") };
}

export async function fetchProductsByCategory(categoryName: string): Promise<Product[] | null> {
  const category = await getCategoryByName(categoryName);
  if (!category) return [];
  
  return await getProductsByCategory(category.id);
}

export async function getCategoryHierarchy(categoryId: number): Promise<CategoryBackendType[]> {
  return await getCategoryPath(categoryId);
}

export async function getSellerName(users: User | User[] | null) {
  if (!users) return "Άγνωστος";
  if (Array.isArray(users)) {
    return users.length > 0 ? `${users[0].firstname} ${users[0].lastname}` : "Άγνωστος";
  }
  return `${users.firstname} ${users.lastname}` || "Άγνωστος";
}

export const getValidImage = (url?: string | null) => {
  if (!url || url.trim() === "") {
    return "/Casual.jpg"; // fallback in /public
  }
  try {
    // if it's a valid URL string (http/https), return it
    new URL(url);
    return url;
  } catch {
    // if invalid, return fallback
    return "/Casual.jpg";
  }
};
