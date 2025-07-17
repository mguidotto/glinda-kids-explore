
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
        
        // Set the correct content type for XML
        document.contentType = 'application/xml';
        
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
    // Set proper headers for XML response
    if (!loading) {
      const head = document.head;
      const metaContentType = document.createElement('meta');
      metaContentType.setAttribute('http-equiv', 'Content-Type');
      metaContentType.setAttribute('content', 'application/xml; charset=utf-8');
      head.appendChild(metaContentType);
    }
  }, [loading]);

  if (loading) {
    return <div>Generating sitemap...</div>;
  }

  return (
    <div style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
      {sitemapXml}
    </div>
  );
};

export default Sitemap;
