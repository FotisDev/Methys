"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PAGE_URLS } from "@/_lib/constants";

import BulletButton from "./BulletButton";
import ClotheCards from "./ClothesCards";

const Menu = () => {
  const [showClothes, setShowClothes] = useState(false);
  const [showBulletMenu, setShowBulletMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);

  const navLinks = [
    { href: PAGE_URLS.ABOUT, label: "About" },
    { href: PAGE_URLS.PRODUCTS, label: "Products" },
    { href: PAGE_URLS.BLOG, label: "Blog" },
    { href: PAGE_URLS.OFFERS, label: "Offers" },
    { href: PAGE_URLS.HELP, label: "Help" },
    { href: PAGE_URLS.CONTACT, label: "Contact Us" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setShowClothes(false);
        setShowBulletMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (label === "Products") {
      setShowClothes(true);
    } else {
      setShowClothes(false);
    }
  };

  const handleMobileClick = (label: string) => {
    if (label === "Products") {
      setShowClothes((prev) => !prev);
    } else {
      setShowClothes(false);
    }
    setShowBulletMenu(false);
  };

  return (
    <div className="relative">
      <div>
        {/* Main Menu */}
        <div
          className="fixed font-sans font-semibold top-0 z-20 flex items-center opacity-70 aspect-[55/2] bg-white backdrop-blur-xl justify-between w-full  px-4 lg:px-6 text-xs shadow-md"
          ref={menuRef}
          style={{ zIndex: 1000 }} // Ensure it stays above other content
        >
          <div className="flex items-center ml-4 gap-6 w-full justify-start">
            {/* Logo */}
            <Link href={PAGE_URLS.HOMEPAGE} passHref>
              <Image
                src="/horizontal.png"
                alt="Company Logo"
                width={160}
                height={50}
                priority
                className="h-12 w-24 rounded-2xl"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex gap-4 items-center">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-black  uppercase  hover:underline"
                  onMouseEnter={() => handleMouseEnter(label)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            {/* Desktop Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/login"
                aria-label="SignUpPage"
                className="w-[130px] h-[40px] text-[14px] font-medium text-white bg-cyan-900 py-2 rounded-lg flex items-center justify-center"
              >
                Sign Up/Sign In
              </Link>
              <BulletButton />
            </div>
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
        <div className="absolute top-full z-50 w-full bg-white  px-4 py-6 shadow-md transition-all duration-300 ease-in-out">
          <ClotheCards />
        </div>
      )}
    </div>
  );
};

export default Menu;
