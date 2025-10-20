import Link from "next/link";
import React from "react";
import Image from "next/image";
const PhotoGallery: React.FC = () => {
  return (
    <div className="w-full flex flex-col relative font-poppins">
      <div className="">
        <div className="flex flex-col lg:flex-row h-[80vh] sm:h-[90vh] lg:h-[100vh] bg-cover justify-center items-center">
          <div className="w-full lg:w-1/2 h-[50vh] md:h-[70vh] lg:h-full flex items-center justify-center">
            <Image
              src="/Articles.jpg"
              alt="Article Image"
              className="w-full h-full object-cover"
              width={10}
              height={10}
              unoptimized
            />
          </div>
          <Link
            href="/products"
            className="absolute bottom-6 left-6  px-6 py-3 text-sm  text-vintage-brown hover:underline"
          >
            Explore more about our latest Collection
          </Link>
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center relative">
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
    </div>
  );
};

export default PhotoGallery;
