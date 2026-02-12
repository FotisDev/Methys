import { NextResponse } from "next/server";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const lines = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /checkout/",
    "Disallow: /dashboard/",
    "Disallow: /admin/",
    "Disallow: /*?*",
    "",
    "User-agent: GPTBot",
    "Allow: /",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ];

  return new NextResponse(lines.join("\n"), {
    headers: { "Content-type": "text/plain" },
  });
}
