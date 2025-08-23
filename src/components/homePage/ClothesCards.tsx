"use client";

import { supabase } from "@/_lib/supabaseClient";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export interface Category {
  id: string;
  category_name: string;
}

function ClotheCards() {
  const [isOpen, setIsOpen] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, category_name")
        .is("parent_id", null); // Fetch only parent categories

      if (error) {
        console.error("Failed to fetch parent categories:", error.message);
        return;
      }

      if (!data) {
        console.warn("No parent categories found");
        setCategories([]);
        return;
      }

      const parentCategories: Category[] = (data ?? []).map((cat) => ({
        id: String(cat.id),
        category_name: cat.category_name,
      }));
      setCategories(parentCategories);
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/${
                category.category_name?.toLowerCase().replace(/\s+/g, "-") || ""
              }`}
              className="group relative w-full p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300"
            >
              <div className="flex items-center justify-center h-full">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 group-hover:text-gray-900">
                  {category.category_name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClotheCards;