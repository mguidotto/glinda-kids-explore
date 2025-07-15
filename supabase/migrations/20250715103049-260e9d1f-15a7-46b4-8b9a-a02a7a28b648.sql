
-- Add photos column to reviews table to store review photos
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS photos text[];

-- Add reviewer_name column to allow anonymous reviews with custom names
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS reviewer_name text;

-- Update RLS policy to allow anonymous reviews (without user_id)
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;

CREATE POLICY "Anyone can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (
    -- Allow authenticated users to create reviews with their user_id
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    -- Allow anonymous reviews (user_id can be null)
    (auth.uid() IS NULL AND user_id IS NULL)
  );
