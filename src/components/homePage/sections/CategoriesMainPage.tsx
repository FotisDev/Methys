"use client";

import { useState, useEffect, JSX, useRef } from "react";
import { supabase } from "@/_lib/helpers";
import { CategoryBackendType } from "@/_lib/interfaces";
import Link from "next/link";
import Image from "next/image";
type CategoryWithImage = CategoryBackendType & {
  image: string;
  category_name: string;
};

const CategoriesMainPage = (): JSX.Element => {
  const [subcategories, setSubCategories] = useState<CategoryWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categoriesformen")
          .select("id, name")
          .eq("parent_id", 1);

        if (error) throw error;

        const mapped: CategoryWithImage[] = (data || []).map((cat) => {
          const rawName = (cat.name || "").toLowerCase();
          let imageName = "";
          if (rawName === "t-shirt" || rawName === "t-shirts")
            imageName = "tshirt.jpg";
          else if (rawName === "shirts") imageName = "shirts.avif";
          else if (rawName === "jackets") imageName = "jackets.jpg";
          else if (rawName === "socks") imageName = "socks.webp";
          else if (
            rawName === "jeans | pants" ||
            rawName === "jeans" ||
            rawName === "pants"
          )
            imageName = "jeans.jpg";
          else if (
            rawName === "custome pants" ||
            rawName === "custom" ||
            rawName === "custom pants"
          )
            imageName = "customePants.webp";
          else if (rawName === "shorts") imageName = "shorts.jpg";
          else if (rawName === "accessories") imageName = "accessories.webp";
          else if (rawName === "shoes") imageName = "shoes.jpg";
          else if (
            rawName.includes("knitwear") ||
            rawName.includes("hoodie") ||
            rawName.includes("hoodies")
          )
            imageName = "knitwear.webp";
          else {
            const nameSlug = rawName
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9\-]/g, "");
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
      } catch (err: unknown) {
        console.error("Error fetching subcategories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [supabaseUrl]);

  const [itemsPerSlide, setItemsPerSlide] = useState<number>(2);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 640) setItemsPerSlide(1);
      else if (window.innerWidth < 1024) setItemsPerSlide(2);
      else setItemsPerSlide(2);
    };
    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  const totalSlides = Math.max(
    1,
    Math.ceil(subcategories.length / itemsPerSlide)
  );

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

 
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

  const slides: CategoryWithImage[][] = [];
  for (let i = 0; i < subcategories.length; i += itemsPerSlide) {
    slides.push(subcategories.slice(i, i + itemsPerSlide));
  }

  return (
    <div
      className="w-full flex flex-col relative overflow-hidden font-poppins"
      ref={containerRef}
    >
      {/* <Link
        href="/products"
        className="absolute right-4 top-4 z-20 text-white px-4 py-2"
        aria-label="Go to products page"
      >
        SHOP NOW
      </Link> */}

      <div className="">
        <div className="relative w-full h-[85vh] sm:h-[95vh]">
          <div
            className="flex transition-transform duration-700 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slideCategories, slideIndex) => (
              <div
                key={slideIndex}
                className="w-full flex-shrink-0 h-full flex flex-col sm:flex-row"
              >
                {slideCategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className="w-full sm:w-1/2 h-1/2 sm:h-full flex items-center justify-center category-container relative"
                  >
                    <Link
                      href={`/products?category=${encodeURIComponent(
                        subcategory.category_name
                      )}`}
                      className="relative w-full h-full overflow-hidden group block"
                      aria-label={`Open ${subcategory.category_name}`}
                    >
                      <Image
                        src={subcategory.image}
                        alt={subcategory.category_name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        fill
                        onError={(e) => {
                          const el = e.currentTarget as HTMLImageElement;
                          el.onerror = null;
                          
                        }}
                      />

                      <div className="absolute bottom-0 flex flex-col justify-start p-6 pointer-events-none font-poppins ">
                        <div
                          className=" text-white "
                          style={{
                            opacity: 0.9,
                            textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                          }}
                        >
                          <p className="text-sm  mb-1 opacity-90">
                            Autumn 2025
                          </p>
                          <h3 className="text-lg ">
                            {subcategory.category_name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}

                {slideCategories.length < itemsPerSlide &&
                  Array.from({
                    length: itemsPerSlide - slideCategories.length,
                  }).map((_, idx) => (
                    <div
                      key={`empty-${idx}`}
                      className="w-full sm:w-1/2 h-1/2 sm:h-full "
                    />
                  ))}
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            aria-label="Previous slide"
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              currentIndex === 0 ? "opacity-40 cursor-not-allowed" : ""
            }`}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex === totalSlides - 1}
            aria-label="Next slide"
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              currentIndex === totalSlides - 1
                ? "opacity-40 cursor-not-allowed"
                : ""
            }`}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-3 h-3 rounded-full ${
              i === currentIndex ? "bg-amber-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesMainPage;
