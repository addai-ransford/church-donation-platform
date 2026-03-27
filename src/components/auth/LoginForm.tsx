import { useState } from "react";
import { useAuthStore } from "../../store";

interface LoginFormProps {
  onSwitch: () => void;
  onSuccess?: (user: any) => void;
  onBack?: () => void;
}

export const LoginForm = ({ onSwitch, onSuccess, onBack }: LoginFormProps) => {
  const login = useAuthStore((s) => s.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await login(username, password);
      if (!user) throw new Error("Invalid username or password");
      onSuccess?.(user);
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Connection failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[420px] p-8 space-y-6 rounded-3xl border border-gray-700/30 backdrop-blur-xl bg-white/5 text-gray-100 shadow-2xl relative animate-in fade-in zoom-in-95 duration-300"
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute top-6 left-6 text-gray-300 hover:text-white transition-colors"
        >
          <span className="text-xl">←</span>
        </button>
      )}

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-gray-100">
          Welcome Back
        </h2>
        <p className="text-gray-300 text-sm font-medium">
          Log in to manage your donations
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-300 ml-2">
            Username
          </label>
          <input
            type="text"
            placeholder="user"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-300 ml-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/10 border border-white/20 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-100 text-xs font-bold uppercase"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold text-black">
            !
          </div>
          <p className="text-red-500 text-xs font-bold leading-tight uppercase tracking-wide">
            {error}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 font-black text-black uppercase rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
      >
        {loading ? "Authenticating..." : "Sign In"}
      </button>

      <p className="text-center text-gray-300 text-xs">
        New here?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-emerald-500 font-black hover:underline underline-offset-4"
        >
          Create an Account
        </button>
      </p>
    </form>
  );
};

