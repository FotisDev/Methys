"use server";

import { CartItem } from "@/components/providers/CartProvider";
import { createSupabaseServerClient } from "@/_lib/supabase/server";
import Stripe from "stripe";
import { isLocale } from "@/i18n.config";
import { getProductPricing } from "@/_lib/utils/discountUtil/discountUtils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export async function createCheckoutSession(
  cartItems: CartItem[],
  shippingInfo: ShippingInfo,
  locale: string,
  promotionCodeId?: string,
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Prices come from the database, never from the client's cart (localStorage
  // can be edited). getProductPricing is the same helper the storefront uses.
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, image_url, is_offer, product_variants (size, price, quantity)")
    .in("id", cartItems.map((item) => item.id));

  if (productsError || !products) {
    throw new Error("Could not load products for checkout");
  }

  const lineItems = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) {
      throw new Error(`Product ${item.id} is no longer available`);
    }
    const { finalPrice } = getProductPricing(product, item.selectedSize);
    return {
      price_data: {
        currency: "eur",
        product_data: {
          name: item.selectedSize ? `${product.name} (${item.selectedSize})` : product.name,
          images: (Array.isArray(product.image_url) ? product.image_url : []).slice(0, 8),
        },
        unit_amount: Math.round(finalPrice * 100),
      },
      quantity: Math.max(1, Math.floor(item.quantity ?? 1)),
    };
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    // All site locales (en, el, da, de) are supported by Stripe Checkout.
    locale: (isLocale(locale) ? locale : "auto") as Stripe.Checkout.SessionCreateParams.Locale,
    customer_email: shippingInfo.email,
    line_items: lineItems,
    ...(promotionCodeId
      ? { discounts: [{ promotion_code: promotionCodeId }] }
      : {}),
    metadata: {
      ...(user?.id && { user_id: user.id }),
      shipping_info: JSON.stringify(shippingInfo),
      cart_items: JSON.stringify(
        cartItems.map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          selectedSize: i.selectedSize,
          image_url: i.image_url,
        })),
      ),
      ...(promotionCodeId && { promotion_code_id: promotionCodeId }),
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/canceled`,
  });

  return { url: session.url };
}

export async function validateDiscountCode(code: string) {
  const result = await stripe.promotionCodes.list({
    code,
    active: true,
    limit: 1,
    expand: ["data.promotion.coupon"],
  });

  const promotionCode = result.data[0];
  if (!promotionCode) return null;

  const coupon = promotionCode.promotion.coupon;

  if (!coupon || typeof coupon === "string") return null;

  if (!coupon.valid) return null;

  return {
    id: promotionCode.id,
    code: promotionCode.code,
    percentOff: coupon.percent_off ?? undefined,
    amountOff: coupon.amount_off ? coupon.amount_off / 100 : undefined,
  };
}