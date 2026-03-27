import React from "react";
import { useAuthStore } from "../../store";
import { LogoutButton } from "../auth";

export const CurrentUser: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="mb-2 flex justify-end items-center text-[10px] gap-3 text-yellow-100 font-bold uppercase tracking-wider text-right">
      <div className="flex items-center gap-2">
        <span className="relative flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-30 animate-ping"></span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="relative h-4 w-4 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
          </svg>
        </span>

        <span className="opacity-90">{user?.name || "Admin"}</span>
      </div>

      <div className="w-[1px] h-3 bg-white/10" />
      <LogoutButton variant="minimal" />
    </div>
  );
};
