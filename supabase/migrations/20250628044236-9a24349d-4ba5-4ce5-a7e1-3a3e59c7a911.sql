
-- Add SEO fields to contents table
ALTER TABLE public.contents 
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_image TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create index for slug for better performance
CREATE INDEX IF NOT EXISTS idx_contents_slug ON public.contents(slug);

-- Add constraint to ensure slug is unique when not null
ALTER TABLE public.contents 
ADD CONSTRAINT unique_content_slug UNIQUE (slug);
