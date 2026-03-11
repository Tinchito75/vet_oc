-- Add ophthalmology_exam column to visits table
ALTER TABLE visits 
ADD COLUMN IF NOT EXISTS ophthalmology_exam JSONB DEFAULT '{}'::jsonb;

-- Comment on column
COMMENT ON COLUMN visits.ophthalmology_exam IS 'Stores detailed ophthalmology exam data (Schirmer, reflexes, etc.) as JSON.';
