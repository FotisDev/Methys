import { Category } from "@/_lib/types";
import Link from "next/link";
import Image from "next/image";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/products?category=${encodeURIComponent(category.category_name)}`}
      className="relative block w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]"
    >
      <Image
        src={category.image_url || "/yo.jpg"}
        alt={category.category_name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
        className="object-cover object-center"
        priority
      />
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6 text-vintage-white font-poppins">
        <p className="text-xs sm:text-sm opacity-80">Autumn 2025</p>
        <h3 className="text-xs  ">{category.category_name}</h3>
      </div>
    </Link>
  );
}