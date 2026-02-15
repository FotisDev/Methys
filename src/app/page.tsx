import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import Hero from "@/components/header/Hero";
import PhotoVideoSection from "@/components/sections/photoAndVideoSection";
import type { Metadata } from "next";
import React, { Suspense } from "react";
import CategoriesSection from "@/components/sections/CategoriesSection";
import {
  ProductBySpringSeason,
  ProductByWinterSeason,
} from "@/_lib/backend/ProductWithStructure/action";
import { createMetadata } from "@/components/SEO/metadata";
import { createWebSiteSchema } from "@/_lib/schemasGenerators/createProductSchema";
import { createOrganizationSchema } from "@/_lib/schemasGenerators/createOrganizationSchema";
import Schema from "@/components/schemas/SchemaMarkUp";
import SeasonalCollectionSection from "@/components/sections/SeasonalCollectionSection";

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
    <section className="home-page ">
      <Schema markup={createOrganizationSchema()} />
      <Schema markup={createWebSiteSchema()} />
      <HeaderProvider forceOpaque={false}>
        <Hero />
        <SeasonalCollectionSection
          title="Winter Collection Just Dropped"
          fetcher={ProductByWinterSeason}
        />
        <Suspense>
          <PhotoVideoSection />
          <CategoriesSection />
          <SeasonalCollectionSection
            title="Spring Collection Just Dropped"
            fetcher={ProductBySpringSeason}
          />
          <Footer />
        </Suspense>
      </HeaderProvider>
    </section>
  );
}
