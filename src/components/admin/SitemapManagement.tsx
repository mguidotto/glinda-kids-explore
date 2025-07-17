
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Download, FileText, ExternalLink } from "lucide-react";
import { useSitemapGenerator } from "@/hooks/useSitemapGenerator";

const SitemapManagement = () => {
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { generateAndDownloadSitemap, logSitemapContent } = useSitemapGenerator();

  const handleGenerateSitemap = async () => {
    setGenerating(true);
    setMessage(null);
    setError(null);

    try {
      const success = await generateAndDownloadSitemap();
      if (success) {
        setMessage('Sitemap generata e scaricata con successo! Sostituisci il file public/sitemap.xml con quello scaricato.');
      } else {
        setError('Errore nella generazione della sitemap');
      }
    } catch (err) {
      setError('Errore nella generazione della sitemap');
      console.error(err);
    } finally {
      setGenerating(false);
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
            <h3 className="font-semibold">Genera Sitemap</h3>
            <p className="text-sm text-gray-600">
              Genera una sitemap aggiornata con tutti i contenuti pubblicati, 
              le categorie attive e le pagine statiche.
            </p>
            <Button 
              onClick={handleGenerateSitemap}
              disabled={generating}
              className="w-full"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Genera e Scarica Sitemap
                </>
              )}
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Debug e Visualizzazione</h3>
            <p className="text-sm text-gray-600">
              Visualizza il contenuto della sitemap nella console per debug.
            </p>
            <div className="space-y-2">
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
            <li>Clicca "Genera e Scarica Sitemap" per ottenere il file XML aggiornato</li>
            <li>Sostituisci il file <code>public/sitemap.xml</code> con quello scaricato</li>
            <li>La sitemap sarà automaticamente accessibile su <code>/sitemap.xml</code></li>
            <li>Ripeti questo processo quando aggiungi/modifichi contenuti</li>
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
