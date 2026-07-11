"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PAGE_URLS } from "@/_lib/constants";
import CartSvg from "@/svgs/cartSvg";
import WishlistSidebar from "../SideBars/wishListSideBar";
import { useWishlist } from "../hooks/wishList";
import { useHeaderContext } from "../providers/HeaderProvider";
import { useCart } from "../providers/CartProvider";
import LogoutButton from "../buttons/LogoutButton";
import { useAuth } from "../providers/AuthProvider";
import BulletButtonSideBar from "../SideBars/BulletButton";
import LanguageSwitcher from "../LanguageSwitch/LanguageSwitch";

const Menu = ({ dropDownMenu }: { dropDownMenu: React.ReactNode }) => {

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { forceOpaque: forceOpaqueFromContext } = useHeaderContext();
  const [showClothes, setShowClothes] = useState(false);
  const [showBulletMenu, setShowBulletMenu] = useState(false);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const clothesModalRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const { cart, getCartItemsCount } = useCart();

  const cartItemCount = getCartItemsCount
    ? getCartItemsCount()
    : cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);

  const { isWishlistOpen, wishlistCount, toggleWishlist, closeWishlist } =
    useWishlist();

  const navLinks = [
    { href: PAGE_URLS.ABOUT, label: "About" },
    { href: PAGE_URLS.PRODUCTS, label: "SHOP" },
    ...(!isAuthLoading && isAuthenticated
      ? [{ href: "/offers", label: "Offers" }]
      : []),
  ];

  const getValidImage = (imageUrl: string | undefined) => {
    if (!imageUrl || imageUrl === "null" || imageUrl === "undefined") {
      return "/images/placeholder.jpg";
    }
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    if (imageUrl.startsWith("/")) {
      return imageUrl;
    }
    return `/images/${imageUrl}`;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        showBulletMenu &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(target)
      ) {
        setShowBulletMenu(false);
      }

      if (
        showClothes &&
        clothesModalRef.current &&
        !clothesModalRef.current.contains(target)
      ) {
        const shopLink = Array.from(
          menuRef.current?.querySelectorAll("a") || [],
        ).find((link) => link.textContent?.includes("SHOP"));

        if (shopLink && shopLink.contains(target)) {
          return;
        }
        setShowClothes(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showClothes, showBulletMenu]);

  const handleMouseEnter = (label: string) => {
    if (label === "SHOP") {
      setShowClothes(true);
    } else {
      setShowClothes(false);
    }
  };

  const handleMobileClick = (label: string) => {
    if (label === "SHOP") {
      setShowClothes((prev) => !prev);
    } else {
      setShowClothes(false);
    }
    setShowBulletMenu(false);
  };

  const isOpaque =
    forceOpaqueFromContext || isNavbarHovered || showClothes || isScrolled;

  const navbarClasses = [
    "fixed",
    "font-poppins",
    "top-0",
    "z-50",
    "grid",
    "grid-cols-3",
    "items-center",
    "aspect-[60/2]",
    "w-full",
    "px-2",
    "lg:px-2",
    "text-xs",
    "transition-all",
    "duration-300",
    "border",
    "border-gray-50",
    "shadow",
    "shadow-gray-50",
  ];

  if (isOpaque) {
    navbarClasses.push("bg-white", "text-vintage-green");
  } else {
    navbarClasses.push("text-white border-none shadow-none");
  }

  return (
    <div className="relative items-center justify-center">
      <div>
        <nav
          className={navbarClasses.join(" ")}
          ref={menuRef}
          style={{ zIndex: 1000 }}
          onMouseEnter={() => setIsNavbarHovered(true)}
          onMouseLeave={() => {
            if (!showClothes) {
              setIsNavbarHovered(false);
            }
          }}
          aria-label="Main navigation"
        >
          <div className="flex items-center">
            <button
              ref={toggleButtonRef}
              aria-label="Open mobile menu"
              className="lg:hidden text-2xl"
              onClick={() => {
                setShowBulletMenu(!showBulletMenu);
                setShowClothes(false);
              }}
            >
              ☰
            </button>

            <ul className="hidden lg:flex gap-4 items-center">
              {navLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="uppercase hover:underline"
                    onMouseEnter={() => handleMouseEnter(label)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center">
            <Link href={PAGE_URLS.HOMEPAGE} className="text-lg">
              <div>Methys</div>
            </Link>
          </div>
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={toggleWishlist}
              className="relative group"
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <div className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                <svg
                  className="w-5 h-5 lg:w-6 lg:h-6 group-hover:text-red-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </div>
            </button>

            <Link
              href={PAGE_URLS.CART}
              className="relative group"
              aria-label={`Cart with ${cartItemCount} items`}
            >
              <div className="relative p-1 sm:p-3 lg:p-2 hover:bg-black rounded-full transition-colors group">
                <CartSvg
                  className={`w-5 h-5 lg:w-6 lg:h-6 transition-colors ${
                    isOpaque
                      ? "text-vintage-green group-hover:text-white"
                      : "text-white group-hover:text-vintage-green"
                  }`}
                />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-vintage-white text-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-4">
              {!isAuthLoading && isAuthenticated && (
                <LogoutButton className="ml-auto" />
              )}
              <LanguageSwitcher />
              <BulletButtonSideBar />
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {showBulletMenu && (
        <nav
          className="block lg:hidden absolute top-full pt-10 left-0 z-30 w-full bg-white shadow-md transition-all duration-300 ease-in-out"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col px-4 py-4 gap-3">
            {navLinks.map(({ href, label }) => (
              <li key={label}>
                <Link
                  href={href}
                  onClick={() => handleMobileClick(label)}
                  className="block text-left text-black py-2 border-b border-gray-200"
                >
                  {label}
                </Link>
              </li>
            ))}

            {!isAuthLoading && isAuthenticated && (
              <li>
                <LogoutButton className="m-4 bg-default-cold!" />
              </li>
            )}
          </ul>
        </nav>
      )}

      {showClothes && (
        <div
          ref={clothesModalRef}
          className="fixed top-16 left-0 z-40 h-auto max-h-[calc(100vh-4rem)] w-auto bg-white shadow-lg rounded-r-3xl transition-transform duration-300 transform translate-x-0"
          style={{
            transform: showClothes ? "translateX(0)" : "translateX(-100%)",
            minWidth: "320px",
          }}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-cyan-900 text-3xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-vintage-green"
            onClick={() => setShowClothes(false)}
            aria-label="Close clothes menu"
          >
            &times;
          </button>
          <div>
            {dropDownMenu}
          </div>
        </div>
      )}
      <WishlistSidebar
        isOpen={isWishlistOpen}
        onClose={closeWishlist}
        getValidImage={getValidImage}
      />
    </div>
  );
};

export default Menu;
