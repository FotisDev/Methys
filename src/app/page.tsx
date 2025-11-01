
import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import Hero from "@/components/header/Hero";
import PhotoGallery from "@/components/sections/photoAndVideoGallery";
import type { Metadata } from "next";
import React, { Suspense } from "react";
import CategoriesMainPage from "@/components/sections/CategoriesMainPage";
import NewCollectionClothes from "@/components/sections/NewCollection";
import ButtonsInRow from "@/components/sections/ButtonsInRow";
import { fetchSections } from "@/_lib/helpers";
import ThreeIcons from "@/components/sections/ThreeIcons";

export const metadata: Metadata = {
  title: "UrbanValor",
  description: "Browse our collection of products. Second-hand clothes is the new fashion.",
};


export default async function Home() {

  const sectionData = await fetchSections();
console.log(JSON.stringify(sectionData,null,2)); 
  return (
    <div>
      <HeaderProvider forceOpaque={false}>
        <Hero />
        <NewCollectionClothes/>
        <Suspense>
          <PhotoGallery />
          <CategoriesMainPage />
          {/* 
          
          <VideoSection />
          <BookNow />
          */}
          <ThreeIcons />
           {/* <ButtonsInRow data={sectionData} defaultSelected="recommended" /> */}
          <Footer />
        </Suspense>
      </HeaderProvider>
    </div>
  );
}
