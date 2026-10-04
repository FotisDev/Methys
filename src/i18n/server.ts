import { headers } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "@/i18n.config";
import { createTranslator } from "./translate";
import { LOCALE_HEADER } from "./constants";

// For server components that don't receive the [lang] route param.
// The middleware forwards the locale from the URL on every page request.
export async function getLocale(): Promise<Locale> {
  const value = (await headers()).get(LOCALE_HEADER);
  return isLocale(value) ? value : defaultLocale;
}

export async function getT(locale?: string) {
  return createTranslator(isLocale(locale) ? locale : await getLocale());
}
