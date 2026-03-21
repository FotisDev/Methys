import { fetchOffers } from "@/_lib/backend/offers/actions";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import Footer from "@/components/footer/Footer";
import OffersPageComponent from "@/components/pages/offerPage";
import { Metadata } from "next";
import { createMetadata } from "@/components/SEO/metadata";

//SEO

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    MetaTitle: "Limited Offers | YourSiteName",
    MetaDescription:
      "Explore our exclusive limited-time offers with up to 20% off on selected items.",
    canonical: "/offers",
    OpenGraphImageUrl:
      "https://mpnjvzyymmtvgsrfgjjc.supabase.co/storage/v1/object/public/OpenGraphImages/about-us.jpg",
  });
}

export default async function OfferPage() {
  const offers = await fetchOffers();

  return (
    <HeaderProvider forceOpaque={true}>
      <section className="padding-y padding-x bg-white">
        <OffersPageComponent offerProduct={offers} />
      </section>
      <Footer />
    </HeaderProvider>
  );
}
