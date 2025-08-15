import { fetchProductsByCategory } from "@/_lib/helpers";
import { CategoryParams, Params } from "@/_lib/types";
import Link from "next/link";
import { Metadata } from "next";
import myImageLoader from "@/_lib/utils/myImageLoader";
import Image from "next/image";

export async function generateMetadata({
  params,
}: CategoryParams): Promise<Metadata> {
  const product = await fetchProductsByCategory(params.category);

  if (!product || product.length === 0) {
    return {
      title: "Product Not Found | UrbanValor",
      description: "The product you searched for wasn't found",
    };
  }

  const categoryName = params.category.replace(/-/g, " ");

  return {
    title: `${categoryName} | UrbanValor`,
    description: `Discover premium ${categoryName} on UrbanValor.`,
    alternates: {
      canonical: `https://UrbanValor.com/products/${params.category}`,
    },
    openGraph: {
      title: `${categoryName} | UrbanValor`,
      description: `Explore our ${categoryName} collection.`,
      url: `https://yourstore.com/products/${params.category}`,
      images: [
        {
          url: product[0].image_url ?? "/placeholder.png",
          width: 800,
          height: 800,
          alt: product[0].name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryName} | UrbanValor`,
      description: `Explore our ${categoryName} collection.`,
      images: [
        {
          url: product[0].image_url ?? "/placeholder.png",
          alt: product[0].name,
        },
      ],
    },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;
  const products = await fetchProductsByCategory(category);

  if (!products || products.length === 0) {
    return (
      <div className="p-10">
        <p>No Products found for the category {category}</p>
        <Link
          href="/products"
          className="mt-4 inline-block border bg-amber-500 text-black font-poppins rounded p-2"
        >
          Back to categories
        </Link>
      </div>
    );
  }

  return (
    <div className="p-10 flex flex-col gap-10">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        Κατηγορία: {category}
      </h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              href={`/products/${category}/${product.slug}`}
              scroll={false}
              prefetch={false}
            >
              <div className="border shadow p-8 gap-10 flex flex-col text-black font-poppins rounded-xl hover:scale-95 transition">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <Image
                  src={product.image_url ?? "/placeholder.png"}
                  alt={product.name}
                  loader={myImageLoader}
                  className="w-full h-60 object-cover mt-2 mb-2 rounded"
                  width={150}
                  height={150}
                />
                <p>Τιμή: €{product.price}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/products"
        className="border font-poppins bg-amber-500 text-xl md:text-3xl w-full md:w-96 rounded p-4 md:p-10 text-black text-center"
      >
        Back to categories
      </Link>
    </div>
  );
}
