export function getSupportPageStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Support | Methys",
    description:
      "Submit a support ticket for billing, bugs, account issues, or feature requests.",
    url: "https://Methys.com/support",
    mainEntity: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@Methys.com",
      availableLanguage: "English",
    },
  };
}
