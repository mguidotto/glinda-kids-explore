
import { useEffect } from 'react';
import { generateDynamicSitemap } from '@/utils/sitemapGenerator';

const DynamicSitemap = () => {
  useEffect(() => {
    const generateSitemap = async () => {
      try {
        const sitemapXml = await generateDynamicSitemap();
        
        // Create a blob with the XML content
        const blob = new Blob([sitemapXml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary link to download/serve the sitemap
        const link = document.createElement('a');
        link.href = url;
        link.download = 'sitemap.xml';
        
        // For SEO purposes, we'll also expose it via a route
        console.log('Generated sitemap:', sitemapXml);
        
      } catch (error) {
        console.error('Error generating sitemap:', error);
      }
    };

    generateSitemap();
  }, []);

  return null; // This component doesn't render anything
};

export default DynamicSitemap;
