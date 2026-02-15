import FetchFaqs from "@/_lib/backend/Faqs/action";
import { generateFAQSchema } from "@/_lib/schemasGenerators/FAQSchema";
import Schema from "@/components/schemas/SchemaMarkUp";
import FaqSection from "@/components/pages/faqPage";

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
