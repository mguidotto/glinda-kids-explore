
-- Rimuovi i tag OpenGraph dalla tabella app_texts
DELETE FROM app_texts WHERE key IN (
  'og_title',
  'og_description', 
  'og_image',
  'twitter_title',
  'twitter_description',
  'twitter_image',
  'twitter_card'
);

-- Aggiungi i testi del footer
INSERT INTO app_texts (key, value, description, category) VALUES
  ('footer.description', 'Il marketplace per genitori consapevoli.', 'Descrizione nel footer', 'footer'),
  ('footer.categories', 'Categorie', 'Titolo sezione categorie nel footer', 'footer'),
  ('footer.support', 'Supporto', 'Titolo sezione supporto nel footer', 'footer'),
  ('footer.contact', 'Contattaci', 'Link contatti nel footer', 'footer'),
  ('footer.partner', 'Partner', 'Titolo sezione partner nel footer', 'footer'),
  ('footer.become_partner', 'Diventa Partner', 'Link diventa partner nel footer', 'footer'),
  ('footer.rights', 'Tutti i diritti riservati.', 'Testo copyright nel footer', 'footer')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  category = EXCLUDED.category;
