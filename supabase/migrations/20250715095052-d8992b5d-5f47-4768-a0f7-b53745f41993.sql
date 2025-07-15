
-- Aggiungi la colonna avatar_url alla tabella providers
ALTER TABLE public.providers 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Crea policy RLS per permettere agli admin di gestire tutti i provider
CREATE POLICY "Admins can manage all providers" ON public.providers
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Crea policy RLS per permettere agli admin di inserire provider
CREATE POLICY "Admins can insert providers" ON public.providers
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Aggiorna la policy esistente per permettere la visualizzazione a tutti
DROP POLICY IF EXISTS "Everyone can view verified providers" ON public.providers;
CREATE POLICY "Everyone can view verified providers" ON public.providers
FOR SELECT
USING (verified = true OR EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));
