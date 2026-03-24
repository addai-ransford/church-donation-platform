import { loadStripe } from "@stripe/stripe-js";
import { getConfig } from "./config/config";

let stripePromise: Promise<any> | null = null;

export function getStripePromise() {
  if (!stripePromise) {
    stripePromise = getConfig().then((config) => {
      if (!config?.stripePublicKey) {
        throw new Error("Missing Stripe public key");
      }
      return loadStripe(config.stripePublicKey);
    });
  }

  return stripePromise;
}