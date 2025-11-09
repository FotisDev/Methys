import Image from "next/image";
import Link from "next/link";
import {
  getCategoryByName,
  getSubcategories,
  fetchProducts,
  CategoryBackendType,
} from "@/_lib/helpers";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

interface CategoryPageProps {
  params: { category: string };
}

type SubcategoryWithImage = Omit<CategoryBackendType, "image_url"> & {
  image_url: string;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  // ✅ σωστό: το params είναι πλέον promise, οπότε το κάνουμε await
  const { category } = await params;
  const categoryName = category.replace(/-/g, " ");

  let categoryData: CategoryBackendType | null = null;
  let subcategories: SubcategoryWithImage[] = [];
  let error: string | null = null;

  try {
    const foundCategory = await getCategoryByName(categoryName);

    if (!foundCategory || foundCategory.parent_id !== null) {
      throw new Error(`Main category "${categoryName}" not found`);
    }

    categoryData = foundCategory;

    const [subcategoriesData, allProducts] = await Promise.all([
      getSubcategories(foundCategory.id),
      fetchProducts(),
    ]);

    subcategories = subcategoriesData.map((subcat) => {
      const product = allProducts?.find((p) => p.category_men_id === subcat.id);
      return {
        ...subcat,
        image_url: product?.image_url ?? "/AuthClothPhoto.jpg",
      } as SubcategoryWithImage;
    });
  } catch (err) {
    console.error("Error loading category data:", err);
    error = err instanceof Error ? err.message : "Unknown error";
  }

  if (error || !categoryData) {
    notFound();
  }

  return (
    <HeaderProvider forceOpaque={true}>
      <main className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[80vh] pt-32 p-2 font-roboto">
        <div className="mx-auto">
          <Breadcrumb LinkclassName={"hover:text-vintage-brown"} />
          <hr className="mt-4 mb-4 bg-vintage-green" />

          <header className="flex flex-row gap-3 text-center mb-4">
            <h1 className="text-vintage-green mb-2 text-2xl">
              {categoryData.name.toUpperCase()}
            </h1>
            <p className="text-lg text-gray-700">
              Explore our {categoryData.name.toLowerCase()} collections
            </p>
          </header>

          {subcategories.length === 0 ? (
            <section className="text-center py-16" aria-labelledby="no-subcategories">
              <div className="text-6xl mb-4" role="img" aria-label="Empty box">
                📦
              </div>
              <h2 id="no-subcategories" className="text-2xl font-semibold mb-4">
                No subcategories found
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                We are working on adding subcategories. Check back soon!
              </p>
            </section>
          ) : (
            <section aria-labelledby="subcategories-heading font-roboto text-vintage-green">
              <h2 id="subcategories-heading" className="sr-only">
                {categoryData.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-1">
                {subcategories.map((subcategory) => {
                  const href = `/products/${category}/${subcategory.name
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`;

                  return (
                    <article key={subcategory.id} className="group">
                      <Link
                        href={href}
                        className="block relative w-full aspect-[3/4] bg-vintage-green overflow-hidden"
                        aria-label={`View ${subcategory.name} collection`}
                      >
                        <div className="absolute inset-0">
                          <Image
                            src={subcategory.image_url}
                            alt={`Photo of ${subcategory.name} clothing collection`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            priority={false}
                          />
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-vintage-green/70 via-transparent to-transparent" />

                        <div className="relative h-full flex flex-col justify-end p-4 text-left">
                          <h3 className="text-lg sm:text-xl font-semibold text-vintage-brown mb-1">
                            {subcategory.name}
                          </h3>
                          <p className="text-sm text-vintage-brown font-medium">
                            Explore collection →
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
