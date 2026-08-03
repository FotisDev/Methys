"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  parent_id: string | null;
};

type MainCategory = {
  id: string;
  name: string;
  subcategories: Category[];
  image_url?: string | null;
};

type DropDownMenuClientProps = {
  mainCategories: MainCategory[];
};

export default function DropDownMenuClient({
  mainCategories,
}: DropDownMenuClientProps) {
  const router = useRouter();

  const toSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  const handleNavigate = (subcategory: Category, mainCategoryName: string) => {
    const mainCategorySlug = toSlug(mainCategoryName);
    const subcategorySlug = toSlug(subcategory.name);
    const fullPath = `/collections/${mainCategorySlug}/${subcategorySlug}`;
    router.push(fullPath);
  };

  return (
    <nav className="fixed left-0 right-0  -top-5 w-screen bg-white z-50 font-serif">
      <div className="w-full grid grid-cols-4 pt-6 pb-0.5">
        <div className="flex flex-col sm:flex-row gap-1">
          <div className="flex flex-col gap-3 pt-2.5 pl-4">
            <Link
              href="/offers"
              className="text-[16px] text-vintage-green uppercase tracking-wide hover:underline"
            >
              See Our Offers
            </Link>
            <Link
              href="/online-exclusive"
              className="text-[16px] text-vintage-green uppercase tracking-wide hover:underline"
            >
              Online Exclusive
            </Link>
            <Link
              href="/seasonal-collection"
              className="text-[16px] text-vintage-green uppercase tracking-wide hover:underline"
            >
              New Collection
            </Link>
          </div>
        </div>
        <div className="col-span-3 ">
          <div className="w-full ">
            <div className="flex gap-0.5">
              {mainCategories.map((mainCat) => {
                let href = "#";

                if (mainCat.name.toLowerCase() === "clothing") {
                  href = "/collections/clothing";
                } else if (mainCat.name.toLowerCase() === "accessories") {
                  href = "/collections/accessories";
                } else if (mainCat.name.toLowerCase() === "kids") {
                  href = "/collections/kids";
                }

                return (
                  <div
                    key={mainCat.id}
                    className="flex-1 flex flex-col gap-4 items-start"
                  >
                    <div className="flex-1 w-full">
                      <h3 className="text-vintage-green text-lg capitalize pb-3">
                        {mainCat.name}
                      </h3>

                      <div className="flex flex-col items-start gap-2 ">
                        {mainCat.subcategories.length > 0 ? (
                          mainCat.subcategories.map((subCat) => (
                            <button
                              key={subCat.id}
                              className=" text-vintage-green text-[13px] over:underline transition-colors whitespace-nowrap capitalize hover:underline cursor-pointer"
                              onClick={() =>
                                handleNavigate(subCat, mainCat.name)
                              }
                            >
                              {subCat.name}
                            </button>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">
                            No subcategories
                          </p>
                        )}
                      </div>
                    </div>

                    {mainCat.image_url && (
                      <Link href={href} className="w-full">
                        <Image
                          src={mainCat.image_url.trim()}
                          alt={mainCat.name}
                          className="w-full max-w-[382px] max-h-[214px] object-cover cursor-pointer hover:opacity-90 transition"
                          width={320}
                          height={299}
                          quality={90}
                        />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {mainCategories.length === 0 && (
          <div className="text-center">
            <p className="text-gray-500">No categories available</p>
          </div>
        )}
      </div>
    </nav>
  );
}
