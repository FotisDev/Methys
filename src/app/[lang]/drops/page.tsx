import Image from "next/image";
import type { Metadata } from "next";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import DropDownMenu from "@/components/header/DropDownMenu";
import Footer from "@/components/footer/Footer";
import Link from "@/components/LocaleLink/LocaleLink";
import { createMetadata } from "@/components/SEO/metadata";
import { getDrops } from "@/_lib/backend/drops/queries";
import { getValidImage } from "@/_lib/helpers";
import { dropPhase } from "@/_lib/utils/content";
import { getT } from "@/i18n/server";
import { defaultLocale, isLocale } from "@/i18n.config";
import { cn } from "@/_lib/utils/cn";

export const revalidate = 60;

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getT(lang);
  return createMetadata({
    locale: lang,
    MetaTitle: t("drops.metaTitle"),
    MetaDescription: t("drops.metaDescription"),
    canonical: "/drops",
  });
}

const PHASE_STYLES = {
  upcoming: "bg-white text-vintage-green",
  live: "bg-red-600 text-white",
  ended: "bg-gray-800 text-white",
} as const;

export default async function DropsPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const [t, drops] = await Promise.all([getT(locale), getDrops(locale)]);
  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: "long" });

  // Upcoming first (soonest first), then live, then past drops.
  const order = { upcoming: 0, live: 1, ended: 2 } as const;
  const sorted = drops
    .map((drop) => ({ drop, phase: dropPhase(drop) }))
    .sort(
      (a, b) =>
        order[a.phase] - order[b.phase] ||
        (a.phase === "upcoming"
          ? a.drop.starts_at.localeCompare(b.drop.starts_at)
          : b.drop.starts_at.localeCompare(a.drop.starts_at)),
    );

  return (
    <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu />}>
      <section
        className={cn(
          "px-4 sm:px-6 pt-28 pb-20 font-roboto text-vintage-green max-w-6xl mx-auto",
        )}
      >
        <header className={cn("mb-12")}>
          <h1 className={cn("text-3xl md:text-4xl font-light tracking-wide")}>
            {t("drops.title")}
          </h1>
          <p className={cn("text-sm text-gray-600 mt-2 max-w-xl")}>
            {t("drops.intro")}
          </p>
        </header>

        {sorted.length === 0 && (
          <p className={cn("text-sm text-gray-500")}>{t("drops.empty")}</p>
        )}

        <ul className={cn("grid sm:grid-cols-2 gap-x-6 gap-y-12")}>
          {sorted.map(({ drop, phase }) => (
            <li key={drop.id}>
              <Link href={`/drops/${drop.slug}`} className={cn("group block")}>
                <div
                  className={cn("relative bg-gray-100 overflow-hidden mb-4")}
                  style={{ aspectRatio: "4/5" }}
                >
                  <Image
                    src={getValidImage(drop.hero_image)}
                    alt={drop.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className={cn(
                      "object-cover transition-transform duration-700 group-hover:scale-[1.03]",
                      phase === "ended" && "grayscale",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute top-4 left-4 text-[10px] uppercase tracking-widest px-3 py-1.5",
                      PHASE_STYLES[phase],
                    )}
                  >
                    {t(`drops.phase.${phase}`)}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-xs uppercase tracking-widest text-gray-500",
                  )}
                >
                  {drop.collaborator_name
                    ? t("drops.withCollaborator", {
                        name: drop.collaborator_name,
                      })
                    : dateFormat.format(new Date(drop.starts_at))}
                </p>
                <h2
                  className={cn(
                    "text-xl font-light mt-2 group-hover:underline underline-offset-4",
                  )}
                >
                  {drop.title}
                </h2>
                {drop.tagline && (
                  <p className={cn("text-sm text-gray-600 mt-1")}>
                    {drop.tagline}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Footer />
    </HeaderProvider>
  );
}
