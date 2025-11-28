import Schema from "./SchemaMarkUp";

type ListItem = {
  "@type": string;
  position: number;
  item: object;
};

// type TouristTripType = {
//   "@type": string;
//   "@id": string;
//   name: string;
//   description: string;
//   itinerary: string;
//   touristType: string;
// };

type AboutEntity = {
  "@type": string;
  name: string;
  url?: string;
  sameAs?: string;
};

type ItemListCollectionSchemaProps = {
  pageUrl: string;
  pageName: string;
  pageDescription: string;
  listName: string;
  items: ListItem[];
  about?: AboutEntity | AboutEntity[];
};

export default function ItemListCollectionSchema({
  pageUrl,
  pageName,
  pageDescription,
  listName,
  items,
  about,
}: ItemListCollectionSchemaProps) {
  const itemListElement: ListItem[] = items;

  const markup = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "CollectionPage"],
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: pageName,
    inLanguage: "en",
    description: pageDescription,
    isPartOf: {
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/#website`,
    },
    ...(about && { about }),
    mainEntity: {
      "@type": "ItemList",
      name: listName,
      itemListElement,
    },
  };

  return <Schema markup={markup} />;
}
