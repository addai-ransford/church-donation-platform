import { Elements } from "@stripe/react-stripe-js";
import { getStripePromise } from "./stripe";

const stripePromise = getStripePromise();

export const StripeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        appearance: { theme: "night" },
      }}
    >
      {children}
    </Elements>
  );
};