export function getAboutPageStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/about#webpage`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
    name: "About Us | Methys",
    description:
      "Learn about Methys — our story, mission, and the team behind the product. Discover how we started and where we're headed.",
    inLanguage: "en",
    isPartOf: {
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/#website`,
    },
    about: {
      "@type": "Organization",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/#organization`,
      name: "Methys",
      url: process.env.NEXT_PUBLIC_SITE_URL,
      sameAs: [
        "https://www.instagram.com/methys", 
        "https://www.facebook.com/methys",
      ],
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