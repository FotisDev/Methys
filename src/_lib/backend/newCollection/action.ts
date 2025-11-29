"use server";

import { supabase } from "@/_lib/supabase/client";
import { ProductInDetails } from "@/_lib/types";

type RawProductFromDB = {
  id: number;
  name: string;
  slug: string | null;
  price: number;
  description: string | null;
  image_url: string | null;
  is_offer?: boolean;

  categoryformen: {
    id: number;
    name: string;
    slug: string | null;
    parent: {
      id: number;
      name: string;
      slug: string | null;
    } | null;
  } | null;

  product_variants: {
    size: string;
    quantity: number;
    price?: number | null;
  }[];
  size_description:string;
};

export async function getProductsWithStructure(): Promise<
  ProductInDetails[] | null
> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      price,
      description,
      size_description,
      image_url,
      is_offer,
      categoryformen:category_men_id!inner(
        id,
        name,
        slug,
        parent:parent_id (
          id,
          name,
          slug
        )
      ),
      product_variants (
        size,
        quantity,
        price
      )
    `
    )
    .returns<RawProductFromDB[]>();

  if (error) {
    console.error("Supabase error:", error.message);
    return null;
  }

  if (!data || data.length === 0) {
    return [];
  }

  const transformedData: ProductInDetails[] = data.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    price: item.price,
    description: item.description,
    size_description: item.size_description,
    image_url: item.image_url,
    is_offer: item.is_offer ?? false,

    categoryformen: item.categoryformen
      ? {
          id: item.categoryformen.id,
          name: item.categoryformen.name,
          slug: item.categoryformen.slug,
          parent: item.categoryformen.parent
            ? {
                id: item.categoryformen.parent.id,
                name: item.categoryformen.parent.name,
                slug: item.categoryformen.parent.slug,
              }
            : null,
        }
      : null,

    product_variants: item.product_variants.map((v) => ({
      size: v.size,
      quantity: v.quantity,
      price: v.price ?? item.price,
    })),
  }));

  return transformedData;
}
