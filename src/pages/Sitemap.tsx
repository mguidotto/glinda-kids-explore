
import { useEffect, useState } from 'react';
import { generateDynamicSitemap } from '@/utils/sitemapGenerator';

const Sitemap = () => {
  const [sitemapXml, setSitemapXml] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const xml = await generateDynamicSitemap();
        setSitemapXml(xml);
      } catch (error) {
        console.error('Error generating sitemap:', error);
        setSitemapXml('<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate sitemap</error>');
      } finally {
        setLoading(false);
      }
    };

    fetchSitemap();
  }, []);

  useEffect(() => {
    // Set proper meta tag for XML content type
    if (!loading && sitemapXml) {
      const existingMeta = document.querySelector('meta[http-equiv="Content-Type"]');
      if (existingMeta) {
        existingMeta.remove();
      }
      
      const metaContentType = document.createElement('meta');
      metaContentType.setAttribute('http-equiv', 'Content-Type');
      metaContentType.setAttribute('content', 'application/xml; charset=utf-8');
      document.head.appendChild(metaContentType);
    }
  }, [loading, sitemapXml]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Generating sitemap...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <pre 
        style={{ 
          fontFamily: 'monospace', 
          whiteSpace: 'pre-wrap',
          margin: 0,
          padding: '1rem',
          fontSize: '14px',
          lineHeight: '1.4'
        }}
        dangerouslySetInnerHTML={{ __html: sitemapXml }}
      />
    </div>
  );
};

export default Sitemap;
