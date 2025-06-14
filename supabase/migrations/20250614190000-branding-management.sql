
-- Create table for branding management
CREATE TABLE IF NOT EXISTS public.branding_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT DEFAULT 'text' CHECK (setting_type IN ('text', 'color', 'font', 'image', 'url')),
  description TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default branding settings
INSERT INTO public.branding_settings (setting_key, setting_value, setting_type, description, category) VALUES
('primary_color', '#3b82f6', 'color', 'Colore primario dell''applicazione', 'colors'),
('secondary_color', '#64748b', 'color', 'Colore secondario dell''applicazione', 'colors'),
('accent_color', '#06b6d4', 'color', 'Colore di accento', 'colors'),
('background_color', '#ffffff', 'color', 'Colore di sfondo principale', 'colors'),
('text_color', '#1f2937', 'color', 'Colore del testo principale', 'colors'),
('logo_url', '', 'image', 'Logo dell''applicazione', 'branding'),
('favicon_url', '/favicon.ico', 'image', 'Icona del sito', 'branding'),
('primary_font', 'Inter', 'font', 'Font principale dell''applicazione', 'typography'),
('heading_font', 'Inter', 'font', 'Font per i titoli', 'typography'),
('font_google_url', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', 'url', 'URL Google Fonts', 'typography');

-- Enable RLS
ALTER TABLE public.branding_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can manage branding settings
CREATE POLICY "Only admins can manage branding settings" ON public.branding_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Policy: Everyone can read branding settings
CREATE POLICY "Everyone can read branding settings" ON public.branding_settings
  FOR SELECT USING (true);

-- Create function to update branding setting
CREATE OR REPLACE FUNCTION update_branding_setting(setting_key_param TEXT, new_value TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.branding_settings 
  SET setting_value = new_value, updated_at = NOW()
  WHERE setting_key = setting_key_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
