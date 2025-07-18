
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Download, FileText, ExternalLink, RefreshCw } from "lucide-react";
import { useSitemapGenerator } from "@/hooks/useSitemapGenerator";

const SitemapManagement = () => {
  const [updating, setUpdating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { updateStaticSitemap, generateAndDownloadSitemap, logSitemapContent } = useSitemapGenerator();

  const handleUpdateSitemap = async () => {
    setUpdating(true);
    setMessage(null);
    setError(null);

    try {
      const success = await updateStaticSitemap();
      if (success) {
        setMessage('Sitemap aggiornata con successo! Il file /sitemap.xml è stato aggiornato.');
      } else {
        setError('Errore durante l\'aggiornamento della sitemap');
      }
    } catch (err) {
      setError('Errore durante l\'aggiornamento della sitemap');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadSitemap = async () => {
    setDownloading(true);
    setMessage(null);
    setError(null);

    try {
      const success = await generateAndDownloadSitemap();
      if (success) {
        setMessage('Sitemap scaricata con successo!');
      } else {
        setError('Errore durante il download della sitemap');
      }
    } catch (err) {
      setError('Errore durante il download della sitemap');
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const handleViewSitemap = async () => {
    try {
      await logSitemapContent();
      setMessage('Contenuto sitemap stampato nella console del browser (F12 -> Console)');
    } catch (err) {
      setError('Errore nel visualizzare la sitemap');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Gestione Sitemap
        </CardTitle>
        <p className="text-sm text-gray-600">
          Genera e gestisci la sitemap XML per migliorare l'indicizzazione SEO
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-semibold">Aggiorna Sitemap Statica</h3>
            <p className="text-sm text-gray-600">
              Aggiorna direttamente il file /sitemap.xml con il contenuto più recente.
            </p>
            <Button 
              onClick={handleUpdateSitemap}
              disabled={updating}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {updating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Aggiornando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Aggiorna sitemap.xml
                </>
              )}
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Download e Debug</h3>
            <p className="text-sm text-gray-600">
              Scarica la sitemap o visualizzala per debug.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={handleDownloadSitemap}
                disabled={downloading}
                variant="outline"
                className="w-full"
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Scarica sitemap.xml
              </Button>
              <Button 
                onClick={handleViewSitemap}
                variant="outline"
                className="w-full"
              >
                <FileText className="h-4 w-4 mr-2" />
                Visualizza in Console
              </Button>
              <Button 
                onClick={() => window.open('/sitemap-debug', '_blank')}
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Apri Debug Page
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Istruzioni</h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Clicca "Aggiorna sitemap.xml" per aggiornare automaticamente il file statico</li>
            <li>La sitemap sarà immediatamente accessibile su <code>/sitemap.xml</code></li>
            <li>Usa "Scarica sitemap.xml" per ottenere una copia locale</li>
            <li>Ripeti l'aggiornamento quando aggiungi/modifichi contenuti</li>
          </ol>
        </div>

        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">Link Utili</h4>
          <div className="space-y-1 text-sm">
            <div>
              <strong>Sitemap attuale:</strong>{' '}
              <a 
                href="/sitemap.xml" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                /sitemap.xml
              </a>
            </div>
            <div>
              <strong>Robots.txt:</strong>{' '}
              <a 
                href="/robots.txt" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                /robots.txt
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SitemapManagement;
