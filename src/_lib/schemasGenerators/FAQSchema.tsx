import { FAQ } from "@/_lib/types";

export function generateFAQSchema(faqs: FAQ[]) {
  if (!faqs || faqs.length === 0) return null;

  const faqItems = faqs.map((faq) => ({
    "@type": "Question",
    name: faq.title,
    acceptedAnswer: {
      "@type": "Answer",
      text: stripHtml(String(faq.description)).result,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems,
  };
}
function stripHtml(html: string) {
  const result = html.replace(/<[^>]*>?/gm, "");
  return { result };
}
