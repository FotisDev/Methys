"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getCategoryByName,
  getSubcategories,
  fetchProducts,
  CategoryBackendType,
} from "@/_lib/helpers";
import { CategoryPageProps } from "@/_lib/interfaces";

export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<CategoryBackendType | null>(null);
  const [subcategories, setSubcategories] = useState<CategoryBackendType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedParams = use(params);
  const categoryName = resolvedParams.category.replace(/-/g, " ");

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        const categoryData = await getCategoryByName(categoryName);

        if (!categoryData || categoryData.parent_id !== null) {
          throw new Error(`Main category "${categoryName}" not found`);
        }

        setCategory(categoryData);

        const subcategoriesData = await getSubcategories(categoryData.id);

        const allProducts = await fetchProducts();

        const subcategoriesWithImages = subcategoriesData.map((subcat) => {
          const product = allProducts?.find(
            (p) => p.category_men_id === subcat.id
          );
          return {
            ...subcat,
            image_url: product?.image_url ?? '/AuthClothPhoto.jpg',
          };
        });

        setSubcategories(subcategoriesWithImages);
      } catch (err) {
        console.error("Error loading category data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryData();
  }, [categoryName]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vintage-green"></div>
        <p className="mt-4 text-lg">Loading subcategories...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-gray-600 mb-8">
          {error || `Category "${categoryName}" not found`}
        </p>
        <Link
          href="/products"
          className="px-6 py-3 rounded-lg hover-colors"
        >
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 font-roboto text-vintage-green">
      <nav className="mb-8 text-sm ">
        <Link
          href="/products"
          className="hover:text-vintage-brown transition-colors"
        >
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="hover:text-vintage-brown cursor-pointer ">{category.name}</span>
      </nav>

      {subcategories.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl  mb-4">
            No subcategories found
          </h2>
          <p className="  mb-8">
            We are working on adding subcategories. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subcategories.map((subcategory) => {
            const href = `/products/${
              resolvedParams.category
            }/${subcategory.name.replace(/\s+/g, "-").toLowerCase()}`;

            return (
              <Link
                key={subcategory.id}
                href={href}
                className="group relative w-full aspect-[3/4] bg-vintage-green rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0">
                  <Image
                    src={subcategory.image_url?? '/AuthClothPhoto.jpg'}
                    alt={`${subcategory.name} category image`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-vintage-green/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-vintage-brown">
                  <h3 className="text-lg  mb-1">
                    {subcategory.name}
                  </h3>
                  <p className="text-sm text-vintage-brown">Explore collection →</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          href="/products"
          className="inline-block px-6 py-3 text-sm hover-colors rounded"
        >
          ← Back to all categories
        </Link>
      </div>
    </div>
  );
}
