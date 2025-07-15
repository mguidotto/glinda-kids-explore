
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useBranding } from './useBranding';

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
  title: 'Scopri corsi, eventi e servizi educativi per i tuoi bambini',
  description: 'Glinda aiuta i genitori a trovare le migliori opportunità vicino a te.',
  keywords: 'attività bambini, corsi bambini, eventi familiari, servizi educativi, marketplace genitori',
  canonical: 'https://glinda.lovable.app/',
  ogImage: 'https://glinda.lovable.app/icon-512x512.png'
};

export const useSEO = (seoData: SEOData = {}) => {
  const location = useLocation();
  const { getSetting } = useBranding();

  useEffect(() => {
    // Recupera i valori configurati dall'admin o usa i default
    const adminTitle = getSetting('meta_title');
    const adminDescription = getSetting('meta_description');
    const adminOgImage = getSetting('og_image');
    
    const {
      title = adminTitle || DEFAULT_SEO.title,
      description = adminDescription || DEFAULT_SEO.description,
      keywords = DEFAULT_SEO.keywords,
      canonical = `https://glinda.lovable.app${location.pathname}`,
      ogTitle = title,
      ogDescription = description,
      ogImage = adminOgImage || seoData.ogImage || DEFAULT_SEO.ogImage,
      ogType = 'website',
      noIndex = false,
      twitterTitle = ogTitle,
      twitterDescription = ogDescription,
      twitterImage = adminOgImage || seoData.twitterImage || ogImage
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

  }, [seoData, location.pathname, getSetting]);
};
