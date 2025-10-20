"use client";

import CartSvg from "@/svgs/cartSvg";
import Image from "next/image";
import Link from "next/link";
import { useState, MouseEvent } from "react";
import { RandomItemsOfEachCategory } from "@/_lib/helpers";

interface NewCollectionCardProps {
  item: RandomItemsOfEachCategory;
}

export default function NewCollectionCard({ item }: NewCollectionCardProps) {
  const [hovered, setHovered] = useState(false);

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(`Added "${item.name}" to cart`);
  };

  return (
    <Link
      href={`/products/${item.categoryPath}/${item.slug}`}
      className="group  block  overflow-hidden transition font-poppins"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full aspect-[4/5]">
        <Image
          src={hovered ? "/articles.jpg" : item.image_url}
          alt={item.name}
          fill
          className="object-cover transition duration-500 ease-in-out"
          quality={100}
          priority
        />
        <div className=" bg-gradient-to-t from-black/60 via-black/10 to-transparent transition duration-500" />

        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-lg  line-clamp-1">{item.name}</h3>
          <p className="text-gray-200">${item.price}</p>
        </div>

        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 p-2 bg-white/80 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition duration-300"
        >
          <CartSvg className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </Link>
  );
}
