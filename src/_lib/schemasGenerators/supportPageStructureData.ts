export function getSupportPageStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Support | YourAppName",
    description:
      "Submit a support ticket for billing, bugs, account issues, or feature requests.",
    url: "https://yourapp.com/support",
    mainEntity: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@yourapp.com",
      availableLanguage: "English",
    },
  };
}
