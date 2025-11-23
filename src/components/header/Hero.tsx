"use client";
//import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="flex mx-auto aspect-[4/3] sm:aspect-video font-roboto"
    >
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
         {/* <Image
          alt="Hero background showing stylish clothing"
          src="/yo.jpg"
          fill
          className="object-cover"
          priority
          sizes="150vw"
        
          
        /> */}
        <video
          src="/on-balcony.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        ></video>
        
        <div className="relative z-10 flex items-center ml-2 w-full h-full">
          <Link 
            href="/products" 
            className="text-vintage-white text-md hover:underline "
          >
            Explore Our Collection
          </Link>
        </div>
      </div>
    </section>
  );
};

export default function Page() {
  return <HeroSection />;
}