export const locales = ["en", "el", "da", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// Used for <html lang>, og:locale and hreflang.
export const localeMeta: Record<Locale, { htmlLang: string; ogLocale: string; label: string }> = {
  en: { htmlLang: "en", ogLocale: "en_US", label: "English" },
  el: { htmlLang: "el", ogLocale: "el_GR", label: "Ελληνικά" },
  da: { htmlLang: "da", ogLocale: "da_DK", label: "Dansk" },
  de: { htmlLang: "de", ogLocale: "de_DE", label: "Deutsch" },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
