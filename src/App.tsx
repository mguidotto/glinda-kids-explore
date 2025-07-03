
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Search from "./pages/Search";
import ContentDetail from "./pages/ContentDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import UserDashboard from "./pages/UserDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import MobileLayout from "./components/MobileLayout";
import { useAuth } from "./hooks/useAuth";
import { useBranding } from "./hooks/useBranding";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics";
import { usePWA } from "./hooks/usePWA";
import { useMobile } from "./hooks/use-mobile";

const queryClient = new QueryClient();

const App = () => {
  const { user, loading } = useAuth();
  const { branding } = useBranding();
  const isMobile = useMobile();
  
  useGoogleAnalytics();
  usePWA();

  useEffect(() => {
    if (branding?.site_title) {
      document.title = branding.site_title;
    }
    if (branding?.favicon_url) {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = branding.favicon_url;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [branding]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const AppContent = () => (
    <>
      <Navigation />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/provider" element={<ProviderDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Content routes - handle both slug and ID based URLs */}
          <Route path="/content/:slugOrId" element={<ContentDetail />} />
          <Route path="/:categorySlug/:contentSlug" element={<ContentDetail />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            {isMobile ? (
              <MobileLayout>
                <AppContent />
              </MobileLayout>
            ) : (
              <AppContent />
            )}
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
