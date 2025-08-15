"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category, Database } from "@/_lib/types";

export default function ClothCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, category_name, image_url ")
        .order("category_name", { ascending: true });

      if (error) {
        console.log("Failed to fetch categories:", error.message);
        return;
      }

      setCategories(data || []);
    };

    fetchCategories();
  }, [supabase]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 [1278px]:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] xl:grid-cols-7 gap-4 p-6 bg-white font-poppins justify-items-center">
      {categories.map((category) => {
        const imageUrl = category.image_url
          ? `https://mpnjvzyymmtvgsrfgjjc.supabase.co/storage/v1/object/public/product-images${
              category.image_url.startsWith("/")
                ? category.image_url
                : "/" + category.image_url
            }`
          : "/AuthClothPhoto.jpg"; 

        return (
          <Link
            key={category.category_name}
            href={`/products/${category.category_name
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
            className="relative w-full max-w-[220px] aspect-[11/16] bg-gray-100 overflow-hidden rounded-[40px] group cursor-pointer shadow-amber-500 border-amber-500 border-b shadow-xl"
          >
            {/* Using Next.js Image component for optimized loading */}
            <div className="absolute inset-0 rounded-[40px] overflow-hidden">
              <Image
                src={imageUrl}
                alt={category.category_name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                quality={80}
                priority={false}
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 z-10 rounded-[40px] transition-opacity duration-700 group-hover:opacity-80"></div>

            {/* Category name */}
            <div className="absolute bottom-4 right-4 z-20 text-white text-[35px] [writing-mode:vertical-rl] font-bold transition-opacity duration-700 group-hover:opacity-0">
              {category.category_name}
            </div>

            {/* Hover content */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <h3 className="text-2xl font-bold mb-2">{category.category_name}</h3>
              <p className="text-sm">
                Explore our exclusive collection of {category.category_name}.
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}