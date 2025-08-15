import { createClient } from "@supabase/supabase-js";

import { Category, Product } from "./interfaces";
import { User } from "./types";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
 
export async function fetchProductBySlug(
  categoryName: string,
  slug: string,
  options?:{next?:{revalidate?:number}}
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
        categories (
          id,
          category_name,
          image_url
        ),
        users:user_id (
          id,
          firstname,
          lastname,
          email,
          telephone,
          birthday
        )
      `)
      .eq("slug", slug)
      .eq("category_id", (await getCategoryId(categoryName)).data?.id)
      .single();

    if (error || !data) {
      console.error(error);
      return null;
    }

    return data as Product;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getCategoryId(categoryName: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("category_name", categoryName.replace(/-/g, " "))
    .maybeSingle(); // ✅ safer than `.single()`

  return { data, error };
}


export async function fetchProductsByCategory(categoryName: string) {
  // Step 1: Fetch the category id
  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("id,category_name")
    .eq("category_name", categoryName.replace(/-/g, " "))
    .single();

  if (categoryError || !categoryData) {
    console.error("Category not found", categoryError);
    return [];
  }
  const { data: products, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryData.id);

  if (productError) {
    console.error("Products fetch error", productError);
    return [];
  }

  return products;
}


export async function fetchCategories(): Promise<Category[] | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, category_name, image_url")
    .order("category_name", { ascending: true });


  if (error || !data) {
    console.log('Error fetching categories:',error?.message);
    
    return null;

  }
    

  return data as Category[];
}


export async function getSellerName(users: User | User[] | null) {
  if (!users) return "Άγνωστος";
  if (Array.isArray(users)) {
    return users.length > 0 ? `${users[0].firstname} ${users[0].lastname}` : "Άγνωστος";
  } else {
    return `${users.firstname} ${users.lastname}` || "Άγνωστος";
  }
}
