import { urlSetResponse } from "@/components/SEO/sitemap";

const PAGES = [
  "/",
  "/collections",
  "/online-exclusive",
  "/seasonal-collection",
  "/journal",
  "/drops",
  "/about",
  "/help",
  "/customer-support",
  "/privacy-policy",
];

export async function GET() {
  return urlSetResponse(PAGES.map((path) => ({ path })));
}
