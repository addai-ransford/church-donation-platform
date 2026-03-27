import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { X, Lock, ShieldCheck, Loader2 } from "lucide-react";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export const DonationCheckout = ({ onSuccess, onCancel }: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMsg(error.message || "Payment failed");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        onSuccess();
        return;
      }

      if (paymentIntent?.status === "processing") {
        setErrorMsg("Payment is processing. Please wait a moment.");
        return;
      }

      if (paymentIntent?.status === "requires_payment_method") {
        setErrorMsg("Payment failed. Please try another payment method.");
        return;
      }

      setErrorMsg("Payment was not completed.");
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="absolute inset-0  backdrop-blur-sm" />

      <div className="relative w-full max-w-md bg-slate-900/40 backdrop-blur-2xl border border-yellow-500/20 rounded-[32px] p-6 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-500/10 blur-[80px] pointer-events-none" />

        <div className="flex justify-between items-start mb-8 relative">
          <div>
            <h2 className="text-white font-black text-2xl tracking-tight">
              CACI - Antwerp
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                Secure SSL Encryption
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 -mr-2 text-slate-500 hover:text-yellow-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="p-1 rounded-2xl bg-slate-950/50 border border-white/5">
            <PaymentElement
              options={{
                layout: "tabs",
              }}
            />
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-400/20 text-red-400 p-3 rounded-xl text-xs text-center">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4 pt-2">
            <button
              disabled={!stripe || loading}
              className="w-full h-14 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 text-black font-black rounded-xl text-base flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-yellow-500/5"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Authorize Payment <Lock size={16} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] hover:text-slate-300 transition-colors"
            >
              Back to selection
            </button>
          </div>
        </form>

        <div className="mt-8 flex justify-center items-center gap-2 opacity-30 grayscale">
          <ShieldCheck size={14} className="text-white" />
          <span className="text-[9px] text-white font-medium uppercase tracking-widest">
            Verified by Stripe
          </span>
        </div>
      </div>
    </div>
  );
};
