"use client";

import Image from "next/image";
import Link from "@/components/LocaleLink/LocaleLink";
import { useCart } from "../providers/CartProvider";
import type { CartItem } from "../providers/CartProvider";
import { useFormatPrice, useT } from "@/i18n/client";
import { translateCount } from "@/i18n/translate";
import { getShipping } from "@/_lib/utils/shipping";
import FreeShippingProgress from "../cart/FreeShippingProgress";

interface CartSideBarProps {
  isOpen: boolean;
  onClose: () => void;
  getValidImage: (imageUrl: string | undefined) => string;
}

const CartSideBar: React.FC<CartSideBarProps> = ({
  isOpen,
  onClose,
  getValidImage,
}) => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getItemPrice } =
    useCart();
  const t = useT();
  const formatPrice = useFormatPrice();

  const validCartlistItems = cart.filter(
    (item): item is NonNullable<CartItem> => item !== null,
  );

  const subtotal = getCartTotal ? getCartTotal() : 0;
  const shipping = getShipping(subtotal);

  const handleRemoveFromCart = (
    itemId: number,
    selectedSize: string | undefined,
  ) => {
    removeFromCart(itemId, selectedSize);
  };

  const handleQuantityChange = (
    itemId: number,
    selectedSize: string | undefined,
    next: number,
  ) => {
    if (next < 1) return;
    updateQuantity(itemId, selectedSize, next);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white overflow-hidden transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <span className="text-lg text-vintage-green">{t("cart.title")}</span>
          <button
            onClick={onClose}
            aria-label={t("cart.close")}
            className="p-1 hover:opacity-60 transition-opacity cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col flex-1 min-h-0">
          {validCartlistItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <p className="text-lg text-gray-900 mb-4">{t("cart.empty")}</p>
              <button
                onClick={onClose}
                className="py-3 px-6 border border-vintage-green text-vintage-green hover:bg-vintage-green hover:text-white transition-colors cursor-pointer"
              >
                {t("common.startShopping")}
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto min-h-0 overscroll-contain px-6">
                {validCartlistItems.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize ?? "no-size"}`}
                    className="flex gap-4 py-6 border-b border-gray-200"
                  >
                    <div className="w-20 h-24 relative flex-shrink-0 bg-gray-100">
                      {item.image_url && (
                        <Image
                          src={getValidImage(item.image_url?.[0])}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm text-vintage-green leading-snug">
                          {item.name}
                        </p>
                        <span className="text-sm text-vintage-green shrink-0 flex flex-col items-end">
                          {formatPrice(getItemPrice(item).finalPrice)}
                          {getItemPrice(item).isDiscounted && (
                            <del className="text-xs text-gray-400">
                              {formatPrice(getItemPrice(item).originalPrice)}
                            </del>
                          )}
                        </span>
                      </div>

                      {item.selectedSize && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.selectedSize}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-gray-300">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.selectedSize,
                                item.quantity - 1,
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center text-vintage-green hover:bg-gray-100 cursor-pointer"
                            aria-label={t("cart.decreaseQuantity")}
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.selectedSize,
                                item.quantity + 1,
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center text-vintage-green hover:bg-gray-100 cursor-pointer"
                            aria-label={t("cart.increaseQuantity")}
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            handleRemoveFromCart(item.id, item.selectedSize)
                          }
                          className="text-xs underline text-vintage-green hover:text-vintage-brown transition-colors cursor-pointer"
                        >
                          {t("common.remove")}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 px-6 py-4 space-y-2 bg-white">
                <div className="flex justify-between text-sm text-vintage-green">
                  <span>
                    {t("cart.subtotal")} (
                    {translateCount(
                      t,
                      "common.items",
                      validCartlistItems.length,
                    )}
                    )
                  </span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-vintage-green">
                  <span>{t("cart.shipping")}</span>
                  <span>
                    {shipping.isFree
                      ? t("cart.free")
                      : formatPrice(shipping.fee)}
                  </span>
                </div>
                <div className="flex justify-between text-base pt-2 border-t border-gray-200 mt-2 text-vintage-green">
                  <span className="font-medium">{t("cart.total")}</span>
                  <span className="font-medium">
                    {formatPrice(subtotal + shipping.fee)}
                  </span>
                </div>
                <FreeShippingProgress subtotal={subtotal} className="pt-2" />
              </div>

              <div className="px-6 pb-6 pt-2 bg-white">
                <Link href="/checkout" onClick={onClose}>
                  <button className="w-full bg-vintage-green text-white py-3.5 uppercase text-xs tracking-widest hover:opacity-90 transition-opacity cursor-pointer">
                    {t("cart.checkout")}
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSideBar;
