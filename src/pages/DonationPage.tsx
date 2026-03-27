import { useState, useEffect } from "react";
import { ShieldCheck, Sparkles, ArrowLeft, Loader2, Euro } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import logo from "../assets/caci-logo.png";
import { getStripePromise } from "../stripe/stripe";
import { useCreateDonationIntent, usePurposesQuery } from "../hooks";
import {
  DonationCheckout,
  DonationSuccess,
  GivingBibleVerse,
  GlowingDivider,
} from "../components";

const stripePromise = getStripePromise();

export default function DonationPage() {
  const { data: purposes = [], isLoading } = usePurposesQuery();
  const { clientSecret, createDonationIntent, setClientSecret } =
    useCreateDonationIntent();

  const [amount, setAmount] = useState<number>(50);
  const [custom, setCustom] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [fund, setFund] = useState<string>("");
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [successAmount, setSuccessAmount] = useState<number>(0);
  const [successFund, setSuccessFund] = useState<string>("");

  useEffect(() => {
    if (purposes.length > 0 && !fund) {
      setFund(purposes[0].id);
    }
  }, [purposes, fund]);

  const presets = [10, 20, 50, 100];
  const finalAmount = custom ? Math.max(0, Number(input)) : amount;

  const handleCreateIntent = async () => {
    if (finalAmount <= 0) return;
    try {
      setIsCreating(true);
      await createDonationIntent(finalAmount, fund);
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Detect Stripe redirect return success
   */
  useEffect(() => {
    const checkStripeReturn = async () => {
      const stripe = await stripePromise;
      if (!stripe) return;

      const params = new URLSearchParams(window.location.search);
      const paymentIntentClientSecret = params.get(
        "payment_intent_client_secret",
      );

      if (!paymentIntentClientSecret) return;

      const { paymentIntent } = await stripe.retrievePaymentIntent(
        paymentIntentClientSecret,
      );

      if (paymentIntent?.status === "succeeded") {
        setIsSuccess(true);
        setSuccessAmount((paymentIntent.amount || 0) / 100);
        setSuccessFund(paymentIntent.metadata?.fund || "General");

        // clean URL after success
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }
    };

    checkStripeReturn();
  }, []);

  if (isSuccess) {
    return (
      <DonationSuccess
        successAmount={successAmount}
        successFund={successFund}
        onReturnHome={() => {
          setIsSuccess(false);
          setClientSecret(null);
          setInput("");
          setCustom(false);
          setAmount(50);
          setFund(purposes[0]?.id || "");
        }}
      />
    );
  }
  return (
    <div className="h-[100dvh] bg-[#020617] text-slate-200 selection:bg-yellow-500/30 font-sans overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-yellow-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 flex items-center justify-center h-full sm:p-4">
        <div className="w-full max-w-md h-full sm:h-auto sm:max-h-[90vh] bg-white/[0.02] backdrop-blur-2xl border-white/10 sm:border sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden">
          <div className="text-center p-2 bg-gradient-to-b from-yellow-500/50 to-transparent border-b border-white/5">
            <img
              src={logo}
              className="w-20 h-20 sm:w-24 sm:h-24 mx-auto drop-shadow-2xl"
              alt="CACI Logo"
            />
            <h1 className="text-white text-xl sm:text-2xl font-black">
              The Celebration Church
            </h1>
            <p className="text-yellow-400 text-[9px] sm:text-[10px] tracking-[0.25em] font-bold mt-1 uppercase opacity-80">
              Christ Apostolic Church International
            </p>
            <p className="text-slate-400 text-[8px] sm:text-[9px] tracking-[0.2em] font-medium mt-1 uppercase">
              Antwerp - Belgium
            </p>
          </div>

          <div className="px-6 py-4 flex-grow flex flex-col justify-between min-h-0 overflow-y-auto">
            <div className="space-y-6">
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={12} className="text-yellow-500" />
                  <label className="text-[10px] uppercase text-slate-400 font-bold tracking-[0.1em]">
                    Select Purpose
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {isLoading
                    ? [1, 2].map((i) => (
                        <div
                          key={i}
                          className="h-10 bg-white/5 animate-pulse rounded-xl"
                        />
                      ))
                    : purposes.map((f: any) => (
                        <button
                          key={f.id}
                          onClick={() => setFund(f.id)}
                          className={`py-2.5 rounded-xl font-bold text-sm transition-all border ${
                            fund === f.id
                              ? "bg-yellow-500 border-yellow-400 text-black shadow-lg shadow-yellow-500/20"
                              : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Euro size={12} className="text-yellow-500" />
                    <label className="text-[10px] uppercase text-slate-400 font-bold tracking-[0.1em]">
                      Donation Amount
                    </label>
                  </div>
                  {custom && (
                    <button
                      onClick={() => {
                        setCustom(false);
                        setInput("");
                      }}
                      className="text-yellow-500 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1"
                    >
                      <ArrowLeft size={10} /> Presets
                    </button>
                  )}
                </div>

                {!custom ? (
                  <div className="grid grid-cols-4 gap-2">
                    {presets.map((p) => (
                      <button
                        key={p}
                        onClick={() => setAmount(p)}
                        className={`py-3 rounded-lg font-black text-xs border ${
                          amount === p && !custom
                            ? "bg-white border-white text-black scale-105"
                            : "bg-white/5 border-transparent text-slate-300"
                        }`}
                      >
                        €{p}
                      </button>
                    ))}
                    <button
                      onClick={() => setCustom(true)}
                      className="col-span-4 mt-1 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-lg text-[9px] font-black uppercase tracking-widest"
                    >
                      Enter Custom Amount
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500 font-black text-xl">
                      €
                    </span>
                    <input
                      type="number"
                      inputMode="decimal"
                      autoFocus
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="w-full bg-white/5 border border-yellow-500/50 rounded-xl p-4 pl-10 text-2xl text-white font-black outline-none"
                      placeholder="0.00"
                    />
                  </div>
                )}
              </section>
            </div>

            <GivingBibleVerse />

            <button
              disabled={finalAmount < 1 || isCreating}
              onClick={handleCreateIntent}
              className="relative w-full py-4 mt-6 bg-yellow-500 disabled:bg-slate-800 disabled:text-slate-500 text-black font-black rounded-xl transition-all active:scale-[0.97] overflow-hidden shrink-0"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {isCreating ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  `Give €${finalAmount.toLocaleString()}`
                )}
              </div>
            </button>
          </div>

          <GlowingDivider />

          <footer className="mt-auto px-8 pb-10 pt-6 border-t text-color-black border-white/5 bg-black/20 text-center space-y-5">
            <div className="flex justify-center items-center gap-5 text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-green-500" /> Secure SSL
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-yellow-500" /> CACI Belgium
              </span>
            </div>
          </footer>
        </div>
      </main>

      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "night",
              variables: {
                colorPrimary: "#EAB308",
                colorBackground: "#020617",
                colorText: "#ffffff",
                borderRadius: "20px",
                spacingGridRow: "24px",
              },
            },
          }}
        >
          <DonationCheckout
            onSuccess={() => {
              setIsSuccess(true);
              setSuccessAmount(finalAmount);
              setSuccessFund(
                purposes.find((p: any) => p.id === fund)?.label || fund,
              );
              setClientSecret(null);
            }}
            onCancel={() => setClientSecret(null)}
          />
        </Elements>
      )}
    </div>
  );
}
