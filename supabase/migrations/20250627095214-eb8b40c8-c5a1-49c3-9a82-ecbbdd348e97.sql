
-- Crea tabella per i tag
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crea tabella di relazione many-to-many tra contenuti e tag
CREATE TABLE public.content_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(content_id, tag_id)
);

-- Abilita RLS per i tag
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_tags ENABLE ROW LEVEL SECURITY;

-- Policy per i tag (leggibili da tutti)
CREATE POLICY "Everyone can view tags" ON public.tags FOR SELECT USING (true);

-- Policy per content_tags (leggibili da tutti)
CREATE POLICY "Everyone can view content tags" ON public.content_tags FOR SELECT USING (true);

-- Policy per permettere agli admin di gestire i tag
CREATE POLICY "Admins can manage tags" ON public.tags FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy per permettere agli admin e provider di gestire content_tags
CREATE POLICY "Admins and providers can manage content tags" ON public.content_tags FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND (role = 'admin' OR role = 'provider')
  )
);

-- Inserisci alcuni tag di esempio
INSERT INTO public.tags (name, slug) VALUES 
('Bambini 0-3 anni', 'bambini-0-3'),
('Bambini 3-6 anni', 'bambini-3-6'),
('Bambini 6-12 anni', 'bambini-6-12'),
('Arte e Creatività', 'arte-creativita'),
('Sport e Movimento', 'sport-movimento'),
('Musica', 'musica'),
('Inglese', 'inglese'),
('Montessori', 'montessori'),
('All''aperto', 'allaperto'),
('Weekend', 'weekend'),
('Estivo', 'estivo'),
('Gratuito', 'gratuito');
