import Link from "next/link";
import Image from "next/image";
import RightArrowIcon from "@/svgs/RightArrowIcon";

type CategoryType = {
  id: number;
  category_name: string;
  slug: string;
  image_url: string;
  blur_data_url?: string;
};

type SubcategoryType = {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  parent_id: number | null;
  blur_data_url?: string;
};

export default function CategoryCard({
  category,
  subcategory,
  priority = false,
}: {
  category: CategoryType;
  subcategory: SubcategoryType;
  priority?: boolean;
}) {
  const blurDataUrl = subcategory.blur_data_url ?? category.blur_data_url;

  return (
    <Link
      href={`/collections/${category.slug}/${subcategory.slug}`}
      className="relative block w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]"
    >
      <Image
        src={subcategory.image_url || category.image_url || "/yo.jpg"}
        alt={`${category.category_name} - ${subcategory.name}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
        className="object-cover object-center"
        priority={priority}
        placeholder={blurDataUrl ? "blur" : "empty"}
        blurDataURL={blurDataUrl}
      />
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6 text-vintage-white fond-sans">
        <h2 className="text-base lg:text-xl capitalize sm:text-sm opacity-90">
          {subcategory.name}
        </h2>
        <div className=" flex flex-row">
          <p className="text-[10px] hover:underline ">Shop Now</p> 
          <span>
            <RightArrowIcon className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
