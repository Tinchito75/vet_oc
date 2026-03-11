-- Enable RLS
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Owners Profile
create table owners (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  first_name text not null,
  last_name text not null,
  phone text,
  email text,
  address text,
  notes text
);

-- Patients
create table patients (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  owner_id uuid references owners(id) on delete cascade not null,
  name text not null,
  species text not null, -- 'Perro', 'Gato', etc.
  breed text,
  birth_date date, -- Calculated age from this
  weight numeric, -- in kg
  gender text, -- 'Macho', 'Hembra'
  is_neutered boolean default false,
  photo_url text,
  medical_history text
);

-- Appointments (Agenda)
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

-- Visits (Consultas)
create table visits (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  patient_id uuid references patients(id) on delete cascade not null,
  appointment_id uuid references appointments(id), -- Optional link to appointment
  reason text,
  anamnesis text, 
  diagnosis text,
  treatment_plan text,
  notes text
);

-- Findings (Hallazgos del Oftalmograma)
create table findings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  visit_id uuid references visits(id) on delete cascade not null,
  eye text not null, -- 'OD' (Right), 'OI' (Left)
  zone text not null, -- 'Cornea', 'Cristalino', 'Retina', etc.
  condition text, -- 'Ulcer', 'Inflammation', etc.
  description text,
  color_code text, -- Hex code for the diagram
  image_url text -- Specific image for this finding if needed
);

-- Treatments/Prescriptions (Recetas)
create table treatments (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  visit_id uuid references visits(id) on delete cascade not null,
  name text not null, -- Drug name
  dosage text,
  frequency text,
  duration text,
  notes text
);

-- Enable Row Level Security (RLS)
alter table owners enable row level security;
alter table patients enable row level security;
alter table appointments enable row level security;
alter table visits enable row level security;
alter table findings enable row level security;
alter table treatments enable row level security;

-- Policies (Simple unrestricted for now, can be refined later for multi-user)
create policy "Enable all access for authenticated users" on owners for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on patients for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on appointments for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on visits for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on findings for all using (auth.role() = 'authenticated');
create policy "Enable all access for authenticated users" on treatments for all using (auth.role() = 'authenticated');

-- Storage Bucket for Images
insert into storage.buckets (id, name, public) values ('images', 'images', true);
create policy "Public Access to Images" on storage.objects for select using ( bucket_id = 'images' );
create policy "Authenticated Upload to Images" on storage.objects for insert with check ( bucket_id = 'images' and auth.role() = 'authenticated' );
