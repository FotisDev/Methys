import type { MetadataRoute } from "next";
import { SITE_URL } from "@/components/SEO/urls";

const PRIVATE_PATHS = [
  "/cart",
  "/checkout",
  "/success",
  "/canceled",
  "/Wishlist",
  "/login",
  "/createAccount",
  "/forgot-password",
  "/reset-password",
  "/offers",
  "/product-entry",
];

export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_IS_LIVE_SITE !== "true") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", ...PRIVATE_PATHS.map((p) => `/*${p}`)],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
