"use client";
//import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="flex mx-auto aspect-[4/5] sm:aspect-video font-roboto"
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
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full min-h-[460px] object-cover"
        >
          <source
            src="https://orvzr4xhmehppcl6.public.blob.vercel-storage.com/on-balcony.mp4"
            type="video/mp4"
          />
        </video>

        <div className="relative z-10 flex items-center ml-2 w-full h-full gap-2">
          <Link
            href="/en/collections"
            className="text-vintage-white text-md hover:underline "
          >
            <h1> Methys Collection</h1>
          </Link>

          <p>Timeless style. Exceptional quality.</p>
        </div>
      </div>
    </section>
  );
};

export default function Page() {
  return <HeroSection />;
}
