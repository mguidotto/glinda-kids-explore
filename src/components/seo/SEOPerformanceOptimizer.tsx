
import { useEffect } from 'react';

const SEOPerformanceOptimizer = () => {
  useEffect(() => {
    // Add preconnect links for external resources
    const addPreconnectLinks = () => {
      const preconnectDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com'
      ];

      preconnectDomains.forEach(domain => {
        if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = domain;
          if (domain.includes('gstatic')) {
            link.crossOrigin = 'anonymous';
          }
          document.head.appendChild(link);
        }
      });
    };

    // Add DNS prefetch for additional performance
    const addDnsPrefetch = () => {
      const dnsPrefetchDomains = [
        'https://rnxiazinwdpyhviyjdwt.supabase.co',
        'https://glinda.it'
      ];

      dnsPrefetchDomains.forEach(domain => {
        if (!document.querySelector(`link[rel="dns-prefetch"][href="${domain}"]`)) {
          const link = document.createElement('link');
          link.rel = 'dns-prefetch';
          link.href = domain;
          document.head.appendChild(link);
        }
      });
    };

    // Add resource hints for better loading
    const addResourceHints = () => {
      // Preload critical CSS if not already done
      if (!document.querySelector('link[rel="preload"][as="style"]')) {
        const criticalCssHint = document.createElement('link');
        criticalCssHint.rel = 'preload';
        criticalCssHint.as = 'style';
        criticalCssHint.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
        document.head.appendChild(criticalCssHint);
      }
    };

    addPreconnectLinks();
    addDnsPrefetch();
    addResourceHints();

    // Monitor Core Web Vitals
    if ('web-vital' in window || typeof window !== 'undefined') {
      // This would integrate with a web vitals library if available
      console.log('SEO Performance Optimizer loaded');
    }

  }, []);

  return null;
};

export default SEOPerformanceOptimizer;
