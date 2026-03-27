import { Heart } from "lucide-react";

interface DonationSuccessProps {
  successAmount: number;
  successFund: string;
  onReturnHome: () => void;
}

export const DonationSuccess = ({
  successAmount,
  successFund,
  onReturnHome,
}: DonationSuccessProps) => {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-72 h-72 bg-yellow-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[15%] w-80 h-80 bg-green-500/10 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%)]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.05] backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.45)] px-8 py-10 text-center space-y-7 animate-in fade-in zoom-in-95 duration-500">

          <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
            <div className="absolute -top-10 left-[-30%] w-[160%] h-20 bg-white/5 rotate-6 blur-2xl" />
          </div>

          <div className="relative mx-auto w-fit">
            <div className="absolute inset-0 blur-2xl bg-green-500/20 rounded-full scale-150" />
            <div className="relative w-24 h-24 rounded-full bg-green-500/10 border border-green-400/20 flex items-center justify-center mx-auto shadow-inner shadow-green-500/10">
              <Heart className="text-green-400 fill-green-400" size={42} />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-green-400/80">
              Donation Successful
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              God Bless You!
            </h2>
          </div>

          <div className="space-y-3">
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
              Your generous gift of{" "}
              <span className="text-yellow-400 font-extrabold">
                €{successAmount}
              </span>{" "}
              towards{" "}
              <span className="text-white font-bold capitalize">
                {successFund}
              </span>{" "}
              has been received successfully.
            </p>

            <p className="text-slate-500 text-xs uppercase tracking-[0.2em]">
              Thank you for supporting CACI Antwerp
            </p>
          </div>

          <div className="w-20 h-px bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mx-auto" />

          <button
            onClick={onReturnHome}
            className="w-full py-4 rounded-2xl bg-white/90 hover:bg-white text-black font-black uppercase tracking-[0.15em] transition-all active:scale-[0.98] shadow-lg"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};
