import Link from "@/components/LocaleLink/LocaleLink";
import React from "react";
import Image from "next/image";
import { getT } from "@/i18n/server";

const PhotoVideoSection = async () => {
  const t = await getT();
  return (
    <div className="w-full relative font-serif">
      <div className="flex flex-col lg:flex-row h-[50vh] md:h-[70vh] lg:h-[100vh]">
        <div className="w-full lg:w-1/2 h-full relative">
          <Image
            src="/Articles.jpg"
            alt={t("photoVideo.imageAlt")}
            fill
            className="object-cover"
            unoptimized
          />
          <Link
            href="/online-exclusive"
            className="absolute bottom-6 left-6 px-6 py-3 text-sm text-vintage-white hover:underline"
          >
            {t("photoVideo.exploreOnlineExclusive")}
          </Link>
        </div>
        <div className="hidden lg:block w-1/2 h-full relative">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover rounded sm:rounded"
          >
            <source
              src="https://orvzr4xhmehppcl6.public.blob.vercel-storage.com/man-window.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    </div>
  );
};

export default PhotoVideoSection;
