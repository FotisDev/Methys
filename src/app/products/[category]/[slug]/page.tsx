import { fetchProductBySlug, getSellerName } from "@/_lib/helpers";
import { Params } from "@/_lib/types";
import Link from "next/link";
import Image from "next/image";
import myImageLoader from "@/_lib/utils/myImageLoader";
import { Metadata } from "next";

export async function generateMetadata(context: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await context.params;
  const product = await fetchProductBySlug(
    resolvedParams.category,
    resolvedParams.slug
  );

  if (!product) {
    return {
      title: "Product Not Found | UrbanValor",
      description: "The product you searched for wasn't found",
    };
  }

  const categoryName = resolvedParams.category.replace(/-/g, " ");

  return {
    title: `${product.name} | UrbanValor`,
    description:
      product.description ?? `Discover premium ${categoryName} on UrbanValor.`,
    alternates: {
      canonical: `https://yourstore.com/products/${resolvedParams.category}/${resolvedParams.slug}`,
    },
    openGraph: {
      title: `${product.name} | UrbanValor`,
      description:
        product.description ?? `Explore our ${categoryName} collection.`,
      url: `https://yourstore.com/products/${resolvedParams.category}/${resolvedParams.slug}`,
      images: [
        {
          url: product.image_url ?? "/placeholder.png",
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | UrbanValor`,
      description:
        product.description ?? `Explore our ${categoryName} collection.`,
      images: [
        {
          url: product.image_url ?? "/placeholder.png",
          alt: product.name,
        },
      ],
    },
  };
}

// Main Component
export default async function ProductPage({ params }: Params) {
  const { category, slug } = await params;
  const product = await fetchProductBySlug(category, slug, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="p-10 flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold mb-6">{product.name}</h1>
      <Image
        src={product.image_url ?? "/placeholder.png"}
        loader={myImageLoader}
        alt={product.name}
        width={320}
        height={320}
        className="rounded mb-6 object-cover"
      />
      <p className="text-xl mb-2">Τιμή: €{product.price}</p>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <p>Πωλητής: {getSellerName(product.users)}</p>

      <Link
        href={`/products/${category}`}
        className="mt-6 underline text-blue-500 hover:text-blue-700"
      >
        Επιστροφή στην κατηγορία
      </Link>
    </div>
  );
}
