// /[lang]/offers/loading.tsx
export default function Loading() {
  return (
    <section className="font-roboto text-vintage-green pt-16">
      {/* Breadcrumb placeholder */}
      <div className="h-4 w-40 bg-gray-200 animate-pulse rounded mb-2" />

      {/* Title placeholder */}
      <div className="h-7 w-72 bg-gray-200 animate-pulse rounded my-2" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="relative block overflow-hidden bg-white">
            {/* Image placeholder — ίδια responsive ύψη με το πραγματικό component */}
            <div className="relative w-full h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[75vh] overflow-hidden bg-gray-200 animate-pulse">
              {/* price badge placeholder */}
              <div className="absolute bottom-3 left-3 bg-gray-300 rounded-full px-4 py-3 animate-pulse" />
            </div>

            <div className="px-2 py-3 flex flex-col gap-2">
              <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-8 bg-gray-200 animate-pulse rounded" />
                <div className="h-6 w-8 bg-gray-200 animate-pulse rounded" />
                <div className="h-6 w-8 bg-gray-200 animate-pulse rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}