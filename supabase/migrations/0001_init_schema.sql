-- Zably Supabase schema bootstrap (Week 1 / Day 1)
-- Ensures all personal data is stored privately while public-facing tables expose only approved provider info.

-- Extensions ------------------------------------------------------------------------------------
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";
create extension if not exists "citext";
create extension if not exists "pg_trgm";
create extension if not exists "postgis";

-- Enums ------------------------------------------------------------------------------------------
create type public.provider_status as enum ('draft', 'pending_review', 'published', 'suspended');
create type public.review_status as enum ('pending', 'approved', 'rejected', 'removed');
create type public.user_role as enum ('provider', 'admin', 'moderator', 'editor', 'viewer');

-- Helpers ----------------------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Providers --------------------------------------------------------------------------------------
create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique,
  display_name text not null,
  legal_name text,
  headline text,
  summary text,
  website text,
  public_email text,
  public_phone text,
  abn text,
  founded_year smallint,
  staff_count_range text,
  tags_search tsvector generated always as (to_tsvector('english', coalesce(display_name,'') || ' ' || coalesce(summary,''))) stored,
  status public.provider_status not null default 'draft',
  is_active boolean not null default true,
  primary_owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger providers_set_updated_at
before update on public.providers
for each row execute procedure public.set_updated_at();

create index providers_search_idx on public.providers using gin (tags_search);
create index providers_status_idx on public.providers (status) where status = 'published';

-- Auth-linked profile for providers/admins -------------------------------------------------------
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'provider',
  provider_id uuid unique references public.providers(id) deferrable initially deferred,
  full_name text,
  timezone text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.user_profiles up
    where up.id = auth.uid()
      and up.role in ('admin','moderator','editor')
  );
$$;

create or replace function public.assign_user_role(target_user uuid, new_role public.user_role)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.user_profiles
  set role = new_role,
      updated_at = timezone('utc', now())
  where id = target_user;

  if not found then
    raise exception 'User % not found in user_profiles', target_user;
  end if;
end;
$$;

