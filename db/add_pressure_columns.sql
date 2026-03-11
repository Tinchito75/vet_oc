-- Add Pressure columns to visits table
alter table visits 
add column pressure_od numeric,
add column pressure_os numeric;
