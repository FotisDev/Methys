import { defaultLocale, isLocale } from "@/i18n.config";

// Prefixes an internal absolute path ("/help") with the locale ("/el/help").
// Leaves external URLs, hash/query-only links and already-prefixed paths alone.
export function localizePath(path: string, locale?: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;

  const firstSegment = path.split(/[/?#]/)[1];
  if (isLocale(firstSegment)) return path;

  const lang = isLocale(locale) ? locale : defaultLocale;
  return path === "/" ? `/${lang}` : `/${lang}${path}`;
}
