import { supabase } from "@/_lib/supabaseClient";
import { ProductInDetails } from "@/_lib/types";

export async function fetchProducts(): Promise<ProductInDetails[] | null> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      description,
      price,
      created_at,
      image_url,
      slug,
      is_offer,
      category_men_id,
      categoryformen:category_men_id (
        id,
        name,
        parent:parent_id (
          id,
          name,
          grandparent:parent_id (id, name)
        )
      ),
      product_variants (
        size,
        price,
        quantity
      )
    `)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Error fetching products:", error?.message);
    return null;
  }

  const transformedData = data?.map(item => {
    const categoryArray = item.categoryformen;
    let category = null;

    if (categoryArray && categoryArray.length > 0) {
      const categoryData = categoryArray[0];
      
      let parent = null;
      if (categoryData.parent && categoryData.parent.length > 0) {
        const parentData = categoryData.parent[0];
        
        let grandparent = null;
        if (parentData.grandparent && parentData.grandparent.length > 0) {
          grandparent = parentData.grandparent[0];
        }
        
        parent = {
          id: parentData.id,
          name: parentData.name,
          grandparent: grandparent
        };
      }
      
      category = {
        id: categoryData.id,
        name: categoryData.name,
        parent: parent
      };
    }

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: item.image_url,
      created_at: item.created_at,
      is_offer: item.is_offer,
      slug: item.slug,
      category_men_id: item.category_men_id,
      categoryformen: category,
      product_variants: item.product_variants || []
    };
  });

  return transformedData as ProductInDetails[];
}