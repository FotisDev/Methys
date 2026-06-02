"use client";

import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ProductInDetails } from "@/_lib/types";
import SeasonalCollectionCard from "../cards/SeasonalCollectionCard";

interface Props {
  items: ProductInDetails[];
}

export default function SwiperComponent({ items }: Props) {
  return (
    <Swiper
      spaceBetween={1}
      slidesPerView={5}
      navigation
      pagination={{ clickable: true }}
      modules={[]}
      className="w-full"
      breakpoints={{
        100: { slidesPerView: 2 },
        200: { slidesPerView: 2 },
        300: { slidesPerView: 2 },
        400: { slidesPerView: 2 },
        560: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
        1200: { slidesPerView: 5 },
      }}
    >
      {items.map((item) => (
        <SwiperSlide key={item.id}>
          <SeasonalCollectionCard item={item} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
