"use client";

import CartSvg from "@/svgs/cartSvg";
import Image from "next/image";
import Link from "next/link";
import { useState, MouseEvent } from "react";
import { useCart } from "../providers/CartProvider";
import { useWishlist } from "../providers/WishListProvider";
import { ProductInDetails } from "@/_lib/types";

function HeartSvg({
  filled,
  className,
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

interface SeasonalCollectionCardProps {
  item: ProductInDetails;
}

export default function SeasonalCollectionCard({ item }: SeasonalCollectionCardProps) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(item.id);

  const availableSizes = item.product_variants
    .filter((variant) => variant.quantity > 0)
    .map((variant) => variant.size);

  const handleSizeClick = (e: MouseEvent<HTMLSpanElement>, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
  };

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedSize && availableSizes.length > 0) {
      alert("Please select a size first");
      return;
    }

    addToCart(item, selectedSize || undefined);

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

  const getCategoryPath = (): string => {
    const category = item.categoryformen;
    const parent = category?.parent;
    if (parent?.slug && category?.slug) {
      return `${parent.slug}/${category.slug}`;
    }
    return category?.slug ?? "uncategorized";
  };

  const defaultImg = item.image_url?.[0] ?? "/Articles.jpg";
  const hoverImg = item.image_url?.[1] ?? defaultImg;

  const isNew = true; 

  return (
    <Link
      href={`/collections/${getCategoryPath()}/${item.slug ?? ""}`}
      className="font-roboto  "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full overflow-hidden bg-[#f5f4f0]"  style={{ aspectRatio: "3/4" }}>
        <Image
          src={hovered ? hoverImg : defaultImg}
          alt={item.name}
          fill
          className="object-cover object-center transition duration-500 ease-in-out"
          quality={100}
          priority
        />
        {isNew && (
          <span className="absolute top-2 left-2 text-[10px] uppercase tracking-widest font-medium text-white z-10">
            New In
          </span>
        )}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-1.5 z-10"
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <HeartSvg
            filled={inWishlist}
            className={`w-5 h-5 transition-colors drop-shadow-sm ${
              inWishlist ? "text-red-500" : "text-white hover:text-red-400"
            }`}
          />
        </button>
      </div>

      <div className="pt-2 pb-3 px-5 text-vintage-green">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-medium line-clamp-1 leading-snug flex-1">
            {item.name}
          </h3>
          <p className="text-sm shrink-0">${item.price}</p>
          <button
            onClick={handleAddToCart}
            aria-label="Add to cart"
            className="shrink-0 text-black hover:text-default-color transition-opacity"
          >
            <CartSvg className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-1 h-5 overflow-hidden">
          {hovered ? (
            availableSizes.length > 0 ? (
              <div className="flex gap-1 flex-wrap">
                {availableSizes.map((size) => (
                  <span
                    key={size}
                    onClick={(e) => handleSizeClick(e, size)}
                    className={`cursor-pointer text-[11px] px-1 py-0.5 transition-all duration-150 border ${
                      selectedSize === size
                        ? "border-vintage-green bg-vintage-green text-white"
                        : "border-transparent text-vintage-green/70 hover:border-vintage-green/50"
                    }`}
                  >
                    {size}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-red-500">Sold Out</span>
            )
          ) : (
            item.size_description ? (
              <p className="text-xs text-vintage-green/60 line-clamp-1">
                {item.size_description}
              </p>
            ) : null
          )}
        </div>
      </div>
    </Link>
  );
}