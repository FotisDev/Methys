"use client";

import { supabase } from "../../_lib/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  category_name: string;
  parent_id: string | null;
}

export default function DropDownMenu() {
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<Category[]>([]);
  const [modalMode, setModalMode] = useState<
    "main" | "subcategories" | "subsubcategories"
  >("main");
  const [selectedMainCategory, setSelectedMainCategory] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Helper function to convert category name to URL slug
  const toSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  // Fetch main categories on mount
  useEffect(() => {
    const fetchParents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("id, category_name, parent_id")
        .is("parent_id", null);

      if (!error && data) {
        setMainCategories(
          data.map((c) => ({
            id: String(c.id),
            category_name: c.category_name,
            parent_id: c.parent_id,
          }))
        );
      }
      setLoading(false);
    };

    fetchParents();
  }, []);

  // fetch subs
  const getSubcategories = async (parentId: string) => {
    const { data, error } = await supabase
      .from("categories")
      .select("id, category_name, parent_id")
      .eq("parent_id", parentId);

    if (error) return [];
    return data.map((c) => ({
      id: String(c.id),
      category_name: c.category_name,
      parent_id: c.parent_id ? String(c.parent_id) : null,
    }));
  };

  // handle clicks
  const handleMainClick = async (cat: Category) => {
    const subs = await getSubcategories(cat.id);
    setSubCategories(subs);
    setSelectedMainCategory(cat);
    setModalMode("subcategories");
  };

  const handleSubClick = async (cat: Category) => {
    const subs = await getSubcategories(cat.id);
    setSubSubCategories(subs);
    setSelectedSubCategory(cat);
    setModalMode("subsubcategories");
  };

  const handleNavigate = (subSubCategory: Category) => {
    // Build the full path: /products/{main-category}/{sub-category}/{sub-sub-category}
    if (selectedMainCategory && selectedSubCategory) {
      const mainSlug = toSlug(selectedMainCategory.category_name);
      const subSlug = toSlug(selectedSubCategory.category_name);
      const subSubSlug = toSlug(subSubCategory.category_name);
      
      const fullPath = `/products/${mainSlug}/${subSlug}/${subSubSlug}`;
      router.push(fullPath);
    }
  };

  const handleBack = () => {
    if (modalMode === "subsubcategories") {
      setModalMode("subcategories");
      setSubSubCategories([]);
      setSelectedSubCategory(null);
    } else if (modalMode === "subcategories") {
      setModalMode("main");
      setSubCategories([]);
      setSelectedMainCategory(null);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white mt-28 relative mx-4 sm:mx-6 lg:mx-8 rounded shadow-md p-4 min-w-[300px]">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {modalMode === "main" && (
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-gray-800 mb-2">Select Category</h3>
                {mainCategories.map((cat) => (
                  <button
                    key={cat.id}
                    className="text-left py-2 px-3 rounded hover:bg-gray-100 transition-colors"
                    onClick={() => handleMainClick(cat)}
                  >
                    {cat.category_name}
                  </button>
                ))}
              </div>
            )}

            {modalMode === "subcategories" && (
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Select Subcategory in {selectedMainCategory?.category_name}
                </h3>
                {subCategories.length > 0 ? (
                  subCategories.map((sub) => (
                    <button
                      key={sub.id}
                      className="text-left py-2 px-3 rounded hover:bg-gray-100 transition-colors"
                      onClick={() => handleSubClick(sub)}
                    >
                      {sub.category_name}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">No subcategories available</p>
                )}
              </div>
            )}

            {modalMode === "subsubcategories" && (
              <div className="flex flex-col gap-3">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Select Product Type in {selectedSubCategory?.category_name}
                </h3>
                {subSubCategories.length > 0 ? (
                  subSubCategories.map((subsub) => (
                    <button
                      key={subsub.id}
                      className="text-left py-2 px-3 rounded hover:bg-gray-100 transition-colors"
                      onClick={() => handleNavigate(subsub)}
                    >
                      {subsub.category_name}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">No product types available</p>
                )}
              </div>
            )}

            {/* Back button */}
            {modalMode !== "main" && (
              <button
                onClick={handleBack}
                className="mt-6 w-full py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
              >
                ← Back
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}