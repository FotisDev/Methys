import { fetchProducts } from "@/_lib/backend/fetchProducts/action";
import SeasonalCollectionCard from "@/components/cards/SeasonalCollectionCard";
import Footer from "@/components/footer/Footer";
import { SeasonalCollectionPageComponent } from "@/components/pages/seasonalCollectionPage";
import { HeaderProvider } from "@/components/providers/HeaderProvider";

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
