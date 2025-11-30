-- Storage bucket configuration for Zably (Week 1 / Day 1)
-- Creates two buckets: public-media (SEO assets) and provider-uploads (private, AU hosted).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('public-media', 'public-media', true, 5242880, array['image/png','image/jpeg','image/webp']),
  ('provider-uploads', 'provider-uploads', false, 20971520, array['image/png','image/jpeg','image/webp','application/pdf'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Ensure public directory assets are readable by anyone but writable via service role only.
do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'Public read public-media'
  ) then
    create policy "Public read public-media"
on storage.objects
for select
to public
using (bucket_id = 'public-media');

  end if;
end$$;

do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'Admins manage public-media'
  ) then
    create policy "Admins manage public-media"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'public-media'
  and exists (
    select 1 from public.user_profiles up
    where up.id = auth.uid()
      and up.role in ('admin','editor')
  )
)
with check (
  bucket_id = 'public-media'
  and exists (
    select 1 from public.user_profiles up
    where up.id = auth.uid()
      and up.role in ('admin','editor')
  )
);

  end if;
end$$;

-- Providers can only manage files in their own folder (provider UUID prefix) in the private bucket.
do $$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'Provider uploads self-manage'
  ) then
    create policy "Provider uploads self-manage"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'provider-uploads'
  and exists (
    select 1
    from public.user_profiles up
    join public.providers p on p.id = up.provider_id
    where up.id = auth.uid()
      and name ilike concat(p.id::text, '/%')
  )
)
with check (
  bucket_id = 'provider-uploads'
  and exists (
    select 1
    from public.user_profiles up
    join public.providers p on p.id = up.provider_id
    where up.id = auth.uid()
      and name ilike concat(p.id::text, '/%')
  )
);

  end if;
end$$;
