// src/api/stripe.ts
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import request from "./api";

let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = async (): Promise<Stripe> => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) throw new Error("Missing VITE_STRIPE_PUBLISHABLE_KEY");
    stripePromise = loadStripe(key);
  }
  const stripe = await stripePromise;
  if (!stripe) throw new Error("Stripe failed to load");
  return stripe;
};

export const createCheckoutSession = async (tier: "monthly" | "annual") => {
  const { id } = await request<{ id: string }>(
    `/stripe/create-checkout-session?tier=${tier}`,
    { method: "POST" }
  );

  const stripe = (await getStripe()) as Stripe & {
    redirectToCheckout?: (options: { sessionId: string }) => Promise<unknown>;
  };
  if (!stripe.redirectToCheckout) {
    throw new Error("Stripe.js missing redirectToCheckout");
  }
  return stripe.redirectToCheckout({ sessionId: id });
};

export const createPortalSession = async (): Promise<void> => {
  const { url } = await request<{ url: string }>(
    `/stripe/create-portal-session`,
    { method: "POST" }
  );
  if (!url) throw new Error("No portal URL returned");
  window.location.href = url;
};
