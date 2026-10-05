import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/_lib/supabase/client";
import type { ProductReview } from "@/_lib/utils/reviews";

export const REVIEWS_TAG = "reviews";

// Public and cached, so the product page stays statically rendered.
export const fetchProductReviews = unstable_cache(
  async (productId: number): Promise<ProductReview[]> => {
    const { data, error } = await supabasePublic
      .from("product_reviews")
      .select("id, author_name, rating, title, body, created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Failed to load reviews:", error.message);
      return [];
    }
    return data ?? [];
  },
  ["product-reviews"],
  { revalidate: 3600, tags: [REVIEWS_TAG] },
);
