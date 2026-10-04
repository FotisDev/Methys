import { supabasePublic } from "@/_lib/supabase/client";
import { createSupabaseServerClient } from "@/_lib/supabase/server";
import { ProductInDetails } from "@/_lib/types";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const PRODUCT_SELECT = `
  id, name, price, description, size_description,
  product_details, image_url, slug, is_offer,
  categoryformen:category_men_id!inner(
    id, name, slug,
    parent:parent_id!inner(id, name, slug)
  ),
  product_variants (size, price, quantity)
`;

function normalizeProduct(data: ProductInDetails): ProductInDetails {
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

const getPublicProductBySlug = unstable_cache(
  async (
    categoryId: number,
    slug: string,
  ): Promise<ProductInDetails | null> => {
    const { data, error } = await supabasePublic
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", slug)
      .eq("category_men_id", categoryId)
      .maybeSingle()
      .overrideTypes<ProductInDetails, { merge: false }>();

    if (error || !data) return null;
    return normalizeProduct(data);
  },
  ["product-by-slug-public"],
  { revalidate: 3600, tags: ["products"] },
);

// Uses the visitor's session, so rows hidden from anon by RLS (offers) are visible
// to logged-in users. Reading cookies makes the request dynamic, so this only runs
// when the cached public lookup finds nothing.
async function getAuthenticatedProductBySlug(
  categoryId: number,
  slug: string,
): Promise<ProductInDetails | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("category_men_id", categoryId)
    .maybeSingle()
    .overrideTypes<ProductInDetails, { merge: false }>();

  if (error || !data) return null;
  return normalizeProduct(data);
}

// Wrapped in cache() so generateMetadata and the page share one lookup per request.
export const fetchProductBySlug = cache(
  async (
    categoryId: number,
    slug: string,
  ): Promise<ProductInDetails | null> => {
    try {
      const product = await getPublicProductBySlug(categoryId, slug);
      if (product) return product;
    } catch (error) {
      console.error("Unexpected error fetching product by slug:", error);
    }

    // Outside the try: cookies() signals dynamic rendering by throwing, and that
    // must reach Next.js instead of being swallowed.
    return getAuthenticatedProductBySlug(categoryId, slug);
  },
);
