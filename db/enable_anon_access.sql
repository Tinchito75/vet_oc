-- Drop valid policies that restrict only to authenticated users
drop policy if exists "Enable all access for authenticated users" on owners;
drop policy if exists "Enable all access for authenticated users" on patients;
drop policy if exists "Enable all access for authenticated users" on appointments;
drop policy if exists "Enable all access for authenticated users" on visits;
drop policy if exists "Enable all access for authenticated users" on findings;
drop policy if exists "Enable all access for authenticated users" on treatments;

-- Re-enable policies allowing PUBLIC access (for MVP without login)
create policy "Enable all access for all users" on owners for all using (true) with check (true);
create policy "Enable all access for all users" on patients for all using (true) with check (true);
create policy "Enable all access for all users" on appointments for all using (true) with check (true);
create policy "Enable all access for all users" on visits for all using (true) with check (true);
create policy "Enable all access for all users" on findings for all using (true) with check (true);
create policy "Enable all access for all users" on treatments for all using (true) with check (true);
