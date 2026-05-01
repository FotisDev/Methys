import { fetchProducts } from "@/_lib/backend/fetchProducts/action";

import Footer from "@/components/footer/Footer";
import { SeasonalCollectionPageComponent } from "@/components/pages/seasonalCollectionPage";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { createMetadata } from "@/components/SEO/metadata";


export const metadata = createMetadata({
  MetaTitle: "Seasonal Collection | Methys",
  MetaDescription:
    "Explore our curated seasonal collection — timeless pieces crafted for every season. Shop the latest arrivals at Methys.",
  canonical: "/seasonal-collection",
  OpenGraphImageUrl:
    "/storage/v1/object/public/OpenGraphImages/about-us.jpg",
  other: {
    "twitter:card": "summary_large_image",
    "twitter:title": "Seasonal Collection | Methys",
    "twitter:description":
      "Explore our curated seasonal collection — timeless pieces crafted for every season.",
  },
});

export default async function SeasonalCollection() {
  const products = await fetchProducts();

  return (
    <HeaderProvider forceOpaque={true}>
      <section className="padding-y padding-x bg-white">
        <SeasonalCollectionPageComponent products={products} title={""} />
      </section>
      <Footer />
    </HeaderProvider>
  );
}
