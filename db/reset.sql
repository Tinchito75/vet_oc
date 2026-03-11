-- ⚠️ DANGER: This script will DELETE ALL USER DATA from the database.
-- Run this in the Supabase SQL Editor.

-- 1. Truncate all user-generated data tables (Order doesn't matter much with CASCADE, but good to be clear)
TRUNCATE TABLE 
    visit_images,
    treatments,
    findings,
    visits,
    appointments,
    patients,
    owners
RESTART IDENTITY CASCADE;

-- 2. (Optional) Clear Medical Templates
-- Uncomment the following line if you also want to delete the prescription templates.
-- TRUNCATE TABLE medical_templates RESTART IDENTITY CASCADE;

-- Note: This does not delete files from Supabase Storage (images bucket). 
-- You may want to manually empty the 'images' bucket in the Storage dashboard.
