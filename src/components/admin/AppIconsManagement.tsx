
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBranding } from "@/hooks/useBranding";
import { Smartphone, Loader2 } from "lucide-react";

const AppIconsManagement = () => {
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

  const iconSettings = [
    { key: 'favicon_url', label: 'Favicon', size: '32x32', description: 'Icona del browser' },
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
          Gestisci le icone per tutti i dispositivi e piattaforme
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {iconSettings.map((setting) => (
          <div key={setting.key} className="space-y-2">
            <Label htmlFor={setting.key}>
              {setting.label} ({setting.size})
            </Label>
            <p className="text-xs text-gray-500">{setting.description}</p>
            <div className="flex gap-2">
              <Input
                id={setting.key}
                value={getCurrentValue(setting.key) || ''}
                onChange={(e) => handleEdit(setting.key, e.target.value)}
                placeholder={`URL per ${setting.label}`}
                className="flex-1"
              />
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
            {getCurrentValue(setting.key) && (
              <div className="mt-2 flex items-center gap-4">
                <img 
                  src={getCurrentValue(setting.key)} 
                  alt={`${setting.label} Preview`} 
                  className="w-16 h-16 object-contain border rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="text-sm text-gray-600">
                  Anteprima {setting.size}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AppIconsManagement;
