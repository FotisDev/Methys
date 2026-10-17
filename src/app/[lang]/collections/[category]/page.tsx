import Image from "next/image";
import Link from "@/components/LocaleLink/LocaleLink";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { notFound } from "next/navigation";
import { CategoryBackendType } from "@/_lib/types";
import { fetchProductThumbnailsByCategoryIds } from "@/_lib/backend/fetchCategoryThumbnail/action";
import { Breadcrumbs } from "@/components/breadcrumb/breadcrumbSchema";
import Footer from "@/components/footer/Footer";
import { createMetadata } from "@/components/SEO/metadata";
import { createCollectionPageSchema } from "@/_lib/schemasGenerators/collectionPageSchema";
import Schema from "@/components/schemas/SchemaMarkUp";
import DropDownMenu from "@/components/header/DropDownMenu";
import { getCategoryBySlug } from "@/_lib/backend/CategoryById/action";
import { getAllCategoriesWithSubcategories } from "@/_lib/backend/CategoriesWithSubcategoriesAction/action";
import RightArrowIcon from "@/svgs/RightArrowIcon";
import { getT } from "@/i18n/server";
import { translateCategory } from "@/i18n/translate";
import { defaultLocale, isLocale } from "@/i18n.config";
import { cn } from "@/_lib/utils/cn";

type SubcategoryWithImage = Omit<CategoryBackendType, "image_url"> & {
  image_url: string;
};

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; lang: string }>;
}) {
  const { category, lang } = await params;
  const categorySlug = decodeURIComponent(category);
  const t = await getT(lang);

  try {
    const foundCategory = await getCategoryBySlug(categorySlug);

    if (!foundCategory || foundCategory.parent_id !== null) {
      return createMetadata({
        locale: lang,
        MetaTitle: t("collections.categoryNotFoundTitle"),
        MetaDescription: t("collections.categoryNotFoundDescription"),
        canonical: `/collections/${categorySlug}`,
        robots: { index: false, follow: false },
      });
    }

    const name = translateCategory(t, foundCategory.slug, foundCategory.name);
    return createMetadata({
      locale: lang,
      MetaTitle: t("collections.categoryMetaTitle", { name }),
      MetaDescription: t("collections.categoryMetaDescription", { name }),
      canonical: `/collections/${categorySlug}`,
      OpenGraphImageUrl:
        "/storage/v1/object/public/OpenGraphImages/about-us.jpg",
    });
  } catch {
    return createMetadata({
      locale: lang,
      MetaTitle: t("collections.categoryNotFoundTitle"),
      MetaDescription: t("common.errorLoading"),
      canonical: `/collections/${categorySlug}`,
      robots: { index: false, follow: false },
    });
  }
}

