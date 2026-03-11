-- Add billing_status column to visits table
ALTER TABLE visits 
ADD COLUMN IF NOT EXISTS billing_status TEXT DEFAULT 'none' CHECK (billing_status IN ('none', 'pending', 'billed'));

-- Comment on column
COMMENT ON COLUMN visits.billing_status IS 'Billing status: none, pending, or billed.';
