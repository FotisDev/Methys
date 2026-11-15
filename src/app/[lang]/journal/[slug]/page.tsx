import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import DropDownMenu from "@/components/header/DropDownMenu";
import Footer from "@/components/footer/Footer";
import { Breadcrumbs } from "@/components/breadcrumb/breadcrumbSchema";
import Schema from "@/components/schemas/SchemaMarkUp";
import ProductShelf from "@/components/products/ProductShelf";
import { createMetadata } from "@/components/SEO/metadata";
import { absoluteUrl } from "@/components/SEO/urls";
import { getJournalPost } from "@/_lib/backend/journal/queries";
import { getProductsByIds } from "@/_lib/backend/ProductWithStructure/action";
import { translateProducts } from "@/_lib/backend/translations/action";
import { getValidImage } from "@/_lib/helpers";
import { parseBody, readingMinutes } from "@/_lib/utils/content";
import { getT } from "@/i18n/server";
import { defaultLocale, isLocale } from "@/i18n.config";
import { cn } from "@/_lib/utils/cn";

export const revalidate = 600;

type PageProps = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = await getJournalPost(decodeURIComponent(slug), lang);
  const t = await getT(lang);
  if (!post) {
    return createMetadata({
      locale: lang,
      MetaTitle: t("journal.notFound"),
      canonical: `/journal/${slug}`,
      robots: { index: false, follow: false },
    });
  }
  return createMetadata({
    locale: lang,
    MetaTitle: `${post.title} | Methys Journal`,
    MetaDescription: post.excerpt ?? undefined,
    canonical: `/journal/${post.slug}`,
    OpenGraphImageUrl: post.cover_image ?? undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
  });
}

export default async function JournalPostPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const post = await getJournalPost(decodeURIComponent(slug), locale);
  if (!post) notFound();

  const [t, rawProducts] = await Promise.all([
    getT(locale),
    getProductsByIds(post.product_ids ?? []),
  ]);
  const products = (await translateProducts(rawProducts, locale)) ?? [];
  const blocks = parseBody(post.body);
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: "long" });
  const url = absoluteUrl(`/journal/${post.slug}`, locale);

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_image ? [getValidImage(post.cover_image)] : undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      "@type": post.author ? "Person" : "Organization",
      name: post.author ?? "Methys",
    },
    publisher: { "@type": "Organization", name: "Methys" },
    mainEntityOfPage: url,
    inLanguage: locale,
  };

  return (
    <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu />}>
      <article
        className={cn(
          "px-4 sm:px-6 pt-24 pb-20 font-roboto text-vintage-green max-w-6xl mx-auto",
        )}
      >
        <Breadcrumbs
          items={[
            { name: t("breadcrumbs.home"), slug: "/" },
            { name: t("journal.title"), slug: "/journal" },
            { name: post.title, slug: `/journal/${post.slug}` },
          ]}
          locale={locale}
        />

        <header className={cn("max-w-2xl mx-auto text-center mt-8 mb-10")}>
          <p className={cn("text-xs uppercase tracking-widest text-gray-500")}>
            {dateFormat.format(new Date(post.published_at))} ·{" "}
            {t("journal.readingTime", { minutes: readingMinutes(post.body) })}
          </p>
          <h1
            className={cn(
              "text-3xl md:text-5xl font-light tracking-wide mt-4 leading-tight",
            )}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p className={cn("text-base text-gray-600 mt-5 leading-relaxed")}>
              {post.excerpt}
            </p>
          )}
          {post.author && (
            <p className={cn("text-xs text-gray-500 mt-4")}>
              {t("journal.by", { author: post.author })}
            </p>
          )}
        </header>

        {post.cover_image && (
          <div
            className={cn("relative bg-gray-50 overflow-hidden mb-12")}
            style={{ aspectRatio: "16/9" }}
          >
            <Image
              src={getValidImage(post.cover_image)}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1152px) 100vw, 1152px"
              className={cn("object-cover")}
            />
          </div>
        )}

        <div
          className={cn(
            "max-w-2xl mx-auto space-y-5 text-[15px] leading-relaxed text-gray-800",
          )}
        >
          {blocks.map((block, i) =>
            block.type === "heading" ? (
              <h2
                key={i}
                className={cn("text-xl font-normal text-vintage-green pt-4")}
              >
                {block.text}
              </h2>
            ) : (
              <p key={i}>{block.text}</p>
            ),
          )}
        </div>

        <ProductShelf title={t("journal.shopTheLook")} products={products} />
      </article>
      <Schema markup={schema} />
      <Footer />
    </HeaderProvider>
  );
}
