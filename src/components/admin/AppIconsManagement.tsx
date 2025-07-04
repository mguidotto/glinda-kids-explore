
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBranding } from "@/hooks/useBranding";
import { Smartphone, Loader2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AppIconsManagement = () => {
  const { settings, isLoading, updateSetting, getSetting } = useBranding();
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleFileUpload = async (key: string, file: File) => {
    setUploading(prev => ({ ...prev, [key]: true }));
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${key}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('content-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('content-images')
        .getPublicUrl(fileName);

      await updateSetting(key, publicUrl);
      
      toast({
        title: "Immagine caricata",
        description: `${iconSettings.find(s => s.key === key)?.label} caricata con successo.`,
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore durante il caricamento dell'immagine.",
        variant: "destructive",
      });
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleRemoveImage = async (key: string) => {
    await updateSetting(key, '');
    toast({
      title: "Immagine rimossa",
      description: `${iconSettings.find(s => s.key === key)?.label} rimossa con successo.`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const iconSettings = [
    { key: 'apple_icon_57', label: 'Apple Touch Icon 57x57', size: '57x57', description: 'iPhone originale' },
    { key: 'apple_icon_72', label: 'Apple Touch Icon 72x72', size: '72x72', description: 'iPad' },
    { key: 'apple_icon_114', label: 'Apple Touch Icon 114x114', size: '114x114', description: 'iPhone Retina' },
    { key: 'apple_icon_144', label: 'Apple Touch Icon 144x144', size: '144x144', description: 'iPad Retina' },
    { key: 'android_icon_192', label: 'Android Icon 192x192', size: '192x192', description: 'Android Chrome' },
    { key: 'android_icon_512', label: 'Android Icon 512x512', size: '512x512', description: 'Android Chrome HD' },
    { key: 'ms_tile_144', label: 'MS Tile 144x144', size: '144x144', description: 'Windows Phone' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Icone App e Dispositivi
        </CardTitle>
        <p className="text-sm text-gray-600">
          Gestisci le icone per tutti i dispositivi e piattaforme (esclusa la favicon)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {iconSettings.map((setting) => {
          const currentValue = getSetting(setting.key);
          
          return (
            <div key={setting.key} className="space-y-2">
              <Label>
                {setting.label} ({setting.size})
              </Label>
              <p className="text-xs text-gray-500">{setting.description}</p>
              
              {currentValue ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={currentValue} 
                      alt={`${setting.label} Preview`} 
                      className="w-16 h-16 object-contain border rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">Anteprima {setting.size}</div>
                      <div className="text-xs text-gray-500 break-all">{currentValue}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveImage(setting.key)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-3">
                    Carica un'immagine per {setting.label}
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(setting.key, file);
                      }
                    }}
                    disabled={uploading[setting.key]}
                    className="max-w-xs mx-auto"
                  />
                  {uploading[setting.key] && (
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Caricamento...</span>
                    </div>
                  )}
                </div>
              )}
              
              {currentValue && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-2">Sostituisci immagine:</p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(setting.key, file);
                      }
                    }}
                    disabled={uploading[setting.key]}
                    className="max-w-xs"
                  />
                  {uploading[setting.key] && (
                    <div className="flex items-center gap-2 mt-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-xs">Caricamento...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default AppIconsManagement;
