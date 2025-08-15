import Logo from "@/svgs/logo";
import Link from "next/link";
import Newsletter from "./NewsLeter";
import Image from "next/image";

export default function Footer() {
  const paymentMethods = [
    {
      name: "VISA",
      width: "122px",
    },
    {
      name: "MASTERCARD",
      width: "122px",
    },
    {
      name: "AMERICAN EXPRESS",
      width: "155px",
    },
  ];

  const columnsData = [
    {
      category: "Legal Policy",
      items: [
        { name: "Terms & Conditions", url: "/" },
        { name: "Privacy Policy", url: "/" },
        { name: "Legal Notice", url: "/" },
        { name: "Accessibility", url: "/" },
      ],
    },
    {
      category: "Quick Links",
      items: [
        { name: "Home", url: "/" },
        { name: "About Us", url: "/about" },
        { name: "Blog", url: "/blog" },
        { name: "Join Our Network", url: "/offerPage" },
      ],
    },
  ];

  return (
    <>
      <Newsletter />

      <footer className="bg-black w-full text-white  text-sm sm:text-base font-poppins">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-40 sm:pt-36 lg:pt-32">
          {/* ROW 1: App Download + Socials */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
            {/* Download the App */}
            <div className="space-y-6 text-center lg:text-left">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-sahara">
                Download the App
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Image
                  src="/google-play-badge.png"
                  alt="Google Play"
                  width={150}
                  height={50}
                  className="w-36 h-auto"
                />
                <Image
                  src="/app-store-badge.png"
                  alt="App Store"
                  width={150}
                  height={50}
                  className="w-36 h-auto"
                />
              </div>
            </div>

            {/* Follow Us */}
            <div className="space-y-6 text-center lg:text-right">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                Follow Us
              </h3>
              <div className="flex gap-4 justify-center lg:justify-end">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full cursor-pointer flex items-center justify-center text-black font-semibold hover:bg-gray-200 transition-colors">
                  Fb
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full cursor-pointer flex items-center justify-center text-black font-semibold hover:bg-gray-200 transition-colors">
                  YT
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full cursor-pointer flex items-center justify-center text-black font-semibold hover:bg-gray-200 transition-colors">
                  In
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full cursor-pointer flex items-center justify-center text-black font-semibold hover:bg-gray-200 transition-colors">
                  IG
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full cursor-pointer flex items-center justify-center text-black font-semibold hover:bg-gray-200 transition-colors">
                  TT
                </div>
              </div>
            </div>
          </div>

          {/* Yellow Line */}
          <div className="h-[2px] bg-sahara w-full mb-16"></div>

          {/* ROW 2: Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
            {columnsData.map((column) => (
              <div
                key={column.category}
                className="space-y-4 text-center sm:text-left"
              >
                <h4 className="text-sahara font-semibold text-base sm:text-lg">
                  {column.category}
                </h4>
                <ul className="space-y-2">
                  {column.items.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.url}
                        className="hover:underline hover:text-sahara transition-colors text-sm sm:text-base"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ROW 3: Bottom Line */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-700 gap-4">
            {/* Left */}
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              <span className="font-bold text-lg sm:text-xl text-myCyan">UrbanValor</span>
              <span className="text-sm text-gray-300">
                © 2025 All rights reserved
              </span>
            </div>

            {/* Right */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-center">
              <Link
                href="/terms"
                className="hover:underline hover:text-yellow-400 transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacy"
                className="hover:underline hover:text-yellow-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
