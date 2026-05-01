import { fetchOnlineExclusive } from "@/_lib/backend/ProductWithStructure/action";
import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { OnlineProductsPageComponent } from "@/components/pages/OnlineProductsPage";
import { createMetadata } from "@/components/SEO/metadata";

export const metadata = createMetadata({
  MetaTitle: "Online Exclusive | Methys",
  MetaDescription:
    "Explore our curated Online Exclusive collection — timeless pieces crafted for every season. Shop the latest arrivals at Methys.",
  OpenGraphImageUrl:
    "/storage/v1/object/public/OpenGraphImages/about-us.jpg",
  canonical: "/online-exclusive",
  other: {
    "twitter:card": "summary_large_image",
    "twitter:title": "Online Exclusive | Methys",
    "twitter:description":
      "Explore our Online Exclusive collection — timeless pieces crafted for every season.",
  },
});
export default async function OnlineExclusiveProducts() {
  const onlineProducts = await fetchOnlineExclusive();

  return (
    <HeaderProvider forceOpaque={true}>
      <section className="padding-y padding-x bg-white">
        <OnlineProductsPageComponent products={onlineProducts} title={""} />
      </section>
      <Footer />
    </HeaderProvider>
  );
}
