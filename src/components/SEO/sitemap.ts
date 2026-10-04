import { NextResponse } from "next/server";
import { locales } from "@/i18n.config";
import { absoluteUrl, languageAlternates } from "./urls";

export type SitemapEntry = {
  path: string;
  lastmod?: string | null;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toIsoDate(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

// One <url> per locale, each listing all language versions as hreflang alternates.
export function urlSetResponse(entries: SitemapEntry[]) {
  const urls = entries.flatMap((entry) => {
    const lastmod = toIsoDate(entry.lastmod);
    const alternates = Object.entries(languageAlternates(entry.path))
      .map(
        ([hreflang, href]) =>
          `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(href)}"/>`,
      )
      .join("\n");

    return locales.map(
      (locale) => `  <url>
    <loc>${escapeXml(absoluteUrl(entry.path, locale))}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}
${alternates}
  </url>`,
    );
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
