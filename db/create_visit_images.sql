create table visit_images (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  visit_id uuid references visits(id) on delete cascade not null,
  image_url text not null,
  notes text
);

alter table visit_images enable row level security;

create policy "Enable all access for authenticated users" on visit_images for all using (auth.role() = 'authenticated');
