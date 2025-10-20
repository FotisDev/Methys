"use client";
import {
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "@/_lib/utils/whishListUtils";
import HeartIcon from "@/svgs/whishListSvg";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  getCategoryByName,
  getSubcategories,
  fetchProductBySlug,
  getValidImage,
  CategoryBackendType,
  Product,
} from "@/_lib/helpers";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string; slug: string }>;
}) {
  const [unwrappedParams, setUnwrappedParams] = useState<{
    category: string;
    subcategory: string;
    slug: string;
  } | null>(null);
  const [parentCategory, setParentCategory] =
    useState<CategoryBackendType | null>(null);
  const [currentCategory, setCurrentCategory] =
    useState<CategoryBackendType | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false); // Track if item was added
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  // Unwrap the params promise
  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const resolvedParams = await params;
        setUnwrappedParams(resolvedParams);
      } catch (err) {
        console.error("Error unwrapping params:", err);
        setError("Failed to load page parameters");
        setIsLoading(false);
      }
    };

    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (product) {
      setIsInWishlistState(isInWishlist(product.id));
    }
  }, [product]);

  // Add this function to handle wishlist toggle
  const handleWishlistToggle = () => {
    if (!product) return;

    if (isInWishlistState) {
      removeFromWishlist(product.id);
      setIsInWishlistState(false);
    } else {
      const success = addToWishlist(product);
      if (success) {
        setIsInWishlistState(true);
      } else {
        alert("Item already in wishlist!");
      }
    }
  };

  // Extract and decode parameters once unwrapped
  const categorySlug = decodeURIComponent(unwrappedParams?.category || "");
  const subcategorySlug = decodeURIComponent(
    unwrappedParams?.subcategory || ""
  );
  const productSlug = decodeURIComponent(unwrappedParams?.slug || "");
  const categoryName = categorySlug.replace(/-/g, " ").toLowerCase().trim();
  const subcategoryName = subcategorySlug
    .replace(/-/g, " ")
    .toLowerCase()
    .trim();

  console.log("ProductDetailPage - Unwrapped Params:", unwrappedParams);
  console.log("ProductDetailPage - Processed Params:", {
    categorySlug,
    subcategorySlug,
    productSlug,
    categoryName,
    subcategoryName,
  });

  useEffect(() => {
    const loadProductData = async () => {
      if (!unwrappedParams) return;

      try {
        if (!categorySlug || !subcategorySlug || !productSlug) {
          throw new Error("Missing required URL parameters");
        }

        console.log(
          "ProductDetailPage - Searching for parent category:",
          categoryName
        );
        const parentData = await getCategoryByName(categoryName);
        if (!parentData) {
          throw new Error(`Parent category "${categoryName}" not found`);
        }
        console.log("ProductDetailPage - Found parent category:", parentData);
        setParentCategory(parentData);

        console.log(
          "ProductDetailPage - Fetching subcategories under parent ID:",
          parentData.id
        );
        const subcategories = await getSubcategories(parentData.id);
        console.log("ProductDetailPage - Found subcategories:", subcategories);

        const currentData = subcategories.find(
          (subcat) =>
            (subcat.slug &&
              decodeURIComponent(subcat.slug) === subcategorySlug) ||
            subcat.name.toLowerCase().trim() === subcategoryName ||
            (subcat.slug && subcat.slug === subcategorySlug) ||
            subcat.name.toLowerCase().includes(subcategoryName) ||
            subcategoryName.includes(subcat.name.toLowerCase())
        );

        if (!currentData) {
          console.log(
            "ProductDetailPage - No exact match for subcategory. Available subcategories:",
            subcategories.map((sub) => sub.name)
          );
          throw new Error(
            `Subcategory "${subcategoryName}" not found under "${categoryName}"`
          );
        }
        console.log("ProductDetailPage - Found subcategory:", currentData);
        setCurrentCategory(currentData);

        console.log(
          "ProductDetailPage - Fetching product with category ID:",
          currentData.id,
          "and slug:",
          productSlug
        );
        const productData = await fetchProductBySlug(
          currentData.id,
          productSlug
        );
        if (!productData) {
          throw new Error(
            `Product with slug "${productSlug}" not found in ${subcategoryName}`
          );
        }
        console.log("ProductDetailPage - Found product:", productData);
        setProduct(productData);
      } catch (err) {
        console.error("ProductDetailPage - Error loading product data:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [
    unwrappedParams,
    categoryName,
    subcategoryName,
    productSlug,
    categorySlug,
    subcategorySlug,
  ]);

  const handleAddToCart = () => {
    if (!product) return;

    const savedCart = localStorage.getItem("cartItems");
    const existingCart = savedCart ? JSON.parse(savedCart) : [];

    const existingItem = existingCart.find(
      (item: Product) => item.id === product.id
    );
    if (existingItem) {
      if (existingItem.quantityInCart < product.quantity) {
        existingItem.quantityInCart += 1;
      } else {
        alert("Cannot add more than available stock!");
        return;
      }
    } else {
      existingCart.push({ ...product, quantityInCart: 1 });
    }

    localStorage.setItem("cartItems", JSON.stringify(existingCart));
    setIsAddedToCart(true); 
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vintage-green"></div>
        <p className="mt-4 text-lg">Loading product...</p>
      </div>
    );
  }

  if (error || !product || !unwrappedParams) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen font-poppins">
        <h1 className="text-2xl  mb-4">Product Not Found</h1>
        <p className="text-vintage-green mb-8">
          {error || `Product "${productSlug}" not found`}
        </p>
        {subcategorySlug && (
          <Link
            href={`/products/${encodeURIComponent(
              categorySlug
            )}/${encodeURIComponent(subcategorySlug)}`}
            className="px-6 py-3 hover-colors"
          >
            Back to {subcategoryName.replace(/-/g, " ") || "Products"}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 font-roboto text-vintage-green">
      <nav className="mb-8 text-sm text-vintage-green">
        <Link
          href="/products"
          className="hover:text-vintage-brown"
        >
          Products
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/products/${encodeURIComponent(categorySlug)}`}
          className="hover:text-vintage-brown"
        >
          {parentCategory?.name || categoryName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/products/${encodeURIComponent(
            categorySlug
          )}/${encodeURIComponent(subcategorySlug)}`}
          className="hover:text-vintage-brown "
        >
          {currentCategory?.name || subcategoryName}
        </Link>
        <span className="mx-2">/</span>
        <span className="hover:text-vintage-brown">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={getValidImage(product.image_url ?? '/AuthClothPhoto.jpg')}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            {product.is_offer && (
              <div className="absolute top-4 left-4 bg-red-700 text-white text-sm  px-3 py-2 rounded-lg">
                SPECIAL OFFER
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl  text-vintage-green mb-4">
              {product.name}
            </h1>
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl">
                ${product.price}
              </span>
              {product.is_offer && (
                <span className="bg-vintage-brown text-red-700 text-sm  px-3 py-1 rounded-full">
                  On Sale
                </span>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg  text-gray-900 mb-3">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg  text-text-vintage-green mb-4">
              Product Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span >Product ID:</span>
                <span >#{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Added:</span>
                <span >
                  {new Date(product.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 px-8 rounded-lg text-lg hover-colors"
            >
              {isAddedToCart ? "Added to Cart!" : "Add to Cart"}
            </button>
            <button
              onClick={handleWishlistToggle}
              className={`w-full border-2 py-4 px-8 rounded-lg transition-colors duration-200 text-lg flex items-center justify-center space-x-2 ${
                isInWishlistState
                  ? "border-red-500 bg-red-50 text-red-600 hover:bg-red-100"
                  : "hover-colors"
              }`}
            >
              <HeartIcon
                filled={isInWishlistState}
                className={`w-5 h-5 ${
                  isInWishlistState ? "text-red-600" : "text-amber-500"
                }`}
              />
              <span>
                {isInWishlistState ? "Remove from Wishlist" : "Add to Wishlist"}
              </span>
            </button>
            {isAddedToCart && (
              <Link href="/cart">
                <button className="w-full py-4 px-8 rounded-lgtext-lg mt-2 hover-colors">
                  Go to Cart
                </button>
              </Link>
            )}
          </div>
          <div className="pt-6 border-t">
            <Link
              href={`/products/${encodeURIComponent(
                categorySlug
              )}/${encodeURIComponent(subcategorySlug)}`}
              className="inline-flex items-center hover-colors rounded p-4"
            >
              ← Back to {currentCategory?.name || subcategoryName}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
