"use client";

import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useWishlist } from "@/components/providers/WishListProvider";
import { ProductInDetails } from "@/_lib/types";
import Image from "next/image";
import SizeGuideModal from "./SizeGuide";

interface ProductActionsProps {
  product: ProductInDetails;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeError, setShowSizeError] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  const availableSizes =
    product.product_variants
      ?.filter((variant) => variant.quantity > 0)
      .map((variant) => variant.size) || [];

  const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const handleSizeSelect = (size: string) => {
    if (availableSizes.includes(size)) {
      setSelectedSize(size);
      setShowSizeError(false);
    }
  };

  const handleAddToCart = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      setShowSizeError(true);
      return;
    }

    addToCart(product, selectedSize || undefined);

    alert(
      selectedSize
        ? `Added "${product.name}" (Size: ${selectedSize}) to cart!`
        : `Added "${product.name}" to cart!`
    );
  };

  const handleWishlistToggle = () => {
    addToWishlist(product);
  };

  return (
    <div className="space-y-6">
      {/* Color Selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Color: Mountain Grey Brown</h3>
        </div>
        <div className="flex gap-2">
          <button className="relative w-16 h-16 border-2 border-vintage-green rounded overflow-hidden">
            <Image
              src={product.image_url ?? "/Articles.jpg"}
              alt="Mountain Grey Brown"
              fill
              className="object-cover"
            />
          </button>
        </div>
      </div>

      {/* Size Selection */}
      {availableSizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">
              Size: {selectedSize || "Please select"}
            </h3>
            <button
              className="text-xs underline hover:no-underline"
              onClick={() => setIsSizeGuideOpen(true)}
            >
              Size guide +
            </button>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {allSizes.map((size) => {
              const isAvailable = availableSizes.includes(size);
              const isSelected = selectedSize === size;

              return (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  disabled={!isAvailable}
                  className={`
                    py-3 text-sm font-medium border transition-all
                    ${
                      isSelected
                        ? "bg-vintage-green text-white border-vintage-green"
                        : isAvailable
                        ? "bg-white text-vintage-green border-gray-300 hover:border-vintage-green"
                        : "bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed line-through"
                    }
                  `}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {showSizeError && (
            <p className="text-red-500 text-sm mt-2">Please select a size</p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={availableSizes.length === 0}
          className={`
            w-full py-4 text-sm font-medium tracking-wider uppercase transition-colors
            ${
              availableSizes.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-vintage-green text-white hover:bg-vintage-green/90"
            }
          `}
        >
          {availableSizes.length === 0
            ? "Out of Stock"
            : `Add to Cart - €${product.price}`}
        </button>

        <button
          onClick={handleWishlistToggle}
          className="w-full py-4 text-sm font-medium tracking-wider uppercase border border-vintage-green text-vintage-green hover:bg-vintage-green hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={inWishlist ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {inWishlist ? "In Wishlist" : "Add to Wishlist"}
        </button>
      </div>

      {/* Payment Methods */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <span className="text-xs text-gray-500">We accept:</span>
        <div className="flex gap-2 opacity-60">
          <div className="w-8 h-5 bg-gray-200 rounded text-[8px] flex items-center justify-center font-bold">VISA</div>
          <div className="w-8 h-5 bg-gray-200 rounded text-[8px] flex items-center justify-center font-bold">MC</div>
          <div className="w-8 h-5 bg-gray-200 rounded text-[8px] flex items-center justify-center font-bold">AMEX</div>
          <div className="w-8 h-5 bg-gray-200 rounded text-[8px] flex items-center justify-center font-bold">PAY</div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        productName={product.name}
        productImages={[product.image_url ?? ""]}
      />
    </div>
  );
}
