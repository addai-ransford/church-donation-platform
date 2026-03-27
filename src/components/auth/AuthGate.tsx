import { useEffect } from "react";
import { useAuthStore } from "../../store";
import { LoginForm, RegisterForm } from ".";
import { authBackgrounds } from "../../types";

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, view, setView, restoreSession } =
    useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) restoreSession();
  }, [isAuthenticated, restoreSession]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#020617]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <FormWrapper backgroundClass={authBackgrounds.cyberSlate}>
        {view === "login" ? (
          <LoginForm onSwitch={() => setView("register")} />
        ) : (
          <RegisterForm onSwitch={() => setView("login")} />
        )}
      </FormWrapper>
    );
  }

  return <>{children}</>;
};

export const FormWrapper = ({
  children,
  backgroundClass,
}: {
  children: React.ReactNode;
  backgroundClass?: string;
}) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[999] p-4 overflow-hidden ${
        backgroundClass || "bg-[#020617]"
      }`}
    >
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-red-600/20 blur-[140px] rounded-full animate-pulse" />

        <div className="absolute top-[10%] right-[-10%] w-[45%] h-[45%] bg-yellow-500/20 blur-[130px] rounded-full" />

        <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] bg-orange-500/15 blur-[140px] rounded-full" />

        <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-red-900/20 blur-[120px] rounded-full" />
      </div>
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
