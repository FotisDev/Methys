import { supabase } from "@/_lib/supabase/client";
import { ProductInDetails } from "@/_lib/types";

type filterProps = {
  parentSlug: string;
  categorySlug: string;
  min?: string;
  max?: string;
  size?: string;
};

export async function FilteredProducts({
  parentSlug,
  categorySlug,
  min,
  max,
  size,
}: filterProps): Promise<ProductInDetails[] | null> {
  let query = supabase
    .from("products")
    .select(
      `
    id,name,slug,price,description,size_description,product_details,image_url,is_offer,
    categoryformen:category_men_id!inner(
    id,name,slug,parent:parent_id!inner(
    id,name,slug)),product_variants(size,price,quantity)`,
    )
    .eq("categoryformen.parent.slug", parentSlug)
    .eq("categoryformen.slug", categorySlug);

  if (min) {
    query = query.gte("product_variants.price", min);
  }
  if (max) {
    query = query.lte("product_variants.price", max);
  }
  if (size) {
    query = query.eq("product_variants.size", size);
  }
  const { data, error } = await query.overrideTypes<ProductInDetails[],{ merge: false } >();

  if (error) {
    console.error("Error fetching products", error.message);
    return null;
  }

  const filteredData = data?.map((product) => ({
    ...product,
    product_variants: product.product_variants?.filter((variant) => {
      if (variant.price === null) return false;  
      let match = true;
      if (min && variant.price < parseFloat(min)) match = false;
      if (max && variant.price > parseFloat(max)) match = false;
      if (size && variant.size !== size) match = false;
      return match;
    })
  })).filter(product => product.product_variants && product.product_variants.length > 0);

  return filteredData ?? [];
}
