
-- Politiche per permettere l'accesso pubblico ai contenuti pubblicati
CREATE POLICY "Public can view published contents" ON public.contents 
FOR SELECT TO anon, authenticated 
USING (published = true);

-- Politiche per permettere l'accesso pubblico alle categorie attive
CREATE POLICY "Public can view active categories" ON public.categories 
FOR SELECT TO anon, authenticated 
USING (active = true);

-- Politiche per permettere l'accesso pubblico ai tag
CREATE POLICY "Public can view tags" ON public.tags 
FOR SELECT TO anon, authenticated 
USING (true);

-- Politiche per permettere l'accesso pubblico alle relazioni content_tags
CREATE POLICY "Public can view content tags" ON public.content_tags 
FOR SELECT TO anon, authenticated 
USING (true);

-- Politiche per permettere agli utenti autenticati di gestire i propri favoriti
CREATE POLICY "Users can view their own favorites" ON public.favorites 
FOR SELECT TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own favorites" ON public.favorites 
FOR INSERT TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own favorites" ON public.favorites 
FOR DELETE TO authenticated 
USING (user_id = auth.uid());

-- Abilita RLS sui favoriti
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
