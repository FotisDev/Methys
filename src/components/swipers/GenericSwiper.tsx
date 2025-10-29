"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type GenericSwiperProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  slidesPerView?: number;
  spaceBetween?: number;
  loop?: boolean;
  autoplay?: boolean;
  breakpoints?: Record<string, any>;
  className?: string;
};

export default function GenericSwiper<T>({
  items,
  renderItem,
  slidesPerView = 1,
  spaceBetween = 10,
  loop = true,
  autoplay = true,
  breakpoints,
  className = "",
}: GenericSwiperProps<T>) {
  if (!items?.length) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-vintage-green">No content available.</p>
      </div>
    );
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      loop={loop}
      navigation
      pagination={{ clickable: true }}
      autoplay={autoplay ? { delay: 4000, disableOnInteraction: false } : false}
      breakpoints={breakpoints}
      className={`relative ${className}`}
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>{renderItem(item, index)}</SwiperSlide>
      ))}
    </Swiper>
  );
}
