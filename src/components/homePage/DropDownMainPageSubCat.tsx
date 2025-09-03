"use client";

import { supabase } from "@/_lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

interface MainCategory {
  id: string;
  name: string;
  subcategories: Category[];
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
          .select("id, name, parent_id")
          .order("parent_id", { ascending: true })
          .order("name", { ascending: true });

        if (error) {
          console.error("Error fetching categories:", error);
          return;
        }

        if (data) {
          console.log("Fetched data:", data); // Debug log

          // Separate main categories (parent_id is null) and subcategories
          const mainCats = data.filter(cat => cat.parent_id === null);
          const subCats = data.filter(cat => cat.parent_id !== null);

          console.log("Main categories:", mainCats); // Debug log
          console.log("Sub categories:", subCats); // Debug log

          // Organize subcategories under their main categories
          const organizedCategories = mainCats.map(mainCat => ({
            id: String(mainCat.id),
            name: mainCat.name,
            subcategories: subCats
              .filter(subCat => subCat.parent_id === mainCat.id)
              .map(subCat => ({
                id: String(subCat.id),
                name: subCat.name,
                parent_id: String(subCat.parent_id),
              }))
          }));

          console.log("Organized categories:", organizedCategories); // Debug log
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
    <div className="fixed left-0 right-0 w-screen bg-white z-50 ">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
          {mainCategories.map((mainCat) => (
            <div key={mainCat.id} className="flex flex-col items-center">
              {/* Main Category Header */}
              <h3 className="font-semibold text-gray-800 mb-4 text-lg capitalize">
                {mainCat.name}
              </h3>
              
              {/* Subcategories */}
              <div className="flex flex-col items-center ">
                {mainCat.subcategories.length > 0 ? (
                  mainCat.subcategories.map((subCat) => (
                    <button
                      key={subCat.id}
                      className="px-4 py-1 font-mono text-gray-700 text-sm hover:text-gray-900 hover:underline transition-colors whitespace-nowrap capitalize"
                      onClick={() => handleNavigate(subCat, mainCat.name)}
                    >
                      {subCat.name}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No subcategories</p>
                )}
              </div>
            </div>
          ))}
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