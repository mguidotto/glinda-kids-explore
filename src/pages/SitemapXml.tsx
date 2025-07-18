
import { useEffect, useState } from 'react';
import { generateDynamicSitemap } from '@/utils/sitemapGenerator';

const SitemapXml = () => {
  const [sitemapXml, setSitemapXml] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        const xml = await generateDynamicSitemap();
        setSitemapXml(xml);
      } catch (error) {
        console.error('Error generating sitemap:', error);
        // Fallback to basic sitemap if dynamic generation fails
        const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://glinda.lovable.app/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://glinda.lovable.app/search</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://glinda.lovable.app/about</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://glinda.lovable.app/contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;
        setSitemapXml(fallbackSitemap);
      } finally {
        setLoading(false);
      }
    };

    fetchSitemap();
  }, []);

  // Set proper meta tag for XML content type
  useEffect(() => {
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
    return <div>Generating sitemap...</div>;
  }

  return (
    <pre
      style={{
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        margin: 0,
        padding: 0,
        fontSize: '14px',
        lineHeight: '1.2'
      }}
    >
      {sitemapXml}
    </pre>
  );
};

export default SitemapXml;
