"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
} from "@/_lib/utils/whishListUtils";
import HeartIcon from "@/svgs/whishListSvg";
import { Product } from "@/_lib/helpers";
import { useCart } from "@/components/providers/CardProvider";

interface ProductActionsProps {
  product: Product;
}

export default function ProductActionsInline({ product }: ProductActionsProps) {
  const { addToCart, cartItems } = useCart();
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isInWishlistState, setIsInWishlistState] = useState(false);

  useEffect(() => {
    setIsInWishlistState(isInWishlist(product.id));
  }, [product.id]);

  useEffect(() => {
    const inCart = cartItems.some((item) => item.id === product.id);
    setIsAddedToCart(inCart);
  }, [cartItems, product.id]);

  const handleAddToCart = () => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    
    if (existingItem && existingItem.quantityInCart >= product.quantity) {
      alert("Cannot add more than available stock!");
      return;
    }

    addToCart(product);
  };

  const handleWishlistToggle = () => {
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

  return (
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
          <button className="w-full py-4 px-8 rounded-lg text-lg mt-2 hover-colors">
            Go to Cart
          </button>
        </Link>
      )}
    </div>
  );
}