import { notFound, unstable_rethrow } from "next/navigation";
import Image from "next/image";
import { getValidImage } from "@/_lib/helpers";
import { getAllCategoriesWithSubcategories } from "@/_lib/backend/CategoriesWithSubcategoriesAction/action";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import ProductActionsInline from "./ProductActionsInline";
import { fetchProductBySlug } from "@/_lib/backend/productBySlug/action";
import { translateProduct } from "@/_lib/backend/translations/action";
import { getProductPricing } from "@/_lib/utils/discountUtil/discountUtils";
import { FREE_SHIPPING_THRESHOLD } from "@/_lib/utils/shipping";
import { Breadcrumbs } from "@/components/breadcrumb/breadcrumbSchema";
import { createProductSchema } from "@/components/schemas/newCollectionSchema";
import Schema from "@/components/schemas/SchemaMarkUp";
import Footer from "@/components/footer/Footer";
import { ProductBySpringSeason } from "@/_lib/backend/ProductWithStructure/action";
import { createMetadata } from "@/components/SEO/metadata";
import { absoluteUrl } from "@/components/SEO/urls";
import SeasonalCollectionSection from "@/components/sections/SeasonalCollectionSection";
import Link from "@/components/LocaleLink/LocaleLink";
import DropDownMenu from "@/components/header/DropDownMenu";
import { getT } from "@/i18n/server";
import {
  formatPrice,
  translateCategory,
  translateCount,
  type Translator,
} from "@/i18n/translate";
import { defaultLocale, isLocale, type Locale } from "@/i18n.config";
import { fetchProductReviews } from "@/_lib/backend/reviews/queries";
import { summarizeReviews } from "@/_lib/utils/reviews";
import ProductReviews from "@/components/reviews/ProductReviews";
import Stars from "@/components/reviews/Stars";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    category: string;
    subcategory: string;
    slug: string;
    lang: string;
  }>;
}) {
  const { category, subcategory, slug, lang } = await params;

  const categorySlug = decodeURIComponent(category);
  const subcategorySlug = decodeURIComponent(subcategory);
  const productSlug = decodeURIComponent(slug);
  const locale = isLocale(lang) ? lang : defaultLocale;
  const t = await getT(locale);
  const notFoundMetadata = () =>
    createMetadata({
      locale,
      MetaTitle: t("product.notFoundTitle"),
      MetaDescription: t("product.notFoundDescription"),
      canonical: `/collections/${categorySlug}/${subcategorySlug}/${productSlug}`,
      robots: { index: false, follow: false },
    });

  try {
    const allCategories = await getAllCategoriesWithSubcategories();
    const parentCategory = allCategories.find(
      (cat) => cat.slug === categorySlug && cat.parent_id === null,
    );
    if (!parentCategory) {
      return notFoundMetadata();
    }

    const subcategories = allCategories.filter(
      (cat) => cat.parent_id === parentCategory.id,
    );
    const currentCategory = subcategories.find(
      (subcat) => subcat.slug === subcategorySlug,
    );

    if (!currentCategory) {
      return notFoundMetadata();
    }

    const product = await translateProduct(
      await fetchProductBySlug(currentCategory.id, productSlug),
      locale,
    );

    if (!product) {
      return notFoundMetadata();
    }

    const inStock = product.product_variants.some((v) => v.quantity > 0);

    return createMetadata({
      locale,
      MetaTitle: t("product.metaTitle", { name: product.name }),
      MetaDescription: product.description ?? t("product.defaultDescription"),
      canonical: `/collections/${categorySlug}/${subcategorySlug}/${productSlug}`,
      OpenGraphImageUrl: product.image_url?.[0],
      other: {
        "product:availability": inStock ? "in stock" : "out of stock",
        "product:price:amount":
          getProductPricing(product).finalPrice.toString(),
        "product:price:currency": "EUR",
      },
    });
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error generating product metadata:", error);
    return createMetadata({
      locale,
      MetaTitle: t("common.errorTitle"),
      MetaDescription: t("common.errorLoading"),
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
    lang: string;
  }>;
}) {
  const { category, subcategory, slug, lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const t = await getT(locale);

  const { product, reviews, reviewSummary, pricing, schema, breadcrumbItems } =
    await loadProductPage(category, subcategory, slug, locale, t);

  return (
    <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu />}>
      <section className="relative w-full pt-20 font-roboto text-vintage-green">
        <div className="mx-auto px-4 sm:px-6">
          <Breadcrumbs items={breadcrumbItems} locale={locale} />
        </div>

        <div className="mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* LEFT IMAGES */}
            <div
              className="
                          flex lg:grid lg:grid-cols-2
                          gap-2
                          overflow-x-auto lg:overflow-visible
                          snap-x snap-mandatory lg:snap-none
                          -mx-4 px-4 lg:mx-0 lg:px-0
                          scrollbar-hide
                        "
            >
              {product.image_url?.map((img, i) => (
                <div
                  key={i}
                  // A single photo fills the width; several peek so they can be swiped.
                  className={`relative bg-gray-50 overflow-hidden shrink-0 snap-center lg:snap-none lg:w-auto ${
                    (product.image_url?.length ?? 0) > 1
                      ? "w-[85vw] sm:w-[70vw]"
                      : "w-full"
                  }`}
                  style={{ aspectRatio: "3/4" }}
                >
                  <Image
                    src={getValidImage(img ?? "/AuthClothPhoto.jpg")}
                    alt={
                      i === 0
                        ? product.name
                        : t("sizeGuide.imageAlt", {
                            name: product.name,
                            index: i + 1,
                          })
                    }
                    fill
                    sizes="(max-width: 1024px) 85vw, 25vw"
                    className="object-cover object-center"
                    priority={i === 0}
                  />

                  {i === 0 && product.is_offer && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs uppercase px-3 py-1.5 tracking-wider">
                      {t("product.newOffer")}
                    </div>
                  )}

                  {i === 0 && (
                    <button
                      aria-label={t("product.addToWishlist")}
                      className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white/80 rounded-full hover:bg-white transition"
                    >
                      ♡
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/*RIGHT BAR */}
            <div className="lg:sticky lg:top-32 lg:h-fit space-y-8">
              <div>
                {product.name && (
                  <h1 className="text-2xl md:text-3xl mb-2 font-light tracking-wide">
                    {product.name}
                  </h1>
                )}

                {reviewSummary.count > 0 && (
                  <a
                    href="#reviews"
                    className="inline-flex items-center gap-2 text-xs mb-3 hover:underline underline-offset-4"
                  >
                    <Stars
                      rating={reviewSummary.average}
                      label={t("reviews.stars", {
                        rating: reviewSummary.average,
                      })}
                      className="w-3.5 h-3.5"
                    />
                    {translateCount(t, "reviews.count", reviewSummary.count)}
                  </a>
                )}

                {product.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {product.description.split(" ").slice(0, 5).join(" ")}
                  </p>
                )}

                <div className="flex items-baseline gap-3">
                  <span className="text-xl font-normal">
                    {formatPrice(pricing.finalPrice, locale)}
                  </span>
                  {pricing.isDiscounted && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(pricing.originalPrice, locale)}
                    </span>
                  )}
                </div>
              </div>

              <ProductActionsInline product={product} />

              <div className="border-t pt-6 space-y-4">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-sm font-medium">
                      {t("product.freeDelivery", {
                        amount: formatPrice(FREE_SHIPPING_THRESHOLD, locale),
                      })}
                    </span>
                    <span className="transition group-open:rotate-45">+</span>
                  </summary>
                  <div className="mt-3 text-sm text-gray-600 leading-relaxed">
                    <p>{t("product.expectedDelivery")}</p>
                  </div>
                </details>

                <details className="group border-t pt-4">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <span className="text-sm font-medium">
                      {t("product.extendedReturns")}
                    </span>
                    <span className="transition group-open:rotate-45">+</span>
                  </summary>
                  <div className="mt-3 text-sm text-vintage-brown leading-relaxed hover:underline">
                    <Link href={"/help"}>{t("product.needHelp")}</Link>
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
                    {t("product.sizeStockInfo")}
                  </h3>
                  <div className="space-y-2">
                    {product.product_variants.map((variant, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm py-2 border-b border-gray-100"
                      >
                        <span>
                          {t("product.sizeLabel", { size: variant.size })}
                        </span>
                        <span
                          className={
                            variant.quantity > 0
                              ? "text-vintage-brown"
                              : "text-red-600"
                          }
                        >
                          {variant.quantity > 0
                            ? t("product.inStock", {
                                count: variant.quantity,
                              })
                            : t("product.outOfStock")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500">
                {t("product.productId", { id: product.id })}
              </div>
            </div>
          </div>
        </div>

        <Schema markup={schema} />
      </section>

      <ProductReviews
        productId={product.id}
        reviews={reviews}
        locale={locale}
        t={t}
      />

      <div className="px-4 sm:px-6">
        <SeasonalCollectionSection
          title={t("product.recommendations")}
          fetcher={ProductBySpringSeason}
          locale={locale}
        />
      </div>
      <Footer />
    </HeaderProvider>
  );
}

// Data loading lives here, not around the JSX: a try/catch around rendering
// doesn't catch render errors (that's what error.tsx is for).
async function loadProductPage(
  category: string,
  subcategory: string,
  slug: string,
  locale: Locale,
  t: Translator,
) {
  const categorySlug = decodeURIComponent(category);
  const subcategorySlug = decodeURIComponent(subcategory);
  const productSlug = decodeURIComponent(slug);

  try {
    const allCategories = await getAllCategoriesWithSubcategories();
    const parentCategory = allCategories.find(
      (cat) => cat.slug === categorySlug && cat.parent_id === null,
    );
    if (!parentCategory) {
      notFound();
    }

    const subcategories = allCategories.filter(
      (cat) => cat.parent_id === parentCategory.id,
    );

    const currentCategory = subcategories.find(
      (subcat) => subcat.slug === subcategorySlug,
    );
    if (!currentCategory) {
      notFound();
    }

    const product = await translateProduct(
      await fetchProductBySlug(currentCategory.id, productSlug),
      locale,
    );
    if (!product) {
      notFound();
    }

    const reviews = await fetchProductReviews(product.id);
    const reviewSummary = summarizeReviews(reviews);

    const fullUrl = absoluteUrl(
      `/collections/${categorySlug}/${subcategorySlug}/${productSlug}`,
      locale,
    );
    const pricing = getProductPricing(product);
    const parentName = translateCategory(
      t,
      parentCategory.slug,
      parentCategory.name,
    );
    const categoryName = translateCategory(
      t,
      currentCategory.slug,
      currentCategory.name,
    );

    const schema = createProductSchema({
      url: fullUrl,
      name: product.name,
      description: product.description ?? "",
      images: product.image_url ?? ["/AuthClothPhoto.jpg"],
      price: pricing.finalPrice,
      currency: "EUR",
      sku: String(product.slug ?? product.id),
      brand: "Methys",
      availability: product.product_variants.some((p) => p.quantity > 0),
      variants: product.product_variants.map((v) => ({
        size: v.size,
        quantity: v.quantity,
      })),
      category: categoryName,
      id: product.id.toString(),
      sizeLabel: t("sizeGuide.size"),
      rating: reviewSummary,
    });

    const breadcrumbItems = [
      { name: t("breadcrumbs.home"), slug: "/" },
      { name: t("breadcrumbs.collections"), slug: "/collections" },
      { name: parentName, slug: `/collections/${categorySlug}` },
      {
        name: categoryName,
        slug: `/collections/${categorySlug}/${subcategorySlug}`,
      },
      {
        name: product.name,
        slug: `/collections/${categorySlug}/${subcategorySlug}/${productSlug}`,
      },
    ];

    return {
      product,
      reviews,
      reviewSummary,
      pricing,
      schema,
      breadcrumbItems,
    };
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error loading product:", error);
    notFound();
  }
}
