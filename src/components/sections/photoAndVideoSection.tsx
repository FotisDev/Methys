import Link from "next/link";
import React from "react";
import Image from "next/image";

const PhotoVideoSection: React.FC = () => {
  return (
    <div className="w-full relative font-poppins">
      <div className="flex flex-col lg:flex-row h-[50vh] md:h-[70vh] lg:h-[100vh]">
        <div className="w-full lg:w-1/2 h-full relative">
          <Image
            src="/Articles.jpg"
            alt="Article Image"
            fill
            className="object-cover"
            unoptimized
          />
          <Link
            href="/online-exclusive"
            className="absolute bottom-6 left-6 px-6 py-3 text-sm text-vintage-white hover:underline"
          >
            Explore more about our Online-exclusive collection
          </Link>
        </div>
        <div className="hidden lg:block w-1/2 h-full relative">
          <video
            src="/man-window.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        </div>

      </div>
    </div>
  );
};

export default PhotoVideoSection;