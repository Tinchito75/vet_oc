-- Add Cost column to visits table
alter table visits 
add column cost numeric default 0;
