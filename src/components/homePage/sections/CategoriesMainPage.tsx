"use client";

import { useState, useEffect, JSX, useRef } from "react";
import { supabase } from "@/_lib/helpers";
import { CategoryBackendType } from "@/_lib/interfaces";
import Link from "next/link";

type CategoryWithImage = CategoryBackendType & { image: string; category_name: string };

const CategoriesMainPage = (): JSX.Element => {
  const [subcategories, setSubCategories] = useState<CategoryWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Base URL of your Supabase project (should exist in env)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categoriesformen")
          .select("id, name")
          .eq("parent_id", 1);

        if (error) throw error;

        const mapped: CategoryWithImage[] = (data || []).map((cat: any) => {
          const rawName = (cat.name || "").toLowerCase();
          let imageName = "";

          // explicit mappings you previously used (adjust as needed)
          if (rawName === "t-shirt" || rawName === "t-shirts") imageName = "tshirt.jpg";
          else if (rawName === "shirts") imageName = "shirts.avif";
          else if (rawName === "jackets") imageName = "jackets.jpg";
          else if (rawName === "socks") imageName = "socks.webp";
          else if (rawName === "jeans | pants" || rawName === "jeans" || rawName === "pants") imageName = "jeans.jpg";
          else if (rawName === "custome pants" || rawName === "custom" || rawName === "custom pants") imageName = "customePants.webp";
          else if (rawName === "shorts") imageName = "shorts.jpg";
          else if (rawName === "accessories") imageName = "accessories.webp";
          else if (rawName === "shoes") imageName = "shoes.jpg";
          else if (rawName.includes("knitwear") || rawName.includes("hoodie") || rawName.includes("hoodies")) imageName = "knitwear.webp";
          else {
            const nameSlug = rawName.replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
            imageName = `${nameSlug}.jpg`;
          }

          const fullUrl = `${supabaseUrl}/storage/v1/object/public/product-images/${imageName}`;
          return {
            id: cat.id,
            category_name: cat.name,
            image: fullUrl,
          } as CategoryWithImage;
        });

        setSubCategories(mapped);
      } catch (err: any) {
        console.error("Error fetching subcategories:", err?.message ?? err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [supabaseUrl]);

  // Prepare slides: show 2 categories per slide on desktop, 1 per slide on mobile
  // We'll compute slides dynamically based on viewport width
  const [itemsPerSlide, setItemsPerSlide] = useState<number>(2);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 640) setItemsPerSlide(1); // mobile
      else if (window.innerWidth < 1024) setItemsPerSlide(2); // tablet
      else setItemsPerSlide(2); // desktop - still 2
    };
    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  const totalSlides = Math.max(1, Math.ceil(subcategories.length / itemsPerSlide));

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Parallax scroll for .parallax-text inside each .category-container
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const containers = containerRef.current.querySelectorAll<HTMLElement>(".category-container");
      const windowHeight = window.innerHeight;

      containers.forEach((container) => {
        const rect = container.getBoundingClientRect();
        const textElement = container.querySelector<HTMLElement>(".parallax-text");
        if (!textElement) return;

        const containerHeight = rect.height || container.offsetHeight;

        // normalized scroll percent (0..1)
        let scrollPercent = (windowHeight - rect.top) / (windowHeight + containerHeight);
        scrollPercent = Math.max(0, Math.min(1, scrollPercent));

        // shift range - you can tune this
        const maxTranslate = Math.max(0, containerHeight - textElement.offsetHeight);
        const translateY = scrollPercent * maxTranslate;

        textElement.style.transform = `translateY(${translateY}px)`;
        textElement.style.opacity = `${0.9}`; // remain visible
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [subcategories]);

  // fallback image data URL (light gray)
  const fallbackDataUrl =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Crect width='1200' height='800' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' font-size='40' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3EImage not found%3C/text%3E%3C/svg%3E";

  if (loading) {
    return (
      <div className="w-full flex flex-col relative">
        <div className="pt-10">
          <div className="flex flex-col lg:flex-row h-[100vh] bg-cover justify-center items-center pb-10">
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center bg-gray-200 animate-pulse">
              <div className="text-gray-500">Loading categories...</div>
            </div>
            <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center bg-gray-100">
              <div className="text-gray-500">Loading content...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (subcategories.length === 0) {
    return (
      <div className="w-full flex flex-col relative">
        <div className="">
          <div className="flex flex-col lg:flex-row h-[80vh] bg-cover justify-center items-center ">
            <div className="w-full flex items-center justify-center">
              <p className="text-gray-600">No categories found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Build slides for rendering (array of arrays)
  const slides: CategoryWithImage[][] = [];
  for (let i = 0; i < subcategories.length; i += itemsPerSlide) {
    slides.push(subcategories.slice(i, i + itemsPerSlide));
  }

  return (
    <div className="w-full flex flex-col relative overflow-hidden" ref={containerRef}>
      {/* Shop Now Button */}
      <Link
        href="/products"
        className="absolute right-4 top-4 z-20 bg-amber-500 text-black px-4 py-2 rounded shadow font-poppins"
        aria-label="Go to products page"
      >
        SHOP NOW
      </Link>

      <div className="">
        {/* Carousel Container */}
        <div className="relative w-full h-[85vh] sm:h-[95vh]">
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slideCategories, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0 h-full flex flex-col sm:flex-row">
                {slideCategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="w-full sm:w-1/2 h-1/2 sm:h-full flex items-center justify-center category-container relative"
                  >
                    <Link
                      href={`/products?category=${encodeURIComponent(subcategory.category_name)}`}
                      className="relative w-full h-full overflow-hidden group block"
                      aria-label={`Open ${subcategory.category_name}`}
                    >
                      <img
                        src={subcategory.image}
                        alt={subcategory.category_name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          const el = e.currentTarget as HTMLImageElement;
                          el.onerror = null;
                          el.src = fallbackDataUrl;
                        }}
                      />

                      <div className="absolute inset-0 flex flex-col justify-start p-6 pointer-events-none">
                        <div
                          className="parallax-text text-white max-w-[85%]"
                          style={{ opacity: 0.9, textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
                        >
                          <p className="text-sm font-light mb-1 opacity-90">Autumn 2025</p>
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">{subcategory.category_name}</h3>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                {/* If a slide has less items than itemsPerSlide, fill empty space */}
                {slideCategories.length < itemsPerSlide &&
                  Array.from({ length: itemsPerSlide - slideCategories.length }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="w-full sm:w-1/2 h-1/2 sm:h-full" />
                  ))}
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            aria-label="Previous slide"
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              currentIndex === 0 ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex === totalSlides - 1}
            aria-label="Next slide"
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              currentIndex === totalSlides - 1 ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Optional dots / pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-3 h-3 rounded-full ${i === currentIndex ? "bg-amber-500" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesMainPage;
