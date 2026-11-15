import { unstable_cache } from "next/cache";
import { cache } from "react";
import { supabasePublic } from "@/_lib/supabase/client";
import { overlay } from "@/_lib/backend/translations/action";
import { defaultLocale, isLocale, type Locale } from "@/i18n.config";

export const DROPS_TAG = "drops";

export type Drop = {
  id: number;
  slug: string;
  title: string;
  tagline: string | null;
  description: string | null;
  hero_image: string | null;
  collaborator_name: string | null;
  collaborator_bio: string | null;
  collaborator_url: string | null;
  collaborator_image: string | null;
  starts_at: string;
  ends_at: string | null;
  product_ids: number[];
};

type DropTranslation = Pick<
  Drop,
  "title" | "tagline" | "description" | "collaborator_bio"
>;

type DropRow = Omit<Drop, "product_ids"> & {
  drop_products: { product_id: number; position: number }[] | null;
};

// RLS returns only published drops (upcoming ones too, for the teaser).
const getAllDrops = unstable_cache(
  async (): Promise<Drop[]> => {
    const { data, error } = await supabasePublic
      .from("drops")
      .select(
        `id, slug, title, tagline, description, hero_image,
        collaborator_name, collaborator_bio, collaborator_url, collaborator_image,
        starts_at, ends_at, drop_products(product_id, position)`,
      )
      .order("starts_at", { ascending: false })
      .limit(100);
    if (error) {
      console.error("Drops:", error.message);
      return [];
    }
    return ((data ?? []) as DropRow[]).map(({ drop_products, ...drop }) => ({
      ...drop,
      product_ids: [...(drop_products ?? [])]
        .sort((a, b) => a.position - b.position)
        .map((p) => p.product_id),
    }));
  },
  ["drops"],
  // Short: a drop page has to flip from countdown to products close to launch.
  { revalidate: 60, tags: [DROPS_TAG] },
);

const getDropTranslations = unstable_cache(
  async (locale: Locale): Promise<Record<number, DropTranslation>> => {
    const { data, error } = await supabasePublic
      .from("drop_translations")
      .select("drop_id, title, tagline, description, collaborator_bio")
      .eq("locale", locale);
    if (error) {
      console.error("Drop translations:", error.message);
      return {};
    }
    const map: Record<number, DropTranslation> = {};
    for (const { drop_id, ...fields } of data ?? []) {
      map[drop_id as number] = fields as DropTranslation;
    }
    return map;
  },
  ["drop-translations"],
  { revalidate: 600, tags: [DROPS_TAG] },
);

export async function translateDrops(drops: Drop[], locale: string) {
  if (!isLocale(locale) || locale === defaultLocale) return drops;
  const translations = await getDropTranslations(locale);
  return drops.map((drop) => overlay(drop, translations[drop.id]));
}

export const getDrops = cache(async (locale: string) =>
  translateDrops(await getAllDrops(), locale),
);

export const getDrop = cache(async (slug: string, locale: string) => {
  const drop = (await getAllDrops()).find((d) => d.slug === slug);
  if (!drop) return null;
  const [translated] = await translateDrops([drop], locale);
  return translated;
});
