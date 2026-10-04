import { absoluteUrl } from "@/components/SEO/urls";
import { localeMeta, type Locale } from "@/i18n.config";
import { AVAILABLE_LANGUAGES, WEBSITE_ID } from "./createOrganizationSchema";

export function getSupportPageStructuredData(
  locale: Locale,
  { name, description }: { name: string; description: string },
) {
  const url = absoluteUrl("/customer-support", locale);

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${url}#webpage`,
    name,
    description,
    url,
    inLanguage: localeMeta[locale].htmlLang,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@methys.com",
      availableLanguage: AVAILABLE_LANGUAGES,
    },
  };
}
