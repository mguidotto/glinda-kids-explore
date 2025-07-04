
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const useGoogleAnalytics = () => {
  const [analyticsId, setAnalyticsId] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleAnalytics = async () => {
      try {
        const { data: settings } = await supabase
          .from('app_texts')
          .select('value')
          .eq('key', 'google_analytics_id')
          .maybeSingle();

        const analyticsIdValue = settings?.value;
        if (!analyticsIdValue) {
          console.log('Google Analytics ID not configured');
          return;
        }

        setAnalyticsId(analyticsIdValue);

        // Check if scripts are already loaded
        if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${analyticsIdValue}"]`)) {
          console.log('Google Analytics already loaded');
          return;
        }

        // Load Google Analytics script
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsIdValue}`;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${analyticsIdValue}');
        `;
        document.head.appendChild(script2);

        // Make gtag available globally
        window.gtag = function() {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push(arguments);
        };

        console.log('Google Analytics loaded with ID:', analyticsIdValue);
      } catch (error) {
        console.error('Error loading Google Analytics:', error);
      }
    };

    loadGoogleAnalytics();
  }, []);

  const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
    console.log('Tracking event:', eventName, parameters);
    if (window.gtag && analyticsId) {
      window.gtag('event', eventName, parameters);
      console.log('Event tracked successfully');
    } else {
      console.warn('Google Analytics not loaded or ID missing. Event not tracked:', eventName);
    }
  };

  const trackPageView = (pagePath: string) => {
    console.log('Tracking page view:', pagePath);
    if (window.gtag && analyticsId) {
      window.gtag('config', analyticsId, {
        page_path: pagePath,
      });
      console.log('Page view tracked successfully');
    } else {
      console.warn('Google Analytics not loaded or ID missing. Page view not tracked:', pagePath);
    }
  };

  return { trackEvent, trackPageView, analyticsId };
};
