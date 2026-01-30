'use client'
import { ProductInDetails } from "@/_lib/types";
import Image from "next/image";
import { useWishlist } from "../providers/WishListProvider";
import { useState } from "react";
import { useCart } from "../providers/CartProvider";
import { Breadcrumbs } from "../breadcrumb/breadcrumbSchema";
import Link from "next/link";
import CartSvg from "@/svgs/cartSvg";

type OnlineProductProps = {
  products: ProductInDetails[] | null;
  title?: string;
};
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

export function OnlineProducts({ products, }: OnlineProductProps) {

     const { addToCart } = useCart();
      const { addToWishlist, isInWishlist } = useWishlist();
    
      const [hoveredItem, setHoveredItem] = useState<number | null>(null);
      const [selectedSize, setSelectedSize] = useState<string | null>(null);
    
     const breadcrumbs = [
    { name: "Home", slug: "Home" },
    { name: "Online-Exclusive", slug: "Online-Exclusive" },
  ];


  return (
    <section className="font-roboto text-vintage-green pt-16">
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="text-2xl font-semibold py-2">Online Exclusive</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-0.5">
        {products && products.length > 0 && products.map((onlineExclusiveProduct) => {
          const availableSizes = onlineExclusiveProduct.product_variants
            .filter((v) => v.quantity > 0)
            .map((v) => v.size);

          const inWishlist = isInWishlist(onlineExclusiveProduct.id);

          const handleAddToCart = (
            e: React.MouseEvent<HTMLButtonElement>
          ) => {
            e.preventDefault();
            e.stopPropagation();

            if (!selectedSize && availableSizes.length > 0) {
              alert("Please select a size first.");
              return;
            }

            addToCart(onlineExclusiveProduct, selectedSize || undefined);

            alert(
              selectedSize
                ? `Added "${onlineExclusiveProduct.name}" (Size: ${selectedSize}) to cart!`
                : `Added "${onlineExclusiveProduct.name}" to cart!`
            );
          };

          const handleWishlistToggle = (
            e: React.MouseEvent<HTMLButtonElement>
          ) => {
            e.preventDefault();
            e.stopPropagation();
            addToWishlist(onlineExclusiveProduct);
          };

          const defaultImg = onlineExclusiveProduct.image_url?.[0] ?? "/AuthClothPhoto.jpg";
          const hoverImg = onlineExclusiveProduct.image_url?.[1] ?? defaultImg;

          return (
            <Link
              key={onlineExclusiveProduct.id}
              href={`/products/${onlineExclusiveProduct.categoryformen?.parent?.slug}/${onlineExclusiveProduct.categoryformen?.slug}/${onlineExclusiveProduct.slug}`}
              className="group relative block overflow-hidden bg-white transition-all duration-300"
              onMouseEnter={() => setHoveredItem(onlineExclusiveProduct.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative w-full max-w-[450px] h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[75vh] overflow-hidden">
                <Image
                  src={
                    hoveredItem === onlineExclusiveProduct.id
                      ? hoverImg
                      : defaultImg
                  }
                  alt={onlineExclusiveProduct.name}
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
                  <p className=" text-gray-200">
                    €{Number(onlineExclusiveProduct.price)}
                  </p>
                
                </div>
              </div>

              <div className="px-2 py-3">
                <h3 className="text-base md:text-lg line-clamp-1">{onlineExclusiveProduct.name}</h3>

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
