"use client";
import Image from "next/image";
import Link from "next/link";

// Import your SlidingCards component here
// import SlidingCards from "./SlidingCards"; 

const HeroSection = () => {
  return (
    <div className="flex  mx-auto pt-12 sm:pt-20 md:pt-17  aspect-[14/9]  pb-6 sm:pb-8 md:pb-10 bg-white">
      <div className="relative w-full min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh] lg:min-h-[95vh] xl:min-h-[100vh] bg-cover overflow-hidden bg-center flex flex-col items-center justify-center  text-white">
        {/* Background Image */}
        <Image
          alt="Hero Image"
          src="/yo.jpg"
          fill
          className="object-cover "
          priority
          sizes="100vw"
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-col w-full px-3 sm:px-4 md:px-6 lg:px-12 xl:px-24 mt-8 sm:mt-12 md:mt-16 lg:mt-20 gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-col lg:flex-col xl:flex-row xl:justify-between items-center xl:items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Text Section */}
            <div className="flex flex-col text-center xl:text-left space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-11 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-tight text-black">
                Dress Beyond Limits.
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-black leading-relaxed">
                Elevate your everyday. Explore styles designed to turn
                heads crafted for those who don't settle.
              </p>

              {/* CTA Button */}
              <div className="flex justify-center xl:justify-start pt-2 sm:pt-4">
                <Link
                  href="/products"
                  className="px-4 sm:px-6 md:px-8 lg:px-10 bg-amber-500 h-10 sm:h-12 md:h-14 lg:h-16 text-white font-light text-sm sm:text-base md:text-lg rounded-full transition hover:bg-amber-600 active:bg-amber-700 text-center flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
                >
                  Explore Our Collection
                </Link>
              </div>
            </div>

            {/* Sliding Card Component */}
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  return <HeroSection />;
}