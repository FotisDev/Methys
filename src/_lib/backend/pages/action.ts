import { supabasePublic } from "@/_lib/supabase/client";
import { unstable_cache } from "next/cache";
import { translatePage } from "@/_lib/backend/translations/action";

// Editable content pages (privacy policy, terms, legal notice) live in the
// `pages` table, one row per slug, with translations in `page_translations`.
export type PageContent = {
  title: string;
  content: string;
  slug: string;
  id: string;
  updated_at: string;
  created_at: string;
};

export type ContentPageSlug =
  "privacy-policy" | "terms-conditions" | "legal-notice";

const fetchEnglishPage = (slug: ContentPageSlug) =>
  unstable_cache(
    async (): Promise<PageContent | null> => {
      const { data, error } = await supabasePublic
        .from("pages")
        .select("title, content, id, slug, updated_at, created_at")
        .eq("slug", slug)
        .maybeSingle();

      if (error) {
        console.error(`Error fetching page "${slug}":`, error.message);
        return null;
      }

      return data;
    },
    ["page", slug],
    {
      revalidate: 86400,
      tags: [slug, "pages"],
    },
  )();

export async function getPage(
  slug: ContentPageSlug,
  locale = "en",
): Promise<PageContent | null> {
  return translatePage(await fetchEnglishPage(slug), locale);
}
