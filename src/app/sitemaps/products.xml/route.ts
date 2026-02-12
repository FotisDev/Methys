import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: products, error } = await supabase
    .from("products")
    .select("id, created_at")
    .eq("is_public", true)
    .eq("is_offer", false); 

  if (error) {
    console.error("Supabase error:", error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${(products || [])
  .map(
    (product) => `
  <url>
    <loc>${siteUrl}/products/${product.id}</loc>
    <lastmod>${new Date(product.created_at).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`,
  )
  .join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}