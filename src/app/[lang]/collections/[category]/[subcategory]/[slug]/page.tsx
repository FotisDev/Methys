import { notFound } from "next/navigation";
import Image from "next/image";
import {
  getCategoryBySlug,
  getSubcategories,
  getValidImage,
} from "@/_lib/helpers";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import ProductActionsInline from "./ProductActionsInline";
import { fetchProductBySlug } from "@/_lib/backend/productBySlug/action";
import { Breadcrumbs } from "@/components/breadcrumb/breadcrumbSchema";
import { createProductSchema } from "@/components/schemas/newCollectionSchema";
import Schema from "@/components/schemas/SchemaMarkUp";
import Footer from "@/components/footer/Footer";
import { ProductBySpringSeason } from "@/_lib/backend/ProductWithStructure/action";
import { createMetadata } from "@/components/SEO/metadata";
import SeasonalCollectionSection from "@/components/sections/SeasonalCollectionSection";
import Link from "next/link";
import DropDownMenu from "@/components/header/DropDownMenu";

export const revalidate = 600;

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
    if (!parentCategory) {
      return createMetadata({
        MetaTitle: "Product Not Found | UrbanValor",
        MetaDescription: "The product you're looking for doesn't exist.",
        // canonical: `/collections/${categorySlug}/${subcategorySlug}/${productSlug}`,//ΝΑ ΔΩ ΑΥΤΟ ΑΝ ΔΟΥΛΕΥΕΙ ΣΩΣΤΑ ΓΙΑΤΙ ΠΑΙΖΕΙ ΝΑ ΕΙΝΑΙ ΕΤΟΙΜΟ ΤΟ  ΝΕΧΤ_PUBLIC ΑΠΟ ΤΗΝ CREATElOACLE METADA.
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/collections/${categorySlug}/${subcategorySlug}/${productSlug}`,
        OpenGraphImageUrl:
          "/storage/v1/object/public/OpenGraphImages/about.jpg",
        other: {
          "twitter:card": "summary_large_image",
          "twitter:title": "About Us | Methys",
          "twitter:description":
            "Learn about Methys — our story, mission, and the team behind the product.",
        },
      });
    }

    const subcategories = await getSubcategories(parentCategory.id);
    const currentCategory = subcategories.find(
      (subcat) => subcat.slug === subcategorySlug,
    );

    if (!currentCategory) {
      return createMetadata({
        MetaTitle: "Product Not Found | UrbanValor",
        MetaDescription: "The product you're looking for doesn't exist.",
        canonical: `/collections/${categorySlug}/${subcategorySlug}/${productSlug}`,
        robots: { index: false, follow: false },
      });
    }

    const product = await fetchProductBySlug(currentCategory.id, productSlug);

    if (!product) {
      return createMetadata({
        MetaTitle: "Product Not Found | UrbanValor",
        MetaDescription: "The product you're looking for doesn't exist.",
        canonical: `/collections/${categorySlug}/${subcategorySlug}/${productSlug}`,
        robots: { index: false, follow: false },
      });
    }

    const inStock = product.product_variants.some((v) => v.quantity > 0);

    return createMetadata({
      MetaTitle: `${product.name} | Methys`,
      MetaDescription:
        product.description ??
        "Premium clothing from Methys. Timeless style, exceptional quality.",
      canonical: `/collections/${categorySlug}/${subcategorySlug}/${productSlug}`,
      OpenGraphImageUrl: product.image_url?.[0],
      product: {
        price: `${product.price} EUR`,
        availability: inStock ? "InStock" : "OutOfStock",
        brand: "Methys",
      },
      other: {
        "twitter:card": "summary_large_image",
        "twitter:title": product.name,
        "twitter:description": product.description ?? "",
        "twitter:image": product.image_url?.[0] ?? "/AuthClothPhoto.jpg",
        "product:price:amount": product.price.toString(),
        "product:price:currency": "EUR",
      },
    });
  } catch (error) {
    console.error("Error generating product metadata:", error);
    return createMetadata({
      MetaTitle: "Error | Methys",
      MetaDescription: "An error occurred while loading this product.",
      canonical: `/collections/${categorySlug}/${subcategorySlug}/${productSlug}`,
      robots: { index: false, follow: false },
    });
  }
}

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
    // console.log("DEBUG parentCategory:", parentCategory, "categorySlug:", categorySlug);
    if (!parentCategory || parentCategory.parent_id !== null) {
      // console.log("DEBUG -> notFound triggered by parentCategory check");
      notFound();
    }

    const subcategories = await getSubcategories(parentCategory.id);
    // console.log("DEBUG subcategories:", subcategories);

    const currentCategory = subcategories.find(
      (subcat) => subcat.slug === subcategorySlug,
    );
    // console.log("DEBUG currentCategory:", currentCategory, "subcategorySlug:", subcategorySlug);
    if (!currentCategory) {
      // console.log("DEBUG -> notFound triggered by currentCategory check");
      notFound();
    }

    const product = await fetchProductBySlug(currentCategory.id, productSlug);
    // console.log("DEBUG product:", product, "productSlug:", productSlug, "currentCategory.id:", currentCategory.id);
    if (!product) {
      // console.log("DEBUG -> notFound triggered by product check");
      notFound();
    }

    const fullUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/collections/${categorySlug}/${subcategorySlug}/${productSlug}`;

    const schema = createProductSchema({
      url: fullUrl,
      name: product.name,
      description: product.description ?? "",
      images: product.image_url ?? ["/AuthClothPhoto.jpg"],
      price: Number(product.price),
      currency: "EUR",
      sku: String(product.slug ?? product.id),
      brand: "Methys",
      availability: product.product_variants.some((p) => p.quantity > 0),
      variants: product.product_variants.map((v) => ({
        size: v.size,
        quantity: v.quantity,
      })),
      category: currentCategory.name,
      id: product.id.toString(),
    });

    const breadcrumbItems = [
      { name: "Home", slug: "/" },
      { name: "collections", slug: "/collections" },
      { name: parentCategory.name, slug: `/collections/${categorySlug}` },
      {
        name: currentCategory.name,
        slug: `/collections/${categorySlug}/${subcategorySlug}`,
      },
      {
        name: product.name,
        slug: `/collections/${categorySlug}/${subcategorySlug}/${productSlug}`,
      },
    ];

    return (
      <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu />}>
        <section className="relative w-full pt-20 pb-32 font-roboto text-vintage-green">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          <div className=" mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              <div className="space-y-0">
                <div
                  className="relative bg-gray-50 overflow-hidden"
                  style={{ aspectRatio: "3/4" }}
                >
                  <Image
                    src={getValidImage(
                      product.image_url?.[0] ?? "/AuthClothPhoto.jpg",
                    )}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                    priority
                  />

                  {product.is_offer && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs uppercase px-3 py-1.5 tracking-wider">
                      New Offer
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:sticky lg:top-24 lg:h-fit space-y-8">
                <div>
                  {product.name && (
                    <h3 className="text-2xl md:text-3xl mb-2 font-light tracking-wide">
                      {product.name}
                    </h3>
                  )}

                  {product.description && (
                    <p className="text-sm text-gray-600 mb-4">
                      {product.description.split(" ").slice(0, 5).join(" ")}
                    </p>
                  )}

                  <div className="flex items-baseline gap-3">
                    {product.price && (
                      <span className="text-xl font-normal">
                        €{product.price}
                      </span>
                    )}
                    {product.is_offer && (
                      <span className="text-sm text-gray-500 line-through">
                        €
                        {(parseFloat(product.price.toString()) * 1.2).toFixed(
                          2,
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
                      <p>Expected delivery: 7 days after the order</p>
                    </div>
                  </details>

                  <details className="group border-t pt-4">
                    <summary className="flex justify-between items-center cursor-pointer list-none">
                      <span className="text-sm font-medium">
                        Extended returns until January 23rd
                      </span>
                      <span className="transition group-open:rotate-45">+</span>
                    </summary>
                    <div className="mt-3 text-sm text-vintage-brown leading-relaxed hover:underline">
                      <Link href={"/help"}>
                        Need help? Contact us or check our Help page
                      </Link>
                    </div>
                  </details>
                </div>

                <div className="border-t pt-6">
                  {product.size_description && (
                    <p className="text-sm text-gray-700 leading-relaxed mb-6">
                      {product.size_description}
                    </p>
                  )}
                  {product.description && (
                    <div className="space-y-2 text-sm ">
                      {product.description}
                    </div>
                  )}
                  {product.product_details && (
                    <div className="space-y-2 text-sm">
                      {product.product_details}
                    </div>
                  )}
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

          <Schema markup={schema} />
        </section>
        <div className="pl-1">
          <SeasonalCollectionSection
            title="Our Recommendations"
            fetcher={ProductBySpringSeason}
          />
        </div>
        <Footer />
      </HeaderProvider>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}
