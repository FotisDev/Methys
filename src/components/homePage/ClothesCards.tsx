"use client";

import { supabase } from "@/_lib/supabaseClient";
import { Category } from "@/_lib/types";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function ClotheCards() {
  
  const [isOpen, setIsOpen] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, category_name, image_url")
        .order("category_name", { ascending: true });

      if (error) {
        console.error("Failed to fetch categories:", error.message);
      }
      setCategories(data || []);
    };
    fetchCategories();
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={cardRef}
      className=" bg-white  mt-28 relative mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-auto max-w-auto rounded"
    >
     {/* Card Container with Grid */}
      <div className="">
        {categories.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-gray-600 text-lg">Loading categories...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-3 md:gap-4 lg:gap-6 ">
            {categories.map((category) => {
              // Ensure category.image_url is a string and handle potential leading slashes
              const imagePath = category.image_url
                ? category.image_url.startsWith('/')
                  ? category.image_url.substring(1) // Remove leading slash if it exists
                  : category.image_url
                : 'shorts.jpg'; // fallback image name if undefined or empty

              const imageUrl = `https://mpnjvzyymmtvgsrfgjjc.supabase.co/storage/v1/object/public/product-images/${imagePath}`;

              // Handle the case for local fallback image
              const finalImageUrl = category.image_url ? imageUrl : "/shorts.jpg";

              return (
                <Link
                  key={category.category_name}
                  href={`/products/${category.category_name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="group relative w-full  aspect-[3/4] bg-gray-100 rounded sm:rounded-2xl lg:rounded-3xl xl:rounded-[20px] overflow-hidden hover:scale-105 transition-transform duration-300"
                >
                                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-3xl xl:rounded-[20px] overflow-hidden">
                    <Image
                      src={finalImageUrl}
                      alt={category.category_name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 z-10 rounded-xl sm:rounded-2xl lg:rounded-3xl xl:rounded-[20px] transition-opacity duration-700 group-hover:opacity-80"></div>

                  {/* Category name - responsive text sizing and positioning */}
                  <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 md:bottom-3 md:right-3 lg:bottom-4 lg:right-4 z-20 text-white text-lg sm:text-lg md:text-lg lg:text-lg xl:text-lg 2xl:text-[25px] [writing-mode:vertical-rl] font-bold transition-opacity duration-700 group-hover:opacity-0">
                    {category.category_name}
                  </div>

                  {/* Hover content - responsive text sizing */}
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-1 sm:px-2 md:px-3 lg:px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <h3 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold mb-1">
                      {category.category_name}
                    </h3>
                    <p className="text-[10px] sm:text-xs md:text-sm lg:text-base leading-relaxed hidden sm:block">
                      Explore our exclusive collection of {category.category_name}.
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}