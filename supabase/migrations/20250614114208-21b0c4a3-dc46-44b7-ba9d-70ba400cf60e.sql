
-- Create enum types
CREATE TYPE content_type AS ENUM ('corso', 'servizio', 'evento', 'centro', 'campo_estivo');
CREATE TYPE age_group AS ENUM ('0-12m', '1-3a', '3-6a', '6-10a');
CREATE TYPE modality AS ENUM ('online', 'presenza', 'ibrido');
CREATE TYPE user_role AS ENUM ('genitore', 'provider', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role user_role NOT NULL DEFAULT 'genitore',
  phone TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create providers table (for business accounts)
CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  phone TEXT,
  email TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contents table
CREATE TABLE public.contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id),
  title TEXT NOT NULL,
  description TEXT,
  content_type content_type NOT NULL,
  age_groups age_group[] NOT NULL DEFAULT '{}',
  modality modality NOT NULL DEFAULT 'presenza',
  price_from DECIMAL(10,2),
  price_to DECIMAL(10,2),
  duration_minutes INTEGER,
  address TEXT,
  city TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  website TEXT,
  phone TEXT,
  email TEXT,
  images TEXT[],
  available_dates JSONB,
  max_participants INTEGER,
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.contents(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  booking_date TIMESTAMP WITH TIME ZONE,
  participants INTEGER DEFAULT 1,
  total_price DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.contents(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id UUID REFERENCES public.contents(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for providers
CREATE POLICY "Providers can manage their own data" ON public.providers
  FOR ALL USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Everyone can view verified providers" ON public.providers
  FOR SELECT USING (verified = true);

-- RLS Policies for categories
CREATE POLICY "Everyone can view categories" ON public.categories
  FOR SELECT USING (true);

-- RLS Policies for contents
CREATE POLICY "Everyone can view published contents" ON public.contents
  FOR SELECT USING (published = true);
CREATE POLICY "Providers can manage their own contents" ON public.contents
  FOR ALL USING (provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid()));

-- RLS Policies for bookings
CREATE POLICY "Users can manage their own bookings" ON public.bookings
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Providers can view bookings for their contents" ON public.bookings
  FOR SELECT USING (content_id IN (
    SELECT c.id FROM public.contents c
    JOIN public.providers p ON c.provider_id = p.id
    WHERE p.user_id = auth.uid()
  ));

-- RLS Policies for reviews
CREATE POLICY "Everyone can view reviews" ON public.reviews
  FOR SELECT USING (true);
CREATE POLICY "Users can manage their own reviews" ON public.reviews
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for favorites
CREATE POLICY "Users can manage their own favorites" ON public.favorites
  FOR ALL USING (user_id = auth.uid());

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert demo categories
INSERT INTO public.categories (name, slug, description, icon, color) VALUES
('Corsi Pre e Post Parto', 'corsi-parto', 'Corsi di preparazione al parto e supporto post-parto', '🤱', '#FF6B9D'),
('Servizi Educativi', 'servizi-educativi', 'Nidi, tagesmutter, doule e servizi per l''infanzia', '🏫', '#4ECDC4'),
('Eventi per Famiglie', 'eventi-famiglie', 'Spettacoli, letture, festival e attività', '🎭', '#45B7D1'),
('Centri e Ludoteche', 'centri-ludoteche', 'Spazi gioco, consultori e centri per famiglie', '🏛️', '#96CEB4'),
('Campi Estivi', 'campi-estivi', 'Centri estivi e attività tempo libero', '☀️', '#FFEAA7');

-- Insert demo content
INSERT INTO public.contents (
  title, description, content_type, age_groups, modality, price_from, price_to,
  duration_minutes, city, published, category_id
) VALUES
('Corso Preparto Completo', 'Corso completo di preparazione al parto con ostetrica qualificata. Include tecniche di respirazione, posizioni per il travaglio e allattamento.', 'corso', ARRAY['1-3a']::age_group[], 'presenza', 150.00, 250.00, 120, 'Milano', true, (SELECT id FROM public.categories WHERE slug = 'corsi-parto')),
('Nido Bilingue Little Stars', 'Asilo nido bilingue italiano-inglese per bambini da 6 mesi a 3 anni. Metodo Montessori e giardino attrezzato.', 'servizio', ARRAY['0-12m','1-3a']::age_group[], 'presenza', 800.00, 1200.00, NULL, 'Roma', true, (SELECT id FROM public.categories WHERE slug = 'servizi-educativi')),
('Spettacolo "Il Piccolo Principe"', 'Spettacolo teatrale per bambini tratto dal celebre racconto. Durata 45 minuti con coinvolgimento del pubblico.', 'evento', ARRAY['3-6a','6-10a']::age_group[], 'presenza', 12.00, 15.00, 45, 'Torino', true, (SELECT id FROM public.categories WHERE slug = 'eventi-famiglie')),
('Ludoteca Arcobaleno', 'Spazio gioco attrezzato con attività creative, laboratori artistici e animazione per feste di compleanno.', 'centro', ARRAY['1-3a','3-6a','6-10a']::age_group[], 'presenza', 8.00, 20.00, 120, 'Napoli', true, (SELECT id FROM public.categories WHERE slug = 'centri-ludoteche')),
('Campo Estivo Natura e Avventura', 'Campo estivo immerso nella natura con attività outdoor, trekking, laboratori scientifici e giochi di gruppo.', 'campo_estivo', ARRAY['6-10a']::age_group[], 'presenza', 180.00, 250.00, 480, 'Firenze', true, (SELECT id FROM public.categories WHERE slug = 'campi-estivi'));
