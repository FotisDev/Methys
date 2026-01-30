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
  categorySlug 
}: ProductFilterClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const [filters, setFilters] = useState({
    min: searchParams.get('min') || '',
    max: searchParams.get('max') || '',
    size: searchParams.get('size') || ''
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
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="lg:w-64 space-y-6 bg-white p-6 rounded-lg shadow-sm h-fit sticky top-4">
        <div>
          <h3 className="font-semibold mb-3 text-vintage-green">Τιμή</h3>
          <div className="space-y-2">
            <input
              type="number"
              placeholder="Από €"
              value={filters.min}
              onChange={(e) => setFilters({ ...filters, min: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-vintage-green"
            />
            <input
              type="number"
              placeholder="Έως €"
              value={filters.max}
              onChange={(e) => setFilters({ ...filters, max: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-vintage-green"
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 text-vintage-green">Μέγεθος</h3>
          <select
            value={filters.size}
            onChange={(e) => setFilters({ ...filters, size: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-vintage-green"
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
            className="w-full bg-vintage-green text-white py-2.5 rounded hover:bg-vintage-green/90 transition disabled:opacity-50"
          >
            {isPending ? 'Φόρτωση...' : 'Εφαρμογή Φίλτρων'}
          </button>
          
          <button
            onClick={clearFilters}
            disabled={isPending}
            className="w-full bg-gray-200 text-vintage-green py-2.5 rounded hover:bg-gray-300 transition disabled:opacity-50"
          >
            Καθαρισμός
          </button>
        </div>

        {(filters.min || filters.max || filters.size) && (
          <div className="pt-4 border-t">
            <p className="text-sm font-semibold mb-2 text-vintage-green">Ενεργά Φίλτρα:</p>
            <div className="space-y-1 text-sm text-gray-600">
              {filters.min && <p>Από: €{filters.min}</p>}
              {filters.max && <p>Έως: €{filters.max}</p>}
              {filters.size && <p>Μέγεθος: {filters.size}</p>}
            </div>
          </div>
        )}
      </aside>

      {/* Products Grid */}
      <div className="flex-1 relative">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {initialProducts.length} {initialProducts.length === 1 ? 'προϊόν' : 'προϊόντα'}
          </p>
        </div>

        {isPending && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="text-vintage-green">Φόρτωση...</div>
          </div>
        )}

        {initialProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Δεν βρέθηκαν προϊόντα με αυτά τα φίλτρα</p>
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
              <SeasonalCollectionCard key={product.id} item={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}