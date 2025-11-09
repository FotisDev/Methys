
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getCategoryByName,
  getSubcategories,
  fetchProductBySlug,
  getValidImage,
} from "@/_lib/helpers";
import { HeaderProvider } from "@/components/providers/HeaderProvider";
import ProductActions from "./ProductActionsInline";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

interface PageProps {
  params: Promise<{
    category: string;
    subcategory: string;
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { category, subcategory, slug } = await params;
  
  // Decode URL parameters
  const categorySlug = decodeURIComponent(category);
  const subcategorySlug = decodeURIComponent(subcategory);
  const productSlug = decodeURIComponent(slug);
  
  const categoryName = categorySlug.replace(/-/g, " ").toLowerCase().trim();
  const subcategoryName = subcategorySlug.replace(/-/g, " ").toLowerCase().trim();

  try {
    const parentCategory = await getCategoryByName(categoryName);
    if (!parentCategory) {
      notFound();
    }

    const subcategories = await getSubcategories(parentCategory.id);
    
    const currentCategory = subcategories.find(
      (subcat) =>
        (subcat.slug && decodeURIComponent(subcat.slug) === subcategorySlug) ||
        subcat.name.toLowerCase().trim() === subcategoryName ||
        (subcat.slug && subcat.slug === subcategorySlug) ||
        subcat.name.toLowerCase().includes(subcategoryName) ||
        subcategoryName.includes(subcat.name.toLowerCase())
    );

    if (!currentCategory) {
      notFound();
    }

    const product = await fetchProductBySlug(currentCategory.id, productSlug);
    if (!product) {
      notFound();
    }

    return (
      <HeaderProvider forceOpaque={true}>
        <section className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[80vh] pt-32 p-2 font-roboto text-vintage-green">
         <Breadcrumb LinkclassName={"hover:text-vintage-brown"} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <Image
                  src={getValidImage(product.image_url ?? "/AuthClothPhoto.jpg")}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                {product.is_offer && (
                  <div className="absolute top-4 left-4 bg-red-700 text-white text-sm px-3 py-2 rounded-lg">
                    SPECIAL OFFER
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl text-vintage-green mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl">${product.price}</span>
                  {product.is_offer && (
                    <span className="bg-vintage-brown text-red-700 text-sm px-3 py-1 rounded-full">
                      On Sale
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg text-text-vintage-green mb-4">
                  Product Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Product ID:</span>
                    <span>#{product.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Added:</span>
                    <span>
                      {new Date(product.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <ProductActions product={product} />
            </div>
          </div>
        </section>
      </HeaderProvider>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    notFound();
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { category, subcategory, slug } = await params;
  const productSlug = decodeURIComponent(slug);
  const subcategorySlug = decodeURIComponent(subcategory);
  const categorySlug = decodeURIComponent(category);
  
  const categoryName = categorySlug.replace(/-/g, " ").toLowerCase().trim();
  const subcategoryName = subcategorySlug.replace(/-/g, " ").toLowerCase().trim();

  try {
    const parentCategory = await getCategoryByName(categoryName);
    if (!parentCategory) return { title: "Product Not Found" };

    const subcategories = await getSubcategories(parentCategory.id);
    const currentCategory = subcategories.find(
      (subcat) =>
        (subcat.slug && decodeURIComponent(subcat.slug) === subcategorySlug) ||
        subcat.name.toLowerCase().trim() === subcategoryName
    );

    if (!currentCategory) return { title: "Product Not Found" };

    const product = await fetchProductBySlug(currentCategory.id, productSlug);
    if (!product) return { title: "Product Not Found" };

    return {
      title: `${product.name} | Your Store`,
      description: product.description,
    };
  } catch {
    return { title: "Product Not Found" };
  }
}