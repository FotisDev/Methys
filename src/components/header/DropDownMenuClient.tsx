"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link, { useLocalizedPath } from "@/components/LocaleLink/LocaleLink";
import { useT } from "@/i18n/client";
import { translateCategory } from "@/i18n/translate";
import { cn } from "@/_lib/utils/cn";

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
  const localizePath = useLocalizedPath();
  const t = useT();

  const toSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  const handleNavigate = (subcategory: Category, mainCategoryName: string) => {
    const mainCategorySlug = toSlug(mainCategoryName);
    const subcategorySlug = toSlug(subcategory.name);
    const fullPath = `/collections/${mainCategorySlug}/${subcategorySlug}`;
    router.push(localizePath(fullPath));
  };

  return (
    <nav
      className={cn(
        "fixed left-0 right-0 -top-5 w-screen bg-white z-50 font-serif",
      )}
    >
      <div className={cn("w-full grid grid-cols-4 pt-6 pb-0.5")}>
        <div className={cn("flex flex-col sm:flex-row gap-1")}>
          <div className={cn("flex flex-col gap-3 pt-2.5 pl-4")}>
            <Link
              href="/offers"
              className={cn(
                "text-[16px] text-vintage-green uppercase tracking-wide hover:underline",
              )}
            >
              {t("nav.seeOurOffers")}
            </Link>
            <Link
              href="/online-exclusive"
              className={cn(
                "text-[16px] text-vintage-green uppercase tracking-wide hover:underline",
              )}
            >
              {t("nav.onlineExclusive")}
            </Link>
            <Link
              href="/seasonal-collection"
              className={cn(
                "text-[16px] text-vintage-green uppercase tracking-wide hover:underline",
              )}
            >
              {t("nav.newCollection")}
            </Link>
          </div>
        </div>
        <div className={cn("col-span-3")}>
          <div className={cn("w-full")}>
            <div className={cn("flex gap-0.5")}>
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
                    className={cn("flex-1 flex flex-col gap-4 items-start")}
                  >
                    <div className={cn("flex-1 w-full")}>
                      <p
                        className={cn(
                          "text-vintage-green text-lg capitalize pb-3",
                        )}
                      >
                        {translateCategory(t, null, mainCat.name)}
                      </p>

                      <div className={cn("flex flex-col items-start gap-2")}>
                        {mainCat.subcategories.length > 0 ? (
                          mainCat.subcategories.map((subCat) => (
                            <button
                              key={subCat.id}
                              className={cn(
                                "text-vintage-green text-[13px] over:underline transition-colors whitespace-nowrap capitalize hover:underline cursor-pointer",
                              )}
                              onClick={() =>
                                handleNavigate(subCat, mainCat.name)
                              }
                            >
                              {translateCategory(t, null, subCat.name)}
                            </button>
                          ))
                        ) : (
                          <p className={cn("text-gray-500 text-sm")}>
                            {t("nav.noSubcategories")}
                          </p>
                        )}
                      </div>
                    </div>

                    {mainCat.image_url && (
                      <Link href={href} className={cn("w-full")}>
                        <Image
                          src={mainCat.image_url.trim()}
                          alt={translateCategory(t, null, mainCat.name)}
                          className={cn(
                            "w-full max-w-[382px] max-h-[214px] object-cover cursor-pointer hover:opacity-90 transition",
                          )}
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
          <div className={cn("text-center")}>
            <p className={cn("text-gray-500")}>{t("nav.noCategories")}</p>
          </div>
        )}
      </div>
    </nav>
  );
}
