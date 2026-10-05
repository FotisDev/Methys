import { fetchOffers } from "@/_lib/backend/offers/actions";
import { translateProducts } from "@/_lib/backend/translations/action";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import Footer from "@/components/footer/Footer";
import OffersPageComponent from "@/components/pages/offerPage";
import { Metadata } from "next";
import { createMetadata } from "@/components/SEO/metadata";
import DropDownMenu from "@/components/header/DropDownMenu";
import { getT } from "@/i18n/server";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getT(lang);
  return createMetadata({
    locale: lang,
    MetaTitle: t("offers.metaTitle"),
    MetaDescription: t("offers.metaDescription"),
    canonical: "/offers",
    // Members-only page (login required), keep it out of the index.
    robots: { index: false, follow: false },
    OpenGraphImageUrl: "/storage/v1/object/public/OpenGraphImages/about-us.jpg",
  });
}

export default async function OfferPage({ params }: PageProps) {
  const { lang } = await params;
  const offers = (await translateProducts(await fetchOffers(), lang)) ?? [];

  return (
    <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu />}>
      <section className="padding-y px-0.5 bg-white">
        <OffersPageComponent offerProduct={offers} />
      </section>
      <Footer />
    </HeaderProvider>
  );
}
