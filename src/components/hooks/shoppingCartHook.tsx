import { useEffect, useState } from "react";

export const useShoppingCartHook = () => {
  const [isShoppingCartOpen, setIsShoppingCartOpen] = useState(false);
  const [ShoppingCartCount, setShoppingCartCount] = useState(0);

  const updateShoppingCartCount = () => {
    const savedShoppingCartItems = localStorage.getItem("cartItems");
    if (savedShoppingCartItems) {
      try {
        const parseShoppingCartItems = JSON.parse(savedShoppingCartItems);
        setShoppingCartCount(parseShoppingCartItems.length);
      } catch {
        setShoppingCartCount(0);
      }
    } else {
      setShoppingCartCount(0);
    }
  };

  useEffect(() => {
    updateShoppingCartCount();

    const handleShoppingCartUpdate = () => {
      updateShoppingCartCount();
    };

    window.addEventListener("shoppingCartUpdated", handleShoppingCartUpdate);
    return () =>
      window.removeEventListener(
        "shoppingCartUpdated",
        handleShoppingCartUpdate,
      );
  }, []);

  const openShoppingCart = () => setIsShoppingCartOpen(true);
  const closeShoppingCart = () => setIsShoppingCartOpen(false);
  const toggleShoppingCart = () => setIsShoppingCartOpen(!isShoppingCartOpen);

  return {
    isShoppingCartOpen,
    ShoppingCartCount,
    openShoppingCart,
    closeShoppingCart,
    toggleShoppingCart,
  };
};
