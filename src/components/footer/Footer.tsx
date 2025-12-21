// import Newsletter from "./NewsLeter";
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

// interface FooterProps {
//   showNewsLetter?: boolean;
// }

// export default function Footer({ showNewsLetter = true }: FooterProps) {
export default function Footer() {
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

  const [legalPolicyColumn, quickLinksColumn, paymentMethods]: Array<{
    category: string;
    items: Array<{ name: string; href: string }>;
    Icon?: string;
    email?: string;
  }> = [
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
        { name: "Blog", href: "/blog" },
        { name: "Offers", href: "/offers" },
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
    {
      category: "Contact Us",
      items: [{ name: "", href: "" }],
      email: "fotislir@outlook.com",
    },
  ];

  return (
    <footer className="h-full padding-y items-center justify-center font-robboto w-full ">
      {/* {showNewsLetter && <Newsletter />} */}
      <section className="grid grid-cols-5 bg-white gap-2 justify-items-center">
        <div className="pl-1 flex flex-col gap-6  text-md ">
          <h3 className="font-bold text-vintage-green">
            Join The Methys Community
          </h3>
          <p>
            Get a heads up about latest Collections, events and collaborations
          </p>
          <form className="flex flex-row ">
            <input
              type="email"
              placeholder="Enter your Email"
              required
              className="border border-default-color w-full h-auto p-2 text-center "
            />
            <button
              type="submit"
              className="bg-default-cold text-white w-20 h-14"
            >
              {"->"}
            </button>
          </form>
          <div className="pt-2 flex flex-row gap-4">
            {socials.map((social, index) => {
              const Icon = social.icon;
              return (
                <div
                  key={index}
                  className="w-5 h-5 cursor-pointer flex text-black"
                >
                  {Icon ? <Icon /> : social.name}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2 ">
          <h3 className="font-bold ">{legalPolicyColumn.category}</h3>
          {legalPolicyColumn.items.map((item, index) => (
            <a key={index} href={item.href}>
              {item.name}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-2 ">
          <h3 className="font-bold">{quickLinksColumn.category}</h3>
          {quickLinksColumn.items.map((item, index) => (
            <a key={index} href={item.href}>
              {item.name}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-2 ">
          <h3 className="font-bold  ">{paymentMethods.category}</h3>
          {paymentMethods.items.map((item, index) => (
            <a key={index} href={item.href}>
              {item.name}
            </a>
          ))}
        </div>
        <div>
          <div className="w-4 h-4 flex flex-col gap-3">
            <h3 className=" font-bold">Country</h3>
            <div className="flex">
              <span className="">
                <WorldShpereSvg />
              </span>
              <p className="text-sm underline ">International</p>
            </div>
          </div>
          <div className="mt-12">
            {paymentMethods.Icon && (
              <Image
                src={paymentMethods.Icon}
                alt="Payment Methods"
                className="mt-5 w-60"
                width={20}
                height={20}
                unoptimized
              />
            )}
          </div>
        </div>
      </section>
      <hr className=" mt-5" />
      <div className="flex flex-col items-center relative ">
        <div className=" text-center mt-5">
          © 2025 <span className="text-vintage-green font-bold"> Methys.</span>{" "}
          All Rights Reserved. Terms and Conditions Privacy Policy Cookies
          Cookie settings
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-center  absolute right-5 -bottom-3">
          <span className="text-vintage-green">
            For special <span className="text-red-500">Offers</span> make sure
            to{" "}
          </span>
          <Link
            href="/login"
            className="w-[130px] h-[40px] text-[14px] bg-vintage-white text-black px-2 py-2 rounded text-center"
          >
            Sign Up / Sign In
          </Link>
        </div>
      </div>
    </footer>
  );
}
