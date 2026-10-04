import FetchFaqs from "@/_lib/backend/Faqs/action";
import { generateFAQSchema } from "@/_lib/schemasGenerators/FAQSchema";
import Schema from "@/components/schemas/SchemaMarkUp";
import FaqSection from "@/components/pages/faqPage";
import { createMetadata } from "@/components/SEO/metadata";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import DropDownMenu from "@/components/header/DropDownMenu";
import { getT } from "@/i18n/server";
import { defaultLocale, isLocale } from "@/i18n.config";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const t = await getT(lang);
  return createMetadata({
    locale: lang,
    MetaTitle: t("help.metaTitle"),
    MetaDescription: t("help.metaDescription"),
    canonical: "/help",
    OpenGraphImageUrl:
      "/storage/v1/object/public/OpenGraphImages/about-us.jpg",
  });
}

export default async function FAQPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const [faqs, t] = await Promise.all([FetchFaqs(locale), getT(locale)]);

  const schemaMarkup = generateFAQSchema(faqs);

  return (
    <HeaderProvider  forceOpaque={true} dropDownMenu={<DropDownMenu/>}>
      {schemaMarkup && <Schema markup={schemaMarkup} />}

      <FaqSection
        faqs={faqs}
        title={t("help.title")}
        subtitle={t("help.subtitle")}
      />
    </HeaderProvider>
  );
}
