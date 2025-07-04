
-- Rendere "Il melograno" un contenuto in evidenza
UPDATE contents 
SET featured = true 
WHERE title ILIKE '%melograno%';
