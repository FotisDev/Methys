import { getAllCategoriesWithSubcategories } from "@/_lib/backend/CategoriesWithSubcategoriesAction/action";
import { fetchProducts } from "@/_lib/backend/fetchProducts/action";
import { NextResponse } from "next/server";
import { absoluteUrl } from "@/components/SEO/urls";

const STATIC_PAGES = [
  {
    url: "/",
    label: "Home",
    description:
      "Timeless style. Exceptional quality. Shop the latest men's clothing, kids fashion and accessories from Methys.",
  },
  {
    url: "/collections",
    label: "All Collections",
    description:
      "Browse all Methys collections including menswear, kids clothing and accessories.",
  },
  {
    url: "/online-exclusive",
    label: "Online Exclusive",
    description:
      "Shop Methys online-exclusive pieces available only on the website.",
  },
  {
    url: "/about",
    label: "About",
    description:
      "Learn about the Methys brand, its values and commitment to craftsmanship.",
  },
  {
    url: "/help",
    label: "Help & Support",
    description: "Get help with orders, returns, sizing and more.",
  },
  {
    url: "/privacy-policy",
    label: "Privacy Policy",
    description: "How Methys collects, uses and protects your personal data.",
  },
];

function toLabel(str: string): string {
  return str.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export const dynamic = "force-dynamic";

export async function GET() {
  const [categories, products] = await Promise.all([
    getAllCategoriesWithSubcategories(),
    fetchProducts(),
  ]);

  const lines: string[] = [];

  lines.push(`# Methys\n`);
  lines.push(
    `> Methys is a premium menswear and kids fashion brand offering timeless, high-quality clothing, footwear and accessories. Distinctive pieces for those who value craftsmanship and character.\n`,
  );

  lines.push(`## Main Pages\n`);
  for (const page of STATIC_PAGES) {
    lines.push(
      `- [${page.label}](${absoluteUrl(page.url)}): ${page.description}`,
    );
  }
  lines.push("");

  const parents = categories.filter((c) => c.parent_id === null);
  const children = categories.filter((c) => c.parent_id !== null);

  for (const parent of parents) {
    const subs = children.filter((c) => c.parent_id === parent.id);
    if (subs.length === 0) continue;

    lines.push(`## ${toLabel(parent.name)}\n`);
    for (const sub of subs) {
      lines.push(
        `- [${toLabel(sub.name)}](${absoluteUrl(`/collections/${parent.slug}/${sub.slug}`)}): Shop Methys ${parent.name.toLowerCase()} – ${sub.name.toLowerCase()}.`,
      );
    }
    lines.push("");
  }

  lines.push(`## Products\n`);
  for (const product of products ?? []) {
    const category = Array.isArray(product.categoryformen)
      ? product.categoryformen[0]
      : product.categoryformen;

    const parentSlug = Array.isArray(category?.parent)
      ? category?.parent[0]?.slug
      : category?.parent?.slug;

    if (!parentSlug || !category?.slug || !product.slug) continue;

    const url = absoluteUrl(
      `/collections/${parentSlug}/${category.slug}/${product.slug}`,
    );
    const price = product.price ? `€${product.price}` : "";
    const sizes =
      Array.isArray(product.product_variants) &&
      product.product_variants.length > 0
        ? [...new Set(product.product_variants.map((v) => v.size))].join(", ")
        : "";
    const meta = [price, sizes ? `Sizes: ${sizes}` : ""]
      .filter(Boolean)
      .join(". ");

    lines.push(
      `- [${product.name}](${url}): ${product.description?.slice(0, 120) ?? `Shop ${product.name} at Methys.`}${meta ? ` ${meta}.` : ""}`,
    );
  }

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
