"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getCategoryByName,
  getSubcategories,
  fetchProducts,
  Category,
  Product,
} from "@/_lib/helpers";

export default function SubcategoryPage() {
  const params = useParams();
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [subSubcategories, setSubSubcategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sanitize and log parameters
  const categorySlug = params.category as string;
  const rawSubcategorySlug = params.subcategory as string;
  const categoryName = categorySlug.replace(/-/g, " ").toLowerCase().trim();
  const subcategoryName = rawSubcategorySlug
    .replace(/^\(\.\)/, "")
    .replace(/-/g, " ")
    .toLowerCase()
    .trim();
  const subcategorySlug = rawSubcategorySlug;
  console.log("Raw Params from useParams:", params);
  console.log("Processed Params:", {
    categorySlug,
    rawSubcategorySlug,
    categoryName,
    subcategoryName,
  });

  useEffect(() => {
    const loadSubcategoryData = async () => {
      try {
        console.log("Searching for parent category:", categoryName);
        const parentData = await getCategoryByName(categoryName);
        if (!parentData || parentData.parent_id !== null) {
          throw new Error(`Parent category "${categoryName}" not found`);
        }
        setParentCategory(parentData);

        console.log("Fetching subcategories under parent ID:", parentData.id);
        const subcategories = await getSubcategories(parentData.id);
        console.log(
          "Found subcategories with names:",
          subcategories.map((sub) => sub.category_name)
        );

        const currentData = subcategories.find(
          (subcat) =>
            subcat.category_name.toLowerCase().trim() === subcategoryName
        );
        if (!currentData) {
          console.log(
            "No exact match for subcategory. Available subcategories:",
            subcategories.map((sub) => sub.category_name)
          );
          throw new Error(
            `Subcategory "${subcategoryName}" not found under "${categoryName}"`
          );
        }
        setCurrentCategory(currentData);

        console.log("Fetching sub-subcategories for ID:", currentData.id);
        const subSubcategoriesData = await getSubcategories(currentData.id);

        console.log("Fetching all products for image mapping");
        const allProducts = await fetchProducts();

        const subSubcategoriesWithImages = subSubcategoriesData.map(
          (subsub) => {
            const product = allProducts?.find(
              (p) => p.category_id === subsub.id
            );
            return {
              ...subsub,
              image_url: product?.image_url || " ",
            };
          }
        );

        setSubSubcategories(subSubcategoriesWithImages);
      } catch (err) {
        console.error("Error loading subcategory data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    loadSubcategoryData();
  }, [categoryName, subcategoryName]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        <p className="mt-4 text-lg">Loading subcategories...</p>
      </div>
    );
  }

  if (error || !parentCategory || !currentCategory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Subcategory Not Found</h1>
        <p className="text-gray-600 mb-8">
          {error || `Subcategory "${subcategoryName}" not found`}
        </p>
        <Link
          href={`/products/${categorySlug}`}
          className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          Back to {categoryName}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600">
        <Link
          href="/products"
          className="hover:text-amber-600 transition-colors"
        >
          Products
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/products/${categorySlug}`}
          className="hover:text-amber-600 transition-colors capitalize"
        >
          {parentCategory.category_name}
        </Link>
        <span className="mx-2">/</span>
        <span className="capitalize font-medium">
          {currentCategory.category_name}
        </span>
      </nav>

      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 capitalize">
        {currentCategory.category_name}
      </h1>

      <p className="text-center text-gray-600 mb-12 text-lg">
        Choose a subcategory to explore our{" "}
        {currentCategory.category_name.toLowerCase()} collection
      </p>

      {subSubcategories.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-semibold mb-4">
            No subcategories found
          </h2>
          <p className="text-gray-600 mb-8">
            We're working on adding subcategories. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subSubcategories.map((subsubcategory) => {
            const href = `/products/${categorySlug}/${subcategorySlug}/${subsubcategory.category_name
              .replace(/\s+/g, "-")
              .toLowerCase()}`;

            return (
              <Link
                key={subsubcategory.id}
                href={href}
                className="group relative w-full aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0">
                  <img
                    src={subsubcategory.image_url ?? ""}
                    alt={subsubcategory.category_name}
                    className="object-cover w-full h-full rounded-2xl group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-semibold capitalize mb-1">
                    {subsubcategory.category_name}
                  </h3>
                  <p className="text-sm text-gray-200">Explore collection →</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          href={`/products/${categorySlug}`}
          className="inline-block px-6 py-3 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
        >
          ← Back to {parentCategory.category_name}
        </Link>
      </div>
    </div>
  );
}
