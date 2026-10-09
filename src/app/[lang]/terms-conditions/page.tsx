import { getPage } from "@/_lib/backend/pages/action";
import LegalPage from "@/components/pages/LegalPage";
import { createMetadata } from "@/components/SEO/metadata";
import { getT } from "@/i18n/server";
import { defaultLocale, isLocale } from "@/i18n.config";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const [page, t] = await Promise.all([
    getPage("terms-conditions", locale),
    getT(locale),
  ]);

  return createMetadata({
    locale,
    MetaTitle: t("terms.metaTitle"),
    MetaDescription: t("terms.metaDescription"),
    canonical: "/terms-conditions",
    dateModified: page?.updated_at,
    datePublished: page?.created_at,
    // Keep it out of the index until it has content.
    robots: page?.content ? undefined : { index: false, follow: true },
  });
}

export default async function TermsConditions({ params }: PageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const [page, t] = await Promise.all([
    getPage("terms-conditions", locale),
    getT(locale),
  ]);

  return (
    <LegalPage
      slug="terms-conditions"
      fallbackTitle={t("terms.title")}
      page={page}
      locale={locale}
      t={t}
    />
  );
}
