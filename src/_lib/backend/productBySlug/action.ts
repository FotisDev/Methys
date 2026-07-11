"use server";

import { supabasePublic } from "@/_lib/supabase/client";
import { createSupabaseServerClient } from "@/_lib/supabase/server";
import { ProductInDetails } from "@/_lib/types";
import { unstable_cache } from "next/cache";

async function checkIsOfferProduct(
  categoryId: number,
  slug: string,
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("products")
    .select("is_offer")
    .eq("slug", slug)
    .eq("category_men_id", categoryId)
    .maybeSingle();

  return data?.is_offer === true;
}

const getPublicProductBySlug = unstable_cache(
  async (
    categoryId: number,
    slug: string,
  ): Promise<ProductInDetails | null> => {
    const { data, error } = await supabasePublic
      .from("products")
      .select(`
        id, name, price, description, size_description,
        product_details, image_url, slug, is_offer,
        categoryformen:category_men_id!inner(
          id, name, slug,
          parent:parent_id!inner(id, name, slug)
        ),
        product_variants (size, price, quantity)
      `)
      .eq("slug", slug)
      .eq("category_men_id", categoryId)
      .maybeSingle()
      .overrideTypes<ProductInDetails, { merge: false }>();

    if (error || !data) return null;

    return {
      ...data,
      slug: data.slug ?? null,
      description: data.description ?? null,
      size_description: data.size_description ?? null,
      product_details: data.product_details ?? null,
      image_url: data.image_url ?? null,
      categoryformen: data.categoryformen ?? null,
      product_variants: Array.isArray(data.product_variants)
        ? data.product_variants
        : [],
    };
  },
  ["product-by-slug-public"],
  { revalidate: 3600, tags: ["products"] },
);

async function getAuthenticatedProductBySlug(
  categoryId: number,
  slug: string,
): Promise<ProductInDetails | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, price, description, size_description,
      product_details, image_url, slug, is_offer,
      categoryformen:category_men_id!inner(
        id, name, slug,
        parent:parent_id!inner(id, name, slug)
      ),
      product_variants (size, price, quantity)
    `)
    .eq("slug", slug)
    .eq("category_men_id", categoryId)
    .maybeSingle()
    .overrideTypes<ProductInDetails, { merge: false }>();

  if (error || !data) return null;

  return {
    ...data,
    slug: data.slug ?? null,
    description: data.description ?? null,
    size_description: data.size_description ?? null,
    product_details: data.product_details ?? null,
    image_url: data.image_url ?? null,
    categoryformen: data.categoryformen ?? null,
    product_variants: Array.isArray(data.product_variants)
      ? data.product_variants
      : [],
  };
}

export async function fetchProductBySlug(
  categoryId: number,
  slug: string,
): Promise<ProductInDetails | null> {
  try {
    const isOffer = await checkIsOfferProduct(categoryId, slug);

    if (isOffer) {
      return await getAuthenticatedProductBySlug(categoryId, slug);
    }

    return await getPublicProductBySlug(categoryId, slug);
  } catch (error) {
    console.error("Unexpected error fetching product by slug:", error);
    return null;
  }
}