import { absoluteUrl } from "@/components/SEO/urls";
import { localeMeta, type Locale } from "@/i18n.config";
import { ORGANIZATION_ID, WEBSITE_ID } from "./createOrganizationSchema";

export function createWebSiteSchema(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl("/", locale),
    name: "Methys",
    description,
    inLanguage: localeMeta[locale].htmlLang,
    publisher: {
      "@id": ORGANIZATION_ID,
    },
  };
}
