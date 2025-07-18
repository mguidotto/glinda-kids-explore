
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Search from "./pages/Search";
import ContentDetail from "./pages/ContentDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Auth from "./pages/Auth";
import UserDashboard from "./pages/UserDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import SitemapXml from "./pages/SitemapXml";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { useAuth } from "./hooks/useAuth";
import { useBranding } from "./hooks/useBranding";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics";
import { useErrorTracking } from "./hooks/useErrorTracking";
import { usePWA } from "./hooks/usePWA";
import SitemapDebug from "./pages/SitemapDebug";

const queryClient = new QueryClient();

// Component to track route changes
const RouteTracker = () => {
  const location = useLocation();
  const { trackPageView } = useGoogleAnalytics();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  return null;
};

const App = () => {
  const { user, loading } = useAuth();
  const { getSetting } = useBranding();
  
  useGoogleAnalytics();
  useErrorTracking();
  usePWA();

  useEffect(() => {
    const siteTitle = getSetting('site_title');
    if (siteTitle) {
      document.title = siteTitle;
    }
    
    const faviconUrl = getSetting('favicon_url');
    if (faviconUrl) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link') as HTMLLinkElement;
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
  }, [getSetting]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteTracker />
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navigation />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/search" element={<Search />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/provider" element={<ProviderDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/sitemap.xml" element={<SitemapXml />} />
                <Route path="/sitemap-debug" element={<SitemapDebug />} />
                {/* Content routes - handle both slug and ID based URLs */}
                <Route path="/content/:slugOrId" element={<ContentDetail />} />
                <Route path="/:categorySlug/:contentSlug" element={<ContentDetail />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
