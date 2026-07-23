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

export default function DropDownMenuClient({ mainCategories }: DropDownMenuClientProps) {

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
    <nav className="fixed left-0 right-0 w-screen bg-white z-50">
      <div className="w-full">
        <div className="py-6 flex flex-col sm:flex-row gap-1">
          <div className="flex flex-col space-y-3 min-w-[200px] pl-8">
            <Link
              href="/offers"
              className="text-lg text-gray-800 hover:text-gray-600 transition-colors uppercase tracking-wide"
            >
              See Our Offers
            </Link>
            <Link
              href="/online-exclusive"
              className="text-lg text-gray-800 hover:text-gray-600 transition-colors uppercase tracking-wide"
            >
              Online Exclusive
            </Link>
            <Link
              href="/seasonal-collection"
              className="text-lg text-gray-800 hover:text-gray-600 transition-colors uppercase tracking-wide"
            >
              New Collection
            </Link>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-[1440px]">
              <div className="flex gap-1">
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
                      className="flex-1 flex flex-col items-start "
                    >
                      <div className="flex-1 w-full">
                        <h3 className="text-gray-800 text-lg capitalize mb-2">
                          {mainCat.name}
                        </h3>

                        <div className="flex flex-col items-start mb-4">
                          {mainCat.subcategories.length > 0 ? (
                            mainCat.subcategories.map((subCat) => (
                              <button
                                key={subCat.id}
                                className="py-1 text-gray-700 text-sm hover:text-gray-900 hover:underline transition-colors whitespace-nowrap capitalize  cursor-pointer"
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
                            className="w-full h-80 object-cover shadow-md cursor-pointer hover:opacity-90 transition"
                            width={320}
                            height={320}
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
