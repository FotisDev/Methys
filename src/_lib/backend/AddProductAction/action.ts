"use server";

import { ProductInsert, VariantInsert } from "@/_lib/types";
import { createSupabaseServerClient } from "@/_lib/supabase/server";

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

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert(productData)
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

  return product;
}
