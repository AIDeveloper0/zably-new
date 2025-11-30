-- Dev-only dataset: seeds ~200 published providers across Australian states.
-- Run after reference_data.sql to guarantee taxonomies exist.

-- 1) Remove previous sample providers (identified by slug prefix).
with target as (
  select id from public.providers where slug like 'sample-provider-%'
)
delete from public.reviews r using target t where r.provider_id = t.id;

with target as (
  select id from public.providers where slug like 'sample-provider-%'
)
delete from public.provider_tag_map m using target t where m.provider_id = t.id;

with target as (
  select id from public.providers where slug like 'sample-provider-%'
)
delete from public.provider_services s using target t where s.provider_id = t.id;

with target as (
  select id from public.providers where slug like 'sample-provider-%'
)
delete from public.provider_funding_options f using target t where f.provider_id = t.id;

with target as (
  select id from public.providers where slug like 'sample-provider-%'
)
delete from public.provider_locations l using target t where l.provider_id = t.id;

with target as (
  select id from public.providers where slug like 'sample-provider-%'
)
delete from public.provider_private_profiles pp using target t where pp.provider_id = t.id;

delete from public.providers where slug like 'sample-provider-%';

drop table if exists tmp_sample_providers;

create temporary table tmp_sample_providers as
with base as (
  select
    gs,
    format('sample-provider-%s', gs) as slug,
    format('Sample Provider %s', gs) as display_name,
    (array['therapy-allied','community-access','support-coordination','supported-independent-living','plan-management','assistive-technology','behaviour-support','transport-services'])[((gs - 1) % 8) + 1] as primary_category,
    case
      when (array['community-access','therapy-allied','support-coordination','assistive-technology','behaviour-support','transport-services','plan-management','supported-independent-living'])[((gs) % 8) + 1]
           = (array['therapy-allied','community-access','support-coordination','supported-independent-living','plan-management','assistive-technology','behaviour-support','transport-services'])[((gs - 1) % 8) + 1]
        then null
      else (array['community-access','therapy-allied','support-coordination','assistive-technology','behaviour-support','transport-services','plan-management','supported-independent-living'])[((gs) % 8) + 1]
    end as secondary_category,
    (array['ndis','private','my-aged-care','medicare','workers-comp'])[((gs - 1) % 5) + 1] as funding_primary,
    case
      when (array['private','ndis','medicare','workers-comp','my-aged-care'])[((gs) % 5) + 1]
           = (array['ndis','private','my-aged-care','medicare','workers-comp'])[((gs - 1) % 5) + 1]
        then null
      else (array['private','ndis','medicare','workers-comp','my-aged-care'])[((gs) % 5) + 1]
    end as funding_secondary,
    (array['NSW','VIC','QLD','SA','WA','TAS','NT','ACT'])[((gs - 1) % 8) + 1] as state_code,
    (array['Sydney','Melbourne','Brisbane','Adelaide','Perth','Hobart','Darwin','Canberra'])[((gs - 1) % 8) + 1] as city_name,
    (array['2000','3000','4000','5000','6000','7000','8000','2600'])[((gs - 1) % 8) + 1] as postcode,
    (array['NDIS registered','Multilingual team','Aboriginal-led','Remote services available','Youth specialists','Adult specialists','Mental health focus','Complex needs ready','Regional outreach','24/7 support'])[((gs - 1) % 10) + 1] as primary_tag,
    case
      when (array['24/7 support','Regional outreach','Complex needs ready','Youth specialists','Adult specialists','Multilingual team','NDIS registered','Mental health focus','Remote services available','Aboriginal-led'])[((gs) % 10) + 1]
           = (array['NDIS registered','Multilingual team','Aboriginal-led','Remote services available','Youth specialists','Adult specialists','Mental health focus','Complex needs ready','Regional outreach','24/7 support'])[((gs - 1) % 10) + 1]
        then null
      else (array['24/7 support','Regional outreach','Complex needs ready','Youth specialists','Adult specialists','Multilingual team','NDIS registered','Mental health focus','Remote services available','Aboriginal-led'])[((gs) % 10) + 1]
    end as secondary_tag,
    case when gs % 4 = 0 then true else false end as featured_flag
  from generate_series(1, 200) as gs
),
inserted as (
  insert into public.providers (
    slug,
    display_name,
    legal_name,
    headline,
    summary,
    website,
    public_email,
    public_phone,
    status,
    is_active
  )
  select
    b.slug,
    b.display_name,
    b.display_name || ' Pty Ltd',
    format('%s services in %s', initcap(replace(b.primary_category, '-', ' ')), b.state_code),
    'Trusted disability provider offering flexible supports across therapy, community, and coordination.',
    format('https://%s.example.com.au', b.slug),
    format('hello+%s@sampleproviders.com.au', b.slug),
    format('1300 %s', lpad(b.gs::text, 4, '0')),
    'published',
    true
  from base b
  returning id, slug
)
select
  i.id as provider_id,
  b.*
from inserted i
join base b on b.slug = i.slug;

insert into public.provider_locations (
  id,
  provider_id,
  location_label,
  address_line1,
  suburb,
  state,
  postcode,
  country,
  is_primary
)
select
  gen_random_uuid(),
  t.provider_id,
  t.city_name || ' office',
  format('%s %s Street', 10 + (t.gs % 80), left(t.city_name, 3)),
  t.city_name,
  t.state_code,
  t.postcode,
  'Australia',
  true
from tmp_sample_providers t;

insert into public.provider_private_profiles (
  provider_id,
  contact_name,
  contact_email,
  contact_phone,
  compliance_notes,
  intake_notes,
  verified_on
)
select
  t.provider_id,
  format('Contact %s', t.gs),
  format('contact+%s@sampleproviders.com.au', t.slug),
  format('04%08s', lpad((10000000 + t.gs)::text, 8, '0')),
  'Auto-generated sample profile for testing. Verify before production.',
  'Prefers email contact. Availability within 5 business days.',
  timezone('utc', now())
from tmp_sample_providers t;

insert into public.provider_services (
  provider_id,
  service_category_id,
  summary,
  funding_codes,
  is_featured
)
select
  t.provider_id,
  cl.id,
  format('%s tailored for local communities.', initcap(replace(t.primary_category, '-', ' '))),
  array[t.funding_primary],
  t.featured_flag
from tmp_sample_providers t
join public.service_categories cl on cl.slug = t.primary_category
union all
select
  t.provider_id,
  cl.id,
  format('Complementary %s offering.', initcap(replace(t.secondary_category, '-', ' '))),
  array[t.funding_secondary],
  false
from tmp_sample_providers t
join public.service_categories cl on cl.slug = t.secondary_category
where t.secondary_category is not null;

insert into public.provider_funding_options (provider_id, funding_type_id, notes)
select
  t.provider_id,
  fl.id,
  'Primary funding stream for this provider.'
from tmp_sample_providers t
join public.funding_types fl on fl.slug = t.funding_primary
union all
select
  t.provider_id,
  fl.id,
  'Secondary stream accepted on request.'
from tmp_sample_providers t
join public.funding_types fl on fl.slug = t.funding_secondary
where t.funding_secondary is not null;

insert into public.provider_tag_map (provider_id, tag_id)
select
  t.provider_id,
  tl.id
from tmp_sample_providers t
join public.provider_tags tl on tl.label = t.primary_tag
union all
select
  t.provider_id,
  tl.id
from tmp_sample_providers t
join public.provider_tags tl on tl.label = t.secondary_tag
where t.secondary_tag is not null;

drop table if exists tmp_sample_providers;
