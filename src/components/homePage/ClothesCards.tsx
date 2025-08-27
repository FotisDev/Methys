"use client";

import { supabase } from "../../_lib/supabaseClient";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { div } from "framer-motion/client";

interface Category {
  id: string;
  category_name: string;
  parent_id: string | null;
}

export default function ClotheCards() {
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<
    "subcategories" | "subsubcategories"
  >("subcategories");
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [subSubLoading, setSubSubLoading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const isOpen = activeCategory !== null;

  // Fetch main categories on mount
  useEffect(() => {
    console.log("🚀 Component mounted, fetching parents...");
    const fetchParents = async () => {
      setLoading(true);
      console.log("📡 Fetching parent categories from supabase...");
      const { data, error } = await supabase
        .from("categories")
        .select("id, category_name, parent_id")
        .is("parent_id", null);

      if (error) {
        console.error("❌ Error fetching parent categories:", error.message);
      } else {
        console.log("✅ Parent categories fetched:", data);
        setMainCategories(
          data.map((c) => ({
            id: String(c.id),
            category_name: c.category_name,
            parent_id: c.parent_id,
          }))
        );
      }

      // Analyze database structure
      console.log("🔍 ANALYZING DATABASE STRUCTURE...");
      const { data: allCategories } = await supabase
        .from("categories")
        .select("id, category_name, parent_id")
        .order("parent_id");

      if (allCategories) {
        console.log("📊 All categories:", allCategories);
        const hierarchy: Record<string, any[]> = {};
        allCategories.forEach((cat) => {
          const parentId = cat.parent_id?.toString() || "null";
          if (!hierarchy[parentId]) hierarchy[parentId] = [];
          hierarchy[parentId].push(cat);
        });
        console.log("🏗️ Category hierarchy:", hierarchy);

        const subCategoriesWithChildren = allCategories.filter(
          (cat) =>
            cat.parent_id !== null &&
            allCategories.some(
              (child) => child.parent_id?.toString() === cat.id?.toString()
            )
        );
        console.log(
          "🎯 Subcategories that have sub-subcategories:",
          subCategoriesWithChildren
        );

        if (subCategoriesWithChildren.length === 0) {
          console.log(
            "⚠️ NO SUB-SUBCATEGORIES FOUND! Your database only has 2 levels (main → sub)"
          );
          console.log(
            "💡 To test the functionality, you need to add categories with parent_id pointing to subcategory IDs"
          );
        }
      }

      setLoading(false);
    };

    fetchParents();
  }, []);

  // Click outside handler to close the menu
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        console.log("🖱️ Click outside detected, closing menu");
        setActiveCategory(null);
        setModalMode("subcategories");
        setSelectedSubCategory(null);
        setSubCategories([]);
        setSubSubCategories([]);
        setSubSubLoading(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handler);
      return () => {
        document.removeEventListener("mousedown", handler);
      };
    }
  }, [isOpen]);

  // fetch subs when opening a parent
  const handleParentOpen = async (parentId: string) => {
    console.log("🖱️ Opening parent category for ID:", parentId);
    console.log("📊 Current state before open:", {
      activeCategory,
      modalMode,
      selectedSubCategory,
    });

    setActiveCategory(parentId);
    setModalMode("subcategories");
    setSelectedSubCategory(null);
    setSubSubCategories([]);
    setSubSubLoading(false);

    const subcategories = await getSubcategories(parentId);
    setSubCategories(subcategories);

    console.log("📊 State after parent open:", {
      activeCategory: parentId,
      modalMode,
    });
  };

  // fetch subs
  const getSubcategories = async (parentId: string | number) => {
    console.log("📡 Fetching subcategories for parent:", parentId);
    const { data, error } = await supabase
      .from("categories")
      .select("id, category_name, parent_id")
      .eq("parent_id", parentId);

    if (error) {
      console.error("❌ Error fetching subcategories:", error.message);
      return [];
    } else {
      console.log("✅ Subcategories fetched:", data);
      return data.map((c) => ({
        id: String(c.id),
        category_name: c.category_name,
        parent_id: c.parent_id ? String(c.parent_id) : null,
      }));
    }
  };

  // fetch sub-subs
  const getSubSubcategories = async (subId: string) => {
    console.log("📡 Fetching sub-subcategories for sub:", subId);
    setSubSubLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("id, category_name, parent_id")
      .eq("parent_id", subId);

    if (error) {
      console.error("❌ Error fetching sub-subcategories:", error.message);
      setSubSubLoading(false);
      return [];
    } else {
      console.log("✅ Sub-subcategories fetched:", data);
      setSubSubLoading(false);
      return data.map((c) => ({
        id: String(c.id),
        category_name: c.category_name,
        parent_id: c.parent_id ? String(c.parent_id) : null,
      }));
    }
  };

  // Handle subcategory click - swap to sub-subcategories
  const handleSubClick = async (e: React.MouseEvent, sub: Category) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("🖱️ SUBCATEGORY CLICKED:", sub);
    console.log("Fetching children of sub.id:", sub.id);

    setSelectedSubCategory(sub);
    setModalMode("subsubcategories");
    setSubSubCategories([]);

    const subSubcategories = await getSubSubcategories(sub.id);
    console.log("✅ Sub-subcategories fetched:", subSubcategories);

    setSubSubCategories(subSubcategories);
  };

  // Handle back button click - return to subcategories view
  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("🖱️ Back button clicked!");
    console.log("🔄 Swapping back to subcategories mode...");
    setModalMode("subcategories");
    setSelectedSubCategory(null);
    setSubSubCategories([]);
    setSubSubLoading(false);
    console.log("📊 State after back click:", { modalMode: "subcategories" });
  };

  // Navigate only to sub-subcategories
  const handleNavigate = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🧭 Navigating to sub-subcategory:", id);
    router.push(`/categories/${id}`);
  };

  // Handle main category click - open if not open
  const handleMainCategoryClick = (e: React.MouseEvent, parentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🖱️ Main category clicked");
    if (activeCategory !== parentId) {
      handleParentOpen(parentId);
    }
  };

  console.log("🔄 Component render - Current state:", {
    activeCategory,
    modalMode,
    selectedSubCategory: selectedSubCategory?.category_name,
    subCategoriesCount: subCategories.length,
    subSubCategoriesCount: subSubCategories.length,
  });

  return (
    <div className="w-full">
      <div
        ref={cardRef}
        className="bg-white mt-28 relative mx-4 sm:mx-6 lg:mx-8 rounded shadow-md"
        style={{ minWidth: "300px" }}
      >
        {loading ? (
          <p className="p-4">Loading...</p>
        ) : (
          <div className="flex flex-col items-start gap-4 p-4 relative">
            {mainCategories.map((cat) => (
              <div
                key={cat.id}
                className="relative flex items-center"
                onMouseEnter={() => handleParentOpen(cat.id)}
              >
                <span
                  className="cursor-pointer text-gray-800 hover:text-black"
                  onClick={(e) => handleMainCategoryClick(e, cat.id)}
                >
                  {cat.category_name}
                </span>

                {/* Flyout showing subcategories or sub-subcategories */}
                {activeCategory === cat.id && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-48 bg-white border rounded-lg shadow-lg z-10 min-h-[200px]">
                    {/* Subcategories Mode */}
                    {modalMode === "subcategories" && (
                      <>
                        {console.log(
                          "🎨 Rendering subcategories mode with",
                          subCategories.length,
                          "items"
                        )}
                        {subCategories.map((sub) => (
                          <div key={sub.id} className="relative">
                            <div
                              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                              onClick={(e) => handleSubClick(e, sub)}
                            >
                              <span>{sub.category_name}</span>
                              <span className="text-gray-400 text-xs">→</span>
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Sub-subcategories Mode */}
                    {modalMode === "subsubcategories" && (
                      <>
                        {console.log(
                          "🎨 Rendering subsubcategories mode with",
                          subSubCategories.length,
                          "items"
                        )}

                        {/* Back button */}
                        <div
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 cursor-pointer border-b flex items-center gap-2"
                          onClick={handleBackClick}
                        >
                          <span>← Back</span>
                        </div>

                        {/* Sub-subcategories header */}
                        {selectedSubCategory && (
                          <div className="px-4 py-2 bg-gray-50 text-gray-800 font-medium text-sm border-b">
                            {selectedSubCategory.category_name}
                          </div>
                        )}

                        {/* Sub-subcategories list */}
                        {subSubLoading ? (
                          <div className="px-4 py-2 text-gray-500 text-sm">
                            Loading...
                          </div>
                        ) : subSubCategories.length > 0 ? (
                          subSubCategories.map((ss) => (
                            <div
                              key={ss.id}
                              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                              onClick={(e) => handleNavigate(e, ss.id)}
                            >
                              {ss.category_name}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500 text-sm">
                            No sub-subcategories found
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

