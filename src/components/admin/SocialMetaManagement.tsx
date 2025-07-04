
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
    { key: 'meta_title', label: 'Titolo Meta', type: 'text', description: 'Titolo per SEO e social media' },
    { key: 'meta_description', label: 'Descrizione Meta', type: 'textarea', description: 'Descrizione per SEO e social media' },
    { key: 'og_title', label: 'Open Graph Title', type: 'text', description: 'Titolo per Facebook/LinkedIn' },
    { key: 'og_description', label: 'Open Graph Description', type: 'textarea', description: 'Descrizione per Facebook/LinkedIn' },
    { key: 'og_image', label: 'Open Graph Image', type: 'image', description: 'Immagine per Facebook/LinkedIn (1200x630px)' },
    { key: 'twitter_title', label: 'Twitter Title', type: 'text', description: 'Titolo per Twitter/X' },
    { key: 'twitter_description', label: 'Twitter Description', type: 'textarea', description: 'Descrizione per Twitter/X' },
    { key: 'twitter_image', label: 'Twitter Image', type: 'image', description: 'Immagine per Twitter/X (1200x600px)' },
    { key: 'twitter_card', label: 'Twitter Card Type', type: 'text', description: 'Tipo di card Twitter (summary_large_image)' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Social Media Tags
        </CardTitle>
        <p className="text-sm text-gray-600">
          Gestisci i tag meta per SEO e condivisioni social
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {socialMetaSettings.map((setting) => {
          const currentValue = getCurrentValue(setting.key);
          
          return (
            <div key={setting.key} className="space-y-2">
              <Label htmlFor={setting.key}>{setting.label}</Label>
              <p className="text-xs text-gray-500">{setting.description}</p>
              
              {setting.type === 'image' ? (
                <div className="space-y-3">
                  {currentValue ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <img 
                          src={currentValue} 
                          alt={`${setting.label} Preview`} 
                          className="max-w-32 max-h-20 object-contain border rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{setting.label}</div>
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
                      <div>
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
                </div>
              ) : (
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
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SocialMetaManagement;
