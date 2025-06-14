
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BrandingSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: string;
  description: string;
  category: string;
}

export const useBranding = () => {
  const [settings, setSettings] = useState<BrandingSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("branding_settings")
        .select("*")
        .order("category", { ascending: true });

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error("Errore nel caricamento delle impostazioni:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le impostazioni di branding",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase.rpc("update_branding_setting", {
        setting_key_param: key,
        new_value: value,
      });

      if (error) throw error;
      
      await fetchSettings();
      toast({
        title: "Successo",
        description: "Impostazione aggiornata con successo",
      });
    } catch (error) {
      console.error("Errore nell'aggiornamento:", error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare l'impostazione",
        variant: "destructive",
      });
    }
  };

  const getSetting = (key: string) => {
    return settings.find(setting => setting.setting_key === key)?.setting_value || '';
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Apply branding settings to CSS variables
  useEffect(() => {
    if (settings.length > 0) {
      const root = document.documentElement;
      
      // Apply colors
      const primaryColor = getSetting('primary_color');
      const secondaryColor = getSetting('secondary_color');
      const accentColor = getSetting('accent_color');
      const backgroundColor = getSetting('background_color');
      const textColor = getSetting('text_color');
      
      if (primaryColor) root.style.setProperty('--primary-color', primaryColor);
      if (secondaryColor) root.style.setProperty('--secondary-color', secondaryColor);
      if (accentColor) root.style.setProperty('--accent-color', accentColor);
      if (backgroundColor) root.style.setProperty('--background-color', backgroundColor);
      if (textColor) root.style.setProperty('--text-color', textColor);

      // Apply fonts
      const fontUrl = getSetting('font_google_url');
      if (fontUrl) {
        // Remove existing font link
        const existingLink = document.querySelector('link[data-font="custom"]');
        if (existingLink) existingLink.remove();

        // Add new font link
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = fontUrl;
        link.setAttribute('data-font', 'custom');
        document.head.appendChild(link);
      }

      const primaryFont = getSetting('primary_font');
      const headingFont = getSetting('heading_font');
      if (primaryFont) root.style.setProperty('--font-primary', primaryFont);
      if (headingFont) root.style.setProperty('--font-heading', headingFont);

      // Update favicon
      const faviconUrl = getSetting('favicon_url');
      if (faviconUrl) {
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon) favicon.href = faviconUrl;
      }
    }
  }, [settings]);

  return {
    settings,
    loading,
    updateSetting,
    getSetting,
    fetchSettings,
  };
};