-- Private provider metadata ----------------------------------------------------------------------
create table if not exists public.provider_private_profiles (
  provider_id uuid primary key references public.providers(id) on delete cascade,
  contact_name text,
  contact_email text,
  contact_phone text,
  compliance_notes text,
  intake_notes text,
  verified_on timestamptz,
  data_residency text default 'ap-southeast-2',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger provider_private_profiles_updated_at
before update on public.provider_private_profiles
for each row execute procedure public.set_updated_at();

-- Locations --------------------------------------------------------------------------------------
create table if not exists public.provider_locations (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  location_label text not null,
  address_line1 text,
  address_line2 text,
  suburb text,
  state text,
  postcode text,
  country text default 'Australia',
  latitude numeric(9,6),
  longitude numeric(9,6),
  geo geography(point, 4326),
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index provider_locations_geo_idx on public.provider_locations using gist (geo);

create trigger provider_locations_updated_at
before update on public.provider_locations
for each row execute procedure public.set_updated_at();

-- Service categories and mappings ----------------------------------------------------------------
create table if not exists public.service_categories (
  id uuid primary key default gen_random_uuid(),
  slug citext unique not null,
  name text not null,
  description text,
  icon text,
  sort_order integer default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger service_categories_updated_at
before update on public.service_categories
for each row execute procedure public.set_updated_at();

create table if not exists public.provider_services (
  provider_id uuid not null references public.providers(id) on delete cascade,
  service_category_id uuid not null references public.service_categories(id) on delete cascade,
  summary text,
  funding_codes text[],
  is_featured boolean default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (provider_id, service_category_id)
);

create trigger provider_services_updated_at
before update on public.provider_services
for each row execute procedure public.set_updated_at();

-- Funding configuration --------------------------------------------------------------------------
create table if not exists public.funding_types (
  id uuid primary key default gen_random_uuid(),
  slug citext unique not null,
  label text not null,
  description text,
  sort_order integer default 0
);

create table if not exists public.provider_funding_options (
  provider_id uuid not null references public.providers(id) on delete cascade,
  funding_type_id uuid not null references public.funding_types(id) on delete cascade,
  notes text,
  primary key (provider_id, funding_type_id)
);

-- Tagging ----------------------------------------------------------------------------------------
create table if not exists public.provider_tags (
  id uuid primary key default gen_random_uuid(),
  label citext not null unique,
  category text
);

create table if not exists public.provider_tag_map (
  provider_id uuid not null references public.providers(id) on delete cascade,
  tag_id uuid not null references public.provider_tags(id) on delete cascade,
  primary key (provider_id, tag_id)
);

-- Articles / resources (SEO content without personal info) --------------------------------------
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug citext not null unique,
  title text not null,
  excerpt text,
  body text,
  hero_image_url text,
  published_at timestamptz,
  created_by uuid references public.user_profiles(id),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger articles_updated_at
before update on public.articles
for each row execute procedure public.set_updated_at();

-- Reviews placeholder (structure only, logic implemented Week 3) ---------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.providers(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  body text,
  display_name text,
  status public.review_status not null default 'pending',
  submitted_at timestamptz not null default timezone('utc', now()),
  moderated_at timestamptz,
  moderated_by uuid references public.user_profiles(id),
  reply text,
  replied_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create trigger reviews_updated_at
before update on public.reviews
for each row execute procedure public.set_updated_at();

-- Audit log captures access and moderation events ------------------------------------------------
create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.user_profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.log_provider_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  payload jsonb := jsonb_build_object(
    'old_status', case when tg_op <> 'INSERT' then coalesce(old.status::text, null) else null end,
    'new_status', case when tg_op <> 'DELETE' then coalesce(new.status::text, null) else null end,
    'old_active', case when tg_op <> 'INSERT' then old.is_active else null end,
    'new_active', case when tg_op <> 'DELETE' then new.is_active else null end,
    'slug', coalesce(case when tg_op = 'DELETE' then old.slug else new.slug end, '')
  );
begin
  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    tg_op,
    'provider',
    coalesce(new.id, old.id),
    payload
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger providers_audit_log
after insert or update or delete on public.providers
for each row execute procedure public.log_provider_audit();

create or replace function public.log_review_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  payload jsonb := jsonb_build_object(
    'old_status', case when tg_op <> 'INSERT' then coalesce(old.status::text, null) else null end,
    'new_status', case when tg_op <> 'DELETE' then coalesce(new.status::text, null) else null end,
    'rating', case when tg_op <> 'DELETE' then new.rating else old.rating end,
    'provider_id', coalesce(case when tg_op = 'DELETE' then old.provider_id else new.provider_id end, '00000000-0000-0000-0000-000000000000'::uuid)
  );
begin
  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    tg_op,
    'review',
    coalesce(new.id, old.id),
    payload
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger reviews_audit_log
after insert or update or delete on public.reviews
for each row execute procedure public.log_review_audit();

-- RLS policies -----------------------------------------------------------------------------------
alter table public.providers enable row level security;
alter table public.provider_private_profiles enable row level security;
alter table public.provider_locations enable row level security;
alter table public.service_categories enable row level security;
alter table public.provider_services enable row level security;
alter table public.funding_types enable row level security;
alter table public.provider_funding_options enable row level security;
alter table public.provider_tags enable row level security;
alter table public.provider_tag_map enable row level security;
alter table public.articles enable row level security;
alter table public.reviews enable row level security;
alter table public.user_profiles enable row level security;
alter table public.audit_logs enable row level security;

-- Providers: public read of published listings
create policy providers_public_read
on public.providers
for select
to public
using (
  status = 'published'
  and is_active = true
);

-- Providers: owners manage their record
create policy providers_owner_write
on public.providers
for all
to authenticated
using (auth.uid() = primary_owner_id)
with check (auth.uid() = primary_owner_id);

create policy providers_admin_manage
on public.providers
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Provider private profile access restricted to owners/admins
create policy provider_private_owner_access
on public.provider_private_profiles
for all
to authenticated
using (
  exists (
    select 1
    from public.providers p
    where p.id = provider_private_profiles.provider_id
      and auth.uid() = p.primary_owner_id
  )
)
with check (
  exists (
    select 1
    from public.providers p
    where p.id = provider_private_profiles.provider_id
      and auth.uid() = p.primary_owner_id
  )
);

create policy provider_private_admin_access
on public.provider_private_profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Provider locations/service/funding/tag maps follow provider visibility
create policy provider_locations_public_read
on public.provider_locations
for select
to public
using (
  exists (
    select 1
    from public.providers p
    where p.id = provider_locations.provider_id
      and p.status = 'published'
      and p.is_active = true
  )
);

create policy provider_locations_owner_write
on public.provider_locations
for all
to authenticated
using (
  exists (
    select 1
    from public.providers p
    where p.id = provider_locations.provider_id
      and auth.uid() = p.primary_owner_id
  )
)
with check (
  exists (
    select 1
    from public.providers p
    where p.id = provider_locations.provider_id
      and auth.uid() = p.primary_owner_id
  )
);

create policy provider_locations_admin_access
on public.provider_locations
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy provider_services_public_read
on public.provider_services
for select
to public
using (
  exists (
    select 1
    from public.providers p
    where p.id = provider_services.provider_id
      and p.status = 'published'
      and p.is_active = true
  )
);

create policy provider_services_owner_write
on public.provider_services
for all
to authenticated
using (
  exists (
    select 1
    from public.providers p
    where p.id = provider_services.provider_id
      and auth.uid() = p.primary_owner_id
  )
)
with check (
  exists (
    select 1
    from public.providers p
    where p.id = provider_services.provider_id
      and auth.uid() = p.primary_owner_id
  )
);

create policy provider_services_admin_access
on public.provider_services
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy provider_funding_public_read
on public.provider_funding_options
for select
to public
using (
  exists (
    select 1
    from public.providers p
    where p.id = provider_funding_options.provider_id
      and p.status = 'published'
      and p.is_active = true
  )
);

create policy provider_funding_owner_write
on public.provider_funding_options
for all
to authenticated
using (
  exists (
    select 1
    from public.providers p
    where p.id = provider_funding_options.provider_id
      and auth.uid() = p.primary_owner_id
  )
)
with check (
  exists (
    select 1
    from public.providers p
    where p.id = provider_funding_options.provider_id
      and auth.uid() = p.primary_owner_id
  )
);

create policy provider_funding_admin_access
on public.provider_funding_options
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy provider_tags_public_read
on public.provider_tag_map
for select
to public
using (
  exists (
    select 1
    from public.providers p
    where p.id = provider_tag_map.provider_id
      and p.status = 'published'
      and p.is_active = true
  )
);

create policy provider_tags_owner_write
on public.provider_tag_map
for all
to authenticated
using (
  exists (
    select 1
    from public.providers p
    where p.id = provider_tag_map.provider_id
      and auth.uid() = p.primary_owner_id
  )
)
with check (
  exists (
    select 1
    from public.providers p
    where p.id = provider_tag_map.provider_id
      and auth.uid() = p.primary_owner_id
  )
);

create policy provider_tags_admin_access
on public.provider_tag_map
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Reference tables are readable to everyone but mutable only by admins via service role
create policy service_categories_public_read
on public.service_categories
for select
to public
using (true);

create policy service_categories_admin_write
on public.service_categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy funding_types_public_read
on public.funding_types
for select
to public
using (true);

create policy funding_types_admin_write
on public.funding_types
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy provider_tags_public
on public.provider_tags
for select
to public
using (true);

create policy provider_tags_admin_write
on public.provider_tags
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Articles & reviews read policies
create policy articles_public_read
on public.articles
for select
to public
using (published_at is not null and published_at <= timezone('utc', now()));

create policy articles_admin_manage
on public.articles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy reviews_public_read
on public.reviews
for select
to public
using (status = 'approved');

create policy reviews_admin_manage
on public.reviews
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- User profile self-access
create policy user_profiles_self_access
on public.user_profiles
for all
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy user_profiles_admin_read
on public.user_profiles
for select
to authenticated
using (public.is_admin());

-- Audit log visible only to admins (moderators)
create policy audit_logs_admin_read
on public.audit_logs
for select
to authenticated
using (
  exists (
    select 1 from public.user_profiles up
    where up.id = auth.uid()
      and up.role in ('admin','moderator')
  )
);

-- Trigger to auto-create profile on new auth user -----------------------------------------------
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), 'provider')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user_profile();
