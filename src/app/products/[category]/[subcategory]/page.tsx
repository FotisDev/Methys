import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCategoryBySlug, getSubcategories } from "@/_lib/helpers";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import Footer from "@/components/footer/Footer";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import { getProductsWithStructure } from "@/_lib/backend/newCollection/action";

interface PageProps {
  params: {
    category: string;
    subcategory: string;
  };
}

export default async function SubcategoryPage({ params }: PageProps) {
  // Απλά προσθέστε 'await' εδώ
  const awaitedParams = await params;
  const categorySlug = decodeURIComponent(awaitedParams.category);
  const subcategorySlug = decodeURIComponent(awaitedParams.subcategory);
  try {
    const parentCategory = await getCategoryBySlug(categorySlug);

    if (!parentCategory || parentCategory.parent_id !== null) {
      // (Γραμμή 27)
      notFound();
    }

    const subcategories = await getSubcategories(parentCategory.id);

    const currentCategory = subcategories.find(
      (subcat) => subcat.slug?.toLowerCase() === subcategorySlug.toLowerCase() // Αφαιρούμε το || subcat.name.toLowerCase() === subcategorySlug.toLowerCase()
    );

    if (!currentCategory) {
      notFound();
    }
    // Log 1: Το ID που ψάχνουμε
    console.log("LOG 1: Target Category ID:", currentCategory.id);

    const allProducts = await getProductsWithStructure();

    // Log 2: Το σύνολο των προϊόντων που φέραμε (για να δούμε αν είναι άδειο)
    console.log("LOG 2: Total Products Fetched:", allProducts?.length);

    const products =
      allProducts?.filter(
        (product) =>
          product &&
          product.categoryformen &&
          product.categoryformen.id === currentCategory.id
      ) || [];

    // Log 3: Το ID του πρώτου προϊόντος που φέραμε
    console.log(
      "LOG 3: First Product's Category ID:",
      allProducts?.[0]?.categoryformen?.id
    );

    // Log 4: Ο τελικός αριθμός των φιλτραρισμένων προϊόντων
    console.log("LOG 4: Filtered Products Count:", products.length);

    return (
      <HeaderProvider forceOpaque={true}>
        <section className="relative w-full min-h-[80vh] pt-32 p-2 pb-32 font-roboto text-vintage-green">
          <Breadcrumb LinkclassName={"hover:text-vintage-brown"} />

          <hr className="mt-4 mb-4 bg-vintage-green" />

          <div className="flex flex-row gap-3 text-center">
            <h1 className="text-2xl text-center">
              {currentCategory.name.toUpperCase()}
            </h1>
            <p className="text-center text-lg">
              Discover our collection of {currentCategory.name.toLowerCase()}{" "}
              products
            </p>
          </div>
          {products.length === 0 ? (
            <div className="text-center mt-10">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl mb-4">No products found</h2>
              <p className="mb-8">
                We’re working on adding products to this category. Check back
                soon!
              </p>
            </div>
          ) : (
            <>
              <div className="p-10 text-center relative">
                <span className="text-vintage-green text-lg absolute left-3">
                  {products.length}{" "}
                  {products.length === 1 ? "product" : "products"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                  if (!product) return null;

                  return (
                    <div
                      key={product.id}
                      className="group relative w-full bg-white overflow-hidden border border-vintage-green"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <Image
                          src={product.image_url || "/AuthClothPhoto.jpg"}
                          alt={product.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />

                        {product.price && (
                          <div className="absolute top-3 right-3 bg-white text-vintage-green px-2 py-1 rounded-lg text-sm">
                            ${product.price}
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg mb-2 line-clamp-2 capitalize">
                          {product.name}
                        </h3>

                        {product.description && (
                          <p className="text-sm text-vintage-green mb-3 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between relative">
                          <Link
                            href={`/products/${encodeURIComponent(
                              categorySlug
                            )}/${encodeURIComponent(
                              subcategorySlug
                            )}/${encodeURIComponent(product.slug)}`}
                            className="px-4 py-2 hover-colors rounded absolute bottom-3 right-3"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <Footer showNewsLetter={true} />
      </HeaderProvider>
    );
  } catch (error) {
    console.error("Error loading subcategory:", error);
    notFound();
  }
}

// export async function generateMetadata({ params }: PageProps) {
//   const categorySlug = decodeURIComponent(params.category);
//   const subcategorySlug = decodeURIComponent(params.subcategory);

//   try {
//     const parentCategory = await getCategoryBySlug(categorySlug);

//     if (!parentCategory) return { title: "Category Not Found" };

//     const subcategories = await getSubcategories(parentCategory.id);
//     const currentCategory = subcategories.find(
//       (subcat) => subcat.slug === subcategorySlug
//     );

//     if (!currentCategory) return { title: "Category Not Found" };

//     return {
//       title: `${currentCategory.name} | ${parentCategory.name} | Your Store`,
//       description: `Discover our collection of ${currentCategory.name.toLowerCase()} products`,
//     };
//   } catch {
//     return { title: "Category Not Found" };
//   }
// }
