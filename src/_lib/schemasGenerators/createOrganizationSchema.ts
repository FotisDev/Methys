export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${process.env.NEXT_PUBLIC_SITE_URL}/#organization`,
    name: "Methys",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    sameAs: [
      
      "https://www.instagram.com/Methys",
      "https://www.facebook.com/Methys",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "support@Methys.com", 
    },
  };
}