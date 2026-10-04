import { createMetadata } from "@/components/SEO/metadata";
import { getT } from "@/i18n/server";

type PageProps = { params: Promise<{ lang: string }> };

// Placeholder page: keep it out of the index until real content exists.
export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const t = await getT(lang);
  return createMetadata({
    locale: lang,
    MetaTitle: t("terms.metaTitle"),
    MetaDescription: t("terms.metaDescription"),
    canonical: "/terms-conditions",
    robots: { index: false, follow: true },
  });
}

export default async function TermsConditions({ params }: PageProps) {
  const { lang } = await params;
  const t = await getT(lang);
  return <h1>{t("terms.title")}</h1>;
}
