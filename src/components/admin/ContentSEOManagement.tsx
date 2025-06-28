
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, Save, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Content {
  id: string;
  title: string;
  slug: string | null;
  featured_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_image: string | null;
  description: string | null;
}

const ContentSEOManagement = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [seoData, setSeoData] = useState({
    meta_title: "",
    meta_description: "",
    meta_image: "",
  });

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    if (selectedContent) {
      setSeoData({
        meta_title: selectedContent.meta_title || selectedContent.title,
        meta_description: selectedContent.meta_description || selectedContent.description || "",
        meta_image: selectedContent.meta_image || selectedContent.featured_image || "",
      });
    }
  }, [selectedContent]);

  const fetchContents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contents")
      .select("id, title, slug, featured_image, meta_title, meta_description, meta_image, description")
      .eq("published", true)
      .order("title");

    if (error) {
      setError("Errore nel caricamento dei contenuti");
      console.error(error);
    } else {
      setContents(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!selectedContent) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const { error } = await supabase
        .from("contents")
        .update({
          meta_title: seoData.meta_title || null,
          meta_description: seoData.meta_description || null,
          meta_image: seoData.meta_image || null,
        })
        .eq("id", selectedContent.id);

      if (error) throw error;

      setMessage("Meta tag Open Graph salvati con successo!");
      
      // Update local state
      setContents(prev => prev.map(content => 
        content.id === selectedContent.id 
          ? { ...content, ...seoData }
          : content
      ));
      
      setSelectedContent(prev => prev ? { ...prev, ...seoData } : null);
      
    } catch (error) {
      console.error("Error saving SEO data:", error);
      setError("Errore nel salvare i meta tag");
    } finally {
      setSaving(false);
    }
  };

  const generatePreviewUrl = (content: Content) => {
    if (content.slug) {
      return `${window.location.origin}/content/${content.slug}`;
    }
    return `${window.location.origin}/content/${content.id}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO e Open Graph per Contenuti
          </CardTitle>
          <p className="text-sm text-gray-600">
            Gestisci i meta tag SEO e Open Graph per ogni contenuto
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

          <div>
            <Label htmlFor="content-select">Seleziona Contenuto</Label>
            <Select
              value={selectedContent?.id || ""}
              onValueChange={(value) => {
                const content = contents.find(c => c.id === value);
                setSelectedContent(content || null);
                setMessage(null);
                setError(null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Scegli un contenuto da modificare" />
              </SelectTrigger>
              <SelectContent>
                {contents.map((content) => (
                  <SelectItem key={content.id} value={content.id}>
                    {content.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedContent && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Meta Tag per: {selectedContent.title}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(generatePreviewUrl(selectedContent), '_blank')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Anteprima
                </Button>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="og-title">Open Graph Title</Label>
                  <Input
                    id="og-title"
                    value={seoData.meta_title}
                    onChange={(e) => setSeoData(prev => ({ ...prev, meta_title: e.target.value }))}
                    placeholder={`Default: ${selectedContent.title}`}
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {seoData.meta_title.length}/60 caratteri • Usato per SEO e condivisioni social
                  </p>
                </div>

                <div>
                  <Label htmlFor="og-description">Open Graph Description</Label>
                  <Textarea
                    id="og-description"
                    value={seoData.meta_description}
                    onChange={(e) => setSeoData(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder={selectedContent.description || "Descrizione del contenuto..."}
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {seoData.meta_description.length}/160 caratteri • Descrizione per condivisioni social
                  </p>
                </div>

                <div>
                  <Label htmlFor="og-image">Open Graph Image</Label>
                  <Input
                    id="og-image"
                    value={seoData.meta_image}
                    onChange={(e) => setSeoData(prev => ({ ...prev, meta_image: e.target.value }))}
                    placeholder={selectedContent.featured_image || "URL dell'immagine..."}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedContent.featured_image ? 
                      `Default: immagine in evidenza (${selectedContent.featured_image.substring(0, 50)}...)` : 
                      "Nessuna immagine in evidenza disponibile"
                    }
                  </p>
                  
                  {seoData.meta_image && (
                    <div className="mt-2">
                      <img 
                        src={seoData.meta_image} 
                        alt="Anteprima Open Graph" 
                        className="max-w-64 max-h-32 object-contain border rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Anteprima Meta Tag</h4>
                  <div className="bg-white p-3 border rounded text-sm space-y-1">
                    <div><strong>Titolo:</strong> {seoData.meta_title || selectedContent.title}</div>
                    <div><strong>Descrizione:</strong> {seoData.meta_description || selectedContent.description || "Nessuna descrizione"}</div>
                    <div><strong>Immagine:</strong> {seoData.meta_image || selectedContent.featured_image || "Nessuna immagine"}</div>
                    <div><strong>URL:</strong> {generatePreviewUrl(selectedContent)}</div>
                  </div>
                </div>

                <Button 
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Salvataggio...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salva Meta Tag
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentSEOManagement;
