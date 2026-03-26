import React, { useState } from "react";
import { useAuthStore } from "../../store/auth.store";

interface LogoutButtonProps {
  variant?: "minimal" | "full";
  onLogoutSuccess?: () => void;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  variant = "minimal", 
  onLogoutSuccess 
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      onLogoutSuccess?.();
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className={`group flex items-center gap-2 transition-all duration-200 uppercase tracking-widest font-bold
          ${variant === "full" 
            ? "w-full py-4 bg-white/5 hover:bg-red-500/10 border border-white/10 rounded-2xl text-zinc-400 hover:text-red-400 justify-center" 
            : "text-[10px] text-zinc-500 hover:text-red-400"
          }`}
      >
        <span>{variant === "full" ? "Sign Out of Session" : "Exit"}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-all" 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowConfirm(false)}
          />
          
          <div className="relative bg-[#0c0c0e] border border-white/10 p-8 rounded-[2.5rem] w-full max-w-[320px] shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">Sign Out?</h3>
            <p className="text-zinc-500 text-xs mb-8 leading-relaxed">
              Are you sure you want to end the session for <span className="text-zinc-300">{user?.name || "Admin"}</span>?
            </p>

            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full py-4 bg-red-500 hover:bg-red-400 text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-500/20"
              >
                Confirm Logout
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-2 text-zinc-500 hover:text-white font-bold uppercase text-[10px] tracking-widest transition-colors"
              >
                Keep Session
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};