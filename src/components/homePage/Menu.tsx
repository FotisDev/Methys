"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PAGE_URLS } from "@/_lib/constants";

import BulletButton from "./BulletButton";
import ClotheCards from "./DropDownMenu";
import DropDownMainPageSubCat from "./DropDownMainPageSubCat";
import CartSvg from "@/svgs/cartSvg";

const Menu = () => {
  const [showClothes, setShowClothes] = useState(false);
  const [showBulletMenu, setShowBulletMenu] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const clothesModalRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);


  const navLinks = [
    { href: PAGE_URLS.ABOUT, label: "About" },
    { href: PAGE_URLS.PRODUCTS, label: "SHOP" },
  ];

  // Update counts from localStorage
  useEffect(() => {
    const updateCounts = () => {
      // Update cart count
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        const totalCartItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantityInCart || 1), 0);
        setCartItemCount(totalCartItems);
      } else {
        setCartItemCount(0);
      }

      // Update wishlist count
      const savedWishlist = localStorage.getItem("wishlistItems");
      if (savedWishlist) {
        const wishlistItems = JSON.parse(savedWishlist);
        setWishlistItemCount(wishlistItems.length);
      } else {
        setWishlistItemCount(0);
      }
    };

    // Initial load
    updateCounts();

    // Listen for events
    window.addEventListener('storage', updateCounts);
    window.addEventListener('cartUpdated', updateCounts);
    window.addEventListener('wishlistUpdated', updateCounts);

    // Cleanup
    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('cartUpdated', updateCounts);
      window.removeEventListener('wishlistUpdated', updateCounts);
    };
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
        const shopLink = Array.from(menuRef.current?.querySelectorAll('a') || [])
          .find(link => link.textContent?.includes('SHOP'));
        
        if (shopLink && shopLink.contains(target)) {
          return;
        }
        
        setShowClothes(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  return (
    <div className="relative items-center justify-center">
      <div>
        <div
          className="fixed font-sans font-semibold top-0 z-50 grid grid-cols-3 items-center opacity-70 aspect-[55/2] bg-white backdrop-blur-xl w-full px-4 lg:px-6 text-xs shadow-md"
          ref={menuRef}
          style={{ zIndex: 1000 }}
        >
          {/* Left - Navigation */}
          <div className="flex items-center justify-start">
            <div className="hidden lg:flex gap-4 items-center ml-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-black uppercase hover:underline"
                  onMouseEnter={() => handleMouseEnter(label)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Center - Logo */}
          <div className="flex justify-center">
            <Link href={PAGE_URLS.HOMEPAGE} passHref>
              <p className="font-roboto text-lg">Methys</p>  
            </Link>
          </div>

          {/* Right - Icons */}
          <div className="flex items-center justify-end">
            <div className="hidden lg:flex items-center gap-4">
              {/* Wishlist Icon */}
              <Link 
                href={PAGE_URLS.WISHLIST} 
                className="relative group"
                aria-label={`Wishlist with ${wishlistItemCount} items`}
              >
                <div className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg 
                    className="w-6 h-6 text-gray-700 group-hover:text-red-500 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {wishlistItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]">
                      {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* Cart Icon */}
              <Link 
                href={PAGE_URLS.CART} 
                className="relative group"
                aria-label={`Cart with ${cartItemCount} items`}
              >
                <div className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <CartSvg className="w-6 h-6 text-gray-700 group-hover:text-black transition-colors" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </div>
              </Link>

              <BulletButton />
            </div>

            <button
              ref={toggleButtonRef}
              aria-label="Open Mobile Menu"
              className="lg:hidden text-black text-3xl"
              onClick={() => {
                setShowBulletMenu(!showBulletMenu);
                setShowClothes(false);
              }}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showBulletMenu && (
        <div className="block lg:hidden absolute top-full left-0 z-30 w-full bg-white shadow-md transition-all duration-300 ease-in-out">
          <div className="flex flex-col px-4 py-4 gap-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                onClick={() => handleMobileClick(label)}
                className="text-left text-black font-medium py-2 border-b border-gray-200"
              >
                {label}
              </Link>
            ))}
            
            {/* Mobile Wishlist */}
            <Link
              href={PAGE_URLS.WISHLIST}
              onClick={() => setShowBulletMenu(false)}
              className="flex items-center justify-between text-left text-black font-medium py-2 border-b border-gray-200"
            >
              <span>Wishlist</span>
              {wishlistItemCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 min-w-[24px] text-center">
                  {wishlistItemCount > 99 ? '99+' : wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Cart */}
            <Link
              href={PAGE_URLS.CART}
              onClick={() => setShowBulletMenu(false)}
              className="flex items-center justify-between text-left text-black font-medium py-2 border-b border-gray-200"
            >
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="bg-amber-500 text-white text-xs font-bold rounded-full px-2 py-1 min-w-[24px] text-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            <Link
              href="/login"
              className="text-center mt-2 text-white bg-cyan-900 py-2 rounded"
            >
              Sign Up/Sign In
            </Link>
          </div>
        </div>
      )}

      {/* Clothes Dropdown */}
      {showClothes && (
        <div
          ref={clothesModalRef}
          className="fixed top-16 left-0 z-40 h-auto max-h-[calc(100vh-4rem)] w-auto bg-white shadow-lg rounded-r-3xl transition-transform duration-300 transform translate-x-0"
          style={{ 
            transform: showClothes ? 'translateX(0)' : 'translateX(-100%)',
            minWidth: '320px'
          }}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-cyan-900 text-3xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            onClick={() => setShowClothes(false)}
            aria-label="Close Clothes Menu"
          >
            &times;
          </button>
          <div className="">
            <DropDownMainPageSubCat/>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;