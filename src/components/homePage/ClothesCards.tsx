"use client";

import { supabase } from "@/_lib/supabaseClient";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export interface Category {
  id: string; // string αντί για number
  category_name: string;
  image_url: string;
}

function ClotheCards() {
  const [isOpen, setIsOpen] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select(`
      id,
      category_name,
      products!inner(
        id,
        image_url
      )
    `);

      if (error) {
        console.error("Failed to fetch categories:", error.message);
        return;
      }

      if (!data) {
        console.warn("No categories found");
        setCategories([]);
        return;
      }

      const categoriesWithImages: Category[] = (data ?? []).map((cat) => ({
        id: String(cat.id), // <-- εδώ το μετατρέπουμε σε string
        category_name: cat.category_name,
        image_url:
          cat.products?.[0]?.image_url || "/images/default-category.jpg",
      }));
      setCategories(categoriesWithImages);

      setCategories(categoriesWithImages);
    };

    fetchCategories();
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={cardRef}
      className="bg-white mt-28 relative mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-auto max-w-auto rounded"
    >
      {categories.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-600 text-lg">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/${
                category.category_name?.toLowerCase().replace(/\s+/g, "-") || ""
              }`}
              className="group relative w-full aspect-[3/4] bg-gray-100 rounded sm:rounded-2xl lg:rounded-3xl xl:rounded-[20px] overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl lg:rounded-3xl xl:rounded-[20px] overflow-hidden"></div>
              <div className="absolute inset-0 bg-black/50 z-10 rounded-xl sm:rounded-2xl lg:rounded-3xl xl:rounded-[20px] transition-opacity duration-700 group-hover:opacity-80"></div>
              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 md:bottom-3 md:right-3 lg:bottom-4 lg:right-4 z-20 text-white text-lg font-bold [writing-mode:vertical-rl] transition-opacity duration-700 group-hover:opacity-0">
                {category.category_name}
              </div>
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <h3 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold mb-1">
                  {category.category_name}
                </h3>
                <p className="text-[10px] sm:text-xs md:text-sm lg:text-base leading-relaxed hidden sm:block">
                  Explore our exclusive collection of {category.category_name}.
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClotheCards;
