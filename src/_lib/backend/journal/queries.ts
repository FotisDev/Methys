import { unstable_cache } from "next/cache";
import { cache } from "react";
import { supabasePublic } from "@/_lib/supabase/client";
import { overlay } from "@/_lib/backend/translations/action";
import { defaultLocale, isLocale, type Locale } from "@/i18n.config";

export const JOURNAL_TAG = "journal";

export type JournalPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  cover_image: string | null;
  author: string | null;
  product_ids: number[];
  published_at: string;
  updated_at: string;
};

type PostTranslation = Pick<JournalPost, "title" | "excerpt" | "body">;

// RLS only returns posts whose published_at has passed, so drafts and
// scheduled posts stay hidden. The cache means a scheduled post can take up
// to `revalidate` seconds to appear.
const getAllPosts = unstable_cache(
  async (): Promise<JournalPost[]> => {
    const { data, error } = await supabasePublic
      .from("journal_posts")
      .select(
        "id, slug, title, excerpt, body, cover_image, author, product_ids, published_at, updated_at",
      )
      .order("published_at", { ascending: false })
      .limit(200);
    if (error) {
      console.error("Journal posts:", error.message);
      return [];
    }
    return (data ?? []) as JournalPost[];
  },
  ["journal-posts"],
  { revalidate: 600, tags: [JOURNAL_TAG] },
);

const getPostTranslations = unstable_cache(
  async (locale: Locale): Promise<Record<number, PostTranslation>> => {
    const { data, error } = await supabasePublic
      .from("journal_post_translations")
      .select("post_id, title, excerpt, body")
      .eq("locale", locale);
    if (error) {
      console.error("Journal translations:", error.message);
      return {};
    }
    const map: Record<number, PostTranslation> = {};
    for (const { post_id, ...fields } of data ?? []) {
      map[post_id as number] = fields as PostTranslation;
    }
    return map;
  },
  ["journal-post-translations"],
  { revalidate: 600, tags: [JOURNAL_TAG] },
);

async function translate(posts: JournalPost[], locale: string) {
  if (!isLocale(locale) || locale === defaultLocale) return posts;
  const translations = await getPostTranslations(locale);
  return posts.map((post) => overlay(post, translations[post.id]));
}

export const getJournalPosts = cache(async (locale: string) =>
  translate(await getAllPosts(), locale),
);

export const getJournalPost = cache(async (slug: string, locale: string) => {
  const post = (await getAllPosts()).find((p) => p.slug === slug);
  if (!post) return null;
  const [translated] = await translate([post], locale);
  return translated;
});
