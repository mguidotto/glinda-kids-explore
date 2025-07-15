
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
  keywords: 'attività bambini, corsi bambini, eventi familiari, servizi educativi, genitori',
  canonical: 'https://www.glinda.it',
  ogImage: 'https://glinda.it/lovable-uploads/df33b161-f952-484f-9188-9e42eb514df1.png'
};

export const useSEO = (seoData: SEOData = {}) => {
  const location = useLocation();
  const { getSetting } = useBranding();

  useEffect(() => {
    // Recupera i valori configurati dall'admin o usa i default
    const adminTitle = getSetting('meta_title');
    const adminDescription = getSetting('meta_description');
    const adminOgImage = getSetting('og_image');
    const adminCanonicalBase = getSetting('canonical_url');
    
    const canonicalBase = adminCanonicalBase || DEFAULT_SEO.canonical;
    
    const {
      title = adminTitle || DEFAULT_SEO.title,
      description = adminDescription || DEFAULT_SEO.description,
      keywords = DEFAULT_SEO.keywords,
      canonical = `${canonicalBase}${location.pathname}`,
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

    // Update existing meta tags (not create new ones)
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      const element = document.querySelector(selector) as HTMLMetaElement;
      
      if (element) {
        element.setAttribute('content', content);
      } else {
        // Solo se non esiste, lo creiamo (per compatibilità con pagine senza tag statici)
        const newElement = document.createElement('meta');
        if (property) {
          newElement.setAttribute('property', name);
        } else {
          newElement.setAttribute('name', name);
        }
        newElement.setAttribute('content', content);
        document.head.appendChild(newElement);
      }
    };

    // Update canonical link
    const canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalElement) {
      canonicalElement.setAttribute('href', canonical);
    }

    // Basic meta tags - aggiorna solo quelli esistenti
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    
    // Open Graph tags - aggiorna solo quelli esistenti
    updateMetaTag('og:title', ogTitle, true);
    updateMetaTag('og:description', ogDescription, true);
    updateMetaTag('og:url', canonical, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:site_name', 'Glinda', true);
    
    // Twitter Card tags - aggiorna solo quelli esistenti
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', twitterTitle);
    updateMetaTag('twitter:description', twitterDescription);
    updateMetaTag('twitter:image', twitterImage);

  }, [seoData, location.pathname, getSetting]);
};
