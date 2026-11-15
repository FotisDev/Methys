"use server";

import { ProductInsert, VariantInsert } from "@/_lib/types";
import { createSupabaseServerClient } from "@/_lib/supabase/server";
import { requireAdmin } from "@/_lib/backend/auth";
import { generateBlurDataUrl } from "@/_lib/utils/generateBlurDataUrl";
import { updateTag } from "next/cache";

export async function addProductAction(
  productData: ProductInsert,
  variants: VariantInsert[],
) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();

  const firstImage = productData.image_url?.[0];
  const blurDataUrl = firstImage ? await generateBlurDataUrl(firstImage) : null;

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({ ...productData, blur_data_url: blurDataUrl })
    .select()
    .single();

  if (productError) throw new Error(productError.message);

  const finalVariants = variants.map((v) => ({
    ...v,
    product_id: product.id,
  }));

  const { error: variantError } = await supabase
    .from("product_variants")
    .insert(finalVariants);

  if (variantError) throw new Error(variantError.message);

  updateTag("products");

  return product;
}
