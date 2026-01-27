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
      spaceBetween={0}
      slidesPerView={2}
      navigation
      pagination={{ clickable: true }}
      modules={[]}
      // modules={[Pagination, Navigation]}
      className="w-full"
      breakpoints={{
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
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
