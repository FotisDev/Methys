"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductInDetails } from "@/_lib/types";

type ProductFilterClientProps = {
  initialProducts: ProductInDetails[];
  parentSlug: string;
  categorySlug: string;
  children: React.ReactNode;
};

export default function ProductFilterClient({
  parentSlug,
  categorySlug,
  children,
}: ProductFilterClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [showFilters, setShowFilters] = useState(false);
  const pathname = usePathname();
  const locale = pathname.split('/')[1];

  const [filters, setFilters] = useState({
    min: searchParams.get("min") || "",
    max: searchParams.get("max") || "",
    size: searchParams.get("size") || "",
  });

  const handleFilterChange = () => {
    const params = new URLSearchParams();
    if (filters.min) params.set("min", filters.min);
    if (filters.max) params.set("max", filters.max);
    if (filters.size) params.set("size", filters.size);

    startTransition(() => {
      router.push(
        `/${locale}/collections/${parentSlug}/${categorySlug}?${params.toString()}`,
      );
    });
  };

  const clearFilters = () => {
    setFilters({ min: "", max: "", size: "" });
    startTransition(() => {
      router.push(`/${locale}/collections/${parentSlug}/${categorySlug}`);
    });
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex items-center gap-4 mb-4 border-b border-vintage-green/20 pb-3">
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-vintage-green border border-vintage-green/40 hover:border-vintage-green transition-colors rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="16" y2="12" />
            <line x1="10" y1="18" x2="14" y2="18" />
          </svg>
          {showFilters ? "HIDE FILTER" : "SHOW FILTER"}
        </button>

        {(filters.min || filters.max || filters.size) && (
          <button
            onClick={clearFilters}
            className="text-sm text-vintage-brown underline underline-offset-2"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Sidebar + Products — same flex row */}
     <div className="flex flex-col md:flex-row gap-8 items-start w-full">

        {/* Sidebar */}
        {showFilters && (
           <aside className="w-full md:w-64 flex-shrink-0 bg-white border border-gray-100 shadow-sm p-5 space-y-6">
            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-vintage-green mb-3">
                Price
              </h3>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="From €"
                  value={filters.min}
                  onChange={(e) =>
                    setFilters({ ...filters, min: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-vintage-green"
                />
                <input
                  type="number"
                  placeholder="To €"
                  value={filters.max}
                  onChange={(e) =>
                    setFilters({ ...filters, max: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-vintage-green"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold tracking-widest uppercase text-vintage-green mb-3">
                Size
              </h3>
              <div className="flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => {
                  const active = filters.size === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        setFilters({ ...filters, size: active ? "" : size })
                      }
                      className={`w-11 h-11 border text-xs font-medium transition-all duration-150 flex items-center justify-center
                        ${
                          active
                            ? "bg-vintage-green text-white border-vintage-green"
                            : "bg-white text-vintage-green border-gray-300 hover:border-vintage-green"
                        }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleFilterChange}
                disabled={isPending}
                className="w-full bg-vintage-green text-white py-2.5 text-sm font-semibold rounded hover:opacity-90 transition-opacity"
              >
                {isPending ? "loading..." : "Place filters"}
              </button>
              <button
                onClick={clearFilters}
                disabled={isPending}
                className="w-full bg-gray-100 text-vintage-green py-2.5 text-sm font-semibold rounded hover:bg-gray-200 transition-colors"
              >
                Clear filters
              </button>
            </div>
          </aside>
        )}

        <div className="flex-1 min-w-0">
          {children}
        </div>

      </div>
    </div>
  );
}