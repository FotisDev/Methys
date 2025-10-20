"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  fetchCategories,
  fetchProducts,
  CategoryBackendType,
  Product,
} from "@/_lib/helpers";
import Footer from "@/components/footer/Footer";

// Debug component

export default function ProductList() {
  const [categories, setCategories] = useState<CategoryBackendType[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const mappedCategories: CategoryBackendType[] = categoriesData.map(
          (cat) => {
            const product = productsData.find(
              (p) => p.category_men_id === cat.id
            );
            return {
              ...cat,
              image_url: product?.image_url,
              parent_id: cat.parent_id ?? null,
            };
          }
        );
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

  const parentCategories = useMemo(() => {
    return (
      categories?.filter(
        (c) =>
          [1, 2, 30].includes(c.id) &&
          (c.parent_id === null || c.parent_id === undefined)
      ) || []
    );
  }, [categories]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-vintage-green font-poppins">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 "></div>
        <p className="mt-4 text-lg">Loading categories...</p>
      </div>
    );
  }

  if (error || !categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-vintage-green font-poppins text-xl">
        <p>{error || "No categories found."}</p>
        <Link
          href="/"
          className="mt-4 px-4 py-2 text-sm font-medium text-vintage-green rounded-lg  transition-colors"
        >
          Back to homepage
        </Link>
      </div>
    );
  }

  return (
    <section className="padding-y text-vintage-green font-roboto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {parentCategories.map((category) => {
          if (!category.name) return null;

          const href = `/products/${category.name
            .replace(/\s+/g, "-")
            .toLowerCase()}`;
          const imageUrl = category.image_url ?? "/accesories.jpg ";

          return (
            <Link
              key={category.id}
              href={href}
              className="group relative w-full aspect-[3/4] bg-vintage-green rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label={`View ${category.name} subcategories`}
            >
              <div className="absolute inset-0 rounded-xl overflow-hidden ">
                <Image
                  src={imageUrl}
                  alt={`${category.name} category image`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                 
                />
              </div>

              <span className="absolute bottom-2 left-2 px-3 py-1 hover-colors rounded-md capitalize text-sm ">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/"
          className="inline-block px-4 py-2 text-sm hover-colors rounded"
        >
          Back to homepage
        </Link>
      </div>
      <Footer/>
    </section>
    
  );
}
