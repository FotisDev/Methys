"use client";

import Image from "next/image";
import { LinkedIn } from "@/svgs/linkedIn";
import { JSX } from "react";
import { Youtube } from "@/svgs/youtube";
import { X } from "@/svgs/X";
import { Instagram } from "@/svgs/instagram";
import { Facebook } from "@/svgs/facebook";
import { Tiktok } from "@/svgs/tiktok";
import { WorldShpereSvg } from "@/svgs/worldShpere";
import Link from "next/link";
import FoldableSectionComponent from "../foldableComponent/FoldableSection";
import { useAuth } from "../providers/AuthProvider";


export default function Footer() {
  const { isAuthenticated, isLoading } = useAuth();

  const socials: Array<{
    name: string;
    icon: (() => JSX.Element) | null;
    url: string;
  }> = [
    { name: "facebook", icon: Facebook, url: "" },
    { name: "instagram", icon: Instagram, url: "" },
    { name: "X", icon: X, url: "" },
    { name: "tiktok", icon: Tiktok, url: "" },
    { name: "linkedin", icon: LinkedIn, url: "" },
    { name: "youtube", icon: Youtube, url: "" },
  ];

  const [legalPolicyColumn, quickLinksColumn, paymentMethods] = [
    {
      category: "Legal Policy",
      items: [
        { name: "Terms & Conditions", href: "/termsAndConditions" },
        { name: "Privacy Policy", href: "/privacyAndPolicy" },
        { name: "Legal Notice", href: "/legalNotice" },
        { name: "FAQ", href: "/faq" },
      ],
    },
    {
      category: "Quick Links",
      items: [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Help", href: "/help" },
      ],
    },
    {
      category: "Payment Methods",
      items: [
        { name: "Paypal", href: "/" },
        { name: "MasterCard", href: "/" },
        { name: "Revolut", href: "/" },
        { name: "Klarna", href: "/" },
        { name: "Stripe", href: "/" },
      ],
      Icon: "/paymentMethods.png",
    },
  ];

  return (
    <footer className="w-full font-robboto bg-white">
      <section
        className="
          grid
          grid-cols-1
          sm:grid-cols-1
          md:grid-cols-1
          lg:grid-cols-5
          gap-8
          px-2
          py-10
         
          
        "
      >
        <div className="flex flex-col gap-6 w-full sm:w-96 lg:w-full">
          <h3 className="font-bold text-vintage-green">
            Join The Methys Community
          </h3>

          <p className="text-sm">
            Get a heads up about latest Collections, events and collaborations
          </p>

          <form className="flex w-full">
            <input
              type="email"
              placeholder="Enter your Email"
              required
              className="border border-default-color w-full p-2 text-sm"
            />
            <button type="submit" className="bg-default-cold text-white w-16">
              →
            </button>
          </form>

          <div className="flex gap-4">
            {socials.map((social, index) => {
              const Icon = social.icon;
              return (
                <div key={index} className="w-5 h-5 cursor-pointer text-black">
                  {Icon ? <Icon /> : social.name}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2 text-center lg:text-left">
          <FoldableSectionComponent
            title={legalPolicyColumn.category}
            items={legalPolicyColumn.items}
          />
        </div>

        <div className="flex flex-col gap-2 text-center lg:text-left">
          <FoldableSectionComponent
            title={quickLinksColumn.category}
            items={quickLinksColumn.items}
          />
        </div>

        <div className="flex flex-col gap-2 text-center lg:text-left">
          <FoldableSectionComponent
            title={paymentMethods.category}
            items={paymentMethods.items}
          />
        </div>

        <div className="flex flex-col items-center lg:items-start gap-6">
          <div>
            <h3 className="font-bold">Country</h3>
            <div className="flex items-center gap-2">
              <WorldShpereSvg />
              <p className="text-sm underline">International</p>
            </div>
          </div>

          <Image
            src="/paymentMethods.png"
            alt="Payment Methods"
            className="w-40 sm:w-48 lg:w-60"
            width={240}
            height={60}
            unoptimized
          />
        </div>
      </section>
      <hr />
      
      <div className="relative px-4 py-6">
        <div className="text-center text-sm">
          © 2025 <span className="text-vintage-green font-bold">Methys.</span>{" "}
          All Rights Reserved.
        </div>

        {!isLoading && !isAuthenticated && (
          <div
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              gap-4
              text-sm
              mt-6
              lg:absolute
              lg:right-5
              lg:bottom-6
            "
          >
            <span className="text-vintage-green text-center">
              For special <span className="text-red-500">Offers</span> make sure
              to
            </span>

            <Link
              href="/login"
              className="w-[130px] h-[40px] bg-vintage-white text-black flex items-center justify-center rounded"
            >
              Sign Up / Sign In
            </Link>
          </div>
        )}
      </div>
    </footer>
  );
}
