import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getCategoryBySlug,
  getSubcategories,
  getValidImage,
} from "@/_lib/helpers";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import ProductActionsInline from "./ProductActionsInline";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";
import { fetchProductBySlug } from "@/_lib/backend/productBySlug/action";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{
    category: string;
    subcategory: string;
    slug: string;
  }>;
}) {
  const { category, subcategory, slug } = await params;

  const categorySlug = decodeURIComponent(category);
  const subcategorySlug = decodeURIComponent(subcategory);
  const productSlug = decodeURIComponent(slug);

  try {
    const parentCategory = await getCategoryBySlug(categorySlug);
    if (!parentCategory || parentCategory.parent_id !== null) {
      notFound();
    }

    const subcategories = await getSubcategories(parentCategory.id);

    const currentCategory = subcategories.find(
      (subcat) => subcat.slug === subcategorySlug
    );

    if (!currentCategory) {
      notFound();
    }

    const product = await fetchProductBySlug(currentCategory.id, productSlug);

    if (!product) {
      notFound();
    }

    return (
      <HeaderProvider forceOpaque={true}>
        <section className="relative w-full pt-20 pb-32 font-roboto text-vintage-green">
          {/* Breadcrumb */}
          <div className="mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <Breadcrumb LinkclassName="hover:text-vintage-brown text-sm uppercase tracking-wider" />
          </div>

          <div className=" mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              {/* LEFT SIDE - PRODUCT IMAGES */}
              <div className="space-y-0">
                {/* Main Image */}
                <div
                  className="relative bg-gray-50 overflow-hidden"
                  style={{ aspectRatio: "3/4" }}
                >
                  <Image
                    src={getValidImage(
                      product.image_url ?? "/AuthClothPhoto.jpg"
                    )}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                    priority
                  />

                  {product.is_offer && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs uppercase px-3 py-1.5 tracking-wider">
                      NEW IN
                    </div>
                  )}
                </div>

                {/* Secondary Image */}
                <div
                  className="relative bg-gray-50 overflow-hidden mt-0"
                  style={{ aspectRatio: "3/4" }}
                >
                  <Image
                    src={getValidImage(
                      product.image_url ?? "/AuthClothPhoto.jpg"
                    )}
                    alt={`${product.name} - alternate view`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>

              <div className="lg:sticky lg:top-24 lg:h-fit space-y-8">
                <div>
                  <h1 className="text-2xl md:text-3xl mb-2 font-light tracking-wide">
                    {product.name}
                  </h1>

                  {product.description && (
                    <p className="text-sm text-gray-600 mb-4">
                      {product.description.split(" ").slice(0, 5).join(" ")}
                    </p>
                  )}

                  <div className="flex items-baseline gap-3">
                    <span className="text-xl font-normal">
                      €{product.price}
                    </span>
                    {product.is_offer && (
                      <span className="text-sm text-gray-500 line-through">
                        €
                        {(parseFloat(product.price.toString()) * 1.2).toFixed(
                          2
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <ProductActionsInline product={product} />

                <div className="border-t pt-6 space-y-4">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer list-none">
                      <span className="text-sm font-medium">
                        Free delivery over €150
                      </span>
                      <span className="transition group-open:rotate-45">+</span>
                    </summary>
                    <div className="mt-3 text-sm text-gray-600 leading-relaxed">
                      <p>Expected delivery: November 26 - 28</p>
                    </div>
                  </details>

                  <details className="group border-t pt-4">
                    <summary className="flex justify-between items-center cursor-pointer list-none">
                      <span className="text-sm font-medium">
                        Extended returns until January 23rd
                      </span>
                      <span className="transition group-open:rotate-45">+</span>
                    </summary>
                    <div className="mt-3 text-sm text-gray-600 leading-relaxed">
                      <p>Need help? Contact us or check our FAQ</p>
                    </div>
                  </details>
                </div>

                <div className="border-t pt-6">
                  <p className="text-sm text-gray-700 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <p>- 100% Cotton (Organic)</p>
                    <p>- Brushed twill fabric</p>
                    <p>- Loose fit</p>
                    <p>- All-over check pattern</p>
                    <p>- Single chest pocket with button closure</p>
                    <p>- Full button placket</p>
                    <p>- Adjustable buttoned cuffs</p>
                    <p>- Straight hem</p>
                  </div>
                </div>

                {product.product_variants?.length > 0 && (
                  <div className="border-t pt-6">
                    <h3 className="text-sm font-medium mb-3">
                      Size & Stock Information
                    </h3>
                    <div className="space-y-2">
                      {product.product_variants.map((variant, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm py-2 border-b border-gray-100"
                        >
                          <span>Size {variant.size}</span>
                          <span
                            className={
                              variant.quantity > 0
                                ? "text-vintage-brown"
                                : "text-red-600"
                            }
                          >
                            {variant.quantity > 0
                              ? `${variant.quantity} in stock`
                              : "Out of stock"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Product ID: #{product.id}
                </div>
              </div>
            </div>
          </div>
        </section>
      </HeaderProvider>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{
    category: string;
    subcategory: string;
    slug: string;
  }>;
}) {
  const { category, subcategory, slug } = await params;

  const categorySlug = decodeURIComponent(category);
  const subcategorySlug = decodeURIComponent(subcategory);
  const productSlug = decodeURIComponent(slug);

  try {
    const parentCategory = await getCategoryBySlug(categorySlug);
    if (!parentCategory) return { title: "Product Not Found" };

    const subcategories = await getSubcategories(parentCategory.id);
    const currentCategory = subcategories.find(
      (subcat) => subcat.slug === subcategorySlug
    );

    if (!currentCategory) return { title: "Product Not Found" };

    const product = await fetchProductBySlug(currentCategory.id, productSlug);
    if (!product) return { title: "Product Not Found" };

    return {
      title: `${product.name} | Your Store`,
      description: product.description ?? undefined,
    };
  } catch {
    return { title: "Product Not Found" };
  }
}
