"use client";

import { supabase } from "@/_lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

interface MainCategory {
  id: string;
  name: string;
  subcategories: Category[];
  image_url?: string | null;
}

export default function DropDownMenu() {
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("categoriesformen")
          .select("id, name, parent_id,image_url")
          .order("parent_id", { ascending: true })
          .order("name", { ascending: true });

        if (error) {
          console.error("Error fetching categories:", error);
          return;
        }

        if (data) {
          const mainCats = data.filter((cat) => cat.parent_id === null);
          const subCats = data.filter((cat) => cat.parent_id !== null);

          const organizedCategories = mainCats.map((mainCat) => ({
            id: String(mainCat.id),
            name: mainCat.name,
            image_url: mainCat.image_url,
            subcategories: subCats
              .filter((subCat) => subCat.parent_id === mainCat.id)
              .map((subCat) => ({
                id: String(subCat.id),
                name: subCat.name,
                parent_id: String(subCat.parent_id),
              })),
          }));
          setMainCategories(organizedCategories);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleNavigate = (subcategory: Category, mainCategoryName: string) => {
    const mainCategorySlug = toSlug(mainCategoryName);
    const subcategorySlug = toSlug(subcategory.name);
    const fullPath = `/products/${mainCategorySlug}/${subcategorySlug}`;
    router.push(fullPath);
  };

  if (loading) {
    return (
      <div className="fixed left-0 right-0 w-screen bg-white z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <p>Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

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
                    href = "/products/clothing";
                  } else if (mainCat.name.toLowerCase() === "accessories") {
                    href = "/products/accessories";
                  } else if (mainCat.name.toLowerCase() === "kids") {
                    href = "/products/kids";
                  }

                  return (
                    <div
                      key={mainCat.id}
                      className="flex-1 flex flex-col items-start"
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
                                className="py-1 text-gray-700 text-sm hover:text-gray-900 hover:underline transition-colors whitespace-nowrap capitalize"
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
                            priority
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