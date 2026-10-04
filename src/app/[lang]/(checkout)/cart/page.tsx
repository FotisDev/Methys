import { HeaderProvider } from "@/components/providers/HeaderProvider";
import DropDownMenu from "@/components/header/DropDownMenu";
import Footer from "@/components/footer/Footer";
import CartPageClient from "./CartPageClient";

export default function CartPage() {
  return (
    <HeaderProvider forceOpaque={true} dropDownMenu={<DropDownMenu />}>
      <CartPageClient />
      <Footer />
    </HeaderProvider>
  );
}
