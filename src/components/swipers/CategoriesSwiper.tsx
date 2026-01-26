"use client";
import GenericSwiper from "@/components/swipers/GenericSwiper";
import CategoryCard from "@/components/cards/CategoryCard";

type Slide = {
  category: {
    id: number;
    category_name: string;
    slug: string;
    image_url: string;
  };
  subcategory: {
    id: number;
    name: string;
    slug: string;
    image_url: string;
    parent_id: number | null;
  };
};

export default function CategoriesSwiper({
  categories,
}: {
  categories: Slide[];
}) {
  if (!categories?.length) {
    return (
      <p className="text-center text-vintage-white">No categories found.</p>
    );
  }

  return (
    <div className="w-full pt-1">
      <GenericSwiper
        items={categories}
        slidesPerView={1}
        spaceBetween={0}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 0 },
          768: { slidesPerView: 1, spaceBetween: 0 },
          1024: { slidesPerView: 2, spaceBetween: 0 },
        }}
        renderItem={(slide) => (
          <CategoryCard 
            category={slide.category} 
            subcategory={slide.subcategory}
          />
        )}
        className="h-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh]"
      />
    </div>
  );
}