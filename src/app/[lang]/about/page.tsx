import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { AboutPageComponent } from "@/components/pages/aboutPageComponent";
import { createMetadata } from "@/components/SEO/metadata";

export const metadata = createMetadata({
  MetaTitle: "About Us | Methys",
  MetaDescription:
    "Learn about Methys — our story, mission, and the team behind the product. Discover how we started and where we're headed.",
  canonical: "/about",
  OpenGraphImageUrl: "/storage/v1/object/public/OpenGraphImages/about-us.jpg",
  other: {
    "twitter:card": "summary_large_image",
    "twitter:title": "About Us | Methys",
    "twitter:description":
      "Learn about Methys — our story, mission, and the team behind the product.",
  },
});

export default function About() {
  return (
    <HeaderProvider forceOpaque>
      <AboutPageComponent />
      <Footer />
    </HeaderProvider>
  );
}
