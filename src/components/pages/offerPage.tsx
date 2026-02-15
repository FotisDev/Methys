"use client";

import { ProductWithDiscount } from "@/_lib/backend/offers/actions";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "../breadcrumb/breadcrumbSchema";
import { useCart } from "../providers/CartProvider";
import { useWishlist } from "../providers/WishListProvider";
import { useState } from "react";
import CartSvg from "@/svgs/cartSvg";

function HeartSvg({ filled, className }: { filled: boolean; className?: string }) {
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

type OffersListProps = {
  offerProduct: ProductWithDiscount[];
};

export default function OffersPageComponent({ offerProduct }: OffersListProps) {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (offerProduct.length === 0) {
    return (
      <section className="p-36">
        <h1 className="text-2xl font-semibold mb-4 text-vintage-green">Offers</h1>
        <p className="text-gray-500">
          Login is required to see our offers.
        </p>
      </section>
    );
  }

  const breadcrumbs = [
    { name: "Home", slug: "home" },
    { name: "Offers", slug: "offers" },
  ];

  return (
    <section className="font-roboto text-vintage-green pt-16">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="text-2xl font-semibold py-2">Explore our Limited Offers</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0.5">
        {offerProduct.map((offer) => {
          const availableSizes = offer.product_variants
            .filter((v) => v.quantity > 0)
            .map((v) => v.size);

          const inWishlist = isInWishlist(offer.id);

          const handleAddToCart = (
            e: React.MouseEvent<HTMLButtonElement>
          ) => {
            e.preventDefault();
            e.stopPropagation();

            if (!selectedSize && availableSizes.length > 0) {
              alert("Please select a size first.");
              return;
            }

            addToCart(offer, selectedSize || undefined);

            alert(
              selectedSize
                ? `Added "${offer.name}" (Size: ${selectedSize}) to cart!`
                : `Added "${offer.name}" to cart!`
            );
          };

          const handleWishlistToggle = (
            e: React.MouseEvent<HTMLButtonElement>
          ) => {
            e.preventDefault();
            e.stopPropagation();
            addToWishlist(offer);
          };

          const defaultImg = offer.image_url?.[0] ?? "/AuthClothPhoto.jpg";
          const hoverImg = offer.image_url?.[1] ?? defaultImg;

          return (
            <Link
              key={offer.id}
              href={`/products/${offer.categoryformen?.parent?.slug}/${offer.categoryformen?.slug}/${offer.slug}`}
              className="group relative block overflow-hidden bg-white transition-all duration-300"
              onMouseEnter={() => setHoveredItem(offer.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative w-full h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[75vh] overflow-hidden">
                <Image
                  src={
                    hoveredItem === offer.id
                      ? hoverImg
                      : defaultImg
                  }
                  alt={offer.name}
                  className="object-cover object-center transition duration-500 ease-in-out w-full h-full"
                  fill
                />

                <button
                  onClick={handleWishlistToggle}
                  className="absolute top-3 left-3 p-3 bg-white/80 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-300 z-10"
                >
                  <HeartSvg
                    filled={inWishlist}
                    className={`w-6 h-6 ${
                      inWishlist ? "text-red-500" : "text-gray-700"
                    }`}
                  />
                </button>

                <button
                  onClick={handleAddToCart}
                  className="absolute top-3 right-3 p-3 bg-white/80 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-300 z-10"
                >
                  <CartSvg className="w-6 h-6 text-gray-700" />
                </button>

                <div className="absolute bottom-3 left-3 bg-ext-vintage-green rounded-full text-vintage-white px-2 py-1 text-sm">
                  <p className="line-through text-gray-200">
                    €{Number(offer.price).toFixed(2)}
                  </p>
                  <span className="font-bold">
                    €{offer.discountedPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="px-2 py-3">
                <h3 className="text-base md:text-lg line-clamp-1">{offer.name}</h3>

                <div className="flex gap-2 mt-2 flex-wrap">
                  {availableSizes.length > 0 ? (
                    availableSizes.map((size) => (
                      <span
                        key={size}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedSize(size);
                        }}
                        className={`cursor-pointer px-2 py-1 text-xs rounded 
                          ${
                            selectedSize === size
                              ? "bg-vintage-green text-white"
                              : "text-vintage-green hover:bg-vintage-green hover:text-white"
                          }`}
                      >
                        {size}
                      </span>
                    ))
                  ) : (
                    <span className="text-red-500 text-sm">Sold Out</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
