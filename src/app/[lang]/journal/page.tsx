import Image from "next/image";
import type { Metadata } from "next";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import DropDownMenu from "@/components/header/DropDownMenu";
import Footer from "@/components/footer/Footer";
import Link from "@/components/LocaleLink/LocaleLink";
import { createMetadata } from "@/components/SEO/metadata";
import { getJournalPosts } from "@/_lib/backend/journal/queries";
import { getValidImage } from "@/_lib/helpers";
import { readingMinutes } from "@/_lib/utils/content";
import { getT } from "@/i18n/server";
import { defaultLocale, isLocale } from "@/i18n.config";
import { cn } from "@/_lib/utils/cn";

export const revalidate = 600;

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getT(lang);
  return createMetadata({
    locale: lang,
    MetaTitle: t("journal.metaTitle"),
    MetaDescription: t("journal.metaDescription"),
    canonical: "/journal",
  });
}

export default async function JournalPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const [t, posts] = await Promise.all([getT(locale), getJournalPosts(locale)]);
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: "long" });
  const [featured, ...rest] = posts;

  return (
    <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu />}>
      <section
        className={cn(
          "px-4 sm:px-6 pt-28 pb-20 font-roboto text-vintage-green max-w-6xl mx-auto",
        )}
      >
        <header className={cn("mb-12")}>
          <h1 className={cn("text-3xl md:text-4xl font-light tracking-wide")}>
            {t("journal.title")}
          </h1>
          <p className={cn("text-sm text-gray-600 mt-2 max-w-xl")}>
            {t("journal.intro")}
          </p>
        </header>

        {!featured && (
          <p className={cn("text-sm text-gray-500")}>{t("journal.empty")}</p>
        )}

        {featured && (
          <Link
            href={`/journal/${featured.slug}`}
            className={cn("group grid md:grid-cols-2 gap-6 md:gap-10 mb-16")}
          >
            <div
              className={cn("relative bg-gray-50 overflow-hidden")}
              style={{ aspectRatio: "4/5" }}
            >
              <Image
                src={getValidImage(featured.cover_image)}
                alt={featured.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className={cn(
                  "object-cover transition-transform duration-700 group-hover:scale-[1.03]",
                )}
              />
            </div>
            <div className={cn("flex flex-col justify-center")}>
              <p
                className={cn(
                  "text-xs uppercase tracking-widest text-gray-500",
                )}
              >
                {dateFormat.format(new Date(featured.published_at))} ·{" "}
                {t("journal.readingTime", {
                  minutes: readingMinutes(featured.body),
                })}
              </p>
              <h2
                className={cn(
                  "text-2xl md:text-3xl font-light mt-3 group-hover:underline underline-offset-4",
                )}
              >
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className={cn("text-sm text-gray-600 mt-4 leading-relaxed")}>
                  {featured.excerpt}
                </p>
              )}
              <span className={cn("text-sm mt-6 underline underline-offset-4")}>
                {t("journal.readMore")} →
              </span>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <ul
            className={cn(
              "grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12",
            )}
          >
            {rest.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/journal/${post.slug}`}
                  className={cn("group block")}
                >
                  <div
                    className={cn("relative bg-gray-50 overflow-hidden mb-4")}
                    style={{ aspectRatio: "4/5" }}
                  >
                    <Image
                      src={getValidImage(post.cover_image)}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={cn(
                        "object-cover transition-transform duration-700 group-hover:scale-[1.03]",
                      )}
                    />
                  </div>
                  <p
                    className={cn(
                      "text-xs uppercase tracking-widest text-gray-500",
                    )}
                  >
                    {dateFormat.format(new Date(post.published_at))}
                  </p>
                  <h2
                    className={cn(
                      "text-lg font-light mt-2 group-hover:underline underline-offset-4",
                    )}
                  >
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p
                      className={cn("text-sm text-gray-600 mt-2 line-clamp-3")}
                    >
                      {post.excerpt}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <Footer />
    </HeaderProvider>
  );
}
