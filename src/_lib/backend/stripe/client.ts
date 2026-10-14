import Stripe from "stripe";

// Created on first use: the constructor throws without an API key, which would
// otherwise break the build (and every page) that imports a module using it.
let stripeClient: Stripe | null = null;
export function getStripe() {
  stripeClient ??= new Stripe(process.env.STRIPE_SECRET_KEY!);
  return stripeClient;
}
