"use client";
import GenericSwiper from "@/components/swipers/GenericSwiper";
import CategoryCard from "@/components/cards/CategoryCard";
import { useT } from "@/i18n/client";
import RightArrowIcon from "@/svgs/RightArrowIcon";
import Link from "@/components/LocaleLink/LocaleLink";

type Slide = {
  category: {
    id: number;
    category_name: string;
    slug: string;
    image_url: string;
    blur_data_url?: string;
  };
  subcategory: {
    id: number;
    name: string;
    slug: string;
    image_url: string;
    parent_id: number | null;
    blur_data_url?: string;
  };
};

export default function CategoriesSwiper({
  categories,
}: {
  categories: Slide[];
}) {
  const t = useT();
  if (!categories?.length) {
    return (
      <p className="text-center text-vintage-white">{t("nav.noCategories")}</p>
    );
  }

  return (
    <div className="w-full pt-1">
      <h2 className="p-4 text-base font-normal">
        <Link
          href="/collections"
          className="inline-flex flex-row hover:underline"
        >
          {t("home.exploreCategories")}
          <span>
            <RightArrowIcon className="w-5 h-5 mt-0.5" />
          </span>
        </Link>
      </h2>
      <GenericSwiper
        items={categories}
        slidesPerView={1}
        spaceBetween={0}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 0 },
          768: { slidesPerView: 1, spaceBetween: 0 },
          1024: { slidesPerView: 2, spaceBetween: 0 },
        }}
        renderItem={(slide, index) => (
          <CategoryCard
            category={slide.category}
            subcategory={slide.subcategory}
            priority={index === 0}
          />
        )}
        // clip instead of Swiper's overflow: hidden, which would stop the
        // card labels from sticking while the page scrolls.
        className="h-auto max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] overflow-clip!"
      />
    </div>
  );
}
