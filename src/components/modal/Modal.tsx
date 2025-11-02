'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={() => router.back()}
      />
      
      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-[95vw] max-h-[90vh] overflow-y-auto z-10 m-4">
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 text-2xl hover:text-gray-500"
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}