const PRIORITY_IMAGE_COUNT = 4;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string; lang: string }>;
}) {
  const { category, lang } = await params;
  const categorySlug = decodeURIComponent(category);
  const locale = isLocale(lang) ? lang : defaultLocale;
  const t = await getT(locale);

  let categoryData: CategoryBackendType | null = null;
  let subcategories: SubcategoryWithImage[] = [];
  let error: string | null = null;

  try {
    const allCategories = await getAllCategoriesWithSubcategories();
    const foundCategory = allCategories.find(
      (cat) => cat.slug === categorySlug && cat.parent_id === null,
    );

    if (!foundCategory) {
      throw new Error(`Main category "${categorySlug}" not found`);
    }

    categoryData = foundCategory;

    const subcategoriesData = allCategories.filter(
      (cat) => cat.parent_id === foundCategory.id,
    );

    const thumbnailMap = await fetchProductThumbnailsByCategoryIds(
      subcategoriesData.map((s) => s.id),
    );

    subcategories = subcategoriesData.map((subcat) => {
      return {
        ...subcat,
        image_url: subcat?.image_url ?? thumbnailMap[subcat.id],
      } as SubcategoryWithImage;
    });
  } catch (err) {
    console.error("Error loading category page:", err);
    error = err instanceof Error ? err.message : "Unknown error";
  }

  if (error || !categoryData) {
    notFound();
  }
  const categoryName = translateCategory(
    t,
    categoryData.slug,
    categoryData.name,
  );
  const categoryIntro = t("collections.categoryIntro", { name: categoryName });
  const schema = createCollectionPageSchema({
    locale,
    path: `/collections/${categorySlug}`,
    name: categoryName,
    description: categoryIntro,
    items: subcategories.map((sub) => ({
      name: translateCategory(t, sub.slug, sub.name),
      path: `/collections/${categorySlug}/${sub.slug}`,
      imageUrl: sub.image_url ?? undefined,
    })),
  });

  const breadcrumbItems = [
    { name: t("breadcrumbs.home"), slug: "/" },
    { name: t("breadcrumbs.collections"), slug: "/collections" },
    { name: categoryName, slug: `/collections/${categorySlug}` },
  ];

  return (
    <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu />}>
      <Schema markup={schema} />
      <main className={cn("relative w-full min-h-screen pt-24 font-roboto")}>
        <div className={cn("w-full px-4 sm:px-6")}>
          <Breadcrumbs items={breadcrumbItems} locale={locale} />
          <header className={cn("mb-5")}>
            <h1
              className={cn(
                "text-3xl md:text-4xl font-light mb-4 text-vintage-green",
              )}
            >
              {categoryName}
            </h1>
            <p className={cn("text-lg text-vintage-brown max-w-2xl")}>
              {categoryIntro}
            </p>
          </header>

          {subcategories.length === 0 ? (
            <section
              className={cn("text-center py-20")}
              aria-labelledby="no-subcategories"
            >
              <div className={cn("text-8xl mb-6")} aria-hidden="true">
                📦
              </div>
              <h2
                id="no-subcategories"
                className={cn("text-3xl font-semibold mb-4 text-vintage-green")}
              >
                {t("collections.noSubcategoriesTitle")}
              </h2>
              <p className={cn("text-lg text-gray-600 max-w-md mx-auto")}>
                {t("collections.noSubcategoriesText")}
              </p>
            </section>
          ) : (
            <section aria-labelledby="subcategories-heading">
              <h2 id="subcategories-heading" className={cn("sr-only")}>
                {t("collections.subcategoriesHeading", { name: categoryName })}
              </h2>

              <div
                className={cn(
                  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8",
                )}
              >
                {subcategories.map((subcategory, index) => {
                  const href = `/collections/${encodeURIComponent(
                    categorySlug,
                  )}/${encodeURIComponent(subcategory.slug ?? "")}`;

                  return (
                    <article
                      key={subcategory.id}
                      className={cn("group relative overflow-hidden w-full")}
                    >
                      <Link
                        href={href}
                        className={cn(
                          "block relative aspect-[3/4] bg-gray-100 h-full w-full",
                        )}
                      >
                        <Image
                          src={subcategory.image_url}
                          alt={t("collections.categoryAlt", {
                            name: translateCategory(
                              t,
                              subcategory.slug,
                              subcategory.name,
                            ),
                          })}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className={cn(
                            "object-cover transition-transform duration-500 group-hover:scale-110",
                          )}
                          priority={index < PRIORITY_IMAGE_COUNT}
                        />

                        <div
                          className={cn(
                            "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent",
                          )}
                        />

                        <div
                          className={cn(
                            "absolute bottom-0 left-0 right-0 p-6 text-white",
                          )}
                        >
                          <h2
                            className={cn(
                              "text-2xl font-semibold tracking-wide capitalize",
                            )}
                          >
                            {translateCategory(
                              t,
                              subcategory.slug,
                              subcategory.name,
                            )}
                          </h2>
                          <p
                            className={cn(
                              "text-sm opacity-90 font-medium flex flex-row hover:underline",
                            )}
                          >
                            {t("collections.shop")}{" "}
                            <span>
                              <RightArrowIcon
                                className={cn("w-5 h-5 text-white-fb")}
                              />
                            </span>
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
      <Footer />
    </HeaderProvider>
  );
}
