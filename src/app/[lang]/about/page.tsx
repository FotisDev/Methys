import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { AboutPageComponent } from "@/components/pages/aboutPageComponent";
import { createMetadata } from "@/components/SEO/metadata";
import DropDownMenu from "@/components/header/DropDownMenu";
import Schema from "@/components/schemas/SchemaMarkUp";
import { getAboutPageStructuredData } from "@/_lib/schemasGenerators/AboutPageStructureData";
import { getT } from "@/i18n/server";
import { defaultLocale, isLocale } from "@/i18n.config";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const t = await getT(lang);
  return createMetadata({
    locale: lang,
    MetaTitle: t("about.metaTitle"),
    MetaDescription: t("about.metaDescription"),
    canonical: "/about",
    OpenGraphImageUrl: "/storage/v1/object/public/OpenGraphImages/about-us.jpg",
  });
}

export default async function About({ params }: PageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const t = await getT(locale);
  return (
    <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu />}>
      <Schema
        markup={getAboutPageStructuredData(locale, {
          name: t("about.metaTitle"),
          description: t("about.metaDescription"),
        })}
      />
      <AboutPageComponent />
      <Footer />
    </HeaderProvider>
  );
}
