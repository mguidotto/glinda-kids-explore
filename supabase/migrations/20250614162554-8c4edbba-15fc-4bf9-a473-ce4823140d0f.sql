
-- Create table for application texts/labels management
CREATE TABLE IF NOT EXISTS public.app_texts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default texts
INSERT INTO public.app_texts (key, value, description, category) VALUES
('site.title', 'Glinda - Marketplace per Genitori', 'Titolo principale del sito', 'general'),
('site.description', 'Scopri corsi, eventi e servizi educativi per bambini da 0 a 10 anni. Il marketplace che aiuta i genitori a trovare le migliori opportunità vicino a te.', 'Descrizione del sito', 'general'),
('nav.home', 'Home', 'Voce menu Home', 'navigation'),
('nav.login', 'Accedi', 'Voce menu Login', 'navigation'),
('nav.dashboard', 'Dashboard', 'Voce menu Dashboard', 'navigation'),
('hero.title', 'Trova le migliori attività per i tuoi bambini', 'Titolo hero section', 'homepage'),
('hero.subtitle', 'Scopri corsi, eventi e servizi educativi nella tua zona per bambini da 0 a 10 anni', 'Sottotitolo hero section', 'homepage'),
('search.placeholder', 'Cerca attività, corsi, eventi...', 'Placeholder barra di ricerca', 'search'),
('search.location', 'Cerca per posizione', 'Label ricerca per posizione', 'search'),
('button.search', 'Cerca', 'Testo pulsante cerca', 'buttons'),
('button.save', 'Salva', 'Testo pulsante salva', 'buttons'),
('button.cancel', 'Annulla', 'Testo pulsante annulla', 'buttons'),
('button.edit', 'Modifica', 'Testo pulsante modifica', 'buttons'),
('admin.texts.title', 'Gestione Testi', 'Titolo sezione gestione testi', 'admin'),
('admin.texts.description', 'Modifica tutti i testi e le etichette dell''applicazione', 'Descrizione sezione gestione testi', 'admin');

-- Enable RLS
ALTER TABLE public.app_texts ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can manage texts
CREATE POLICY "Only admins can manage app texts" ON public.app_texts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Policy: Everyone can read texts
CREATE POLICY "Everyone can read app texts" ON public.app_texts
  FOR SELECT USING (true);

-- Create function to update app texts
CREATE OR REPLACE FUNCTION update_app_text(text_key TEXT, new_value TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.app_texts 
  SET value = new_value, updated_at = NOW()
  WHERE key = text_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
