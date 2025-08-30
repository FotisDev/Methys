
import ShowSubCategories from "@/components/homePage/categories/ShowSubCategories";
import Footer from "@/components/footer/Footer";
import Newsletter from "@/components/footer/NewsLeter";
import BookNow from "@/components/homePage/BookNow";
import ClothesCategories from "@/components/homePage/ClothesCategories";
import { HeaderProvider } from "@/components/homePage/Header";
import Hero from "@/components/homePage/Hero";
import HowItWork from "@/components/homePage/HowItWork/HowItWork";
import ThreeButtonsInRow from "@/components/homePage/ThreeButtonsInRow";
import ThreeIcons from "@/components/homePage/ThreeIcons";
import VideoSection from "@/components/homePage/VideoSection";
import PhotoGallery from "@/components/sections/photoAndVideoGallery";
import type { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "UrbanValor",
  description: "Browse our collection of products Second hand clothes is the new fashion.",
};

export default async function Home() {
  return (
    <div className={""}>
     
      {/* ta components einai me tin seira akribws opws blepoume kai tin home selida. */}
      <HeaderProvider>
        <Hero />
        <Suspense>
          <PhotoGallery/>
          <ShowSubCategories/>
          {/* <ClothesCategories />
          <ThreeButtonsInRow />
          <VideoSection />
          <BookNow />
          <HowItWork />
          */}
           <ThreeIcons />
          <Footer/>
        </Suspense>
      </HeaderProvider>
    </div>
  );
}
