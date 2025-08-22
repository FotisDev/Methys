"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Product, 
  getCategoryByName, 
  getSubcategories, 
  fetchProductBySlug, 
  getValidImage 
} from "@/_lib/helpers";

interface ProductDetailPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
    "sub-subcategory": string;
    slug: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [categoryPath, setCategoryPath] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedParams = use(params);
  const { category, subcategory, slug } = resolvedParams;
  const subsubcategory = resolvedParams["sub-subcategory"];

  console.log("Product Detail Page - Raw params:", { category, subcategory, subsubcategory, slug });

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Process parameter names
        const categoryName = category.replace(/-/g, " ").toLowerCase().trim();
        const subcategoryName = subcategory.replace(/-/g, " ").toLowerCase().trim();
        const subsubcategoryName = subsubcategory.replace(/-/g, " ").toLowerCase().trim();

        console.log("Loading individual product:", {
          categoryName,
          subcategoryName,
          subsubcategoryName,
          slug
        });

        // Find parent category (e.g., "mens")
        const parentCategory = await getCategoryByName(categoryName);
        if (!parentCategory || parentCategory.parent_id !== null) {
          throw new Error(`Parent category "${categoryName}" not found`);
        }

        // Find subcategory (e.g., "clothes")
        const subcategories = await getSubcategories(parentCategory.id);
        const currentSubcategory = subcategories.find(
          (subcat) => subcat.category_name.toLowerCase().trim() === subcategoryName
        );
        if (!currentSubcategory) {
          throw new Error(`Subcategory "${subcategoryName}" not found`);
        }

        // Find sub-subcategory (e.g., "shirts")
        const subSubcategories = await getSubcategories(currentSubcategory.id);
        const currentSubSubcategory = subSubcategories.find(
          (subsub) => subsub.category_name.toLowerCase().trim() === subsubcategoryName
        );
        if (!currentSubSubcategory) {
          throw new Error(`Sub-subcategory "${subsubcategoryName}" not found`);
        }

        // Set category path for breadcrumbs
        setCategoryPath([
          parentCategory.category_name,
          currentSubcategory.category_name,
          currentSubSubcategory.category_name
        ]);

        console.log("Found category IDs:", {
          parentId: parentCategory.id,
          subcategoryId: currentSubcategory.id,
          subsubcategoryId: currentSubSubcategory.id
        });

        // Fetch the specific product by slug and category ID
        const productData = await fetchProductBySlug(currentSubSubcategory.id, slug);
        if (!productData) {
          throw new Error(`Product with slug "${slug}" not found in ${subsubcategoryName}`);
        }

        console.log("Found product:", productData);
        setProduct(productData);
      } catch (err) {
        console.error("Error loading product:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [category, subcategory, subsubcategory, slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
        <p className="mt-4 text-lg">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">{error || `Product "${slug}" not found`}</p>
        <Link
          href={`/products/${category}/${subcategory}/${subsubcategory}`}
          className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
        >
          Back to {categoryPath[2] || subsubcategory.replace(/-/g, " ")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="mb-8 text-sm text-gray-600">
        <Link href="/products" className="hover:text-amber-600 transition-colors">
          Products
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/products/${category}`}
          className="hover:text-amber-600 transition-colors capitalize"
        >
          {categoryPath[0] || category.replace(/-/g, " ")}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/products/${category}/${subcategory}`}
          className="hover:text-amber-600 transition-colors capitalize"
        >
          {categoryPath[1] || subcategory.replace(/-/g, " ")}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/products/${category}/${subcategory}/${subsubcategory}`}
          className="hover:text-amber-600 transition-colors capitalize"
        >
          {categoryPath[2] || subsubcategory.replace(/-/g, " ")}
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={getValidImage(product.image_url)}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {product.is_offer && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-2 rounded-lg">
                SPECIAL OFFER
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-amber-600">
                €{product.price}
              </span>
              {product.is_offer && (
                <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                  On Sale
                </span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Product Info */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{categoryPath.join(" → ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Product ID:</span>
                <span className="font-medium">#{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Slug:</span>
                <span className="font-medium">{product.slug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Added:</span>
                <span className="font-medium">
                  {new Date(product.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-6">
            <button className="w-full bg-amber-500 text-white font-semibold py-4 px-8 rounded-lg hover:bg-amber-600 transition-colors duration-200 text-lg">
              Add to Cart
            </button>
            <button className="w-full border-2 border-amber-500 text-amber-500 font-semibold py-4 px-8 rounded-lg hover:bg-amber-50 transition-colors duration-200 text-lg">
              Add to Wishlist
            </button>
          </div>

          {/* Back Navigation */}
          <div className="pt-6 border-t">
            <Link
              href={`/products/${category}/${subcategory}/${subsubcategory}`}
              className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium transition-colors"
            >
              ← Back to {categoryPath[2] || subsubcategory.replace(/-/g, " ")}
            </Link>
          </div>
        </div>
      </div>

      {/* Debug info */}
      <div className="mt-16 p-4 bg-gray-100 rounded-lg text-xs text-gray-600">
        <h4 className="font-bold mb-2">Debug Info:</h4>
        <p>URL Params: category={category}, subcategory={subcategory}, sub-subcategory={subsubcategory}, slug={slug}</p>
        <p>Category Path: {categoryPath.join(" → ")}</p>
        <p>Product ID: {product.id}, Category ID: {product.category_id}</p>
      </div>
    </div>
  );
}