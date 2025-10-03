"use client";

import { supabase } from "@/_lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

interface MainCategory {
  id: string;
  name: string;
  subcategories: Category[];
  image_url?: string | null;
}

export default function DropDownMainPageSubCat() {
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Helper function to convert category name to URL slug
  const toSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  // Fetch all categories and organize them by main categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // Fetch all categories from categoriesformen table
        const { data, error } = await supabase
          .from("categoriesformen")
          .select("id, name, parent_id,image_url")
          .order("parent_id", { ascending: true })
          .order("name", { ascending: true });

        if (error) {
          console.error("Error fetching categories:", error);
          return;
        }

        if (data) {
          // Separate main categories (parent_id is null) and subcategories
          const mainCats = data.filter((cat) => cat.parent_id === null);
          const subCats = data.filter((cat) => cat.parent_id !== null);

          // Organize subcategories under their main categories
          const organizedCategories = mainCats.map((mainCat) => ({
            id: String(mainCat.id),
            name: mainCat.name,
            image_url: mainCat.image_url,
            subcategories: subCats
              .filter((subCat) => subCat.parent_id === mainCat.id)
              .map((subCat) => ({
                id: String(subCat.id),
                name: subCat.name,
                parent_id: String(subCat.parent_id),
              })),
          }));
          setMainCategories(organizedCategories);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle navigation for subcategories
  const handleNavigate = (subcategory: Category, mainCategoryName: string) => {
    const mainCategorySlug = toSlug(mainCategoryName);
    const subcategorySlug = toSlug(subcategory.name);
    const fullPath = `/products/${mainCategorySlug}/${subcategorySlug}`;
    router.push(fullPath);
  };

  if (loading) {
    return (
      <div className="fixed left-0 right-0 w-screen bg-white z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <p>Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 right-0 w-screen items-start justify-start bg-white z-50 ">
      <div className="w-full py-2">
        <div className="mt-10 flex flex-col sm:flex-row gap-12 items-start">
          {/* Left side links column */}
          <div className="flex flex-col space-y-3 min-w-[200px] pl-8">
            <Link
              href="/offers"
              className="text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors uppercase tracking-wide"
            >
              See Our Offers
            </Link>
            <Link
              href="/online-exclusive"
              className="text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors uppercase tracking-wide"
            >
              Online Exclusive
            </Link>
            <Link
              href="/autumn-2025"
              className="text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors uppercase tracking-wide"
            >
              Autumn 2025
            </Link>
          </div>

          {/* Categories columns */}
          <div className="flex flex-1 gap-8 justify-center">
          {mainCategories.map((mainCat) => {
            let href = "#";

            if (mainCat.name.toLowerCase() === "clothing") {
              href = "/products/clothing";
            } else if (mainCat.name.toLowerCase() === "accessories") {
              href = "/products/accessories";
            }

            return (
              <div key={mainCat.id} className="flex flex-col">
                {/* Main Category Header */}
                <h3 className="font-semibold text-gray-800 mb-4 text-lg capitalize">
                  {mainCat.name}
                </h3>

                {/* Subcategories */}
                <div className="flex flex-col items-start mb-4">
                  {mainCat.subcategories.length > 0 ? (
                    mainCat.subcategories.map((subCat) => (
                      <button
                        key={subCat.id}
                        className=" py-1 font-mono text-gray-700 text-sm hover:text-gray-900 hover:underline transition-colors whitespace-nowrap capitalize"
                        onClick={() => handleNavigate(subCat, mainCat.name)}
                      >
                        {subCat.name}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No subcategories</p>
                  )}
                </div>

                {/* Category Image */}
                {mainCat.image_url && (
                  <Link href={href}>
                    <img
                      src={mainCat.image_url}
                      alt={mainCat.name}
                      className="w-full h-60 object-cover  shadow-md cursor-pointer hover:opacity-90 transition"
                    />
                  </Link>
                )}
              </div>
            );
          })}
          </div>
        </div>
        {mainCategories.length === 0 && (
          <div className="text-center">
            <p className="text-gray-500">No categories available</p>
          </div>
        )}
      </div>
    </div>
  );
}