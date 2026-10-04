import { fetchOnlineExclusive } from "@/_lib/backend/ProductWithStructure/action";
import { translateProducts } from "@/_lib/backend/translations/action";
import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { OnlineProductsPageComponent } from "@/components/pages/OnlineProductsPage";
import { createMetadata } from "@/components/SEO/metadata";
import DropDownMenu from "@/components/header/DropDownMenu";
import { getT } from "@/i18n/server";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { lang } = await params;
  const t = await getT(lang);
  return createMetadata({
    locale: lang,
    MetaTitle: t("onlineExclusive.metaTitle"),
    MetaDescription: t("onlineExclusive.metaDescription"),
    canonical: "/online-exclusive",
    OpenGraphImageUrl:
      "/storage/v1/object/public/OpenGraphImages/about-us.jpg",
  });
}
export default async function OnlineExclusiveProducts({ params }: PageProps) {
  const { lang } = await params;
  const onlineProducts = await translateProducts(await fetchOnlineExclusive(), lang);

  return (
    <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu/>}>
      <section className="padding-y px-0.5 bg-white">
        <OnlineProductsPageComponent products={onlineProducts} title={""} />
      </section>
      <Footer />
    </HeaderProvider>
  );
}
