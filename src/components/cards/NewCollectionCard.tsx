"use client";

import CartSvg from "@/svgs/cartSvg";
import Image from "next/image";
import Link from "next/link";
import { useState, MouseEvent } from "react";
import { RandomItemsOfEachCategory } from "@/_lib/helpers";
import { useCart } from "../providers/CardProvider";
import { useWishlist } from "../providers/WishListProvider";

interface NewCollectionCardProps {
  item: RandomItemsOfEachCategory;
}

function HeartSvg({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export default function NewCollectionCard({ item }: NewCollectionCardProps) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(item.id);

  const handleSizeClick = (e: MouseEvent<HTMLSpanElement>, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
  };

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedSize && item.sizes && item.sizes.length > 0) {
      alert("Please select a size first");
      return;
    }

    addToCart({
      ...item,
      selectedSize,
    });

    alert(
      selectedSize
        ? `Added "${item.name}" (Size: ${selectedSize}) to cart!`
        : `Added "${item.name}" to cart!`
    );
  };

  const handleWishlistToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(item);
  };

  return (
    <Link
      href={`/products/${item.categoryPath}/${item.slug}`}
      className="group block overflow-hidden transition font-roboto"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full">
        <div className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[80vh]">
          <Image
            src={hovered ? "/articles.jpg" : item.image_url}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition duration-500 ease-in-out"
            quality={100}
            priority
          />

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 left-3 p-3 sm:p-4 bg-white/80 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-300 z-10 hover:bg-white"
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <HeartSvg
              filled={inWishlist}
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                inWishlist ? "text-red-500" : "text-gray-700"
              }`}
            />
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="absolute top-3 right-3 p-3 sm:p-4 bg-white/80 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-300 z-10 hover:bg-white"
            aria-label="Add to cart"
          >
            <CartSvg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>
        </div>

        {/* Product Info */}
        <div className="relative pt-3 text-vintage-green">
          <h3 className="text-base left-3 top-1 line-clamp-1">{item.name}</h3>

          <div className="text-xs md:text-base text-vintage-green/70 mt-1 block flex-wrap">
            {item.sizes && item.sizes.length > 0 ? (
              <div className="flex gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
                {item.sizes.map((size) => (
                  <span
                    key={size}
                    onClick={(e) => handleSizeClick(e, size)}
                    className={`cursor-pointer w-5 text-center h-8 py-1 sm:py-1.5 text-xs sm:text-sm md:text-base transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-vintage-green text-white"
                        : "bg-white text-vintage-green hover:bg-vintage-green hover:text-white"
                    }`}
                  >
                    {size}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-red-500 text-xs sm:text-sm md:text-base">
                Sold Out
              </span>
            )}
          </div>

          <p className="absolute right-3 sm:right-4 md:right-5 lg:right-6 top-3 text-base">
            ${item.price}
          </p>
        </div>
      </div>
    </Link>
  );
}