"use server";

import { CartItem } from "@/components/providers/CartProvider";
import { createSupabaseServerClient } from "@/_lib/supabase/server";
import Stripe from "stripe";

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
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: shippingInfo.email,
    line_items: cartItems.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: item.image_url ?? [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity ?? 1,
    })),
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
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/canceled`,
  });

  return { url: session.url };
}
