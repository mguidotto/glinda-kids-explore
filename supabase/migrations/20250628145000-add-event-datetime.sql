
-- Add event date and time fields to contents table
ALTER TABLE public.contents 
ADD COLUMN IF NOT EXISTS event_date DATE,
ADD COLUMN IF NOT EXISTS event_time TIME,
ADD COLUMN IF NOT EXISTS event_end_date DATE,
ADD COLUMN IF NOT EXISTS event_end_time TIME;

-- Create index for event_date for better performance when filtering events
CREATE INDEX IF NOT EXISTS idx_contents_event_date ON public.contents(event_date);
