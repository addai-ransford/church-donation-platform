import { useState } from "react";
import { apiFetch } from "../lib";

export const useDonationPayment = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const createDonationIntent = async (amount: number, fund: string) => {
    const data = await apiFetch<{ clientSecret: string }>("/create-donation-intent", {
      method: "POST",
      body: JSON.stringify({ amount, fund }),
    });
    setClientSecret(data.clientSecret);
  };

  return {
    clientSecret,
    setClientSecret,
    createDonationIntent,
  };
};