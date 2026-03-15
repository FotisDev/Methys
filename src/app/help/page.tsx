import FetchFaqs from "@/_lib/backend/Faqs/action";
import { generateFAQSchema } from "@/_lib/schemasGenerators/FAQSchema";
import Schema from "@/components/schemas/SchemaMarkUp";
import FaqSection from "@/components/pages/faqPage";
import { createMetadata } from "@/components/SEO/metadata";

export const metadata = createMetadata({
  MetaTitle: "Frequently Asked Question | Methys",
  MetaDescription:
    "Here are some of the most common inquiries about shiping ,founding money, and details about the products",
  canonical: "/help",
  OpenGraphImageUrl:
    "https://mpnjvzyymmtvgsrfgjjc.supabase.co/storage/v1/object/public/OpenGraphImages/about-us.jpg",
  other: {
    "twitter:card": "summary_large_image",
    "twitter:title": "Help | Methys",
    "twitter:description":
      "Questions and Answers in the most common inquiries about our products",
  },
});

export default async function FAQPage() {
  const faqs = await FetchFaqs();

  const schemaMarkup = generateFAQSchema(faqs);

  return (
    <>
      {schemaMarkup && <Schema markup={schemaMarkup} />}

      <FaqSection
        faqs={faqs}
        title="Everything you need to know about our services"
        subtitle="Frequently Asked Questions"
      />
    </>
  );
}
