import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCategoryBySlug, getSubcategories } from "@/_lib/helpers";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import Footer from "@/components/footer/Footer";
import { getProductsWithStructure } from "@/_lib/backend/ProductWithStructure/action";
import { Breadcrumbs } from "@/components/breadcrumb/breadcrumbSchema";

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}) {
  const { category, subcategory } = await params;

  const categorySlug = decodeURIComponent(category);
  const subcategorySlug = decodeURIComponent(subcategory);

  try {
    const parentCategory = await getCategoryBySlug(categorySlug);

    if (!parentCategory || parentCategory.parent_id !== null) {
      notFound();
    }

    const subcategories = await getSubcategories(parentCategory.id);
    
    
    const currentCategory = subcategories.find(
      (subcat) => subcat.slug?.toLowerCase() === subcategorySlug.toLowerCase()
    );

    if (!currentCategory) {
      notFound();
    }
    const allProducts = await getProductsWithStructure();

    const products =
      allProducts?.filter(
        (product) =>
          product &&
          product.categoryformen &&
          product.categoryformen.id === currentCategory.id
      ) ?? [];

    const breadcrumbItems = [
      { name: "Home", slug: "/" },
      { name: "Products", slug: "/products" },
    ];

    if (categorySlug) {
      breadcrumbItems.push({
        name: categorySlug,
        slug: `/products/${categorySlug}`,
      });
    }

    return (
      <HeaderProvider forceOpaque={true}>
        <section className="relative w-full min-h-[80vh] pt-32 p-2 pb-32 font-roboto text-vintage-green">
          <Breadcrumbs items={breadcrumbItems} />

          <hr className="mt-4 mb-4 bg-vintage-green" />

          <div className="flex flex-col items-center gap-3 text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-light">
              {currentCategory.name.toUpperCase()}
            </h1>
            <p className="text-lg text-vintage-brown">
              Discover our collection of {currentCategory.name.toLowerCase()}{" "}
              products
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center mt-20">
              <div className="text-8xl mb-6">Still creating this page.</div>
              <h2 className="text-2xl md:text-3xl mb-4">No products found</h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                We’re working on adding products to this category. Check back
                soon!
              </p>
            </div>
          ) : (
            <>
              <div className="p-6 text-center">
                <span className="text-lg text-vintage-brown">
                  {products.length}{" "}
                  {products.length === 1 ? "product" : "products"} available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
                {products.map((product) => {
                  if (!product) return null;

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${encodeURIComponent(
                        categorySlug
                      )}/${encodeURIComponent(
                        subcategorySlug
                      )}/${encodeURIComponent(product.slug ?? "")}`}
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

                      <div className="p-6">
                        <h3 className="text-lg font-medium line-clamp-2 mb-2 group-hover:text-vintage-brown transition">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                            {product.description}
                          </p>
                        )}
                        <span className="text-sm text-vintage-brown font-medium inline-block mt-auto">
                          View Details →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <Footer />
      </HeaderProvider>
    );
  } catch (error) {
    console.error("Error loading subcategory page:", error);
    notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}) {
  const { category, subcategory } = await params;

  const categorySlug = decodeURIComponent(category);
  const subcategorySlug = decodeURIComponent(subcategory);

  try {
    const parentCategory = await getCategoryBySlug(categorySlug);
    if (!parentCategory) return { title: "Category Not Found" };

    const subcategories = await getSubcategories(parentCategory.id);
    const currentCategory = subcategories.find(
      (subcat) => subcat.slug?.toLowerCase() === subcategorySlug.toLowerCase()
    );

    if (!currentCategory) return { title: "Subcategory Not Found" };

    return {
      title: `${currentCategory.name} | ${parentCategory.name} | Urban Valor`,
      description: `Shop our exclusive collection of ${currentCategory.name.toLowerCase()} – premium quality, timeless style.`,
      openGraph: {
        title: `${currentCategory.name} – Urban Valor`,
        description: `Discover ${currentCategory.name.toLowerCase()} from our latest collection.`,
        type: "website",
      },
    };
  } catch {
    return {
      title: "Category Not Found | Urban Valor",
    };
  }
}
