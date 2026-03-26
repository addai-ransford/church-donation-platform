import { useEffect } from "react";
import { useAuthStore } from "../../store";
import { LoginForm, RegisterForm } from ".";

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, view, setView, restoreSession } =
    useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) restoreSession();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return view === "login" ? (
      <LoginForm onSwitch={() => setView("register")} />
    ) : (
      <RegisterForm onSwitch={() => setView("login")} />
    );
  }

  return <>{children}</>;
};
