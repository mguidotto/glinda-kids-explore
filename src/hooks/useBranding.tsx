
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type BrandingSetting = {
  key: string;
  value: string;
  category: string;
};

export const useBranding = () => {
  const [settings, setSettings] = useState<BrandingSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBrandingSettings();
  }, []);

  const fetchBrandingSettings = async () => {
    try {
      const { data } = await supabase
        .from("app_texts")
        .select("*")
        .eq("category", "branding");
      
      if (data) {
        const brandingSettings = data.map(item => ({
          key: item.key,
          value: item.value,
          category: item.category || "branding"
        }));
        setSettings(brandingSettings);
        applyBrandingToDocument(brandingSettings);
        // Apply favicon immediately after fetching settings
        applyFaviconToDocument(brandingSettings);
      }
    } catch (error) {
      console.error("Error fetching branding settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase.rpc("update_app_text", {
        text_key: key,
        new_value: value
      });

      if (!error) {
        // Immediately apply favicon update if it's a favicon change
        if (key === 'favicon_url') {
          updateFaviconInDocument(value);
        }
        await fetchBrandingSettings();
      }
    } catch (error) {
      console.error("Error updating branding setting:", error);
    }
  };

  const getSetting = (key: string, defaultValue = "") => {
    const setting = settings.find(s => s.key === key);
    return setting?.value || defaultValue;
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

  const applyFaviconToDocument = (brandingSettings: BrandingSetting[]) => {
    const faviconSetting = brandingSettings.find(s => s.key === 'favicon_url');
    if (faviconSetting && faviconSetting.value) {
      updateFaviconInDocument(faviconSetting.value);
    }
  };

  const applyBrandingToDocument = (brandingSettings: BrandingSetting[]) => {
    const root = document.documentElement;
    
    brandingSettings.forEach(setting => {
      switch (setting.key) {
        case "primary_color":
          root.style.setProperty("--primary", setting.value);
          break;
        case "secondary_color":
          root.style.setProperty("--secondary", setting.value);
          break;
        case "accent_color":
          root.style.setProperty("--accent", setting.value);
          break;
        case "primary_font":
          root.style.setProperty("--font-primary", setting.value);
          break;
        case "secondary_font":
          root.style.setProperty("--font-secondary", setting.value);
          break;
      }
    });
  };

  return {
    settings,
    isLoading,
    updateSetting,
    getSetting,
    fetchBrandingSettings,
    updateFaviconInDocument
  };
};
