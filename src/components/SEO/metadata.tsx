import type { Metadata } from "next";
import { DEFAULT_METADATA } from "@/_lib/constants";
import { MetadataProps } from "@/_lib/interfaces";
import { absoluteUrl, languageAlternates } from "./urls";
import { defaultLocale, isLocale, localeMeta, locales } from "@/i18n.config";

const isLiveSite = process.env.NEXT_PUBLIC_IS_LIVE_SITE === "true";

// Supabase storage paths ("/storage/v1/...") live on the Supabase host;
// other relative paths are files in /public, resolved via metadataBase.
function resolveImageUrl(url?: string | null) {
  if (!url) return DEFAULT_METADATA.openGraphImageUrl;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/storage/")) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}${url}`;
  }
  return url;
}

export async function createMetadata(metadata: MetadataProps): Promise<Metadata> {
  const metaTitle = metadata.MetaTitle || DEFAULT_METADATA.metaTitle;
  const metaDescription =
    metadata.MetaDescription || DEFAULT_METADATA.metaDescription;
  const openGraphImage = resolveImageUrl(metadata.OpenGraphImageUrl);
  const locale = isLocale(metadata.locale) ? metadata.locale : defaultLocale;
  const path = metadata.canonical || "/";
  const canonicalUrl = absoluteUrl(path, locale);

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      siteName: DEFAULT_METADATA.siteName,
      url: canonicalUrl,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => localeMeta[l].ogLocale),
      type: metadata.datePublished ? "article" : "website",
      images: [
        {
          url: openGraphImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],

      ...(metadata.datePublished && {
        publishedTime: metadata.datePublished,
      }),

      ...(metadata.dateModified && {
        modifiedTime: metadata.dateModified,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [openGraphImage],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates(path),
    },
    robots: {
      index: metadata.robots?.index ?? isLiveSite,
      follow: metadata.robots?.follow ?? isLiveSite,
    },
    ...(metadata?.other && {
      other: metadata.other,
    }),
  };
}

