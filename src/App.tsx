import { AuthGate } from "./components/auth";
import { AdminDashboard } from "./components";
import DonationPage from "./pages/DonationPage";
import { StripeProvider } from "./stripe/StripeProvider";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-7xl font-black text-yellow-500">404</div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">
            Page Not Found
          </h1>
          <p className="text-slate-400 text-sm">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-yellow-500 text-black font-black uppercase tracking-widest hover:bg-yellow-400 transition-all active:scale-[0.98]"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StripeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DonationPage />} />
            <Route
              path="/admin"
              element={
                <AuthGate>
                  <AdminDashboard />
                </AuthGate>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </StripeProvider>
    </QueryClientProvider>
  );
}

export default App;