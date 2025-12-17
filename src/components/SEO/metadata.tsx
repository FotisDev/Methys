import { DEFAULT_METADATA } from "@/_lib/constants";
import { MetadataProps, ProductMetadataProps } from "@/_lib/interfaces";

export async function createMetadata(metadata: MetadataProps) {
  const metaTitle = metadata.MetaTitle || DEFAULT_METADATA.metaTitle;
  const metaDescription =
    metadata.MetaDescription || DEFAULT_METADATA.metaDescription;
  let openGraphImage = DEFAULT_METADATA.openGraphImageUrl;

  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${
    metadata?.canonical || ""
  }`;

  if (metadata?.OpenGraphImageUrl) {
    openGraphImage =
      process.env.NEXT_PUBLIC_IMAGE_URL + metadata.OpenGraphImageUrl;
  }

  return {
    title: metaTitle,
    verification: {
      google: "VxpGe4reZ6GyzQ7rxYRnbi-JSuQ2dWPptVo-jGTFbOg",
      yandex: "your-yandex-verification-code", 
      bing: "your-bing-verification-code", 
      yahoo: "your-yahoo-verification-code",
    },
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "website",
      siteName: DEFAULT_METADATA.siteName,
      url: canonicalUrl,
      images: [
        {
          url: openGraphImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
    },
    alternates: {
      canonical: canonicalUrl,
      ...metadata?.alternates,
    },
    robots: {
      index:
        metadata.robots?.index ??
        process.env.NEXT_PUBLIC_IS_LIVE_SITE === "true",
      follow:
        metadata.robots?.follow ??
        process.env.NEXT_PUBLIC_IS_LIVE_SITE === "true",
    },
    ...(metadata?.other && {
      other: metadata.other,
    }),
  };
}

export async function createProductMetadata(product: ProductMetadataProps) {
  const metaTitle =
    product.MetaTitle || `${product.name} | ${DEFAULT_METADATA.siteName}`;
  const metaDescription =
    product.MetaDescription ||
    product.description ||
    DEFAULT_METADATA.metaDescription;
  const openGraphImage = product.OpenGraphImageUrl
    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${product.OpenGraphImageUrl}`
    : product.imageUrl || DEFAULT_METADATA.openGraphImageUrl;

  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${
    product.canonical || `/products/${product.slug}`
  }`;

  return {
    title: metaTitle,
    verification: {
      google: "VxpGe4reZ6GyzQ7rxYRnbi-JSuQ2dWPptVo-jGTFbOg",
    },
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "product",
      siteName: DEFAULT_METADATA.siteName,
      url: canonicalUrl,
      images: [
        {
          url: openGraphImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      ...(product.price && {
        product: {
          price: {
            amount: product.price.toString(),
            currency: product.currency || "USD",
          },
          availability: product.inStock ? "in stock" : "out of stock",
        },
      }),
    },
    alternates: {
      canonical: canonicalUrl,
      ...product?.alternates,
    },
    robots: {
      index:
        product.robots?.index ??
        process.env.NEXT_PUBLIC_IS_LIVE_SITE === "true",
      follow:
        product.robots?.follow ??
        process.env.NEXT_PUBLIC_IS_LIVE_SITE === "true",
    },
    ...(product?.other && {
      other: product.other,
    }),
  };
}



