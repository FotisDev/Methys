import { fetchProductBySlug, getSellerName } from "@/_lib/helpers";
import { Params } from "@/_lib/types";
import { Modal } from "@/components/modal/Modal";
import Image from "next/image";

export default async function ProductModal({ params }: Params) {
  const { category, slug } = await params;
  const product = await fetchProductBySlug(category, slug, {
    next: { revalidate: 3600 },
  });

  if (!product) {
    return (
      <Modal>
        <div className="p-4 text-red-500">
          Error loading product: Δεν βρέθηκε το προϊόν.
        </div>
      </Modal>
    );
  }

  // const typedProduct = product as unknown as {
  //   id: string;
  //   name: string;
  //   price: number;
  //   description: string;
  //   image_url: string | null;
  //   users: { id: string; firstname: string ,lastname:string} | null;
  // };

  return (
    <Modal>
      <div className="p-6 max-w-2xl">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        {product.image_url && (
          <Image
            src={product.image_url ?? "/placeholder.png"}
            alt={product.name}
            width={320}
            height={320}
            className="rounded mb-6 object-cover"
          />
        )}
        <p className="text-lg">${product.price.toFixed(2)}</p>
        <p className="text-gray-700 mt-2">{product.description}</p>
        {/* {typedProduct.users && (
          <p className="mt-4 text-sm">Seller: {typedProduct.users ? (typedProduct.users.firstname + ' ' +typedProduct.users.lastname) :''}</p>
        )} */}
        <p>Seller: {getSellerName(product.users)}</p>
      </div>
    </Modal>
  );
}
