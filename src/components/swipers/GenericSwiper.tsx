"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import type { SwiperOptions } from "swiper/types";

type SwiperBreakpoints = Record<number, SwiperOptions>;

type GenericSwiperProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  slidesPerView?: number | "auto";
  spaceBetween?: number;
  loop?: boolean;
  autoplay?: boolean | { delay: number; disableOnInteraction: boolean };
  navigation?: boolean;
  pagination?: boolean | { clickable?: boolean };
  breakpoints?: SwiperBreakpoints;
  className?: string;
};

export default function GenericSwiper<T>({
  items,
  renderItem,
  slidesPerView = 1,
  spaceBetween = 10,
  loop = true,
  autoplay = true,
  navigation = true,
  pagination = true,
  breakpoints,
  className = "",
}: GenericSwiperProps<T>) {
  if (!items || items.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh] bg-gray-50">
        <p className="text-vintage-white text-lg">No content available.</p>
      </div>
    );
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      loop={loop}
      navigation={navigation}
      pagination={pagination ? { clickable: true } : false}
      autoplay={
        autoplay
          ? { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }
          : false
      }
      breakpoints={breakpoints}
      className={className}
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>
          {renderItem(item, index)}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}