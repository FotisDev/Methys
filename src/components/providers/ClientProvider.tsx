import { CartProvider } from "./CardProvider";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
