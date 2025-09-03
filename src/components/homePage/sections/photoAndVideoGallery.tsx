import Link from "next/link";
import React from "react";

const PhotoGallery: React.FC = () => {
  return (
    <div className="w-full flex flex-col relative">
      <Link href='/products' className="absolute right-3 -top-5 h-12 flex items-center justify-center bg-none text-black underline w-40 px-6 py-3 rounded-full z-10 font-poppins">
       SHOP NOW
      </Link>
      <div className="pt-10">
        <div className="flex flex-col lg:flex-row h-[100vh] bg-cover justify-center items-center pb-10">
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center">
            <img
              src="/Articles.jpg"
              alt="Article Image"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex items-center justify-center">
            <video
              src="/Awareness-16-9.mp4"
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