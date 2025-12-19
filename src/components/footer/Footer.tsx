
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

  const [
    legalPolicyColumn,
    quickLinksColumn,
    paymentMethods,
  ]: Array<{
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
          <h3 className="font-bold text-vintage-green">Join The Methys Community</h3>
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
            <span className=""><WorldShpereSvg /></span>
           <p className="text-sm underline ">International</p></div> 
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
      <hr className="pt-2 mt-5"/>
      <div className=" text-center py-2">© 2025 <span className="text-vintage-green font-bold"> Methys.</span> All Rights Reserved.
Terms and Conditions
Privacy Policy
Cookies
Cookie settings</div>
    </footer>
    // <>
    //   {/* {showNewsLetter && <Newsletter />} */}
    //   <footer className="bg-default-yellow w-full text-vintage-green text-sm sm:text-base font-poppins">
    //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-40 sm:pt-36 lg:pt-32">
    //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
    //         <div className="space-y-6 text-center lg:text-left">
    //           <h3 className="text-lg sm:text-xl lg:text-2xl  text-vintage-green">
    //             Download the App
    //           </h3>
    //           <div className="flex flex-col sm:flex-row items-center gap-2">
    //             <Link
    //               href="https://play.google.com/store"
    //               target="_blank"
    //               rel="noopener noreferrer"
    //               className="inline-block"
    //             >
    //               <Image
    //                 src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
    //                 alt="Google Play"
    //                 width={150}
    //                 height={50}
    //                 className="w-44 h-auto"
    //               />
    //             </Link>
    //             <Link
    //               href="https://www.apple.com/app-store"
    //               target="_blank"
    //               rel="noopener noreferrer"
    //               className="inline-block"
    //             >
    //               <Image
    //                 src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"
    //                 alt="App Store"
    //                 width={150}
    //                 height={50}
    //                 className="w-38 h-auto"
    //               />
    //             </Link>
    //           </div>
    //         </div>

    //         <div className="space-y-6 text-center lg:text-center">
    //           <h3 className="text-lg lg:text-xl ">Follow Us</h3>
    //           <div className="flex gap-4 justify-start lg:justify-center flex-wrap">
    //             {["Fb", "YT", "In", "IG", "TT"].map((social) => (
    //               <div
    //                 key={social}
    //                 className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full cursor-pointer flex items-center justify-center text-black  hover:bg-vintage-white transition-colors"
    //               >
    //                 {social}
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //       </div>

    //       <div className="h-[2px] bg-sahara w-full mb-16"></div>

    //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
    //         {columnsData.map((column) => (
    //           <div
    //             key={column.category}
    //             className="space-y-4 text-center sm:text-left"
    //           >
    //             <h4 className="text-sahara  text-base sm:text-lg">
    //               {column.category}
    //             </h4>

    //             {column.items.length > 0 && (
    //               <ul className="space-y-2">
    //                 {column.items.map((item, index) => (
    //                   <li key={`${column.category}-${index}`}>
    //                     <Link
    //                       href={item.href}
    //                       className="hover:underline hover:text-sahara transition-colors text-sm sm:text-base"
    //                       // aria-label={`Learn more about ${item.name}`}
    //                     >
    //                       {item.name}
    //                     </Link>
    //                   </li>
    //                 ))}
    //               </ul>
    //             )}

    //             {column.category === "Payment Methods" && (
    //               <div className="flex flex-col gap-3 items-center sm:items-start">
    //                 {paymentMethods.map((method) => (
    //                   <div
    //                     key={method.name}
    //                     className="bg-white text-black py-2 px-4 rounded-md text-center"
    //                     style={{ width: method.width }}
    //                   >
    //                     {method.name}
    //                   </div>
    //                 ))}
    //               </div>
    //             )}

    //             {column.category === "Contact Us" && (
    //               <div className="space-y-2 text-sm sm:text-base">
    //                 <p>Email: support@Methys.com</p>
    //                 <p>Phone: +30 (695) 144-2347</p>
    //                 <p>Hours: Mon-Fri 9AM-5PM</p>
    //               </div>
    //             )}
    //           </div>
    //         ))}
    //       </div>

    //       <div className="flex flex-col lg:flex-row justify-between items-center pt-8 border-t border-gray-700 gap-6">
    //         <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
    //           <span className=" text-lg sm:text-xl text-vintage-white">
    //             Methys
    //           </span>
    //           <span className="text-sm text-vintage-white">
    //             © 2025 All rights reserved
    //           </span>
    //         </div>

    //         <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-center">
    //           <span className="text-vintage-green">
    //             For special <span className="text-red-500">Offers</span> make
    //             sure to{" "}
    //           </span>
    //           <Link
    //             href="/login"
    //             className="w-[130px] h-[40px] text-[14px] bg-vintage-white text-black px-2 py-2 rounded text-center"
    //           >
    //             Sign Up / Sign In
    //           </Link>
    //         </div>
    //       </div>
    //     </div>
    //   </footer>
    // </>
  );
}
