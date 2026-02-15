import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { AboutPageComponent } from "@/components/pages/aboutPageComponent";
export default function About() {
  return (
    <HeaderProvider forceOpaque>
      <AboutPageComponent />
      <Footer />
    </HeaderProvider>
  );
}
