'use server';

import { supabase } from "@/_lib/supabase/client";
import {  ProductInDetails } from "@/_lib/types";

export async function fetchProductBySlug(
  categoryId: number,
  slug: string
): Promise<ProductInDetails | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        name,
        price,
        description,
        size_description,
        product_details,
        image_url,
        slug,
        is_offer,
        categoryformen:category_men_id!inner(
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


    const mappedData: ProductInDetails = {
      ...data,
      slug: data.slug ?? null,
      description: data.description ?? null,
      size_description:data.size_description,
      product_details:data.product_details,
      image_url: data.image_url ?? null,
      categoryformen: data.id,
      product_variants: Array.isArray(data.product_variants) ? data.product_variants : [],
    };


    return mappedData;

  } catch (error) {
    console.error("Unexpected error fetching product by slug:", error);
    return null;
  }
}

