import { urlSetResponse } from "@/components/SEO/sitemap";
import { getJournalPosts } from "@/_lib/backend/journal/queries";
import { getDrops } from "@/_lib/backend/drops/queries";

export const revalidate = 3600;

// Journal posts and drops (both are published-only through RLS).
export async function GET() {
  const [posts, drops] = await Promise.all([
    getJournalPosts("en"),
    getDrops("en"),
  ]);

  return urlSetResponse([
    ...posts.map((post) => ({
      path: `/journal/${post.slug}`,
      lastmod: post.updated_at,
    })),
    ...drops.map((drop) => ({
      path: `/drops/${drop.slug}`,
      lastmod: drop.starts_at,
    })),
  ]);
}
