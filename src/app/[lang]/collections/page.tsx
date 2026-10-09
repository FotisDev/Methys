import Image from "next/image";
import Link from "@/components/LocaleLink/LocaleLink";
import { getAllCategoriesWithSubcategories } from "@/_lib/backend/CategoriesWithSubcategoriesAction/action";
import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { Breadcrumbs } from "@/components/breadcrumb/breadcrumbSchema";
import { createMetadata } from "@/components/SEO/metadata";
import type { Metadata } from "next";
import { createCollectionPageSchema } from "@/_lib/schemasGenerators/collectionPageSchema";
import Schema from "@/components/schemas/SchemaMarkUp";
import DropDownMenu from "@/components/header/DropDownMenu";
import RightArrowIcon from "@/svgs/RightArrowIcon";
import { getT } from "@/i18n/server";
import { translateCategory } from "@/i18n/translate";
import { defaultLocale, isLocale } from "@/i18n.config";

type PageProps = { params: Promise<{ lang: string }> };

export const revalidate = 600;

const MAIN_CATEGORY_IDS = [1, 2, 30];
const MAX_SUBCATEGORY_LINKS = 4;

const categoryPath = (cat: { name: string; slug?: string | null }) =>
  `/collections/${cat.slug ?? cat.name.replace(/\s+/g, "-").toLowerCase()}`;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getT(lang);
  return createMetadata({
    locale: lang,
    MetaTitle: t("collections.metaTitle"),
    MetaDescription: t("collections.metaDescription"),
    canonical: "/collections",
    OpenGraphImageUrl: "/storage/v1/object/public/OpenGraphImages/about-us.jpg",
  });
}

export default async function ProductList({ params }: PageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const t = await getT(locale);

  const allCategories = await getAllCategoriesWithSubcategories();

  const parentCategories = allCategories
    .filter(
      (c) => MAIN_CATEGORY_IDS.includes(c.id) && c.parent_id == null && c.name,
    )
    .sort((a, b) => a.id - b.id)
    .map((cat) => ({
      ...cat,
      image_url: cat.image_url || "/accesories.jpg",
      subcategories: allCategories.filter((sub) => sub.parent_id === cat.id),
    }));

  if (parentCategories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-vintage-green fond-sans text-xl">
        <p>{t("nav.noCategories")}</p>
        <Link
          href="/"
          className="mt-4 px-4 py-2 text-sm font-medium text-vintage-green rounded-lg transition-colors"
        >
          {t("common.backToHomepage")}
        </Link>
      </div>
    );
  }

  const schema = createCollectionPageSchema({
    locale,
    path: "/collections",
    name: t("collections.title"),
    description: t("collections.subtitle"),
    items: parentCategories.map((cat) => ({
      name: translateCategory(t, cat.slug, cat.name),
      path: categoryPath(cat),
      imageUrl: cat.image_url,
    })),
  });

  const breadcrumbItems = [
    { name: t("breadcrumbs.home"), slug: "/" },
    { name: t("breadcrumbs.collections"), slug: "/collections" },
  ];

  return (
    <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu />}>
      <Schema markup={schema} />
      <main className="w-full pt-24 px-4 sm:px-6 font-roboto text-vintage-green">
        <Breadcrumbs items={breadcrumbItems} locale={locale} />

        <header className="mt-4 mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <h1 className="text-2xl md:text-3xl font-light">
            {t("collections.title")}
          </h1>
          <p className="text-sm md:text-base text-gray-500 max-w-md md:text-right">
            {t("collections.subtitle")}
          </p>
        </header>

        <section
          aria-label={t("collections.title")}
          className="grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-10 pb-16 md:pb-24"
        >
          {parentCategories.map((category) => {
            const href = categoryPath(category);
            const name = translateCategory(t, category.slug, category.name);
            const subcategories = category.subcategories.slice(
              0,
              MAX_SUBCATEGORY_LINKS,
            );

            return (
              <article key={category.id}>
                <Link href={href} className="group block">
                  <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-white-f6">
                    <Image
                      src={category.image_url}
                      alt={t("collections.categoryAlt", { name })}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                      priority
                    />
                  </div>

                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h2 className="text-lg font-light capitalize">{name}</h2>
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 group-hover:text-vintage-green group-hover:underline underline-offset-4">
                      {t("home.shopNow")}
                      <RightArrowIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>

                {subcategories.length > 0 && (
                  <ul className="mt-1 flex flex-wrap text-sm text-gray-500">
                    {subcategories.map((sub) => (
                      <li
                        key={sub.id}
                        className="not-first:before:content-['·'] not-first:before:px-2"
                      >
                        <Link
                          href={`${href}/${sub.slug}`}
                          className="capitalize hover:text-vintage-green hover:underline underline-offset-4"
                        >
                          {translateCategory(t, sub.slug, sub.name)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </section>
      </main>
      <Footer />
    </HeaderProvider>
  );
}
