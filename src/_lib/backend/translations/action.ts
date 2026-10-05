import { unstable_cache } from "next/cache";
import { supabasePublic } from "@/_lib/supabase/client";
import { defaultLocale, isLocale, type Locale } from "@/i18n.config";

// Long-form DB content (product copy, FAQs, pages) is translated in *_translations
// tables. English lives in the original tables; missing rows/fields fall back to it.

type ProductTranslation = {
  name: string | null;
  description: string | null;
  size_description: string | null;
  product_details: string | null;
};

type HelpTranslation = {
  title: string | null;
  subtitle: string | null;
  description: string | null;
};

type PageTranslation = {
  title: string | null;
  content: string | null;
};

const REVALIDATE = 3600;

type Id = number | string;

function byId<T>(rows: (T & { id: Id })[] | null) {
  const map: Record<string, T> = {};
  for (const { id, ...fields } of rows ?? []) map[id] = fields as T;
  return map;
}

// Copies only the fields that have a translation, keeping English for the rest.
function overlay<T extends object>(item: T, translation?: object | null): T {
  if (!translation) return item;
  const merged = { ...item } as Record<string, unknown>;
  for (const [key, value] of Object.entries(translation)) {
    if (typeof value === "string" && value.trim() !== "") merged[key] = value;
  }
  return merged as T;
}

const getProductTranslations = unstable_cache(
  async (locale: Locale): Promise<Record<string, ProductTranslation>> => {
    const { data, error } = await supabasePublic
      .from("product_translations")
      .select(
        "id:product_id, name, description, size_description, product_details",
      )
      .eq("locale", locale);

    if (error) {
      console.error("Error fetching product translations:", error.message);
      return {};
    }
    return byId<ProductTranslation>(
      data as (ProductTranslation & { id: number })[],
    );
  },
  ["product-translations"],
  { revalidate: REVALIDATE, tags: ["products", "product-translations"] },
);

const getHelpTranslations = unstable_cache(
  async (locale: Locale): Promise<Record<string, HelpTranslation>> => {
    const { data, error } = await supabasePublic
      .from("help_translations")
      .select("id:help_id, title, subtitle, description")
      .eq("locale", locale);

    if (error) {
      console.error("Error fetching FAQ translations:", error.message);
      return {};
    }
    return byId<HelpTranslation>(data as (HelpTranslation & { id: number })[]);
  },
  ["help-translations"],
  { revalidate: REVALIDATE, tags: ["faqs", "help-translations"] },
);

const getPageTranslations = unstable_cache(
  async (locale: Locale): Promise<Record<string, PageTranslation>> => {
    const { data, error } = await supabasePublic
      .from("page_translations")
      .select("id:page_id, title, content")
      .eq("locale", locale);

    if (error) {
      console.error("Error fetching page translations:", error.message);
      return {};
    }
    return byId<PageTranslation>(data as (PageTranslation & { id: string })[]);
  },
  ["page-translations"],
  { revalidate: REVALIDATE, tags: ["pages", "page-translations"] },
);

function needsTranslation(locale: string): locale is Locale {
  return isLocale(locale) && locale !== defaultLocale;
}

export async function translateProducts<T extends { id: number }>(
  items: T[] | null,
  locale: string,
): Promise<T[] | null> {
  if (!items || !needsTranslation(locale)) return items;
  const translations = await getProductTranslations(locale);
  return items.map((item) => overlay(item, translations[item.id]));
}

export async function translateProduct<T extends { id: number }>(
  item: T | null,
  locale: string,
): Promise<T | null> {
  if (!item) return item;
  const [translated] = (await translateProducts([item], locale)) ?? [item];
  return translated;
}

export async function translateFaqs<T extends { id: number }>(
  items: T[],
  locale: string,
): Promise<T[]> {
  if (!needsTranslation(locale)) return items;
  const translations = await getHelpTranslations(locale);
  return items.map((item) => overlay(item, translations[item.id]));
}

export async function translatePage<T extends { id: Id }>(
  page: T | null,
  locale: string,
): Promise<T | null> {
  if (!page || !needsTranslation(locale)) return page;
  const translations = await getPageTranslations(locale);
  return overlay(page, translations[page.id]);
}
