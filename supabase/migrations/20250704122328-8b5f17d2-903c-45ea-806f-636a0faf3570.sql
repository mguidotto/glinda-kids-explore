
-- Modify the update_app_text function to use UPSERT instead of just UPDATE
CREATE OR REPLACE FUNCTION update_app_text(text_key text, new_value text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.app_texts (key, value, category, created_at, updated_at)
  VALUES (text_key, new_value, 'branding', NOW(), NOW())
  ON CONFLICT (key) 
  DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW();
END;
$$;

-- Insert all the missing branding/icon settings that the components expect
INSERT INTO public.app_texts (key, value, category, description, created_at, updated_at)
VALUES 
  ('favicon_url', '/favicon.ico', 'branding', 'Favicon del sito', NOW(), NOW()),
  ('apple_icon_57', '', 'branding', 'Apple Touch Icon 57x57', NOW(), NOW()),
  ('apple_icon_72', '', 'branding', 'Apple Touch Icon 72x72', NOW(), NOW()),
  ('apple_icon_114', '', 'branding', 'Apple Touch Icon 114x114', NOW(), NOW()),
  ('apple_icon_144', '', 'branding', 'Apple Touch Icon 144x144', NOW(), NOW()),
  ('android_icon_192', '', 'branding', 'Android Icon 192x192', NOW(), NOW()),
  ('android_icon_512', '', 'branding', 'Android Icon 512x512', NOW(), NOW()),
  ('ms_tile_144', '', 'branding', 'MS Tile 144x144', NOW(), NOW()),
  ('meta_title', '', 'branding', 'Titolo Meta', NOW(), NOW()),
  ('meta_description', '', 'branding', 'Descrizione Meta', NOW(), NOW()),
  ('og_title', '', 'branding', 'Open Graph Title', NOW(), NOW()),
  ('og_description', '', 'branding', 'Open Graph Description', NOW(), NOW()),
  ('og_image', '', 'branding', 'Open Graph Image', NOW(), NOW()),
  ('twitter_title', '', 'branding', 'Twitter Title', NOW(), NOW()),
  ('twitter_description', '', 'branding', 'Twitter Description', NOW(), NOW()),
  ('twitter_image', '', 'branding', 'Twitter Image', NOW(), NOW()),
  ('twitter_card', 'summary_large_image', 'branding', 'Twitter Card Type', NOW(), NOW())
ON CONFLICT (key) DO NOTHING;
