"use server";
import { supabase } from "@/_lib/supabaseClient";
import { ProductInDetails } from "@/_lib/types";

export async function getProductsWithStructure(): Promise<ProductInDetails[] | null> {
  const { data, error } = await supabase.from("products").select(`
      id,
      name,
      slug,
      price,
      description,
      image_url,
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
        quantity
      )
    `);

  if (error) {
    console.error("Supabase error:", error);
    return null;
  }

  if (!data) return null;

  const transformedData: ProductInDetails[] = (data as unknown as any[]).map((item) => {
    const category = item.categoryformen
      ? {
          id: item.categoryformen.id,
          name: item.categoryformen.name,
          slug: item.categoryformen.slug,
          parent: item.categoryformen.parent
            ? {
                id: item.categoryformen.parent.id,
                name: item.categoryformen.parent.name,
                slug: item.categoryformen.parent.slug ?? null,
              }
            : null,
        }
      : null;

    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      description: item.description,
      image_url: item.image_url,
      categoryformen: category,
      product_variants: item.product_variants || [],
      is_offer: item.is_offer ?? undefined,
    };
  });

  return transformedData;
}
