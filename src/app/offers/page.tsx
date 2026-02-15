
import { fetchOffers } from "@/_lib/backend/offers/actions";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import Footer from "@/components/footer/Footer";
import OffersPageComponent from "@/components/pages/offerPage";

export default async function OfferPage() {
  const offers = await fetchOffers();

  return (
    <HeaderProvider forceOpaque={true}>
      <section className="padding-y padding-x bg-white">
        <OffersPageComponent offerProduct={offers} />
      </section>
      <Footer  />
    </HeaderProvider>
  );
}
