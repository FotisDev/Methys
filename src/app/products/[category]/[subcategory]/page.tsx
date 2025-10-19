"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getCategoryByName,
  getSubcategories,
  fetchProducts,
  CategoryBackendType,
  Product,
} from "@/_lib/helpers";

export default function SubcategoryPage() {
  const params = useParams();
  const [parentCategory, setParentCategory] =
    useState<CategoryBackendType | null>(null);
  const [currentCategory, setCurrentCategory] =
    useState<CategoryBackendType | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sanitize and decode parameters
  const categorySlug = decodeURIComponent(params.category as string);
  const rawSubcategorySlug = decodeURIComponent(params.subcategory as string);
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
          subcategories.map((sub) => sub.name)
        );

        // Better matching logic that handles special characters
        // Better matching logic that handles special characters
        const currentData = subcategories.find(
          (subcat) =>
            (subcat.slug && subcat.slug === subcategorySlug) || // Match by slug first
            subcat.name.toLowerCase().trim() === subcategoryName || // Then by exact name match
            (subcat.slug &&
              decodeURIComponent(subcat.slug) === subcategorySlug) || // Match decoded slug
            subcat.name.toLowerCase().includes(subcategoryName) || // Partial name match
            subcategoryName.includes(subcat.name.toLowerCase()) // Reverse partial match
        );

        if (!currentData) {
          console.log(
            "No exact match for subcategory. Available subcategories:",
            subcategories.map((sub) => sub.name)
          );
          throw new Error(
            `Subcategory "${subcategoryName}" not found under "${categoryName}"`
          );
        }
        setCurrentCategory(currentData);

        console.log("Fetching products for subcategory ID:", currentData.id);
        const allProducts = await fetchProducts();

        // Filter products that belong to this subcategory
        const subcategoryProducts =
          allProducts?.filter(
            (product) => product.category_men_id === currentData.id
          ) || [];

        console.log(
          `Found ${subcategoryProducts.length} products for subcategory "${currentData.name}"`
        );
        setProducts(subcategoryProducts);
      } catch (err) {
        console.error("Error loading subcategory data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    loadSubcategoryData();
  }, [categoryName, subcategoryName, subcategorySlug]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        <p className="mt-4 text-lg">Loading products...</p>
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
          href={`/products/${encodeURIComponent(categorySlug)}`}
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
          href={`/products/${encodeURIComponent(categorySlug)}`}
          className="hover:text-amber-600 transition-colors capitalize"
        >
          {parentCategory.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="capitalize font-medium">{currentCategory.name}</span>
      </nav>

      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 capitalize">
        {currentCategory.name}
      </h1>

      <p className="text-center text-gray-600 mb-12 text-lg">
        Discover our collection of {currentCategory.name.toLowerCase()} products
      </p>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-semibold mb-4">No products found</h2>
          <p className="text-gray-600 mb-8">
            We are working on adding products to this category. Check back soon!
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 text-center">
            <span className="text-gray-600">
              Showing {products.length}{" "}
              {products.length === 1 ? "product" : "products"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative w-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={product.image_url || "/AuthClothPhoto.jpg"}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/AuthClothPhoto.jpg";
                    }}
                    fill
                    unoptimized
                  />

                  {/* Price badge */}
                  {product.price && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                      ${product.price}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 capitalize">
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      {product.price && (
                        <span className="text-xl font-bold text-amber-600">
                          ${product.price}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/products/${encodeURIComponent(
                        categorySlug
                      )}/${encodeURIComponent(
                        subcategorySlug
                      )}/${encodeURIComponent(product.slug)}`}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="text-center mt-12">
        <Link
          href={`/products/${encodeURIComponent(categorySlug)}`}
          className="inline-block px-6 py-3 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
        >
          ← Back to {parentCategory.name}
        </Link>
      </div>
    </div>
  );
}
