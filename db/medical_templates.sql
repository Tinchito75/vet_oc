-- Create Medical Templates Table
create table medical_templates (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  prescription_body text not null
);

-- Enable RLS (Public for MVP)
alter table medical_templates enable row level security;
create policy "Enable all access for all users" on medical_templates for all using (true) with check (true);

-- Seed Data
insert into medical_templates (title, prescription_body) values 
('Úlcera Corneal Superficial', '1. Tobramicina (Colirio): 1 gota en el ojo afectado cada 6 horas por 7 días.
2. Atropina (Colirio): 1 gota en el ojo afectado cada 12 horas por 3 días (si hay dolor/uveítis).
3. Suero Autólogo: 1 gota cada 4 horas.
4. Collar Isabelino permanente hasta revisión.'),

('Conjuntivitis Bacteriana', '1. Ciprofloxacina (Colirio): 1 gota cada 8 horas por 7 días.
2. Limpieza de secreciones con solución fisiológica estéril antes de cada aplicación.
3. Control en 7 días si no hay mejoría.'),

('Glaucoma Agudo de Urgencia', '1. Manitol 20% IV: 1-2 g/kg en 30 minutos.
2. Dorzolamida + Timolol (Colirio): 1 gota cada 8 horas.
3. Latanoprost (Colirio): 1 gota cada 12 horas (si no hay uveítis).
4. Derivar a especialista para posible cirugía.');
