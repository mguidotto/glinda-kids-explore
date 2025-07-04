
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOData {
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
}

const DEFAULT_SEO = {
  title: 'Glinda - Marketplace Attività Educative per Bambini 0-10 anni',
  description: 'Scopri i migliori corsi, eventi e servizi educativi per bambini da 0 a 10 anni su Glinda. Marketplace di fiducia per genitori.',
  keywords: 'attività bambini, corsi bambini, eventi familiari, servizi educativi, marketplace genitori',
  canonical: 'https://glinda.lovable.app/',
  ogImage: 'https://glinda.lovable.app/icon-512x512.png'
};

export const useSEO = (seoData: SEOData = {}) => {
  const location = useLocation();

  useEffect(() => {
    const {
      title = DEFAULT_SEO.title,
      description = DEFAULT_SEO.description,
      keywords = DEFAULT_SEO.keywords,
      canonical = `https://glinda.lovable.app${location.pathname}`,
      ogTitle = title,
      ogDescription = description,
      ogImage = DEFAULT_SEO.ogImage,
      ogType = 'website',
      noIndex = false,
      twitterTitle = ogTitle,
      twitterDescription = ogDescription,
      twitterImage = ogImage
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

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    
    // Open Graph tags
    updateMetaTag('og:title', ogTitle, true);
    updateMetaTag('og:description', ogDescription, true);
    updateMetaTag('og:url', canonical, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:site_name', 'Glinda', true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', twitterTitle);
    updateMetaTag('twitter:description', twitterDescription);
    updateMetaTag('twitter:image', twitterImage);

  }, [seoData, location.pathname]);
};
