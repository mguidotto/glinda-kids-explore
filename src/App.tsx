
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCapacitor } from "@/hooks/useCapacitor";
import MobileLayout from "@/components/MobileLayout";
import InstallPrompt from "@/components/InstallPrompt";
import Index from "./pages/Index";
import Search from "./pages/Search";
import ContentDetail from "./pages/ContentDetail";
import Auth from "./pages/Auth";
import UserDashboard from "./pages/UserDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  const { isNative } = useCapacitor();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MobileLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/content/:id" element={<ContentDetail />} />
              <Route path="/:categorySlug/:contentSlug" element={<ContentDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/favorites" element={<UserDashboard />} />
              <Route path="/provider-dashboard" element={<ProviderDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            {!isNative && <InstallPrompt />}
          </MobileLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
