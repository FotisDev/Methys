import { createClient } from "@supabase/supabase-js";
import { urlSetResponse } from "@/components/SEO/sitemap";

export const revalidate = 3600;

type SlugRef = { slug: string | null };
type ProductRow = {
  slug: string | null;
  created_at: string | null;
  categoryformen:
    | (SlugRef & { parent: SlugRef | SlugRef[] | null })
    | (SlugRef & { parent: SlugRef | SlugRef[] | null })[]
    | null;
};

const first = <T,>(value: T | T[] | null | undefined) =>
  Array.isArray(value) ? value[0] : value;

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase
    .from("products")
    .select(
      `slug, created_at,
       categoryformen:category_men_id!inner (
         slug,
         parent:parent_id!inner ( slug )
       )`,
    )
    .eq("is_public", true)
    .eq("is_offer", false);

  if (error) {
    console.error("Sitemap products error:", error.message);
  }

  const entries = ((data ?? []) as unknown as ProductRow[]).flatMap(
    (product) => {
      const category = first(product.categoryformen);
      const parent = first(category?.parent);
      if (!product.slug || !category?.slug || !parent?.slug) return [];

      return [
        {
          path: `/collections/${parent.slug}/${category.slug}/${product.slug}`,
          lastmod: product.created_at,
        },
      ];
    },
  );

  return urlSetResponse(entries);
}
