
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBranding } from "@/hooks/useBranding";
import { Globe, Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FaviconManagement = () => {
  const { settings, isLoading, updateSetting, getSetting } = useBranding();
  const [editingValue, setEditingValue] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleEdit = (value: string) => {
    setEditingValue(value);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSetting('favicon_url', editingValue);
      
      // Update the favicon in the document head
      updateFaviconInDocument(editingValue);
      
      toast({
        title: "Favicon aggiornata",
        description: "La favicon del sito è stata aggiornata con successo.",
      });
      
      setEditingValue("");
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante l'aggiornamento della favicon.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateFaviconInDocument = (faviconUrl: string) => {
    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(link => link.remove());

    // Add new favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = faviconUrl;
    
    // Determine type based on file extension
    if (faviconUrl.endsWith('.png')) {
      link.type = 'image/png';
    } else if (faviconUrl.endsWith('.jpg') || faviconUrl.endsWith('.jpeg')) {
      link.type = 'image/jpeg';
    } else if (faviconUrl.endsWith('.svg')) {
      link.type = 'image/svg+xml';
    } else {
      link.type = 'image/x-icon';
    }
    
    document.head.appendChild(link);
  };

  const getCurrentValue = () => {
    return editingValue !== "" ? editingValue : getSetting('favicon_url', '/favicon.ico');
  };

  const isEditing = editingValue !== "";
  const currentFavicon = getCurrentValue();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Gestione Favicon
        </CardTitle>
        <p className="text-sm text-gray-600">
          Modifica la favicon che appare nella barra del browser
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="favicon_url">URL Favicon</Label>
          <p className="text-xs text-gray-500">
            Inserisci l'URL di un'immagine PNG, JPG o SVG (16x16 o 32x32 pixel consigliati)
          </p>
          <div className="flex gap-2">
            <Input
              id="favicon_url"
              value={getCurrentValue()}
              onChange={(e) => handleEdit(e.target.value)}
              placeholder="https://esempio.com/favicon.png o /path/to/favicon.png"
              className="flex-1"
            />
            {isEditing && (
              <Button
                onClick={handleSave}
                disabled={saving}
                size="sm"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Salva'
                )}
              </Button>
            )}
          </div>
        </div>

        {currentFavicon && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h4 className="font-medium text-sm mb-3">Anteprima Favicon</h4>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <img 
                  src={currentFavicon} 
                  alt="Favicon Preview" 
                  className="w-8 h-8 object-contain border rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="text-sm">
                  <div className="font-medium">Preview 32x32</div>
                  <div className="text-gray-500 text-xs">
                    Come apparirà nella barra del browser
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <div className="font-medium text-blue-900 mb-1">💡 Suggerimenti:</div>
              <ul className="text-blue-800 space-y-1 text-xs">
                <li>• Usa immagini PNG per la migliore compatibilità</li>
                <li>• Dimensioni consigliate: 16x16, 32x32 o 64x64 pixel</li>
                <li>• Evita immagini troppo complesse per piccole dimensioni</li>
                <li>• Le modifiche si applicano immediatamente</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FaviconManagement;
