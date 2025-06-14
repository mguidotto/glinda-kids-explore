
-- Add editable flag and management fields to categories
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS editable BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Create table for managing payment information on contents
ALTER TABLE public.contents
ADD COLUMN IF NOT EXISTS purchasable BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS payment_type TEXT CHECK (payment_type IN ('free', 'paid', 'booking')) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
ADD COLUMN IF NOT EXISTS booking_required BOOLEAN DEFAULT false;

-- Create orders table for tracking purchases
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.contents(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
  payment_method TEXT,
  participants INTEGER DEFAULT 1,
  booking_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on orders table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies for orders table
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins and providers can view related orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM public.contents c
      JOIN public.providers p ON c.provider_id = p.id
      WHERE c.id = content_id AND p.user_id = auth.uid()
    )
  );

-- Add RLS policy for admins to manage categories
CREATE POLICY "Admins can manage categories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Add function to create category
CREATE OR REPLACE FUNCTION create_category(
  category_name TEXT,
  category_slug TEXT,
  category_description TEXT DEFAULT NULL,
  category_icon TEXT DEFAULT NULL,
  category_color TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_category_id UUID;
BEGIN
  INSERT INTO public.categories (name, slug, description, icon, color, editable, active)
  VALUES (category_name, category_slug, category_description, category_icon, category_color, true, true)
  RETURNING id INTO new_category_id;
  
  RETURN new_category_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to update category
CREATE OR REPLACE FUNCTION update_category(
  category_id UUID,
  category_name TEXT,
  category_slug TEXT,
  category_description TEXT DEFAULT NULL,
  category_icon TEXT DEFAULT NULL,
  category_color TEXT DEFAULT NULL,
  category_active BOOLEAN DEFAULT true
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.categories 
  SET 
    name = category_name,
    slug = category_slug,
    description = category_description,
    icon = category_icon,
    color = category_color,
    active = category_active,
    updated_at = NOW()
  WHERE id = category_id AND editable = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
