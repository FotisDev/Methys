import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getCategoryByName,
  getSubcategories,
  fetchProducts,
} from "@/_lib/helpers";
import { HeaderProvider } from "@/components/providers/HeaderProvider";

interface PageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { category, subcategory } = await params;

  // Decode and process URL parameters
  const categorySlug = decodeURIComponent(category);
  const rawSubcategorySlug = decodeURIComponent(subcategory);
  const categoryName = categorySlug.replace(/-/g, " ").toLowerCase().trim();
  const subcategoryName = rawSubcategorySlug
    .replace(/^\(\.\)/, "")
    .replace(/-/g, " ")
    .toLowerCase()
    .trim();
  const subcategorySlug = rawSubcategorySlug;

  try {
    // Fetch parent category
    const parentCategory = await getCategoryByName(categoryName);
    if (!parentCategory || parentCategory.parent_id !== null) {
      notFound();
    }

    // Fetch subcategories
    const subcategories = await getSubcategories(parentCategory.id);

    // Find matching subcategory
    const currentCategory = subcategories.find(
      (subcat) =>
        (subcat.slug && subcat.slug === subcategorySlug) ||
        subcat.name.toLowerCase().trim() === subcategoryName ||
        (subcat.slug && decodeURIComponent(subcat.slug) === subcategorySlug) ||
        subcat.name.toLowerCase().includes(subcategoryName) ||
        subcategoryName.includes(subcat.name.toLowerCase())
    );

    if (!currentCategory) {
      notFound();
    }

    // Fetch all products and filter by subcategory
    const allProducts = await fetchProducts();
    const products = allProducts?.filter(
      (product) => product.category_men_id === currentCategory.id
    ) || [];

    return (
      <HeaderProvider forceOpaque={true}>
        <section className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[80vh] pt-32 p-2 font-roboto text-vintage-green">
          {/* Breadcrumb Navigation */}
          <nav className="mb-4 text-sm">
            <Link href="/products" className="hover:text-vintage-brown">
              Products
            </Link>
            <span className="mx-2">/</span>
            <Link
              href={`/products/${encodeURIComponent(categorySlug)}`}
              className="hover:text-vintage-brown"
            >
              {parentCategory.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="hover:text-vintage-brown cursor-pointer">
              {currentCategory.name}
            </span>
          </nav>

          <hr className="mt-4 mb-4 bg-vintage-green" />

          {/* Header */}
          <div className="flex flex-row gap-3 text-center">
            <h1 className="text-2xl text-center">{currentCategory.name.toUpperCase()}</h1>
            <p className="text-center text-lg">
              Discover our collection of {currentCategory.name.toLowerCase()} products
            </p>
          </div>

          {/* Empty State or Products Grid */}
          {products.length === 0 ? (
            <div className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl mb-4">No products found</h2>
              <p className="mb-8">
                We are working on adding products to this category. Check back soon!
              </p>
            </div>
          ) : (
            <>
              {/* Product Count */}
              <div className="p-10 text-center font-roboto relative">
                <span className="text-vintage-green text-lg absolute left-3">
                  {products.length} {products.length === 1 ? "product" : "products"}
                </span>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
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
                ))}
              </div>
            </>
          )}

          {/* Back Button */}
          <div className="text-center p-10">
            <Link
              href={`/products/${encodeURIComponent(categorySlug)}`}
              className="inline-block px-6 py-3 text-sm hover-colors rounded-2xl sm:rounded-3xl p-2"
            >
              ← Back to {parentCategory.name}
            </Link>
          </div>
        </section>
      </HeaderProvider>
    );
  } catch (error) {
    console.error("Error loading subcategory:", error);
    notFound();
  }
}

// Optional: Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { category, subcategory } = await params;
  const categorySlug = decodeURIComponent(category);
  const rawSubcategorySlug = decodeURIComponent(subcategory);
  const categoryName = categorySlug.replace(/-/g, " ").toLowerCase().trim();
  const subcategoryName = rawSubcategorySlug
    .replace(/^\(\.\)/, "")
    .replace(/-/g, " ")
    .toLowerCase()
    .trim();

  try {
    const parentCategory = await getCategoryByName(categoryName);
    if (!parentCategory) {
      return { title: "Category Not Found" };
    }

    const subcategories = await getSubcategories(parentCategory.id);
    const currentCategory = subcategories.find(
      (subcat) =>
        subcat.name.toLowerCase().trim() === subcategoryName ||
        (subcat.slug && subcat.slug === rawSubcategorySlug)
    );

    if (!currentCategory) {
      return { title: "Category Not Found" };
    }

    return {
      title: `${currentCategory.name} | ${parentCategory.name} | Your Store`,
      description: `Discover our collection of ${currentCategory.name.toLowerCase()} products`,
    };
  } catch {
    return { title: "Category Not Found" };
  }
}