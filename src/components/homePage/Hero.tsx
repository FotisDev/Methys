"use client";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="flex mx-auto pt-0 sm:pt-0 md:pt-0 aspect-[14/9] pb-6 sm:pb-8 md:pb-10 bg-white"
    >
      <div className="relative w-full min-h-[80vh] sm:min-h-[85vh] md:min-h-[90vh] lg:min-h-[95vh] xl:min-h-[100vh] bg-cover overflow-hidden bg-center flex flex-col items-start justify-center text-white">
        <Image
          alt="Hero background showing stylish clothing"
          src="/yo.jpg"
          fill
          className="object-cover"
          priority
          sizes="150vw"
        />

        <div className="relative z-10 flex flex-col w-full pl-0 mt-8 sm:mt-12 md:mt-16 lg:mt-20 gap-4 sm:gap-6">
          <div className="flex flex-col items-start gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            <div className="flex flex-col text-left space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-11 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl">
              <div className="flex justify-start pt-2 sm:pt-4 pl-8">
                <Link
                  href="/products"
                  className="text-white hover:underline"
                >
                  Explore Our Collection{' - >'}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default function Page() {
  return <HeroSection />;
}