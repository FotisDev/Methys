
import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import Hero from "@/components/header/Hero";
import PhotoGallery from "@/components/sections/photoAndVideoGallery";
import type { Metadata } from "next";
import React, { Suspense } from "react";
import CategoriesMainPage from "@/components/sections/CategoriesMainPage";
import SeasonalCollection from "@/components/sections/SeasonalCollection";

export const metadata: Metadata = {
  title: "UrbanValor",
  description: "Browse our collection of products. Second-hand clothes is the new fashion.",
};


export default async function Home() {

  return (
    <div>
      <HeaderProvider forceOpaque={false}>
        <Hero />
        <SeasonalCollection/>
        <Suspense>
          <PhotoGallery />
          <CategoriesMainPage />
          <Footer />
        </Suspense>
      </HeaderProvider>
    </div>
  );
}
