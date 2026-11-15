import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import DropDownMenu from "@/components/header/DropDownMenu";
import Footer from "@/components/footer/Footer";
import { Breadcrumbs } from "@/components/breadcrumb/breadcrumbSchema";
import ProductShelf from "@/components/products/ProductShelf";
import Countdown from "@/components/drops/Countdown";
import DropSignupForm from "@/components/drops/DropSignupForm";
import Schema from "@/components/schemas/SchemaMarkUp";
import { createMetadata } from "@/components/SEO/metadata";
import { absoluteUrl } from "@/components/SEO/urls";
import { getDrop } from "@/_lib/backend/drops/queries";
import { getProductsByIds } from "@/_lib/backend/ProductWithStructure/action";
import { translateProducts } from "@/_lib/backend/translations/action";
import { getValidImage } from "@/_lib/helpers";
import { dropPhase, parseBody } from "@/_lib/utils/content";
import { safeHttpUrl } from "@/_lib/utils/orders";
import { getT } from "@/i18n/server";
import { defaultLocale, isLocale } from "@/i18n.config";
import { cn } from "@/_lib/utils/cn";

export const revalidate = 60;

type PageProps = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const drop = await getDrop(decodeURIComponent(slug), lang);
  const t = await getT(lang);
  if (!drop) {
    return createMetadata({
      locale: lang,
      MetaTitle: t("drops.notFound"),
      canonical: `/drops/${slug}`,
      robots: { index: false, follow: false },
    });
  }
  return createMetadata({
    locale: lang,
    MetaTitle: `${drop.title} | Methys Drops`,
    MetaDescription: drop.tagline ?? drop.description ?? undefined,
    canonical: `/drops/${drop.slug}`,
    OpenGraphImageUrl: drop.hero_image ?? undefined,
  });
}

export default async function DropPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const drop = await getDrop(decodeURIComponent(slug), locale);
  if (!drop) notFound();

  const t = await getT(locale);
  const phase = dropPhase(drop);
  // Products stay secret until launch.
  const products =
    phase === "upcoming"
      ? []
      : ((await translateProducts(
          await getProductsByIds(drop.product_ids),
          locale,
        )) ?? []);
  const launchFormat = new Intl.DateTimeFormat(locale, {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Athens",
    timeZoneName: "short",
  });
  const collaboratorUrl = safeHttpUrl(drop.collaborator_url);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: drop.title,
    description: drop.tagline ?? drop.description ?? undefined,
    startDate: drop.starts_at,
    ...(drop.ends_at && { endDate: drop.ends_at }),
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "VirtualLocation",
      url: absoluteUrl(`/drops/${drop.slug}`, locale),
    },
    image: drop.hero_image ? [getValidImage(drop.hero_image)] : undefined,
    organizer: { "@type": "Organization", name: "Methys" },
  };

  return (
    <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu />}>
      <div className={cn("pt-20 font-roboto text-vintage-green")}>
        <section className={cn("relative min-h-[80vh] flex items-end")}>
          <Image
            src={getValidImage(drop.hero_image)}
            alt={drop.title}
            fill
            priority
            sizes="100vw"
            className={cn("object-cover", phase === "ended" && "grayscale")}
          />
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent",
            )}
          />
          <div
            className={cn(
              "relative w-full max-w-6xl mx-auto px-4 sm:px-6 pb-12 text-white space-y-5",
            )}
          >
            <p className={cn("text-xs uppercase tracking-[0.3em]")}>
              {t(`drops.phase.${phase}`)}
              {drop.collaborator_name &&
                ` · ${t("drops.withCollaborator", { name: drop.collaborator_name })}`}
            </p>
            <h1
              className={cn(
                "text-4xl sm:text-6xl font-light tracking-wide leading-tight",
              )}
            >
              {drop.title}
            </h1>
            {drop.tagline && (
              <p className={cn("text-base sm:text-lg max-w-xl opacity-90")}>
                {drop.tagline}
              </p>
            )}

            {phase === "upcoming" && (
              <div className={cn("space-y-5 pt-2")}>
                <p className={cn("text-sm opacity-90")}>
                  {t("drops.launchesAt", {
                    date: launchFormat.format(new Date(drop.starts_at)),
                  })}
                </p>
                <Countdown target={drop.starts_at} />
                <DropSignupForm dropId={drop.id} className="text-white" />
              </div>
            )}
          </div>
        </section>

        <div className={cn("max-w-6xl mx-auto px-4 sm:px-6 py-10")}>
          <Breadcrumbs
            items={[
              { name: t("breadcrumbs.home"), slug: "/" },
              { name: t("drops.title"), slug: "/drops" },
              { name: drop.title, slug: `/drops/${drop.slug}` },
            ]}
            locale={locale}
          />

          {drop.description && (
            <div
              className={cn(
                "max-w-2xl mt-8 space-y-4 text-[15px] leading-relaxed text-gray-800",
              )}
            >
              {parseBody(drop.description).map((block, i) =>
                block.type === "heading" ? (
                  <h2 key={i} className={cn("text-xl text-vintage-green")}>
                    {block.text}
                  </h2>
                ) : (
                  <p key={i}>{block.text}</p>
                ),
              )}
            </div>
          )}

          {phase === "ended" && (
            <p className={cn("mt-10 text-sm text-gray-600")}>
              {t("drops.endedNote")}
            </p>
          )}

          <ProductShelf title={t("drops.thePieces")} products={products} />

          {drop.collaborator_name && (
            <section
              className={cn(
                "mt-20 grid md:grid-cols-[240px_1fr] gap-8 items-start border-t pt-12",
              )}
            >
              {drop.collaborator_image && (
                <div
                  className={cn("relative bg-gray-100 overflow-hidden")}
                  style={{ aspectRatio: "1/1" }}
                >
                  <Image
                    src={getValidImage(drop.collaborator_image)}
                    alt={drop.collaborator_name}
                    fill
                    sizes="240px"
                    className={cn("object-cover")}
                  />
                </div>
              )}
              <div className={cn("max-w-2xl")}>
                <p
                  className={cn(
                    "text-xs uppercase tracking-widest text-gray-500",
                  )}
                >
                  {t("drops.aboutCollaborator")}
                </p>
                <h2 className={cn("text-2xl font-light mt-2")}>
                  {drop.collaborator_name}
                </h2>
                {drop.collaborator_bio &&
                  parseBody(drop.collaborator_bio).map((block, i) => (
                    <p
                      key={i}
                      className={cn(
                        "text-sm text-gray-700 leading-relaxed mt-4",
                      )}
                    >
                      {block.text}
                    </p>
                  ))}
                {collaboratorUrl && (
                  <a
                    href={collaboratorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-block mt-5 text-sm underline underline-offset-4 hover:text-vintage-brown",
                    )}
                  >
                    {t("drops.visitCollaborator")} →
                  </a>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
      <Schema markup={schema} />
      <Footer />
    </HeaderProvider>
  );
}
