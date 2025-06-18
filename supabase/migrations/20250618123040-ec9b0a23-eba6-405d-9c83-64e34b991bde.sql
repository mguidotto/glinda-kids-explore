
-- Crea bucket per le immagini dei contenuti
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-images', 'content-images', true);

-- Crea policy per permettere a tutti di leggere le immagini
CREATE POLICY "Everyone can view content images" ON storage.objects
  FOR SELECT USING (bucket_id = 'content-images');

-- Crea policy per permettere agli utenti autenticati di caricare immagini
CREATE POLICY "Authenticated users can upload content images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'content-images' AND auth.role() = 'authenticated');

-- Crea policy per permettere agli utenti di aggiornare le proprie immagini
CREATE POLICY "Users can update content images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'content-images' AND auth.role() = 'authenticated');

-- Crea policy per permettere agli utenti di eliminare le proprie immagini
CREATE POLICY "Users can delete content images" ON storage.objects
  FOR DELETE USING (bucket_id = 'content-images' AND auth.role() = 'authenticated');
