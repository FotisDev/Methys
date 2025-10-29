"use client";
import GenericSwiper from "@/components/swipers/GenericSwiper";
import CategoryCard from "@/components/cards/CategoryCard";
import { Category } from "@/_lib/types";

export default function CategoriesSwiper({
  categories,
}: {
  categories: Category[];
}) {
  if (!categories?.length) {
    return (
      <p className="text-center mt-10 text-vintage-green">No categories found.</p>
    );
  }
  return (
    <div className="w-full py-8 sm:py-12 md:py-16">
      <GenericSwiper
        items={categories}
        slidesPerView={1}
        spaceBetween={0}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 0 },
          768: { slidesPerView: 1, spaceBetween: 0 },
          1024: { slidesPerView: 2, spaceBetween: 0 },
        }}
        renderItem={(category) => <CategoryCard category={category} />}
        className="h-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh]"
      />
    </div>
  );
}