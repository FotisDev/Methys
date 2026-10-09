import { HeaderProvider } from "@/components/providers/HeaderProvider";
import Footer from "@/components/footer/Footer";
import DropDownMenu from "@/components/header/DropDownMenu";
import WishlistPageComponent from "@/components/pages/wishlistPage";

export default function WishlistPage() {
  return (
    <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu />}>
      <section className="padding-y px-0.5 bg-white">
        <WishlistPageComponent />
      </section>
      <Footer />
    </HeaderProvider>
  );
}
