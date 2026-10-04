"use client";
import { useEffect, useRef } from "react";
import { useCart } from "@/components/providers/CartProvider";

export function ClearCartOnSuccess() {
  const { cart, clearCart } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    if (hasCleared.current || cart.length === 0) return;
    hasCleared.current = true;
    clearCart();
  }, [cart, clearCart]);

  return null;
}
