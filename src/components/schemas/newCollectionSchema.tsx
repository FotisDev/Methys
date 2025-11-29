export type CreateProductSchemaParams = {
  url: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
  sku: string;
  brand: string;
  availability: boolean;
  sizes: string[];
  category: string;
  id: string;
  product_details: string;
};

export function createProductSchema(p: CreateProductSchemaParams) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": p.url,
    url: p.url,
    name: p.name,
    description: p.description,
    product_details:p.product_details,
    image: p.images,
    sku: p.sku,
    brand: {
      "@type": "Brand",
      name: p.brand,
    },
    category: p.category,

    size: p.sizes,

    offers: {
      "@type": "Offer",
      url: p.url,
      price: p.price.toFixed(2),
      priceCurrency: p.currency,
      availability: p.availability
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}
