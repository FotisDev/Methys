import { NextResponse } from "next/server";
import { SITE_URL } from "@/components/SEO/urls";

const SITEMAPS = ["static.xml", "collections.xml", "products.xml"];

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAPS.map(
  (name) => `  <sitemap>
    <loc>${SITE_URL}/sitemaps/${name}</loc>
  </sitemap>`,
).join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
