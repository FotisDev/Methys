import { fetchProducts } from "@/_lib/backend/fetchProducts/action";
import { translateProducts } from "@/_lib/backend/translations/action";

import Footer from "@/components/footer/Footer";
import DropDownMenu from "@/components/header/DropDownMenu";
import { SeasonalCollectionPageComponent } from "@/components/pages/seasonalCollectionPage";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { createMetadata } from "@/components/SEO/metadata";
import { getT } from "@/i18n/server";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const t = await getT(lang);
  return createMetadata({
    locale: lang,
    MetaTitle: t("seasonalCollection.metaTitle"),
    MetaDescription: t("seasonalCollection.metaDescription"),
    canonical: "/seasonal-collection",
    OpenGraphImageUrl: "/storage/v1/object/public/OpenGraphImages/about-us.jpg",
  });
}

export default async function SeasonalCollection({ params }: PageProps) {
  const { lang } = await params;
  const products = await translateProducts(await fetchProducts(), lang);

  return (
    <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu />}>
      <section className="padding-y padding-x bg-white">
        <SeasonalCollectionPageComponent products={products} title={""} />
      </section>
      <Footer />
    </HeaderProvider>
  );
}
