-- Consolidated Database Initialization Script for Vet OC
-- WARNING: This will drop existing tables and reset the schema.

-- 1. Drop existing tables if they exist
drop table if exists medical_templates cascade;
drop table if exists treatments cascade;
drop table if exists findings cascade;
drop table if exists visit_images cascade;
drop table if exists visits cascade;
drop table if exists appointments cascade;
drop table if exists patients cascade;
drop table if exists owners cascade;

-- 2. Create Owners Table
create table owners (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  first_name text not null,
  last_name text not null,
  phone text,
  email text,
  address text,
  dni text, -- Added for billing
  cuit text, -- Added for billing
  referred_by text,
  notes text
);

-- 3. Create Patients Table
create table patients (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  owner_id uuid references owners(id) on delete cascade not null,
  name text not null,
  species text not null, -- 'Perro', 'Gato', etc.
  breed text,
  birth_date date,
  weight numeric, -- in kg
  gender text, -- 'Macho', 'Hembra'
  is_neutered boolean default false,
  is_aggressive boolean default false,
  photo_url text,
  medical_history text
);

-- 4. Create Appointments Table (Agenda)
create table appointments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  patient_id uuid references patients(id) on delete cascade not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  status text not null default 'pending', -- 'pending', 'confirmed', 'waiting', 'finished', 'cancelled'
  reason text,
  notes text
);

-- 5. Create Visits Table (Consultas)
create table visits (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  patient_id uuid references patients(id) on delete cascade not null,
  appointment_id uuid references appointments(id),
  reason text,
  anamnesis text, 
  diagnosis text,
  treatment_plan text,
  cost numeric default 0,
  pressure_od numeric,
  pressure_os numeric,
  billing_status text default 'none' check (billing_status in ('none', 'pending', 'billed')),
  ophthalmology_exam jsonb default '{}'::jsonb,
  notes text
);

-- 6. Create Findings Table (Hallazgos del Oftalmograma)
create table findings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  visit_id uuid references visits(id) on delete cascade not null,
  eye text not null, -- 'OD', 'OI'
  zone text not null, -- 'Cornea', 'Cristalino', etc.
  condition text,
  description text,
  color_code text, -- Hex code
  image_url text
);

-- 7. Create Visit Images Table
create table visit_images (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  visit_id uuid references visits(id) on delete cascade not null,
  image_url text not null,
  notes text
);

-- 8. Create Treatments Table (Medicaciones/Recetas)
create table treatments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  visit_id uuid references visits(id) on delete cascade not null,
  name text not null,
  dosage text,
  frequency text,
  duration text,
  notes text
);

-- 9. Create Medical Templates Table
create table medical_templates (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  prescription_body text not null
);

-- 10. Enable Row Level Security (RLS)
alter table owners enable row level security;
alter table patients enable row level security;
alter table appointments enable row level security;
alter table visits enable row level security;
alter table findings enable row level security;
alter table treatments enable row level security;
alter table visit_images enable row level security;
alter table medical_templates enable row level security;

-- 11. Create Policies (Public Access for MVP)
create policy "Public Access" on owners for all using (true) with check (true);
create policy "Public Access" on patients for all using (true) with check (true);
create policy "Public Access" on appointments for all using (true) with check (true);
create policy "Public Access" on visits for all using (true) with check (true);
create policy "Public Access" on findings for all using (true) with check (true);
create policy "Public Access" on treatments for all using (true) with check (true);
create policy "Public Access" on visit_images for all using (true) with check (true);
create policy "Public Access" on medical_templates for all using (true) with check (true);

-- 12. Storage Bucket Setup (Must be done manually or via API, but here are the policies)
-- Note: Supabase UI is recommended for creating the 'images' bucket.
create policy "Public Access to Images" on storage.objects for select using ( bucket_id = 'images' );
create policy "Public Upload to Images" on storage.objects for insert with check ( bucket_id = 'images' );

-- 13. Seed Data
insert into medical_templates (title, prescription_body) values 
('Ulcera Corneal Superficial', '1. Tobramicina (Colirio): 1 gota en el ojo afectado cada 6 horas por 7 días.
2. Atropina (Colirio): 1 gota en el ojo afectado cada 12 horas por 3 días (si hay dolor/uveitis).
3. Suero Autologo: 1 gota cada 4 horas.
4. Collar Isabelino permanente hasta revision.'),

('Conjuntivitis Bacteriana', '1. Ciprofloxacina (Colirio): 1 gota cada 8 horas por 7 días.
2. Limpieza de secreciones con solucion fisiologica esteril antes de cada aplicacion.
3. Control en 7 dias si no hay mejoria.'),

('Glaucoma Agudo de Urgencia', '1. Manitol 20% IV: 1-2 g/kg en 30 minutos.
2. Dorzolamida + Timolol (Colirio): 1 gota cada 8 horas.
3. Latanoprost (Colirio): 1 gota cada 12 horas (si no hay uveitis).
4. Derivar a especialista para posible cirugia.');
