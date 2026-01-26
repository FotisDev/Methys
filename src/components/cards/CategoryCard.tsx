import Link from "next/link";
import Image from "next/image";

type CategoryType = {
  id: number;
  category_name: string;
  slug: string;
  image_url: string;
};

type SubcategoryType = {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  parent_id: number | null;
};

export default function CategoryCard({ 
  category, 
  subcategory 
}: { 
  category: CategoryType;
  subcategory: SubcategoryType;
}) {
  return (
    <Link
      href={`/products/${category.slug}/${subcategory.slug}`}
      className="relative block w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]"
    >
      <Image
        src={subcategory.image_url || category.image_url || "/yo.jpg"}
        alt={`${category.category_name} - ${subcategory.name}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
        className="object-cover object-center"
        priority
        unoptimized
      />
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6 text-vintage-white font-poppins">
        <p className="text-xs sm:text-sm opacity-80">Autumn 2025</p>
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">
          {category.category_name}
        </h3>
        <p className="text-xs sm:text-sm opacity-90">{subcategory.name}</p>
      </div>
    </Link>
  );
}