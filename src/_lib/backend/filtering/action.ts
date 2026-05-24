import { supabasePublic } from "@/_lib/supabase/client";
import { ProductInDetails } from "@/_lib/types";

type filterProps = {
  parentSlug: string;
  categorySlug: string;
  min?: string;
  max?: string;
  size?: string;
};

type SupabaseProductResponse = {
  id: number;
  name: string;
  slug: string | null;
  price: string;
  description: string | null;
  size_description: string | null;
  product_details: string | null;
  image_url: string[] | null;
  is_offer: boolean;
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
    price: string | null;
    quantity: number;
  }[];
};

export async function FilteredProducts({
  parentSlug,
  categorySlug,
  min,
  max,
  size,
}: filterProps): Promise<ProductInDetails[] | null> {
  
 

  const { data, error } = await supabasePublic
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      price,
      description,
      size_description,
      product_details,
      image_url,
      is_offer,
      category_men_id,
      categoryformen:category_men_id(
        id,
        name,
        slug,
        parent_id,
        parent:parent_id(
          id,
          name,
          slug
        )
      ),
      product_variants(size, price, quantity)
    `
    )
    .not("categoryformen", "is", null)
    .returns<SupabaseProductResponse[]>();

  if (error) {
    console.error("Error fetching products:", error.message);
    return null;
  }

  if (!data || data.length === 0) {
    console.log('No products found in database');
    return [];
  }

  const categoryFilteredData = data.filter((product) => {
    const category = product.categoryformen;
    const parent = category?.parent;
    
    const matchesCategory = category?.slug === categorySlug;
    const matchesParent = parent?.slug === parentSlug;
    
    return matchesCategory && matchesParent;
  });

 


 const filteredData = categoryFilteredData
  .filter((product) => {
    const basePrice = parseFloat(product.price);

    // Filter by price on the product level
    if (min && basePrice < parseFloat(min)) return false;
    if (max && basePrice > parseFloat(max)) return false;

    // Filter by size — check if at least one variant has that size
    if (size) {
      const hasSize = product.product_variants?.some(
        (v) => v.size === size && v.quantity > 0
      );
      if (!hasSize) return false;
    }

    return true;
  })
  .map((product) => ({
    ...product,
    price: parseFloat(product.price),
    product_variants: product.product_variants ?? [],
  })) as ProductInDetails[];

return filteredData;
}