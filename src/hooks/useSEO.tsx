
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  type?: string;
}

const DEFAULT_SEO = {
  title: 'Glinda - Marketplace Attività Educative per Bambini 0-10 anni',
  description: 'Scopri i migliori corsi, eventi e servizi educativi per bambini da 0 a 10 anni su Glinda. Marketplace di fiducia per genitori.',
  keywords: 'attività bambini, corsi bambini, eventi familiari, servizi educativi, marketplace genitori',
  canonical: 'https://glinda.lovable.app/'
};

export const useSEO = (seoData: SEOData = {}) => {
  const location = useLocation();

  useEffect(() => {
    const {
      title = DEFAULT_SEO.title,
      description = DEFAULT_SEO.description,
      keywords = DEFAULT_SEO.keywords,
      canonical = `https://glinda.lovable.app${location.pathname}`,
      ogImage = 'https://glinda.lovable.app/icon-512x512.png',
      noIndex = false,
      type = 'website'
    } = seoData;

    // Update title
    document.title = title;

    // Update or create meta tags
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

    // Update canonical link
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonical);

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    
    // Open Graph
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', canonical, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:type', type, true);
    
    // Twitter
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);

  }, [seoData, location.pathname]);
};
