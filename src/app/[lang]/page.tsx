import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import Hero from "@/components/header/Hero";
import PhotoVideoSection from "@/components/sections/photoAndVideoSection";
import type { Metadata } from "next";
import React, { Suspense } from "react";
import CategoriesSection from "@/components/sections/CategoriesSection";
import {
  ProductByAutumnSeason,
  ProductBySummerSeason,
} from "@/_lib/backend/ProductWithStructure/action";
import { createMetadata } from "@/components/SEO/metadata";
import { createWebSiteSchema } from "@/_lib/schemasGenerators/createProductSchema";
import { createOrganizationSchema } from "@/_lib/schemasGenerators/createOrganizationSchema";
import Schema from "@/components/schemas/SchemaMarkUp";
import SeasonalCollectionSection from "@/components/sections/SeasonalCollectionSection";
import SeasonalCollectionSkeleton from "@/components/skeletons/SeasonalCollectionSkeleton";
import DropDownMenu from "@/components/header/DropDownMenu";
import { getT } from "@/i18n/server";
import { isLocale, defaultLocale } from "@/i18n.config";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = await getT(lang);
  return createMetadata({
    locale: lang,
    MetaTitle: t("home.metaTitle"),
    MetaDescription: t("home.metaDescription"),
    canonical: "/",
  });
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : defaultLocale;
  const t = await getT(locale);

  return (
    <section className="home-page">
      <Schema markup={createOrganizationSchema(locale)} />
      <Schema markup={createWebSiteSchema(locale, t("home.metaDescription"))} />
      <HeaderProvider forceOpaque={false} dropDownMenu={<DropDownMenu />}>
        <Suspense>
          <Hero />
        </Suspense>

        <Suspense fallback={<SeasonalCollectionSkeleton />}>
          <SeasonalCollectionSection
            title={t("home.shopNow")}
            fetcher={ProductBySummerSeason}
          />
        </Suspense>

        <Suspense fallback={null}>
          <PhotoVideoSection />
        </Suspense>

        <Suspense fallback={null}>
          <CategoriesSection />
        </Suspense>

        <Suspense fallback={<SeasonalCollectionSkeleton />}>
          <SeasonalCollectionSection
            title={t("home.autumnCollection")}
            fetcher={ProductByAutumnSeason}
          />
        </Suspense>

        <Footer />
      </HeaderProvider>
    </section>
  );
}
