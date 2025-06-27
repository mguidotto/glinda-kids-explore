
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const useGoogleAnalytics = () => {
  useEffect(() => {
    const loadGoogleAnalytics = async () => {
      try {
        const { data: settings } = await supabase
          .from('app_texts')
          .select('value')
          .eq('key', 'google_analytics_id')
          .maybeSingle();

        const analyticsId = settings?.value;
        if (!analyticsId) return;

        // Load Google Analytics script
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${analyticsId}');
        `;
        document.head.appendChild(script2);

        // Make gtag available globally
        window.gtag = function() {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push(arguments);
        };

        console.log('Google Analytics loaded with ID:', analyticsId);
      } catch (error) {
        console.error('Error loading Google Analytics:', error);
      }
    };

    loadGoogleAnalytics();
  }, []);

  const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    if (window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  };

  const trackPageView = (pagePath: string) => {
    if (window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: pagePath,
      });
    }
  };

  return { trackEvent, trackPageView };
};
