import Image from "next/image";
import Link from "next/link";
import { getCategoryBySlug, getSubcategories } from "@/_lib/helpers";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { notFound } from "next/navigation";
import { CategoryBackendType } from "@/_lib/types";
import { fetchProducts } from "@/_lib/backend/fetchProducts/action";
import { Breadcrumbs } from "@/components/breadcrumb/breadcrumbSchema";

type SubcategoryWithImage = Omit<CategoryBackendType, "image_url"> & {
  image_url: string;
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categorySlug = decodeURIComponent(category);

  let categoryData: CategoryBackendType | null = null;
  let subcategories: SubcategoryWithImage[] = [];
  let error: string | null = null;

  try {
    const foundCategory = await getCategoryBySlug(categorySlug);

    if (!foundCategory || foundCategory.parent_id !== null) {
      throw new Error(`Main category "${categorySlug}" not found`);
    }

    categoryData = foundCategory;

    const [subcategoriesData, allProducts] = await Promise.all([
      getSubcategories(foundCategory.id),
      fetchProducts(),
    ]);

    subcategories = subcategoriesData.map((subcat) => {
      const product = allProducts?.find(
        (p) => p?.categoryformen?.id === subcat.id && p?.image_url
      );

      return {
        ...subcat,
        image_url: product?.image_url ?? "/AuthClothPhoto.jpg",
      } as SubcategoryWithImage;
    });
  } catch (err) {
    console.error("Error loading category page:", err);
    error = err instanceof Error ? err.message : "Unknown error";
  }

  if (error || !categoryData) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", slug: "/" },
    { name: "Products", slug: "/products" },
    { name: categoryData.name, slug: `/products/${categorySlug}` },
  ];

  return (
    <HeaderProvider forceOpaque={true}>
      <main className="relative w-full min-h-screen pt-32 pb-20 font-roboto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems}  />
          <hr className="my-6 border-vintage-green/30" />

          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-vintage-green mb-4 tracking-wide">
              {categoryData.name.toUpperCase()}
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Explore our premium {categoryData.name.toLowerCase()} collections
              – timeless style, exceptional quality.
            </p>
          </header>

          {subcategories.length === 0 ? (
            <section
              className="text-center py-20"
              aria-labelledby="no-subcategories"
            >
              <div className="text-8xl mb-6" role="img" aria-label="Empty box">
                Empty Box
              </div>
              <h2
                id="no-subcategories"
                className="text-3xl font-semibold mb-4 text-vintage-green"
              >
                No subcategories yet
              </h2>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                We’re working on adding new collections. Check back soon!
              </p>
            </section>
          ) : (
            <section aria-labelledby="subcategories-heading">
              <h2 id="subcategories-heading" className="sr-only">
                {categoryData.name} Subcategories
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {subcategories.map((subcategory) => {
                  const href = `/products/${encodeURIComponent(
                    categorySlug
                  )}/${encodeURIComponent(subcategory.slug ?? "")}`;

                  return (
                    <article
                      key={subcategory.id}
                      className="group relative overflow-hidden"
                    >
                      <Link
                        href={href}
                        className="block relative aspect-[3/4] bg-gray-100"
                      
                      >
                        <Image
                          src={subcategory.image_url}
                          alt={``}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          priority
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-2xl font-semibold mb-2 tracking-wide">
                            {subcategory.name}
                          </h3>
                          <p className="text-sm opacity-90 font-medium">
                            Shop Collection
                          </p>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
    </HeaderProvider>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categorySlug = decodeURIComponent(category);

  try {
    const foundCategory = await getCategoryBySlug(categorySlug);
    if (!foundCategory || foundCategory.parent_id !== null) {
      return { title: "Category Not Found | Urban Valor" };
    }

    return {
      title: `${foundCategory.name} | Urban Valor`,
      description: `Shop our exclusive ${foundCategory.name.toLowerCase()} collection – premium quality, timeless design.`,
    };
  } catch {
    return { title: "Category Not Found | Urban Valor" };
  }
}
