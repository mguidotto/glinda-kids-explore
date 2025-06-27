
-- Drop the orders and bookings tables
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Admins can manage tags" ON public.tags;
DROP POLICY IF EXISTS "Admins can manage content tags" ON public.content_tags;

-- Enable RLS on tags table if not already enabled
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

-- Enable RLS on content_tags table if not already enabled
ALTER TABLE public.content_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tags table to allow admin access
CREATE POLICY "Admins can manage tags" ON public.tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create RLS policies for content_tags table to allow admin access
CREATE POLICY "Admins can manage content tags" ON public.content_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
