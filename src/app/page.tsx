
import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import Hero from "@/components/homePage/Hero";
import ThreeIcons from "@/components/homePage/ThreeIcons";
import PhotoGallery from "@/components/homePage/sections/photoAndVideoGallery";
import type { Metadata } from "next";
import React, { Suspense } from "react";
import CategoriesMainPage from "@/components/homePage/sections/CategoriesMainPage";
import NewCollectionClothes from "@/components/homePage/NewCollection";

export const metadata: Metadata = {
  title: "UrbanValor",
  description: "Browse our collection of products. Second-hand clothes is the new fashion.",
};

export default async function Home() {
  return (
    <div>
      <HeaderProvider forceOpaque={false}>
        <Hero />
        <NewCollectionClothes/>
        <Suspense>
          <PhotoGallery />
          <CategoriesMainPage />
          {/* 
          <ThreeButtonsInRow />
          <VideoSection />
          <BookNow />
          */}
          <ThreeIcons />
          <Footer />
        </Suspense>
      </HeaderProvider>
    </div>
  );
}
