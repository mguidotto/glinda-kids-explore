
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBranding } from "@/hooks/useBranding";
import { Share2, Loader2 } from "lucide-react";

const SocialMetaManagement = () => {
  const { settings, isLoading, updateSetting, getSetting } = useBranding();
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

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
    { key: 'og_image', label: 'Open Graph Image', type: 'url', description: 'Immagine per Facebook/LinkedIn (1200x630px)' },
    { key: 'twitter_title', label: 'Twitter Title', type: 'text', description: 'Titolo per Twitter/X' },
    { key: 'twitter_description', label: 'Twitter Description', type: 'textarea', description: 'Descrizione per Twitter/X' },
    { key: 'twitter_image', label: 'Twitter Image', type: 'url', description: 'Immagine per Twitter/X (1200x600px)' },
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
        {socialMetaSettings.map((setting) => (
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
            {setting.key === 'og_image' && getCurrentValue(setting.key) && (
              <div className="mt-2">
                <img 
                  src={getCurrentValue(setting.key)} 
                  alt="OG Image Preview" 
                  className="max-w-64 max-h-32 object-contain border rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SocialMetaManagement;
