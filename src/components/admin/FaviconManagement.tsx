
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBranding } from "@/hooks/useBranding";
import { Globe, Loader2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const FaviconManagement = () => {
  const { settings, isLoading, updateSetting, getSetting, updateFaviconInDocument } = useBranding();
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `favicon-${Date.now()}.${fileExt}`;
      
      console.log("Uploading favicon:", fileName);
      
      const { data, error } = await supabase.storage
        .from('content-images')
        .upload(fileName, file);

      if (error) {
        console.error("Upload error:", error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('content-images')
        .getPublicUrl(fileName);

      console.log("Favicon uploaded, URL:", publicUrl);
      
      await updateSetting('favicon_url', publicUrl);
      
      // Apply favicon immediately
      updateFaviconInDocument(publicUrl);
      
      toast({
        title: "Favicon aggiornata",
        description: "La favicon del sito è stata aggiornata con successo.",
      });
    } catch (error) {
      console.error("Favicon upload error:", error);
      toast({
        title: "Errore",
        description: "Errore durante il caricamento della favicon.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFavicon = async () => {
    await updateSetting('favicon_url', '/favicon.ico');
    updateFaviconInDocument('/favicon.ico');
    
    toast({
      title: "Favicon ripristinata",
      description: "La favicon è stata ripristinata a quella predefinita.",
    });
  };

  const currentFavicon = getSetting('favicon_url', '/favicon.ico');

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
          Gestisci la favicon che appare nella barra del browser
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentFavicon && currentFavicon !== '/favicon.ico' ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <img 
                src={currentFavicon} 
                alt="Favicon Preview" 
                className="w-8 h-8 object-contain border rounded"
                onError={(e) => {
                  console.error("Favicon preview error for:", currentFavicon);
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex-1">
                <div className="font-medium text-sm">Favicon Attuale</div>
                <div className="text-xs text-gray-500 break-all">{currentFavicon}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveFavicon}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Sostituisci Favicon</Label>
              <p className="text-xs text-gray-500 mb-2">
                Carica una nuova immagine PNG, JPG o SVG (16x16 o 32x32 pixel consigliati)
              </p>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    console.log("Selected file for favicon:", file.name, file.size);
                    handleFileUpload(file);
                  }
                }}
                disabled={uploading}
                className="max-w-xs"
              />
              {uploading && (
                <div className="flex items-center gap-2 mt-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Caricamento favicon...</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-3">
              Carica una nuova favicon
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Formato supportato: PNG, JPG, SVG (16x16 o 32x32 pixel consigliati)
            </p>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  console.log("Selected file for new favicon:", file.name, file.size);
                  handleFileUpload(file);
                }
              }}
              disabled={uploading}
              className="max-w-xs mx-auto"
            />
            {uploading && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Caricamento favicon...</span>
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded-lg text-sm">
          <div className="font-medium text-blue-900 mb-1">💡 Suggerimenti:</div>
          <ul className="text-blue-800 space-y-1 text-xs">
            <li>• Usa immagini PNG per la migliore compatibilità</li>
            <li>• Dimensioni consigliate: 16x16, 32x32 o 64x64 pixel</li>
            <li>• Evita immagini troppo complesse per piccole dimensioni</li>
            <li>• Le modifiche si applicano immediatamente</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FaviconManagement;
