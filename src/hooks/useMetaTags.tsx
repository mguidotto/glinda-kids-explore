
import { useEffect } from 'react';
import { useBranding } from './useBranding';

interface MetaTagsConfig {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: object;
}

export const useMetaTags = (config: MetaTagsConfig = {}) => {
  const { getSetting } = useBranding();

  useEffect(() => {
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    const updateCanonical = (url: string) => {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
    };

    const addStructuredData = (data: object) => {
      // Remove existing structured data with same type
      const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
      existingScripts.forEach(script => {
        try {
          const scriptData = JSON.parse(script.textContent || '');
          if (scriptData['@type'] === (data as any)['@type']) {
            script.remove();
          }
        } catch (e) {
          // Ignore parsing errors
        }
      });

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data, null, 2);
      document.head.appendChild(script);
    };

    // Get settings with fallbacks
    const title = config.title || getSetting('meta_title') || 'Scopri corsi, eventi e servizi educativi per i tuoi bambini';
    const description = config.description || getSetting('meta_description') || 'Glinda aiuta i genitori a trovare le migliori opportunità vicino a te.';
    const ogImage = config.ogImage || getSetting('og_image') || 'https://glinda.it/lovable-uploads/df33b161-f952-484f-9188-9e42eb514df1.png';
    const canonicalBase = getSetting('canonical_url') || 'https://glinda.lovable.app';
    const canonical = config.canonical || `${canonicalBase}${window.location.pathname}`;

    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', config.keywords || 'attività bambini, corsi bambini, eventi familiari, servizi educativi');
    updateMetaTag('robots', config.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    
    // Open Graph
    updateMetaTag('og:title', config.ogTitle || title, true);
    updateMetaTag('og:description', config.ogDescription || description, true);
    updateMetaTag('og:url', canonical, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:type', config.ogType || 'website', true);
    updateMetaTag('og:site_name', 'Glinda', true);
    updateMetaTag('og:locale', 'it_IT', true);
    
    // Twitter Card
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', config.twitterTitle || title);
    updateMetaTag('twitter:description', config.twitterDescription || description);
    updateMetaTag('twitter:image', config.twitterImage || ogImage);
    updateMetaTag('twitter:site', '@Glinda');
    
    // Canonical URL
    updateCanonical(canonical);

    // Structured Data
    if (config.structuredData) {
      addStructuredData(config.structuredData);
    }

  }, [config, getSetting]);
};
