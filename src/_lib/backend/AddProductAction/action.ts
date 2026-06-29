"use server";

import { ProductInsert, VariantInsert } from "@/_lib/types";
import { createSupabaseServerClient } from "@/_lib/supabase/server";
import { generateBlurDataUrl } from "@/_lib/utils/generateBlurDataUrl";
import { revalidateTag } from "next/cache";

export async function addProductAction(
  productData: ProductInsert,
  variants: VariantInsert[]
) {
  const supabase = await createSupabaseServerClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You need to login...");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw new Error("You dont have privilages of Admin.");
  }

  const firstImage = productData.image_url?.[0];
  const blurDataUrl = firstImage
    ? await generateBlurDataUrl(firstImage)
    : null;

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

  revalidateTag("products");

  return product;
}