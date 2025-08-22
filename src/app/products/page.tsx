"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  fetchCategories,
  fetchProducts,
  Category,
  Product,
} from "@/_lib/helpers";

// Debug component
const DebugInfo = ({
  categories,
  parentCategories,
}: {
  categories: Category[];
  parentCategories: Category[];
}) => {
  if (process.env.NODE_ENV !== "development") return null;
  console.log("parentCat", parentCategories);
  return (
    <details className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded text-sm">
      <summary className="cursor-pointer font-semibold">Debug Info</summary>
      <p>Total categories: {categories.length}</p>
      <p>Parent categories: {parentCategories.length}</p>
      <p>
        Parent categories with names:{" "}
        {parentCategories.filter((c) => c.category_name).length}
      </p>
      <p>
        Parent categories with images:{" "}
        {parentCategories.filter((c) => c.image_url).length}
      </p>
    </details>
  );
};

export default function ProductList() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories and products
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        if (!categoriesData) {
          throw new Error("No categories data returned");
        }
        console.debug("Fetched categories:", categoriesData);

        let productsData: Product[] = [];
        try {
          const products = await fetchProducts();
          if (products) {
            productsData = products;
            console.debug("Fetched products:", productsData);
          } else {
            console.warn("No products data returned, using empty array");
          }
        } catch (err) {
          console.error("Error fetching products:", err);
          console.warn("Using empty products array as fallback");
        }

        // Map image_url from products
        const mappedCategories: Category[] = categoriesData.map((cat) => {
          const product = productsData.find((p) => p.category_id === cat.id);
          return {
            ...cat,
            image_url: product?.image_url || " ",
            parent_id: cat.parent_id ?? null,
          };
        });
        console.log(mappedCategories);

        setCategories(mappedCategories);
      } catch (err) {
        console.error("Fetch categories failed:", err);
        setError(
          `Failed to load categories: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Memoize parent categories (Mens:1, Womens:51, Kids:101)
  const parentCategories = useMemo(() => {
    return (
      categories?.filter(
        (c) =>
          [1, 51, 101].includes(c.id) &&
          (c.parent_id === null || c.parent_id === undefined)
      ) || []
    );
  }, [categories]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700 font-poppins">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        <p className="mt-4 text-lg">Loading categories...</p>
      </div>
    );
  }

  if (error || !categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-700 font-poppins text-xl">
        <p>{error || "No categories found."}</p>
        <Link
          href="/"
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
        >
          Back to homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 text-gray-800 font-poppins">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-8">
        Product Categories
      </h2>

      <DebugInfo categories={categories} parentCategories={parentCategories} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {parentCategories.map((category) => {
          if (!category.category_name) return null;

          const href = `/products/${category.category_name
            .replace(/\s+/g, "-")
            .toLowerCase()}`;
          const imageUrl = category.image_url ?? " ";

          return (
            <Link
              key={category.id}
              href={href}
              className="group relative w-full aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label={`View ${category.category_name} subcategories`}
            >
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <img
                  src={imageUrl ?? ""}
                  alt={`${category.category_name} category image`}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <span className="absolute bottom-2 left-2 px-3 py-1 text-white bg-gray-900/70 rounded-md capitalize text-sm font-medium">
                {category.category_name}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/"
          className="inline-block px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
        >
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
