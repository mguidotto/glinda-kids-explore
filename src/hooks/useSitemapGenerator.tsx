
import { useCallback } from 'react';
import { generateDynamicSitemap } from '@/utils/sitemapGenerator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useSitemapGenerator = () => {
  const { toast } = useToast();

  const updateStaticSitemap = useCallback(async () => {
    try {
      console.log('Generating sitemap for static update...');
      const xml = await generateDynamicSitemap();
      
      console.log('Calling update-sitemap function...');
      const { data, error } = await supabase.functions.invoke('update-sitemap', {
        body: { sitemapContent: xml }
      });

      if (error) {
        console.error('Error calling update-sitemap function:', error);
        toast({
          title: "Errore",
          description: "Errore durante l'aggiornamento della sitemap",
          variant: "destructive"
        });
        return false;
      }

      console.log('Sitemap updated successfully:', data);
      toast({
        title: "Successo",
        description: "Sitemap aggiornata con successo!"
      });
      return true;
    } catch (error) {
      console.error('Error updating static sitemap:', error);
      toast({
        title: "Errore",
        description: "Errore durante l'aggiornamento della sitemap",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

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
    updateStaticSitemap,
    generateAndDownloadSitemap,
    logSitemapContent
  };
};
