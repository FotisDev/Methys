// src/components/sections/SeasonalCollectionSkeleton.tsx
export default function SeasonalCollectionSkeleton() {
  return (
    <section className="new-collection pb-1 sm:pb-12 md:pb-20 lg:pb-1 pt-5 font-poppins bg-white">
      <div className="mb-6 h-4 w-48 bg-gray-200 animate-pulse rounded ml-2" />

      <div className="flex gap-1 overflow-hidden px-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex-1 min-w-[45%] sm:min-w-[30%] lg:min-w-[19%]">
            <div
              className="w-full bg-gray-200 animate-pulse"
              style={{ aspectRatio: "3/4" }}
            />
            <div className="pt-2 pb-3 px-5 flex flex-col gap-2">
              <div className="h-3 w-3/4 bg-gray-200 animate-pulse rounded" />
              <div className="h-3 w-1/3 bg-gray-200 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}