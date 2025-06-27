
-- Create bucket for content featured images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-images', 'content-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Everyone can view content images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload content images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update content images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete content images" ON storage.objects;

-- Create policies for the content-images bucket
-- Allow everyone to view images
CREATE POLICY "Everyone can view content images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'content-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload content images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'content-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update content images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'content-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete content images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'content-images' AND auth.role() = 'authenticated');
