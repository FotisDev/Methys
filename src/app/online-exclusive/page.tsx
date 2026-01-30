import { fetchOnlineExclusive } from "@/_lib/backend/ProductWithStructure/action";
import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { OnlineProducts } from "@/components/sections/OnlineProducts";



export default async function OnlineExclusiveProducts() {
  const onlineProducts = await fetchOnlineExclusive();

  return (
    <HeaderProvider forceOpaque={true}>
      <section className="padding-y padding-x bg-white">
        <OnlineProducts products={onlineProducts} title={""} />
      </section>
      <Footer />
    </HeaderProvider>
  );
}
