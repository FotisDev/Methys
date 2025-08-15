// app/products/page.tsx
import type { Metadata } from 'next';
import { fetchCategories} from '@/_lib/helpers';
import Link from 'next/link';
import { Category } from '@/_lib/types';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch categories (you might want to create a separate fetch for metadata)
  const allCategories = await fetchCategories(); // This now correctly holds Category[] | null

  // Extract only the category_name strings for metadata
  const categoryNamesArray: string[] = allCategories
    ? allCategories.map((category: Category) => category.category_name)
    : [];

  const categoryNames = categoryNamesArray.join(', '); // This will now correctly join strings

  return {
    title: `Shop ${categoryNames} | UrbanValor`,
    description: `Discover our collection of ${categoryNames}. Find the perfect items in our ${categoryNamesArray.length || 'many'} categories.`,
    keywords: ['products', 'categories', 'shopping', ...categoryNamesArray], // This will now spread strings
    alternates: {
      canonical: 'https://yourstore.com/products',
    },
    openGraph: {
      title: `Product Categories | UrbanValor`,
      description: `Browse our ${categoryNamesArray.length || 'many'} categories including ${categoryNames}`,
      url: 'https://yourstore.com/products',
      images: [
        {
          url: 'https://yourstore.com/images/categories-og.jpg',
          width: 1200,
          height: 630,
          alt: 'YourStore Product Categories',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Product Categories | UrbanValor`,
      description: `Browse our ${categoryNamesArray.length || 'many'} categories`,
      images: ['https://yourstore.com/images/categories-twitter.jpg'],
    },
  };
}

export default async function ProductList() {
  const categories = await fetchCategories();

  return (
    <div className="flex flex-col items-center text-black font-poppins justify-center text-5xl">
      <h2>Product list</h2>
      
      {categories?.map((category) => (
        <Link 
          key={category.category_name} 
          href={`/products/${category.category_name.replace(/\s+/g, '-').toLowerCase()}`} 
          className="hover:underline capitalize"
        >
          {category.category_name}
        </Link>
      ))}
      
      <Link 
        href="/" 
        className="text-black bg-amber-500 text-sm mt-4 p-2 rounded"
      >
        Back to products homepage
      </Link>
    </div>
  );
}