
import Footer from "@/components/footer/Footer";
import BookNow from "@/components/homePage/BookNow";
import { HeaderProvider } from "@/components/homePage/Header";
import Hero from "@/components/homePage/Hero";
import HowItWork from "@/components/homePage/HowItWork/HowItWork";
import ThreeButtonsInRow from "@/components/homePage/ThreeButtonsInRow";
import ThreeIcons from "@/components/homePage/ThreeIcons";
import VideoSection from "@/components/homePage/VideoSection";
import PhotoGallery from "@/components/sections/photoAndVideoGallery";
import type { Metadata } from "next";
import React, { Suspense } from "react";
import CategoriesMainPage from "@/components/homePage/categories/CategoriesMainPage";

export const metadata: Metadata = {
  title: "UrbanValor",
  description: "Browse our collection of products. Second-hand clothes is the new fashion.",
};

export default async function Home() {
  return (
    <div>
      <HeaderProvider>
        <Hero />
        <Suspense>
          <PhotoGallery />
          <CategoriesMainPage />
          {/* 
          <ThreeButtonsInRow />
          <VideoSection />
          <BookNow />
          <HowItWork />
          */}
          <ThreeIcons />
          <Footer />
        </Suspense>
      </HeaderProvider>
    </div>
  );
}
