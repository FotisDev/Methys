import { fetchOnlineExclusive } from "@/_lib/backend/ProductWithStructure/action";
import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { OnlineProductsPageComponent } from "@/components/pages/OnlineProductsPage";



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
