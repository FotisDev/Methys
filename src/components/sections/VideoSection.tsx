"use client";

import VideoSectionButton from "@/svgs/videoSectionButton";
import { useState, useRef, useEffect } from "react";

const VideoSection = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  const handleToggleFullscreen = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoEl.requestFullscreen();
    }
  };

  useEffect(() => {
    const onFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullScreenChange);
    };
  }, []);

  return (
    <div className="px-4 sm:px-14 py-40 sm:my-20  bg-white">
      <div className="relative flex justify-center items-center bg-white w-full h-[70vh] sm:h-screen  ">
        {/* Background Video */}
        <div className="absolute inset-0 bg-cover bg-center w-full h-full ">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover rounded sm:rounded"
            src="/videos/Awareness-16-9.mp4"
          />
        </div>

        {/* Content */}
       <div className="relative z-10 text-center bg-white px-4 sm:px-8 mb-24 sm:mb-96 mt-20 sm:mt-48">

  {!isVideoPlaying && (
    <>
      <h3 className="text-base sm:text-xl font-bold text-[#d4770d] mb-2">
        Watch Full Video
      </h3>
      <p className="text-3xl sm:text-6xl font-bold text-[#d4770d] mb-6 leading-snug">
        Discover the ease and <br />
        convenience of renting with us.
      </p>
    </>
  )}

  {!isVideoPlaying && (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center justify-center w-[130px] h-[130px] sm:w-[165px] sm:h-[165px] rounded-full bg-white bg-opacity-10 backdrop-blur-2xl">
        <div className="flex flex-col items-center justify-center w-[115px] h-[115px] sm:w-[150px] sm:h-[150px] rounded-full bg-white bg-opacity-40 backdrop-blur-2xl">
          <div onClick={handlePlayVideo} className="cursor-pointer">
            <VideoSectionButton
              circleColor="#063f1e"
              pathColor="white"
              size={110}
            />
          </div>
        </div>
      </div>
    </div>
  )}

  {isVideoPlaying && (
    <div className="relative w-full h-[50vh] sm:h-screen  sm:mt-1 rounded-[20px] sm:rounded-[40px] overflow-hidden">
      <video
        ref={videoRef}
        width="100%"
        height="90%"
        controls
        autoPlay
        loop
        playsInline
        className="w-full h-full object-cover"
        src="/Awareness-16-9.mp4"
      />
      <button
        onClick={handleToggleFullscreen}
        className="absolute top-4 right-4 z-50 bg-white text-black px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md shadow-md"
      >
        {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
      </button>
    </div>
  )}
</div>

      </div>
    </div>
  );
};

export default VideoSection;
