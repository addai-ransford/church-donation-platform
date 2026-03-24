import DonationPage from "./pages/DonationPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { StripeProvider } from "./stripe/StripeProvider";
import { AdminDashboard } from "./components";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StripeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DonationPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </StripeProvider>
    </QueryClientProvider>
  );
}

export default App;
