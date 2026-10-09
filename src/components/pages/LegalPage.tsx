import Footer from "@/components/footer/Footer";
import DropDownMenu from "@/components/header/DropDownMenu";
import Link from "@/components/LocaleLink/LocaleLink";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { Breadcrumbs } from "@/components/breadcrumb/breadcrumbSchema";
import type { ContentPageSlug, PageContent } from "@/_lib/backend/pages/action";
import type { Translator } from "@/i18n/translate";
import type { Locale } from "@/i18n.config";

const LEGAL_LINKS = [
  { slug: "terms-conditions", label: "footer.termsConditions" },
  { slug: "privacy-policy", label: "footer.privacyPolicy" },
  { slug: "legal-notice", label: "footer.legalNotice" },
] as const satisfies { slug: ContentPageSlug; label: string }[];

type LegalPageProps = {
  slug: ContentPageSlug;
  // Used until the page has content in Supabase.
  fallbackTitle: string;
  page: PageContent | null;
  locale: Locale;
  t: Translator;
};

// Shared layout for the legal pages (terms, privacy, legal notice).
export default function LegalPage({
  slug,
  fallbackTitle,
  page,
  locale,
  t,
}: LegalPageProps) {
  const title = page?.title || fallbackTitle;

  return (
    <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu />}>
      <main className="w-full pt-20 font-roboto text-vintage-green">
        <div className="mx-auto px-4 sm:px-6">
          <Breadcrumbs
            items={[
              { name: t("breadcrumbs.home"), slug: "/" },
              { name: title, slug: `/${slug}` },
            ]}
            locale={locale}
          />
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-6 pb-20 md:pt-10">
          <nav
            aria-label={t("legal.navLabel")}
            className="flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-wider mb-10"
          >
            {LEGAL_LINKS.map((link) => {
              const isCurrent = link.slug === slug;
              return (
                <Link
                  key={link.slug}
                  href={`/${link.slug}`}
                  aria-current={isCurrent ? "page" : undefined}
                  className={
                    isCurrent
                      ? "underline underline-offset-8"
                      : "text-gray-500 hover:text-vintage-green transition-colors"
                  }
                >
                  {t(link.label)}
                </Link>
              );
            })}
          </nav>

          <header className="border-b border-default-color pb-8 mb-10">
            <h1 className="text-2xl md:text-3xl font-light tracking-wide">
              {title}
            </h1>
            {page?.updated_at && (
              <p className="text-xs text-gray-500 mt-3">
                {t("legal.lastUpdated")}{" "}
                <time dateTime={page.updated_at}>
                  {new Date(page.updated_at).toLocaleDateString(locale, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </p>
            )}
          </header>

          {page?.content ? (
            <div
              className="legal-content"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            <p className="text-sm text-gray-600">{t("legal.comingSoon")}</p>
          )}

          <aside className="mt-16 border-t border-default-color pt-8 text-sm">
            <p className="font-medium mb-1">{t("legal.questionsTitle")}</p>
            <p className="text-gray-600">
              {t("legal.questionsText")}{" "}
              <Link
                href="/customer-support"
                className="underline underline-offset-4 hover:text-default-cold"
              >
                {t("legal.contactUs")}
              </Link>
            </p>
          </aside>
        </div>
      </main>
      <Footer />
    </HeaderProvider>
  );
}
