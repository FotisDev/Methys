import Image from "next/image";
import Link from "next/link";
import { fetchCategories } from "@/_lib/helpers";
import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { Breadcrumbs } from "@/components/breadcrumb/breadcrumbSchema";
import { createMetadata } from "@/components/SEO/metadata";
import type { Metadata } from "next";



export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    MetaTitle: "Shop All Collections | Methys",
    MetaDescription: "Discover our curated selection of premium clothing and accessories. Timeless style, exceptional quality.",
    canonical: "/products",
  });
}

export default async function ProductList() {
  let categories = null;
  let error = null;

  try {
    const categoriesData = await fetchCategories();
    
    if (!categoriesData) {
      throw new Error("No categories data returned");
    }

    categories = categoriesData.map((cat) => ({
      ...cat,
      image_url: cat.image_url || "/accesories.jpg",
      parent_id: cat.parent_id ?? null,
    }));
  } catch (err) {
    console.error("Fetch categories failed:", err);
    error = err instanceof Error ? err.message : "Unknown error";
  }

  const parentCategories = categories?.filter(
    (c) =>
      [1, 2, 30].includes(c.id) &&
      (c.parent_id === null || c.parent_id === undefined)
  ) || [];

  if (error || !categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-vintage-green font-poppins text-xl">
        <p>{error || "No categories found."}</p>
        <Link
          href="/"
          className="mt-4 px-4 py-2 text-sm font-medium text-vintage-green rounded-lg transition-colors"
        >
          Back to homepage
        </Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: "Home", slug: "/" },
    { name: "Products", slug: "/products" },
  ];

  return (
    <HeaderProvider forceOpaque={true}>
      <section className="padding-y padding-x text-vintage-green font-roboto">
        <div className="pt-16">
          <Breadcrumbs items={breadcrumbItems} />
          

          <header className="mb-10 mt-6">
            <h1 className="text-3xl md:text-4xl font-light mb-4">
              Shop All Collections
            </h1>
            <p className="text-lg text-vintage-brown">
              Discover our curated selection of premium clothing and accessories
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {parentCategories.map((category) => {
              if (!category.name) return null;

              const href = `/products/${category.name
                .replace(/\s+/g, "-")
                .toLowerCase()}`;
              const imageUrl = category.image_url ?? "/accesories.jpg";

              return (
                <Link
                  key={category.id}
                  href={href}
                  className="group relative w-full aspect-[3/4] bg-vintage-green"
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={`${category.name} collection`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <span className="absolute bottom-2 left-2 px-3 py-1 hover-colors rounded-md capitalize text-sm">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
          
          <Footer />
        </div>
      </section>
    </HeaderProvider>
  );
}