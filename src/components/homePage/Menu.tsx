"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PAGE_URLS } from "@/_lib/constants";

import BulletButton from "./BulletButton";
import ClotheCards from "./DropDownMenu";
// import DropDownMenu from "./DropDownMenu";
// import ShowSubCategories from "./categories/DropDownMainPageSubCat";
import DropDownMainPageSubCat from "./categories/DropDownMainPageSubCat";

const Menu = () => {
  const [showClothes, setShowClothes] = useState(false);
  const [showBulletMenu, setShowBulletMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const clothesModalRef = useRef<HTMLDivElement | null>(null); // Add ref for clothes modal
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  const navLinks = [
    { href: PAGE_URLS.ABOUT, label: "About" },
    { href: PAGE_URLS.PRODUCTS, label: "SHOP" },
    // { href: PAGE_URLS.BLOG, label: "Blog" },
    // { href: PAGE_URLS.OFFERS, label: "Offers" },
    // { href: PAGE_URLS.HELP, label: "Help" },
    // { href: PAGE_URLS.CONTACT, label: "Contact Us" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside the mobile menu
      if (
        showBulletMenu &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(target)
      ) {
        setShowBulletMenu(false);
      }

      // Check if click is outside the clothes modal
      if (
        showClothes &&
        clothesModalRef.current &&
        !clothesModalRef.current.contains(target)
      ) {
        // Don't close if clicking on the SHOP link in the menu
        const shopLink = Array.from(menuRef.current?.querySelectorAll('a') || [])
          .find(link => link.textContent?.includes('SHOP'));
        
        if (shopLink && shopLink.contains(target)) {
          return; // Don't close when clicking SHOP link
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
      setShowClothes(false); // This ensures hovering other items closes the clothes menu
    }
  };

  const handleMouseLeave = () => {
    // Optional: Add a small delay before closing to prevent accidental closes
    // You can uncomment this if you want the menu to stay open when moving mouse between elements
    // setTimeout(() => setShowClothes(false), 150);
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
        {/* Main Menu */}
        <div
          className="fixed font-sans font-semibold top-0 z-50 grid grid-cols-3 items-center opacity-70 aspect-[55/2] bg-white backdrop-blur-xl w-full px-4 lg:px-6 text-xs shadow-md"
          ref={menuRef}
          style={{ zIndex: 1000 }}
        >
          {/* Left Section - Desktop Nav */}
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

          {/* Center Section - Logo */}
          <div className="flex justify-center">
            <Link href={PAGE_URLS.HOMEPAGE} passHref>
              <p className="font-roboto text-lg">Methys</p>  
            </Link>
          </div>

          {/* Right Section - Desktop Buttons & Mobile Burger */}
          <div className="flex items-center justify-end">
            {/* Desktop Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/login"
                aria-label="SignUpPage"
                className="w-[130px] h-[40px] text-[14px] font-medium text-black bg-none py-2 rounded-lg flex items-center justify-center"
              >
                Sign Up/Sign In
              </Link>
              <BulletButton />
            </div>

            {/* Mobile Burger Button */}
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

      {/* Mobile Dropdown Menu */}
      {showBulletMenu && (
        <div className="block lg:hidden absolute top-full left-0 z-30 w-full bg-white shadow-md transition-all duration-300 ease-in-out">
          <div className="flex flex-col px-4 py-4 gap-3">
            {navLinks.map(({ label }) => (
              <button
                key={label}
                onClick={() => handleMobileClick(label)}
                className="text-left text-black font-medium py-2 border-b border-gray-200"
              >
                {label}
              </button>
            ))}
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
          {/* Close Button */}
          <button
            type="button"
            className="absolute top-4 right-4 text-cyan-900 text-3xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            onClick={() => setShowClothes(false)}
            aria-label="Close Clothes Menu"
          >
            &times;
          </button>
          <div className="">
            {/* <DropDownMenu />  */}
            <DropDownMainPageSubCat/>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;