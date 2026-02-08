import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import Hero from "@/components/header/Hero";
import PhotoGallery from "@/components/sections/photoAndVideoGallery";
import type { Metadata } from "next";
import React, { Suspense } from "react";
import CategoriesMainPage from "@/components/sections/CategoriesMainPage";
import SeasonalCollection from "@/components/sections/SeasonalCollection";
import {
  ProductBySpringSeason,
  ProductByWinterSeason,
} from "@/_lib/backend/ProductWithStructure/action";
import { createMetadata } from "@/components/SEO/metadata";
import { createWebSiteSchema } from "@/_lib/schemasGenerators/createProductSchema";
import { createOrganizationSchema } from "@/_lib/schemasGenerators/createOrganizationSchema";
import Schema from "@/components/schemas/SchemaMarkUp";

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
    <section className="hero-section">
      <h1>Methys</h1>
      <p>Timeless style. Exceptional quality.</p>
      <Schema markup={createOrganizationSchema()} />
      <Schema markup={createWebSiteSchema()} />
      <HeaderProvider forceOpaque={false}>
        <Hero />
        <SeasonalCollection
          title="Winter Collection Just Dropped"
          fetcher={ProductByWinterSeason}
        />
        <Suspense>
          <PhotoGallery />
          <CategoriesMainPage />
          <SeasonalCollection
            title="Spring Collection Just Dropped"
            fetcher={ProductBySpringSeason}
          />
          <Footer />
        </Suspense>
      </HeaderProvider>
    </section>
  );
}
