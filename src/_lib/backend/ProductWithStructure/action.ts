"use server";

import { supabase } from "@/_lib/supabase/client";
import { ProductInDetails } from "@/_lib/types";

export async function getProductsWithStructure(): Promise<ProductInDetails[] | null> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      description,
      size_description,
      product_details,
      image_url,
      is_offer,
      categoryformen:category_men_id!inner (
        id,
        name,
        slug,
        parent:parent_id!inner (
          id,
          name,
          slug
        )
      ),
      product_variants (
        size,
        price,
        quantity
      )
    `)
    .overrideTypes<ProductInDetails[], { merge: false }>();

  if (error) {
    console.error("Supabase error:", error.message);
    return null;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data;
}

export  async function ProductBySpringSeason(): Promise<
  ProductInDetails[] | null
> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `id,name,slug,price,description,size_description,product_details,image_url,is_spring,
      categoryformen:category_men_id!inner(id,name,slug,
      parent:parent_id!inner(id,name,slug)),
      product_variants(size,price,quantity)`,
    )
    .eq('is_spring',true)
    .overrideTypes<ProductInDetails[], { merge: false }>();
  if (error) {
    console.error("supabase error", error.message);
  }
  if (!data || data.length === 0) {
    return [];
  }
  return data;
}
export  async function ProductByWinterSeason(): Promise<
  ProductInDetails[] | null
> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `id,name,slug,price,description,size_description,product_details,image_url,is_winter,
      categoryformen:category_men_id!inner(id,name,slug,
      parent:parent_id!inner(id,name,slug)),
      product_variants(size,price,quantity)`,
    )
    .eq('is_winter',true)
    .overrideTypes<ProductInDetails[], { merge: false }>();
  if (error) {
    console.error("supabase error", error.message);
  }
  if (!data || data.length === 0) {
    return [];
  }
  return data;
}
export async function ProductByAutumnSeason(): Promise<
  ProductInDetails[] | null
> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `id,name,slug,price,description,size_description,product_details,image_url,is_autumn,
      categoryformen:category_men_id!inner(id,name,slug,
      parent:parent_id!inner(id,name,slug)),
      product_variants(size,price,quantity)`,
    )
    .eq('is_autumn',true)
    .overrideTypes<ProductInDetails[], { merge: false }>();
  if (error) {
    console.error("supabase error", error.message);
  }
  if (!data || data.length === 0) {
    return [];
  }
  return data;
}

export async function ProductBySummerSeason(): Promise<
  ProductInDetails[] | null
> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `id,name,slug,price,description,size_description,product_details,image_url,is_summer,
      categoryformen:category_men_id!inner(id,name,slug,
      parent:parent_id!inner(id,name,slug)),
      product_variants(size,price,quantity)`,
    )
    .eq('is_summer',true)
    .overrideTypes<ProductInDetails[], { merge: false }>();
  if (error) {
    console.error("supabase error", error.message);
  }
  if (!data || data.length === 0) {
    return [];
  }
  return data;
}