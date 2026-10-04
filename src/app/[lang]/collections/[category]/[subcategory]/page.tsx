import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "@/components/LocaleLink/LocaleLink";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import Footer from "@/components/footer/Footer";
import { getProductsByCategoryId } from "@/_lib/backend/ProductWithStructure/action";
import { Breadcrumbs } from "@/components/breadcrumb/breadcrumbSchema";
import { FilteredProducts } from "@/_lib/backend/filtering/action";
import ProductFilterClient from "@/components/filters/Filters";
import { createMetadata } from "@/components/SEO/metadata";
import { Metadata } from "next";
import { createCollectionPageSchema } from "@/_lib/schemasGenerators/collectionPageSchema";
import Schema from "@/components/schemas/SchemaMarkUp";
import DropDownMenu from "@/components/header/DropDownMenu";
import { getAllCategoriesWithSubcategories } from "@/_lib/backend/CategoriesWithSubcategoriesAction/action";
import { getT } from "@/i18n/server";
import { translateProducts } from "@/_lib/backend/translations/action";
import { getProductPricing } from "@/_lib/utils/discountUtil/discountUtils";
import { formatPrice, translateCategory, translateCount } from "@/i18n/translate";
import { defaultLocale, isLocale } from "@/i18n.config";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    category: string;
    subcategory: string;
    lang: string;
  }>;
}): Promise<Metadata> {
  const { category, subcategory, lang } = await params;
  const categorySlug = decodeURIComponent(category);
  const subcategorySlug = decodeURIComponent(subcategory);
  const t = await getT(lang);

  try {
    const allCategories = await getAllCategoriesWithSubcategories();
    const parentCategory = allCategories.find(
      (cat) => cat.slug === categorySlug && cat.parent_id === null,
    );

    if (!parentCategory) {
      return createMetadata({
        locale: lang,
        MetaTitle: t("collections.categoryNotFoundTitle"),
        MetaDescription: t("collections.categoryNotFoundDescription"),
        canonical: `/collections/${categorySlug}/${subcategorySlug}`,
        robots: { index: false, follow: false },
      });
    }

    const subcategories = allCategories.filter(
      (cat) => cat.parent_id === parentCategory.id,
    );
    const currentCategory = subcategories.find(
      (subcat) => subcat.slug?.toLowerCase() === subcategorySlug.toLowerCase(),
    );

    if (!currentCategory) {
      return createMetadata({
        locale: lang,
        MetaTitle: t("collections.categoryNotFoundTitle"),
        MetaDescription: t("collections.categoryNotFoundDescription"),
        canonical: `/collections/${categorySlug}/${subcategorySlug}`,
        robots: { index: false, follow: false },
      });
    }

    const name = translateCategory(t, currentCategory.slug, currentCategory.name);
    const parentName = translateCategory(t, parentCategory.slug, parentCategory.name);
    return createMetadata({
      locale: lang,
      MetaTitle: t("collections.subcategoryMetaTitle", { name, parent: parentName }),
      MetaDescription: t("collections.subcategoryMetaDescription", { name }),
      canonical: `/collections/${categorySlug}/${subcategorySlug}`,
      OpenGraphImageUrl:
        "/storage/v1/object/public/OpenGraphImages/about-us.jpg",
    });
  } catch {
    return createMetadata({
      locale: lang,
      MetaTitle: t("common.errorTitle"),
      MetaDescription: t("common.errorLoading"),
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
    lang: string;
  }>;
  searchParams: Promise<{ min?: string; max?: string; size?: string }>;
}) {
  const { category, subcategory, lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const t = await getT(locale);

  const categorySlug = decodeURIComponent(category);
  const subcategorySlug = decodeURIComponent(subcategory);
  const filters = await searchParams;

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
    (subcat) => subcat.slug?.toLowerCase() === subcategorySlug.toLowerCase(),
  );

  if (!currentCategory) {
    notFound();
  }

  const [products, filtered] = await Promise.all([
    getProductsByCategoryId(currentCategory.id).then((p) => p ?? []),
    FilteredProducts({
      categoryId: currentCategory.id,
      min: filters?.min,
      max: filters?.max,
      size: filters?.size,
    }),
  ]);

  const filteredProducts = await translateProducts(filtered, locale);

  const categoryName = translateCategory(t, currentCategory.slug, currentCategory.name);
  const parentName = translateCategory(t, parentCategory.slug, parentCategory.name);
  const schema = createCollectionPageSchema({
    locale,
    path: `/collections/${categorySlug}/${subcategorySlug}`,
    name: categoryName,
    description: t("collections.subcategoryMetaDescription", { name: categoryName }),
    items: products.map((p) => ({
      name: p.name,
      path: `/collections/${categorySlug}/${subcategorySlug}/${p.slug}`,
      imageUrl: p.image_url?.[0] ?? undefined,
    })),
  });

  const breadcrumbItems = [
    { name: t("breadcrumbs.home"), slug: "/" },
    { name: t("breadcrumbs.collections"), slug: "/collections" },
    {
      name: parentName,
      slug: `/collections/${parentCategory.slug}`,
    },
    {
      name: categoryName,
      slug: `/collections/${parentCategory.slug}/${currentCategory.slug}`,
    },
  ];

  return (
    <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu />}>
      <Schema markup={schema} />
      <section className="relative w-full min-h-[80vh] pt-[70px]  pb-12 font-serif text-vintage-green">
        <div className="pl-4">
          <Breadcrumbs items={breadcrumbItems} locale={locale} />
        </div>

        <header className="flex flex-row items-center tracking-wide pl-4">
          <h1 className="text-lg capitalize ">{categoryName}</h1>
        </header>

        <div className="flex flex-row gap-5 text-black text-xs uppercase p-4 overflow-x-auto scrollbar-hide tracking-wide whitespace-nowrap ">
          {subcategories
            .filter((item) => item.slug != subcategorySlug)
            .map((item) => (
              <Link
                href={`/collections/${parentCategory.slug}/${item.slug}`}
                key={item.id}
                className="inline-block"
              >
                {translateCategory(t, item.slug, item.name)}
              </Link>
            ))}
        </div>

        <hr className="mt-2 mb-4 bg-vintage-green" />

        <ProductFilterClient
          initialProducts={filteredProducts || []}
          parentSlug={categorySlug}
          categorySlug={subcategorySlug}
        >
          {(filteredProducts ?? []).length === 0 ? (
            <div>{t("common.noProductsFound")}</div>
          ) : (
            <>
              <p className="text-sm text-vintage-brown text-right mb-4 mr-4 sm:text-lg">
                {translateCount(t, "collections.productsAvailable", (filteredProducts ?? []).length)}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {(filteredProducts ?? []).map((product) => {
                  if (!product) return null;

                  return (
                    <Link
                      key={product.id}
                      href={`/collections/${encodeURIComponent(categorySlug)}/${encodeURIComponent(subcategorySlug)}/${encodeURIComponent(product.slug ?? "")}`}
                      className="group block bg-white border border-vintage-green/20 hover:border-vintage-green transition-all duration-300 overflow-hidden"
                    >
                      <div className="relative aspect-[3/3] overflow-hidden bg-gray-50">
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
                            {t("product.offer")}
                          </div>
                        )}
                        {product.price && (
                          <div className="absolute top-4 right-4 bg-white text-vintage-green px-3 py-1.5 rounded-lg text-sm font-medium shadow">
                            {formatPrice(getProductPricing(product).finalPrice, locale)}
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="text-base font-medium line-clamp-2 mb-1 text-vintage-green">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                            {product.description}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 underline-offset-4 transition-colors group-hover:text-vintage-green group-hover:underline">
                          {t("collections.viewDetails")}
                          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
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
