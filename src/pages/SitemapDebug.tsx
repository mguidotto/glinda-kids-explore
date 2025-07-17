
import { useEffect, useState } from 'react';
import { generateDynamicSitemap } from '@/utils/sitemapGenerator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Download, RefreshCw } from 'lucide-react';

const SitemapDebug = () => {
  const [sitemapXml, setSitemapXml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

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

  const regenerateStaticSitemap = async () => {
    setGenerating(true);
    try {
      const xml = await generateDynamicSitemap();
      
      // Create a blob and download it
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sitemap.xml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Static sitemap file generated and downloaded');
    } catch (error) {
      console.error('Error generating static sitemap:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate static sitemap');
    } finally {
      setGenerating(false);
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
            Debug della sitemap e generazione del file statico per SEO
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button onClick={fetchSitemap} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Rigenera Sitemap
            </Button>
            <Button 
              onClick={regenerateStaticSitemap} 
              disabled={generating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {generating ? (
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
            <h4 className="font-semibold">Per implementare la sitemap statica:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Scarica il file sitemap.xml usando il pulsante sopra</li>
              <li>Sostituisci il file public/sitemap.xml con quello scaricato</li>
              <li>La sitemap sarà accessibile su /sitemap.xml</li>
              <li>Rigenera periodicamente quando aggiungi nuovi contenuti</li>
            </ol>
          </div>
          
          <Alert>
            <AlertDescription>
              <strong>Nota:</strong> Questa pagina è solo per debug. La sitemap finale 
              dovrebbe essere servita come file statico da /sitemap.xml per funzionare 
              correttamente con i motori di ricerca.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default SitemapDebug;
