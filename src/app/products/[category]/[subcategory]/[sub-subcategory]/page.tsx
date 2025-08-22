"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchProducts, getCategoryByName, getSubcategories, Product } from "@/_lib/helpers";

export default function SubSubcategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sanitize parameters
  const categorySlug = params.category as string;
  const subcategorySlug = params.subcategory as string;
  const subsubcategorySlug = params["sub-subcategory"] as string;
  const categoryName = categorySlug.replace(/-/g, " ").toLowerCase().trim();
  const subcategoryName = subcategorySlug
    .replace(/-/g, " ")
    .toLowerCase()
    .trim();
  const subsubcategoryName = subsubcategorySlug
    .replace(/-/g, " ")
    .toLowerCase()
    .trim();

useEffect(() => {
  const loadProducts = async () => {
    try {
      const allProducts = await fetchProducts();
      console.log("All products fetched:", JSON.stringify(allProducts, null, 2));

      const categoryName = categorySlug.replace(/-/g, " ").toLowerCase().trim();
      const subcategoryName = subcategorySlug.replace(/-/g, " ").toLowerCase().trim();
      const subsubcategoryName = decodeURIComponent(subsubcategorySlug)
        .replace(/-/g, " ")
        .toLowerCase()
        .trim();

      console.log("Processed params:", {
        categoryName,
        subcategoryName,
        subsubcategoryName,
      });

      if (!allProducts || allProducts.length === 0) {
        throw new Error("No products fetched");
      }

      // Fetch top-level category (e.g., "mens")
      const parentCategory = await getCategoryByName(categoryName);
      if (!parentCategory || parentCategory.parent_id !== null) {
        throw new Error(`Parent category "${categoryName}" not found`);
      }
      const categoryId = parentCategory.id;

      // Fetch subcategories under the parent category (e.g., "clothes")
      const subcategories = await getSubcategories(categoryId);
      const currentSubcategory = subcategories.find(
        (subcat) => subcat.category_name.toLowerCase().trim() === subcategoryName
      );
      if (!currentSubcategory) {
        throw new Error(`Subcategory "${subcategoryName}" not found`);
      }
      const subcategoryId = currentSubcategory.id;

      // Fetch sub-subcategories under the subcategory (e.g., "shirts")
      const subSubcategories = await getSubcategories(subcategoryId);
      const currentSubSubcategory = subSubcategories.find(
        (subsub) => subsub.category_name.toLowerCase().trim() === subsubcategoryName
      );
      if (!currentSubSubcategory) {
        throw new Error(`Sub-subcategory "${subsubcategoryName}" not found`);
      }
      const subsubcategoryId = currentSubSubcategory.id;

      console.log("Resolved IDs:", { categoryId, subcategoryId, subsubcategoryId });

      // Filter products where category_id matches the sub-subcategory ID
      const filteredProducts = allProducts.filter(
        (product) => product.category_id === subsubcategoryId
      );

      console.log("Filtered products by subsubcategory ID:", filteredProducts);

      if (filteredProducts.length === 0) {
        throw new Error(`No products found for ${subsubcategoryName}`);
      }
      setProducts(filteredProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  loadProducts();
}, [categorySlug, subcategorySlug, subsubcategorySlug]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        <p className="mt-4 text-lg">Loading products...</p>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Products Not Found</h1>
        <p className="text-gray-600 mb-8">
          {error || `No products found for ${subsubcategoryName}`}
        </p>
        <Link
          href={`/products/${categorySlug}/${subcategorySlug}`}
          className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          Back to {subcategoryName}
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
          {categoryName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/products/${categorySlug}/${subcategorySlug}`}
          className="hover:text-amber-600 transition-colors capitalize"
        >
          {subcategoryName}
        </Link>
        <span className="mx-2">/</span>
        <span className="capitalize font-medium">{subsubcategoryName}</span>
      </nav>

      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 capitalize">
        {subsubcategoryName}
      </h1>

      <p className="text-center text-gray-600 mb-12 text-lg">
        All {subsubcategoryName} products in {subcategoryName} for{" "}
        {categoryName}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${categorySlug}/${subcategorySlug}/${subsubcategorySlug}/${product.slug}`}
            className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-amber-200 cursor-pointer"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={product.image_url || ""}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold capitalize mb-2 group-hover:text-amber-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-xl font-bold text-amber-600">€{product.price}</p>
              {product.description && (
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
              )}
              
              {/* Visual indicator that it's clickable */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-500 group-hover:text-amber-600 transition-colors">
                  View Details
                </span>
                <span className="text-gray-400 group-hover:text-amber-600 transition-colors">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href={`/products/${categorySlug}/${subcategorySlug}`}
          className="inline-block px-6 py-3 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors"
        >
          ← Back to {subcategoryName}
        </Link>
      </div>
    </div>
  );
}