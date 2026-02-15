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
    .map((product) => {
      const basePrice = parseFloat(product.price);
      
      const filteredVariants = product.product_variants?.filter((variant) => {

        const effectivePrice = variant.price !== null 
          ? parseFloat(variant.price) 
          : basePrice;
        
        if (min) {
          const minPrice = parseFloat(min);
          if (effectivePrice < minPrice) {
            console.log(`    ❌ Rejected: €${effectivePrice} < min €${minPrice}`);
            return false;
          }
        }
    
        if (max) {
          const maxPrice = parseFloat(max);
          if (effectivePrice > maxPrice) {
            console.log(`    ❌ Rejected: €${effectivePrice} > max €${maxPrice}`);
            return false;
          }
        }
        
        if (size && variant.size !== size) {
          console.log(`    ❌ Rejected: size ${variant.size} !== ${size}`);
          return false;
        }
        
     
        return true;
      }).map(variant => ({
        ...variant,
        price: variant.price !== null ? parseFloat(variant.price) : basePrice,
      })) || [];

      console.log(`  → ${filteredVariants.length} variants match`);

      return {
        ...product,
        price: basePrice,
        product_variants: filteredVariants,
      } as ProductInDetails;
    })
    .filter((product) => {
      const hasVariants = product.product_variants && product.product_variants.length > 0;
      if (!hasVariants) {
      
      }
      return hasVariants;
    });

  filteredData.forEach(p => {
    p.product_variants?.forEach(v => console.log(`    - ${v.size}: €${v.price}`));
  });


  return filteredData;
}