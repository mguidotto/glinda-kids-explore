import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './Navigation';
import Footer from './Footer';
import { useAuth } from '../hooks/useAuth';
import { useBranding } from '../hooks/useBranding';
import { useGoogleAnalytics } from '../hooks/useGoogleAnalytics';
import { useErrorTracking } from '../hooks/useErrorTracking';
import { usePWA } from '../hooks/usePWA';

const queryClient = new QueryClient();

const Layout = () => {
  const location = useLocation();
  const { user, loading } = useAuth();
  const { getSetting } = useBranding();
  const { trackPageView } = useGoogleAnalytics();

  useGoogleAnalytics();
  useErrorTracking();
  usePWA();

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  // Set site title and favicon
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default Layout;
