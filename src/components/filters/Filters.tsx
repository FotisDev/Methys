'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductInDetails } from '@/_lib/types';
import SeasonalCollectionCard from '../cards/SeasonalCollectionCard';

type ProductFilterClientProps = {
  initialProducts: ProductInDetails[];
  parentSlug: string;
  categorySlug: string;
};

export default function ProductFilterClient({
  initialProducts,
  parentSlug,
  categorySlug,
}: ProductFilterClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [showResults, setShowResults] = useState(false);

  const [filters, setFilters] = useState({
    min: searchParams.get('min') || '',
    max: searchParams.get('max') || '',
    size: searchParams.get('size') || '',
  });

  const handleFilterChange = () => {
    const params = new URLSearchParams();
    if (filters.min) params.set('min', filters.min);
    if (filters.max) params.set('max', filters.max);
    if (filters.size) params.set('size', filters.size);

    startTransition(() => {
      router.push(`/products/${parentSlug}/${categorySlug}?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setFilters({ min: '', max: '', size: '' });
    startTransition(() => {
      router.push(`/products/${parentSlug}/${categorySlug}`);
    });
  };

  return (
    <div className="w-full">

      <button
        onClick={() => setShowResults(prev => !prev)}
        className="mb-6 px-4 py-2 rounded-md bg-vintage-green text-white font-semibold"
      >
        {showResults ? 'Hide Filters' : 'Show Filters'}
      </button>

      {showResults && (
        <div className="flex flex-col lg:flex-row gap-8">
        
          <aside className="lg:w-64 space-y-6 bg-white p-6 rounded-lg shadow-sm h-fit sticky top-4">
            <div>
              <h3 className="font-semibold mb-3 text-vintage-green">Τιμή</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Από €"
                  value={filters.min}
                  onChange={(e) =>
                    setFilters({ ...filters, min: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  placeholder="Έως €"
                  value={filters.max}
                  onChange={(e) =>
                    setFilters({ ...filters, max: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-vintage-green">Μέγεθος</h3>
              <select
                value={filters.size}
                onChange={(e) =>
                  setFilters({ ...filters, size: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">Όλα τα μεγέθη</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleFilterChange}
                disabled={isPending}
                className="w-full bg-vintage-green text-white py-2.5 rounded"
              >
                {isPending ? 'Φόρτωση...' : 'Εφαρμογή φίλτρων'}
              </button>

              <button
                onClick={clearFilters}
                disabled={isPending}
                className="w-full bg-gray-200 text-vintage-green py-2.5 rounded"
              >
                Καθαρισμός
              </button>
            </div>
          </aside>

          <div className="flex-1 relative">
            {isPending && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                <div className="text-vintage-green">Φόρτωση...</div>
              </div>
            )}

            {initialProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Δεν βρέθηκαν προϊόντα</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-vintage-green underline"
                >
                  Καθαρισμός φίλτρων
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialProducts.map((product) => (
                  <SeasonalCollectionCard
                    key={product.id}
                    item={product}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
