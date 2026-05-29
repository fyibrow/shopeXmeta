-- Jalankan setelah membuat bucket "og-images" (public) di Supabase Dashboard

insert into storage.buckets (id, name, public)
values ('og-images', 'og-images', true)
on conflict (id) do nothing;

create policy "Public read og images"
  on storage.objects for select
  using (bucket_id = 'og-images');

create policy "Authenticated upload og images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'og-images');

create policy "Authenticated delete og images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'og-images');
