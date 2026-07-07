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

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    MetaTitle: "Methys - Timeless Pieces for the Modern Individual",
    MetaDescription:
      "Distinctive pieces for those who value craftsmanship and character.",
    canonical: "/",
  });
}

export default async function Home() {
  return (
    <section className="home-page">
      <Schema markup={createOrganizationSchema()} />
      <Schema markup={createWebSiteSchema()} />
      <HeaderProvider forceOpaque={false}>
        <Suspense >
          <Hero />
        </Suspense>

        <Suspense fallback={<SeasonalCollectionSkeleton />}>
          <SeasonalCollectionSection
            title="Summer Collection Just Dropped"
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
            title="Autumn Collection Just Dropped"
            fetcher={ProductByAutumnSeason}
          />
        </Suspense>

        <Footer />
      </HeaderProvider>
    </section>
  );
}
