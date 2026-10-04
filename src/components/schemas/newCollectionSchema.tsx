import { absoluteAssetUrl } from "@/components/SEO/urls";
import { ORGANIZATION_ID } from "@/_lib/schemasGenerators/createOrganizationSchema";

export type ProductVariant = {
  size: string;
  quantity: number;
  sku?: string; 
};
 
export type CreateProductSchemaParams = {
  url: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
  sku: string; 
  brand: string;
  variants: ProductVariant[];
  availability?: boolean; 
  category: string;
  id: string;
  product_details?: string;
  sizeLabel?: string;
};
 
export function createProductSchema(p: CreateProductSchemaParams) {
  const baseId = `${p.url}#product-group`;
  const images = p.images.map(absoluteAssetUrl);
  const seller = { "@type": "Organization", "@id": ORGANIZATION_ID, name: p.brand };
 
  const variants = p.variants.map((v) => {
    const variantSku = v.sku ?? `${p.sku}-${v.size.toUpperCase()}`;
    const variantUrl = `${p.url}?size=${encodeURIComponent(v.size)}`;
    const inStock = v.quantity > 0;
 
    return {
      "@type": "Product",
      "@id": `${p.url}#variant-${v.size.toLowerCase()}`,
      name: `${p.name} — ${p.sizeLabel ?? "Size"} ${v.size}`,
      description: p.description,
      image: images,
      sku: variantSku,
      size: v.size,
      url: variantUrl,
      brand: {
        "@type": "Brand",
        name: p.brand,
      },
      inProductGroupWithID: p.sku,
      isVariantOf: { "@id": baseId },
      offers: {
        "@type": "Offer",
        url: variantUrl,
        price: p.price.toFixed(2),
        priceCurrency: p.currency,
        availability: inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        seller,
      },
    };
  });
 
  if (variants.length === 0) {
    const inStock = p.availability ?? false;
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": p.url,
      url: p.url,
      name: p.name,
      description: p.description,
      image: images,
      sku: p.sku,
      brand: {
        "@type": "Brand",
        name: p.brand,
      },
      category: p.category,
      offers: {
        "@type": "Offer",
        url: p.url,
        price: p.price.toFixed(2),
        priceCurrency: p.currency,
        availability: inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        seller,
      },
    };
  }
 
  return {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    "@id": baseId,
    url: p.url,
    name: p.name,
    description: p.description,
    image: images,
    brand: {
      "@type": "Brand",
      name: p.brand,
    },
    category: p.category,
    productGroupID: p.sku, 
    variesBy: ["https://schema.org/size"],
    hasVariant: variants,
  };
}