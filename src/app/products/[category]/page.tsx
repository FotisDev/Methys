"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCategoryByName, getSubcategories, fetchProducts, Category, Product } from "@/_lib/helpers";
import { CategoryPageProps } from "@/_lib/interfaces";



export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedParams = use(params);
  const categoryName = resolvedParams.category.replace(/-/g, " ");

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        // Find the main category (Mens, Womens, Kids)
        const categoryData = await getCategoryByName(categoryName);
        
        if (!categoryData || categoryData.parent_id !== null) {
          throw new Error(`Main category "${categoryName}" not found`);
        }

        setCategory(categoryData);

        // Get subcategories (Clothes, Shoes, etc.)
        const subcategoriesData = await getSubcategories(categoryData.id);
        
        // Get products to extract images for subcategories
        const allProducts = await fetchProducts();
        
        // Map images to subcategories
        const subcategoriesWithImages = subcategoriesData.map(subcat => {
          const product = allProducts?.find(p => p.category_id === subcat.id);
          return {
            ...subcat,
            image_url: product?.image_url || " "
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        <p className="mt-4 text-lg">Loading subcategories...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="text-gray-600 mb-8">{error || `Category "${categoryName}" not found`}</p>
        <Link
          href="/products"
          className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600">
        <Link href="/products" className="hover:text-amber-600 transition-colors">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="capitalize font-medium">{category.category_name}</span>
      </nav>

      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 capitalize">
        {category.category_name}
      </h1>
      
      <p className="text-center text-gray-600 mb-12 text-lg">
        Choose a subcategory to explore our {category.category_name.toLowerCase()} collection
      </p>

      {subcategories.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-semibold mb-4">No subcategories found</h2>
          <p className="text-gray-600 mb-8">
            We're working on adding subcategories. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {subcategories.map((subcategory) => {
            const href = `/products/${resolvedParams.category}/${subcategory.category_name
              .replace(/\s+/g, "-")
              .toLowerCase()}`;

            return (
              <Link
                key={subcategory.id}
                href={href}
                className="group relative w-full aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* <div className="absolute inset-0">
                  <Image
                    src={subcategory.image_url ?? ''}
                    alt={`${subcategory.category_name} category`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div> */}
                 <div className="absolute inset-0 rounded-xl overflow-hidden">
                <img
                  src={subcategory.image_url ?? ''}
                  alt={`${subcategory.category_name} category image`}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
              </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg font-semibold capitalize mb-1">
                    {subcategory.category_name}
                  </h3>
                  <p className="text-sm text-gray-200">
                    Explore collection →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          href="/products"
          className="inline-block px-6 py-3 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
        >
          ← Back to all categories
        </Link>
      </div>
    </div>
  );
}