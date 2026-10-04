import { absoluteAssetUrl, absoluteUrl } from "@/components/SEO/urls";
import { localeMeta, type Locale } from "@/i18n.config";
import { WEBSITE_ID } from "./createOrganizationSchema";

export function createCollectionPageSchema({
  locale,
  path,
  name,
  description,
  items,
}: {
  locale: Locale;
  path: string;
  name: string;
  description: string;
  items: { name: string; path: string; imageUrl?: string }[];
}) {
  const url = absoluteUrl(path, locale);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    name,
    description,
    url,
    inLanguage: localeMeta[locale].htmlLang,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: absoluteUrl(item.path, locale),
        ...(item.imageUrl && { image: absoluteAssetUrl(item.imageUrl) }),
      })),
    },
  };
}
