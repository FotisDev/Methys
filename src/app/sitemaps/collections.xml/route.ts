import { createClient } from "@supabase/supabase-js";
import { urlSetResponse } from "@/components/SEO/sitemap";

export const revalidate = 3600;

type CategoryRow = {
  id: number;
  slug: string | null;
  parent_id: number | null;
  created_at: string | null;
};

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase
    .from("categoriesformen")
    .select("id, slug, parent_id, created_at");

  if (error) {
    console.error("Sitemap categories error:", error.message);
  }

  const categories = (data ?? []) as CategoryRow[];
  const byId = new Map(categories.map((c) => [c.id, c]));

  const entries = categories.flatMap((category) => {
    if (!category.slug) return [];

    if (category.parent_id === null) {
      return [
        {
          path: `/collections/${category.slug}`,
          lastmod: category.created_at,
        },
      ];
    }

    const parent = byId.get(category.parent_id);
    if (!parent?.slug) return [];

    return [
      {
        path: `/collections/${parent.slug}/${category.slug}`,
        lastmod: category.created_at,
      },
    ];
  });

  return urlSetResponse(entries);
}
