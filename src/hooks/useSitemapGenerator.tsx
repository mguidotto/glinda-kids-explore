
import { useCallback } from 'react';
import { generateDynamicSitemap } from '@/utils/sitemapGenerator';

export const useSitemapGenerator = () => {
  const generateAndDownloadSitemap = useCallback(async () => {
    try {
      console.log('Generating sitemap for download...');
      const xml = await generateDynamicSitemap();
      
      // Create blob and download
      const blob = new Blob([xml], { 
        type: 'application/xml;charset=utf-8' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sitemap.xml';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      console.log('Sitemap downloaded successfully');
      return true;
    } catch (error) {
      console.error('Error generating sitemap for download:', error);
      return false;
    }
  }, []);

  const logSitemapContent = useCallback(async () => {
    try {
      const xml = await generateDynamicSitemap();
      console.log('=== SITEMAP CONTENT ===');
      console.log(xml);
      console.log('=== END SITEMAP ===');
      return xml;
    } catch (error) {
      console.error('Error logging sitemap:', error);
      return null;
    }
  }, []);

  return {
    generateAndDownloadSitemap,
    logSitemapContent
  };
};
