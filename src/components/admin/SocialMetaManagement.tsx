
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBranding } from "@/hooks/useBranding";
import { Share2, Loader2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SocialMetaManagement = () => {
  const { settings, isLoading, updateSetting, getSetting } = useBranding();
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const handleEdit = (key: string, value: string) => {
    setEditingValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key: string) => {
    setSaving(prev => ({ ...prev, [key]: true }));
    await updateSetting(key, editingValues[key]);
    setSaving(prev => ({ ...prev, [key]: false }));
    setEditingValues(prev => {
      const newValues = { ...prev };
      delete newValues[key];
      return newValues;
    });
  };

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
        description: `${socialMetaSettings.find(s => s.key === key)?.label} caricata con successo.`,
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
      description: `${socialMetaSettings.find(s => s.key === key)?.label} rimossa con successo.`,
    });
  };

  const getCurrentValue = (key: string) => {
    return editingValues[key] !== undefined ? editingValues[key] : getSetting(key);
  };

  const isEditing = (key: string) => editingValues[key] !== undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const socialMetaSettings = [
    { key: 'meta_title', label: 'Titolo Meta', type: 'text', description: 'Titolo per SEO e social media (Default: "Scopri corsi, eventi e servizi educativi per i tuoi bambini")' },
    { key: 'meta_description', label: 'Descrizione Meta', type: 'textarea', description: 'Descrizione per SEO e social media (Default: "Glinda aiuta i genitori a trovare le migliori opportunità vicino a te.")' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Social Media Tags
        </CardTitle>
        <p className="text-sm text-gray-600">
          Gestisci i tag meta per SEO e condivisioni social. I tag OpenGraph sono configurati direttamente nell'HTML con i valori di default dell'homepage.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {socialMetaSettings.map((setting) => {
          const currentValue = getCurrentValue(setting.key);
          
          return (
            <div key={setting.key} className="space-y-2">
              <Label htmlFor={setting.key}>{setting.label}</Label>
              <p className="text-xs text-gray-500">{setting.description}</p>
              
              <div className="flex gap-2">
                {setting.type === 'textarea' ? (
                  <Textarea
                    id={setting.key}
                    value={getCurrentValue(setting.key) || ''}
                    onChange={(e) => handleEdit(setting.key, e.target.value)}
                    placeholder={setting.label}
                    className="flex-1"
                    rows={3}
                  />
                ) : (
                  <Input
                    id={setting.key}
                    value={getCurrentValue(setting.key) || ''}
                    onChange={(e) => handleEdit(setting.key, e.target.value)}
                    placeholder={setting.label}
                    className="flex-1"
                  />
                )}
                {isEditing(setting.key) && (
                  <Button
                    onClick={() => handleSave(setting.key)}
                    disabled={saving[setting.key]}
                    size="sm"
                  >
                    {saving[setting.key] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Salva'
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Tag OpenGraph e Twitter</h4>
          <p className="text-sm text-blue-800">
            I tag OpenGraph e Twitter sono configurati direttamente nell'HTML della pagina con questi valori di default:
          </p>
          <ul className="text-xs text-blue-700 mt-2 space-y-1">
            <li><strong>og:title:</strong> "Scopri corsi, eventi e servizi educativi per i tuoi bambini"</li>
            <li><strong>og:description:</strong> "Glinda aiuta i genitori a trovare le migliori opportunità vicino a te."</li>
            <li><strong>og:image:</strong> "https://glinda.lovable.app/icon-512x512.png"</li>
            <li><strong>twitter:card:</strong> "summary_large_image"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMetaManagement;
