import { absoluteUrl } from "@/components/SEO/urls";
import { localeMeta, type Locale } from "@/i18n.config";
import {
  ORGANIZATION_ID,
  ORGANIZATION_SAME_AS,
  WEBSITE_ID,
} from "./createOrganizationSchema";

export function getAboutPageStructuredData(
  locale: Locale,
  { name, description }: { name: string; description: string },
) {
  const url = absoluteUrl("/about", locale);

  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: localeMeta[locale].htmlLang,
    isPartOf: {
      "@id": WEBSITE_ID,
    },
    about: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Methys",
      url: absoluteUrl("/", locale),
      sameAs: ORGANIZATION_SAME_AS,
      founder: {
        "@type": "Person",
        name: "Fotis Lyrantzakis",
        nationality: "Greek",
      },
      foundingLocation: {
        "@type": "Place",
        name: "Greece",
      },
    },
  };
}
