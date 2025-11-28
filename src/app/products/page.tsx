"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchCategories } from "@/_lib/helpers";
import Footer from "@/components/footer/Footer";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import { CategoryBackendType, ProductInDetails } from "@/_lib/types";
import { fetchProducts } from "@/_lib/backend/fetchProducts/action";
import { Breadcrumbs } from "@/components/breadcrumb/breadcrumbSchema";
export default function ProductList() {
  const [categories, setCategories] = useState<CategoryBackendType[] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        if (!categoriesData) {
          throw new Error("No categories data returned");
        }
        console.debug("Fetched categories:", categoriesData);

        let productsData: ProductInDetails[] = [];
        try {
          const products = await fetchProducts();
          if (products) {
            productsData = products;
            console.debug("Fetched products:", productsData);
          } else {
            console.warn("No products data returned, using empty array");
          }
        } catch (err) {
          console.error("Error fetching products:", err);
          console.warn("Using empty products array as fallback");
        }
        const mappedCategories: CategoryBackendType[] = categoriesData.map(
          (cat) => {
            const product = productsData.find(
              (p) => p?.categoryformen?.id === cat.id
            );
            return {
              ...cat,
              image_url: product?.image_url,
              parent_id: cat.parent_id ?? null,
            };
          }
        );

        setCategories(mappedCategories);
      } catch (err) {
        console.error("Fetch categories failed:", err);
        setError(
          `Failed to load categories: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const parentCategories = useMemo(() => {
    return (
      categories?.filter(
        (c) =>
          [1, 2, 30].includes(c.id) &&
          (c.parent_id === null || c.parent_id === undefined)
      ) || []
    );
  }, [categories]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-vintage-green font-poppins">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 "></div>
        <p className="mt-4 text-lg">Loading categories...</p>
      </div>
    );
  }

  if (error || !categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-vintage-green font-poppins text-xl">
        <p>{error || "No categories found."}</p>
        <Link
          href="/"
          className="mt-4 px-4 py-2 text-sm font-medium text-vintage-green rounded-lg  transition-colors"
        >
          Back to homepage
        </Link>
      </div>
    );
  }

  const breadcrumbItems = [
    { name: "Home", slug: "/" },
    { name: "Products", slug: "/products" },
  ];

  return (
    <HeaderProvider forceOpaque={true}>
      <section className="padding-y padding-x text-vintage-green font-roboto">
        <div className="pt-16">
          <Breadcrumbs items={breadcrumbItems}/>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {parentCategories.map((category) => {
              if (!category.name) return null;

              const href = `/products/${category.name
                .replace(/\s+/g, "-")
                .toLowerCase()}`;
              const imageUrl = category.image_url ?? "/accesories.jpg ";

              return (
                <Link
                  key={category.id}
                  href={href}
                  className="group relative w-full aspect-[3/4] bg-vintage-green "
                  // aria-label={`View ${category.name} subcategories`}
                >
                  <div className="absolute inset-0  overflow-hidden ">
                    <Image
                      src={imageUrl}
                      alt={``}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <span className="absolute bottom-2 left-2 px-3 py-1 hover-colors rounded-md capitalize text-sm ">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
          <Footer />
        </div>
      </section>
    </HeaderProvider>
  );
}
