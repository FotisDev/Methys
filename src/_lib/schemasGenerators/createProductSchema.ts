export function createWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/#website`,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    name: "Methys",
    description: "Distinctive pieces for those who value craftsmanship and character.",
    publisher: {
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}