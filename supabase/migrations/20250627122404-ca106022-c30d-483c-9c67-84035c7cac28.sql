
-- Remove the content_type column and add featured_image column to contents table
ALTER TABLE public.contents 
DROP COLUMN IF EXISTS content_type,
ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- Update the contents table to make sure we have proper defaults
UPDATE public.contents 
SET featured_image = NULL 
WHERE featured_image IS NULL;
