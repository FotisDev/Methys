import { createMetadata } from "@/components/SEO/metadata";
import { getSupportPageStructuredData } from "@/_lib/schemasGenerators/supportPageStructureData";
import SupportFormPageComponent from "@/components/pages/SupportFormPageComponent";
import Schema from "@/components/schemas/SchemaMarkUp";
import { getSupportCategories } from "@/_lib/backend/SupportCategories/action";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import Image from "next/image";
import Link from "@/components/LocaleLink/LocaleLink";
import DropDownMenu from "@/components/header/DropDownMenu";
import { getT } from "@/i18n/server";
import { defaultLocale, isLocale } from "@/i18n.config";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const t = await getT(lang);
  return createMetadata({
    locale: lang,
    MetaTitle: t("support.metaTitle"),
    MetaDescription: t("support.metaDescription"),
    canonical: "/customer-support",
    OpenGraphImageUrl: "/storage/v1/object/public/OpenGraphImages/about-us.jpg",
  });
}

export default async function SupportPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const [supportCategories, t] = await Promise.all([
    getSupportCategories(),
    getT(locale),
  ]);
  const schemaMarkUp = getSupportPageStructuredData(locale, {
    name: t("support.metaTitle"),
    description: t("support.metaDescription"),
  });

  return (
    <>
      {schemaMarkUp && <Schema markup={schemaMarkUp} />}
      <HeaderProvider forceOpaque={false} dropDownMenu={<DropDownMenu />}>
        <main className="relative min-h-screen flex items-center justify-center px-4">
          <Image
            src="/yo.jpg"
            alt=""
            className="fixed inset-0 w-full h-full object-cover -z-10"
            fill
          />
          <div className="fixed inset-0 bg-black/30 -z-5"></div>
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8 relative z-10">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {t("support.title")}
            </h1>
            <p className="text-gray-500 mb-6 text-sm">{t("support.intro")}</p>
            <SupportFormPageComponent categories={supportCategories ?? []} />
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-vintage-green font-bold hover:underline"
              >
                {t("support.goToMainPage")}
              </Link>
            </div>
          </div>
        </main>
      </HeaderProvider>
    </>
  );
}
