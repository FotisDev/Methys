"use client";

import CartSvg from "@/svgs/cartSvg";
import Image from "next/image";
import Link from "next/link";
import { useState, MouseEvent } from "react";
import { RandomItemsOfEachCategory } from "@/_lib/helpers";
import { useCart } from "../providers/CardProvider";

interface NewCollectionCardProps {
  item: RandomItemsOfEachCategory;
}

export default function NewCollectionCard({ item }: NewCollectionCardProps) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();

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

  return (
    <Link
      href={`/products/${item.categoryPath}/${item.slug}`}
      className="group block overflow-hidden transition font-roboto"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full">
        {/* Image Container with aspect ratio */}
        <div className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[90vh] xl:h-[95vh]">
          <Image
            src={hovered ? "/articles.jpg" : item.image_url}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition duration-500 ease-in-out"
            quality={100}
            priority
          />

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="absolute top-3 right-3 p-3 sm:p-4 bg-white/80 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-300 z-10"
          >
            <CartSvg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>
        </div>

        {/* Product Info */}
        <div className="relative p-3 sm:p-4 md:p-5 lg:p-6 text-vintage-green">
          <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl left-0 top-1 line-clamp-1">{item.name}</h3>

          <div className="text-xs sm:text-sm md:text-base text-vintage-green/70 mt-1 block">
            {item.sizes && item.sizes.length > 0 ? (
              <div className="flex gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
                {item.sizes.map((size) => (
                  <span
                    key={size}
                    onClick={(e) => handleSizeClick(e, size)}
                    className={`cursor-pointer px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm md:text-base transition-all duration-200 ${
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
              <span className="text-red-500 text-xs sm:text-sm md:text-base">Sold Out</span>
            )}
          </div>

          <p className="absolute right-3 sm:right-4 md:right-5 lg:right-6 top-3 sm:top-4 md:top-5 lg:top-6 text-base sm:text-lg md:text-xl lg:text-2xl">${item.price}</p>
        </div>
      </div>
    </Link>
  );
}