import myImageLoader from "../../../_lib/utils/myImageLoader";
import React from "react";
import Image from "next/image";

const GradientBorders = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={`w-full max-w-[530px] h-auto relative mt-16 lg:mt-28 lg:ml-16 ${className}`}
    >
      {/* First Gradient Border (blurred background) */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900 to-amber-700 opacity-90 h-80 md:h-96 blur-3xl lg:mt-40 -rotate-45 transform rounded-full"></div>

      {/* Second Gradient Border (thin circular outline with fading effect) */}
      <div
        className="absolute inset-0 bg-none w-[70%] h-[80%] transform rounded-[200px] top-[60%] left-[40%] -translate-x-1/2 -translate-y-1/2 z-20 border-2  border-amber-500"
        style={{
          maskImage:
            "radial-gradient(circle, transparent 20%, rgba(0, 0, 0, 1) 100%)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 20%, rgba(0, 0, 0, 1) 100%)",
        }}
      ></div>

      {/* Third Gradient Border (thin circular outline with fading effect) */}
      <div
        className="absolute inset-0 bg-none w-[65%] h-[85%] transform rounded-[200px] top-[50%] left-[57%] -translate-x-1/2 -translate-y-1/2 z-20 border-2  border-amber-500"
        style={{
          maskImage:
            "radial-gradient(circle, transparent 20%, rgba(0, 0, 0, 1) 100%)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 20%, rgba(0, 0, 0, 1) 100%)",
        }}
      ></div>

      {/* Image Container with Rounded Corners */}
      <div
        className="relative rounded-full overflow-hidden shadow-lg mx-auto lg:mx-4"
        style={{
          width: "70%",
          height: "85%",
          top: "10%",
          left: "10%",
          zIndex: 30, // Image is always in front of borders
        }}
      >
        {/* Background color as fallback in case image doesn't load */}
        <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
          <span className="text-gray-500">Image Not Found</span>
        </div>

        {/* Image itself */}
        <div
          className="absolute inset-0 bg-cover bg-start"
          style={{ backgroundImage: "url(/howWorkImage.webp)" }}
        ></div>
      </div>

      {/* Text Box */}
      <div className="absolute w-full max-w-[200px] lg:max-w-[270px] h-auto left-1/2 lg:left-72 transform -translate-x-/2 lg:translate-x-16 top-[450px] bg-amber-500 z-40 text-white px-4 py-5 rounded-3xl flex flex-col items-center">
        <p className="text-xl xl:text-xl font-normal mb-2 mr-16">
          1m+ Trusted <br />
          world wide <br />
          Global clients
        </p>

        <div className="w-full my-2">
          <hr className="border-t-2 font-bold border-white h-2 " />
        </div>

        <div className="flex  mt-2 justify-center  mr-12 -space-x-2 p-2">
          <Image
            loader={myImageLoader}
            width={30}
            height={30}
            src="/TrendingCloth.jpg"
            alt="Client 1"
            className="w-8 h-8 md:w-12 md:h-12 rounded-full"
            unoptimized
          />
          <Image
            loader={myImageLoader}
            width={30}
            height={30}
            src="/TrendingCloth.jpg"
            alt="Client 2"
            className="w-8 h-8 md:w-12 md:h-12 rounded-full"
            unoptimized
          />
          <Image
            loader={myImageLoader}
            width={30}
            height={30}
            src="/TrendingCloth.jpg"
            alt="Client 3"
            className="w-8 h-8 md:w-12 md:h-12 rounded-full"
            unoptimized
          />
          <div className="w-12 h-12 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center font-extralight text-amber-600 text-4xl xl::text-base">
            +
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientBorders;
