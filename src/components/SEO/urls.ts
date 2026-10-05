import { defaultLocale, locales, type Locale } from "@/i18n.config";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
)
  .trim()
  .replace(/\/+$/, "");

export function absoluteUrl(path = "/", locale: Locale = defaultLocale) {
  const clean = path === "/" ? "" : `/${path.replace(/^\/+/, "")}`;
  return `${SITE_URL}/${locale}${clean}`;
}

// hreflang map for a page: every locale version plus x-default.
export function languageAlternates(path = "/") {
  return {
    ...Object.fromEntries(locales.map((l) => [l, absoluteUrl(path, l)])),
    "x-default": absoluteUrl(path, defaultLocale),
  } as Record<Locale | "x-default", string>;
}

export function absoluteAssetUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}/${path.replace(/^\/+/, "")}`;
}
