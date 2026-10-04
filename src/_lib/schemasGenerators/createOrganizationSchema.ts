import { absoluteUrl, SITE_URL } from "@/components/SEO/urls";
import { localeMeta, locales, type Locale } from "@/i18n.config";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const ORGANIZATION_SAME_AS = [
  "https://www.instagram.com/methys",
  "https://www.facebook.com/methys",
];
export const AVAILABLE_LANGUAGES = locales.map((l) => localeMeta[l].label);

export function createOrganizationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Methys",
    url: absoluteUrl("/", locale),
    // TODO: add `logo` once a square logo (min 112x112) exists in /public.
    sameAs: ORGANIZATION_SAME_AS,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "support@methys.com",
      url: absoluteUrl("/customer-support", locale),
      availableLanguage: AVAILABLE_LANGUAGES,
    },
  };
}
