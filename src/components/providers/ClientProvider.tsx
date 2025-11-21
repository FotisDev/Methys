import { CartProvider } from "./CartProvider";
import { WishlistProvider } from "./WishListProvider";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
      </WishlistProvider>
    </CartProvider>
  );
}