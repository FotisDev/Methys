import { createClient } from "@supabase/supabase-js";

type RawProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  categoriesformen?: {
    name?: string;
    parent?: {
      name?: string;
      grandparent?: {
        name?: string;
      };
    };
  };
};

// Define interfaces
export interface CategoryBackendType {
  id: number;
  name: string;
  parent_id?: number | null;
  image_url?: string;
  slug?: string;
}
export interface RandomItemsOfEachCategory {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  price: number;
  categoryPath: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  created_at: string;
  is_offer: boolean;
  slug: string;
  quantity: number;
  category_men_id: number;
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
    .select(
      "id, name, description, price, created_at, image_url, category_men_id, slug, is_offer"
    )
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
export async function getSubcategories(
  parentId: number
): Promise<CategoryBackendType[]> {
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
export async function getCategoryByName(
  categoryName: string,
  parentId?: number | null
): Promise<CategoryBackendType | null> {
  const query = supabase
    .from("categoriesformen")
    .select("id, name, parent_id")
    .ilike("name", categoryName);

  if (parentId !== null && parentId !== undefined) {
    query.eq("parent_id", parentId);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) {
    console.error("Category not found:", error?.message);
    return null;
  }

  return data as CategoryBackendType;
}



// Get category by ID
export async function getCategoryById(
  categoryId: number
): Promise<CategoryBackendType | null> {
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
export async function getProductsByCategory(
  categoryId: number
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, description, price, created_at, image_url, category_men_id, slug, is_offer"
    )
    .eq("categoriesformen", categoryId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching products:", error?.message);
    return [];
  }

  return data as Product[];
}

// Get full category path (breadcrumb)
export async function getCategoryPath(
  categoryId: number
): Promise<CategoryBackendType[]> {
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

//CHECK IF CATEGORY HAS PRODUCTS
export async function hasProducts(categoryId: number): Promise<boolean> {
  const { data, error } = await supabase
    .from("products")
    .select("id")
    .eq("category_men_id", categoryId)
    .limit(1);

  return !error && data && data.length > 0;
}

//NEW COLLECTION
export async function getNewCollection(): Promise<RandomItemsOfEachCategory[]> {
  try {
    const { data, error } = await supabase.from("products").select(`
        id,
        name,
        slug,
        price,
        image_url,
        categoryformen:category_men_id (
          id,
          name,
          parent:parent_id (
            id,
            name,
            grandparent:parent_id (
              id,
              name
            )
          )
        )
      `);

    if (error) throw error;
    const formattedData = data.map((product: RawProduct) => {
      const sub = product.categoriesformen?.name?.toLowerCase();
      const parent = product.categoriesformen?.parent?.name?.toLowerCase();
      const grandparent =
        product.categoriesformen?.parent?.grandparent?.name?.toLowerCase();

      const segments = [grandparent, parent, sub].filter(Boolean);
      const categoryPath = segments.join("/");
      return {
        id: product.id.toString(),
        name: product.name,
        slug: product.slug,
        image_url: product.image_url,
        price: product.price,
        categoryPath,
      };
    });

    return formattedData;
  } catch (err) {
    console.error("Error fetching new collection", err);
    return [];
  }
}

//FETCH PRODUCTS BY SLUG
export async function fetchProductBySlug(
  categoryId: number,
  slug: string
): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        price,
        description,
        image_url,
        slug,
        created_at,
        category_men_id,
        is_offer
      `
      )
      .eq("slug", slug)
      .eq("category_men_id", categoryId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching product by slug:", error.message);
      return null;
    }

    if (!data) {
      console.error(
        `Product with slug "${slug}" and category_men_id "${categoryId}" not found`
      );
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
  return {
    data: category,
    error: category ? null : new Error("Category not found"),
  };
}

export async function fetchProductsByCategory(
  categoryName: string
): Promise<Product[] | null> {
  const category = await getCategoryByName(categoryName);
  if (!category) return [];

  return await getProductsByCategory(category.id);
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
  // Return fallback if no URL provided or empty string
  if (!url || url.trim() === "") {
    return "/Casual.jpg";
  }

  // If it's already a full URL (http:// or https://), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it starts with /, it's already a valid local path
  if (url.startsWith('/')) {
    return url;
  }

  // If it's a relative filename (like "google.jpg" or "facebook.png"),
  // assume it should be in the /public/images folder
  return `/images/${url}`;
};