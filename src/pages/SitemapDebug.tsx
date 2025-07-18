
import { useEffect, useState } from 'react';
import { generateDynamicSitemap } from '@/utils/sitemapGenerator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Download, RefreshCw, Upload } from 'lucide-react';
import { useSitemapGenerator } from '@/hooks/useSitemapGenerator';

const SitemapDebug = () => {
  const [sitemapXml, setSitemapXml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { updateStaticSitemap, generateAndDownloadSitemap } = useSitemapGenerator();

  const fetchSitemap = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Generating sitemap...');
      const xml = await generateDynamicSitemap();
      console.log('Sitemap generated successfully:', xml.length, 'characters');
      setSitemapXml(xml);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate sitemap');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSitemap = async () => {
    setUpdating(true);
    setError(null);
    
    try {
      const success = await updateStaticSitemap();
      if (!success) {
        setError('Errore durante l\'aggiornamento della sitemap');
      }
    } catch (error) {
      console.error('Error updating sitemap:', error);
      setError(error instanceof Error ? error.message : 'Failed to update sitemap');
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadSitemap = async () => {
    setDownloading(true);
    try {
      await generateAndDownloadSitemap();
    } catch (error) {
      console.error('Error downloading sitemap:', error);
      setError(error instanceof Error ? error.message : 'Failed to download sitemap');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    fetchSitemap();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg">Generating sitemap...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sitemap Debug & Generator</CardTitle>
          <p className="text-sm text-gray-600">
            Debug della sitemap e gestione del file statico per SEO
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 flex-wrap">
            <Button onClick={fetchSitemap} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Rigenera Sitemap
            </Button>
            <Button 
              onClick={handleUpdateSitemap} 
              disabled={updating}
              className="bg-green-600 hover:bg-green-700"
            >
              {updating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Aggiorna /sitemap.xml
            </Button>
            <Button 
              onClick={handleDownloadSitemap} 
              disabled={downloading}
              variant="outline"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Scarica sitemap.xml
            </Button>
          </div>

          {sitemapXml && (
            <div className="space-y-2">
              <h3 className="font-semibold">Contenuto Sitemap:</h3>
              <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-auto">
                <pre className="text-xs font-mono whitespace-pre-wrap">
                  {sitemapXml}
                </pre>
              </div>
              <p className="text-sm text-gray-600">
                Dimensione: {sitemapXml.length} caratteri
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Istruzioni per l'implementazione</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Per aggiornare la sitemap:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Clicca "Aggiorna /sitemap.xml" per aggiornare automaticamente il file statico</li>
              <li>La sitemap sarà immediatamente accessibile su /sitemap.xml</li>
              <li>Usa "Scarica sitemap.xml" per ottenere una copia di backup</li>
              <li>Ripeti quando aggiungi nuovi contenuti</li>
            </ol>
          </div>
          
          <Alert>
            <AlertDescription>
              <strong>Dominio aggiornato:</strong> Tutti gli URL utilizzano ora il dominio 
              corretto <strong>www.glinda.it</strong> invece di glinda.lovable.app.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default SitemapDebug;
