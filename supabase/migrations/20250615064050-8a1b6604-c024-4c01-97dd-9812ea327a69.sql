
-- Add validation status to reviews table
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS validated BOOLEAN DEFAULT FALSE;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS validated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS validated_by UUID REFERENCES public.profiles(id);

-- Update RLS policies for reviews to only show validated reviews to public
DROP POLICY IF EXISTS "Everyone can view reviews" ON public.reviews;

-- Create new policies
CREATE POLICY "Everyone can view validated reviews" ON public.reviews
  FOR SELECT USING (validated = true);

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own reviews regardless of validation" ON public.reviews
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all reviews" ON public.reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update review validation" ON public.reviews
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
