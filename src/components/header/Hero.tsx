"use client";
//import Image from "next/image";
import Link from "@/components/LocaleLink/LocaleLink";
import { useT } from "@/i18n/client";

const HeroSection = () => {
  const t = useT();
  return (
    <section
      aria-labelledby="hero-heading"
      className="flex mx-auto aspect-[4/5] sm:aspect-video font-serif"
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

        <div className="relative z-10 flex flex-col sm:flex-row justify-center items-start sm:items-center px-4 sm:px-0 sm:ml-2 w-full h-full gap-1 sm:gap-2">
          <Link
            href="/collections"
            className="text-white-f6 text-md hover:underline "
          >
            <h1>{t("hero.title")}</h1>
          </Link>

          <p className="text-vintage-green">{t("hero.tagline")}</p>
        </div>
      </div>
    </section>
  );
};

export default function Page() {
  return <HeroSection />;
}
