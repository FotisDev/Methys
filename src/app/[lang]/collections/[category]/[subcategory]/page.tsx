import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCategoryBySlug, getSubcategories } from "@/_lib/helpers";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import Footer from "@/components/footer/Footer";
import { getProductsWithStructure } from "@/_lib/backend/ProductWithStructure/action";
import { Breadcrumbs } from "@/components/breadcrumb/breadcrumbSchema";
import { FilteredProducts } from "@/_lib/backend/filtering/action";
import ProductFilterClient from "@/components/filters/Filters";
import { createMetadata } from "@/components/SEO/metadata";
import { Metadata } from "next";
import { createCollectionPageSchema } from "@/_lib/schemasGenerators/collectionPageSchema";
import Schema from "@/components/schemas/SchemaMarkUp";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}): Promise<Metadata> {
  const { category, subcategory } = await params;
  const categorySlug = decodeURIComponent(category);
  const subcategorySlug = decodeURIComponent(subcategory);

  try {
    const parentCategory = await getCategoryBySlug(categorySlug);

    if (!parentCategory || parentCategory.parent_id !== null) {
      return createMetadata({
        MetaTitle: "Category Not Found | Methys",
        MetaDescription: "The category you're looking for doesn't exist.",
        canonical: `/collections/${categorySlug}/${subcategorySlug}`,
        OpenGraphImageUrl:
          "/storage/v1/object/public/OpenGraphImages/about-us.jpg",
        other: {
          "twitter:card": "summary_large_image",
          "twitter:title": "Category Not Found | Methys",
          "twitter:description":
            "Learn about Methys — our story, mission, and the team behind the product.",
        },
      });
    }

    const subcategories = await getSubcategories(parentCategory.id);
    const currentCategory = subcategories.find(
      (subcat) => subcat.slug?.toLowerCase() === subcategorySlug.toLowerCase(),
    );

    if (!currentCategory) {
      return createMetadata({
        MetaTitle: "Subcategory Not Found | Methys",
        MetaDescription: "The subcategory you're looking for doesn't exist.",
        canonical: `/collections/${categorySlug}/${subcategorySlug}`,
        robots: { index: false, follow: false },
      });
    }

    return createMetadata({
      MetaTitle: `${currentCategory.name} - ${parentCategory.name} | Methys`,
      MetaDescription: `Discover our collection of ${currentCategory.name.toLowerCase()} products. Timeless style, exceptional quality.`,
      canonical: `/collections/${categorySlug}/${subcategorySlug}`,
      // Optional: Add category image
      OpenGraphImageUrl:
        "/storage/v1/object/public/OpenGraphImages/about-us.jpg",
    });
  } catch {
    return createMetadata({
      MetaTitle: "Error | Methys",
      MetaDescription: "An error occurred while loading this page.",
      canonical: `/collections/${categorySlug}/${subcategorySlug}`,
      robots: { index: false, follow: false },
    });
  }
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
  searchParams: Promise<{ min?: string; max?: string; size?: string }>;
}) {
  const { category, subcategory } = await params;

  const categorySlug = decodeURIComponent(category);
  const subcategorySlug = decodeURIComponent(subcategory);
  const filters = await searchParams;

  const parentCategory = await getCategoryBySlug(categorySlug);

  if (!parentCategory || parentCategory.parent_id !== null) {
    notFound();
  }

  const subcategories = await getSubcategories(parentCategory.id);

  const currentCategory = subcategories.find(
    (subcat) => subcat.slug?.toLowerCase() === subcategorySlug.toLowerCase(),
  );

  if (!currentCategory) {
    notFound();
  }

  const allProducts = await getProductsWithStructure();

  const filteredProducts = await FilteredProducts({
    parentSlug: categorySlug,
    categorySlug: subcategorySlug,
    min: filters?.min,
    max: filters?.max,
    size: filters?.size,
  });

  const products =
    allProducts?.filter(
      (product) =>
        product &&
        product.categoryformen &&
        product.categoryformen.id === currentCategory.id,
    ) ?? [];

  const schema = createCollectionPageSchema({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/collections/${categorySlug}/${subcategorySlug}`,
    name: currentCategory.name,
    description: `Discover our collection of ${currentCategory.name.toLowerCase()}.`,
    items: products.map((p) => ({
      name: p.name,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/collections/${categorySlug}/${subcategorySlug}/${p.slug}`,
      imageUrl: p.image_url?.[0] ?? undefined,
    })),
  });

  const breadcrumbItems = [
    { name: "Home", slug: "/" },
    { name: "collections", slug: "/collections" },
    {
      name: parentCategory.name,
      slug: `/collections/${parentCategory.slug}`,
    },
    {
      name: currentCategory.name,
      slug: `/collections/${parentCategory.slug}/${currentCategory.slug}`,
    },
  ];

  return (
    <HeaderProvider forceOpaque={true}>
      <Schema markup={schema} />
      <section className="relative w-full min-h-[80vh] pt-22 p-2 pb-32 font-serif text-vintage-green">
        <Breadcrumbs items={breadcrumbItems} />

        <header className="flex flex-row items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-light">
            {currentCategory.name.toUpperCase()}
          </h1>
          <p className="text-lg text-vintage-brown">
            Discover our collection of {currentCategory.name.toLowerCase()}
          </p>
        </header>

        <div className="flex flex-row gap-5 text-xl capitalize py-2">
          {subcategories.map((item) => (
            <Link
              href={`/collections/${parentCategory.slug}/${item.slug}`}
              key={item.id}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <hr className="mt-2 mb-4 bg-vintage-green" />

        {/* ✅ Τα products περνάνε ως children — sidebar + grid σε flex row */}
        <ProductFilterClient
          initialProducts={filteredProducts || []}
          parentSlug={categorySlug}
          categorySlug={subcategorySlug}
        >
          {products.length === 0 ? (
            <div className="text-center mt-20">
              <div className="text-8xl mb-6">Still creating this page.</div>
              <h2 className="text-2xl md:text-3xl mb-4">No products found</h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                We are working on adding products to this category. Check back soon!
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-vintage-brown mb-4">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"} available
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => {
                  if (!product) return null;

                  return (
                    <Link
                      key={product.id}
                      href={`/collections/${encodeURIComponent(categorySlug)}/${encodeURIComponent(subcategorySlug)}/${encodeURIComponent(product.slug ?? "")}`}
                      className="group block bg-white border border-vintage-green/20 hover:border-vintage-green transition-all duration-300 overflow-hidden"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                        <Image
                          src={product.image_url?.[0] || "/AuthClothPhoto.jpg"}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          priority={false}
                        />
                        {product.is_offer && (
                          <div className="absolute top-4 left-4 bg-red-600 text-white text-xs uppercase px-3 py-1.5 rounded">
                            Offer
                          </div>
                        )}
                        {product.price && (
                          <div className="absolute top-4 right-4 bg-white text-vintage-green px-3 py-1.5 rounded-lg text-sm font-medium shadow">
                            €{product.price}
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="text-base font-medium line-clamp-2 mb-1 group-hover:text-vintage-brown transition">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                            {product.description}
                          </p>
                        )}
                        <span className="text-sm text-vintage-brown font-medium">
                          View Details →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </ProductFilterClient>
      </section>

      <Footer />
    </HeaderProvider>
  );
}
