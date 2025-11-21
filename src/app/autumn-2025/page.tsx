import { fetchProducts } from "@/_lib/backend/fetchProducts/action";

export default async function autumn() {
  const products = await fetchProducts();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {products ? (
        products.map((p) => (
          <div key={p.id} className="mb-6 border p-4 rounded">
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="text-gray-700 mb-2">Price: ${p.price}</p>

            <div>
              <h3 className="font-medium">Variants:</h3>
              <ul className="ml-4">
                {p.product_variants.map((v, index) => (
                  <li key={index}>
                    Size: {v.size}, Quantity: {v.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-500">No products available (or fetch error).</div>  
      )}
    </div>
  );
}