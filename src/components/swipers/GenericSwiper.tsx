"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";


import type { SwiperOptions } from "swiper/types";
import { useT } from "@/i18n/client";

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
  // autoplay = false,
  // navigation = true,
  // pagination = true,
  breakpoints,
  className = "",
}: GenericSwiperProps<T>) {
  const t = useT();
  if (!items || items.length === 0) {
    return (
      <div className="flex justify-center items-center h-[50vh] bg-gray-50">
        <p className="text-vintage-white text-lg">{t("common.noContent")}</p>
      </div>
    );
  }

  return (
    <Swiper
      modules={[Navigation]}
      // modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={slidesPerView}
      spaceBetween={spaceBetween}
      loop={loop}
      navigation
      pagination={{ clickable: true }}
      autoplay={false}
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