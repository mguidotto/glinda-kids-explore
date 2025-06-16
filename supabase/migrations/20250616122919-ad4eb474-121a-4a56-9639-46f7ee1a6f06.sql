
-- Insert admin user profile (we'll need to create the auth user manually)
-- First, let's ensure we have the admin role available
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('genitore', 'provider', 'admin');
    END IF;
END $$;

-- Update branding settings with new logo
INSERT INTO public.app_texts (key, value, category, description, created_at, updated_at)
VALUES ('logo_url', '/lovable-uploads/0ba80ca5-a55e-4806-8de4-97bbe75cf938.png', 'branding', 'Logo dell''applicazione', NOW(), NOW())
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value, 
    updated_at = NOW();

-- Update color scheme based on the logo colors (burgundy/maroon primary, teal secondary, yellow accent)
INSERT INTO public.app_texts (key, value, category, description, created_at, updated_at)
VALUES 
    ('primary_color', '#8B4A6B', 'branding', 'Colore primario dell''applicazione (burgundy)', NOW(), NOW()),
    ('secondary_color', '#7BB3BD', 'branding', 'Colore secondario dell''applicazione (teal)', NOW(), NOW()),
    ('accent_color', '#F4D03F', 'branding', 'Colore di accento (yellow)', NOW(), NOW()),
    ('coral_color', '#FF6B7A', 'branding', 'Colore coral per dettagli', NOW(), NOW()),
    ('pink_color', '#F4C2C2', 'branding', 'Colore rosa per sfondi', NOW(), NOW())
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value, 
    updated_at = NOW();
