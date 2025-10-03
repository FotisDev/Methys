import Link from "next/link";
import React from "react";

const PhotoGallery: React.FC = () => {
  return (
    <div className="w-full flex flex-col relative">
      {/* Shop Now Button */}
      <Link
        href="/products"
        className="absolute right-4 top-4 sm:right-6 sm:top-6 
                   bg-amber-500 text-black font-semibold text-sm sm:text-base
                   px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow-md 
                   hover:bg-amber-600 transition z-10 font-poppins"
      >
        SHOP NOW
      </Link>

      {/* Main Section */}
      <div className="pt-10">
        <div className="flex flex-col lg:flex-row h-[80vh] sm:h-[90vh] lg:h-[100vh] bg-cover justify-center items-center">
          {/* Left Side - Image */}
          <div className="w-full lg:w-1/2 h-[50vh] md:h-[70vh] lg:h-full flex items-center justify-center">
            <img
              src="/Articles.jpg"
              alt="Article Image"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side - Video */}
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
