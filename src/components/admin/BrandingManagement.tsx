
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBranding } from "@/hooks/useBranding";
import { Palette, Type, Image, Loader2 } from "lucide-react";

const BrandingManagement = () => {
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

  // Define the branding settings we want to manage
  const brandingSettings = [
    { key: 'primary_color', label: 'Colore Primario', type: 'color', category: 'colors' },
    { key: 'secondary_color', label: 'Colore Secondario', type: 'color', category: 'colors' },
    { key: 'accent_color', label: 'Colore di Accento', type: 'color', category: 'colors' },
    { key: 'primary_font', label: 'Font Primario', type: 'text', category: 'typography' },
    { key: 'secondary_font', label: 'Font Secondario', type: 'text', category: 'typography' },
    { key: 'logo_url', label: 'URL Logo', type: 'url', category: 'branding' },
    { key: 'favicon_url', label: 'URL Favicon', type: 'url', category: 'branding' },
  ];

  const colorSettings = brandingSettings.filter(s => s.category === 'colors');
  const typographySettings = brandingSettings.filter(s => s.category === 'typography');
  const logoSettings = brandingSettings.filter(s => s.category === 'branding');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Gestione Branding
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Colori
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Tipografia
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Logo & Immagini
            </TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colorSettings.map((setting) => (
                <div key={setting.key} className="space-y-2">
                  <Label htmlFor={setting.key}>{setting.label}</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-10 h-10 rounded border border-gray-300"
                      style={{ backgroundColor: getCurrentValue(setting.key) || '#3b82f6' }}
                    />
                    <Input
                      id={setting.key}
                      type="color"
                      value={getCurrentValue(setting.key) || '#3b82f6'}
                      onChange={(e) => handleEdit(setting.key, e.target.value)}
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
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4">
            {typographySettings.map((setting) => (
              <div key={setting.key} className="space-y-2">
                <Label htmlFor={setting.key}>{setting.label}</Label>
                <div className="flex gap-2">
                  <Input
                    id={setting.key}
                    value={getCurrentValue(setting.key)}
                    onChange={(e) => handleEdit(setting.key, e.target.value)}
                    placeholder={setting.label}
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
                {setting.key === 'primary_font' && (
                  <p className="text-sm text-gray-500">
                    Esempio: Inter, Roboto, Arial, sans-serif
                  </p>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="branding" className="space-y-4">
            {logoSettings.map((setting) => (
              <div key={setting.key} className="space-y-2">
                <Label htmlFor={setting.key}>{setting.label}</Label>
                <div className="flex gap-2">
                  <Input
                    id={setting.key}
                    value={getCurrentValue(setting.key)}
                    onChange={(e) => handleEdit(setting.key, e.target.value)}
                    placeholder={setting.label}
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
                {getCurrentValue(setting.key) && setting.type === 'url' && setting.key === 'logo_url' && (
                  <div className="mt-2">
                    <img 
                      src={getCurrentValue(setting.key)} 
                      alt="Logo Preview" 
                      className="max-w-32 max-h-32 object-contain border rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BrandingManagement;
