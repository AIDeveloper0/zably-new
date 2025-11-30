-- Reference taxonomy data for services, funding options, and tags.
-- Safe to re-run; all inserts use upserts keyed by slug/label.

insert into public.service_categories (slug, name, description, icon, sort_order)
values
  ('therapy-allied', 'Therapy & Allied Health', 'Physio, OT, speech, psychology, and related allied health supports.', 'ph_therapy', 10),
  ('community-access', 'Community Access', 'Programs and supports that help participants engage with their community.', 'ph_people', 20),
  ('support-coordination', 'Support Coordination', 'Plan implementation, coordination, and goal-tracking services.', 'ph_flag', 30),
  ('supported-independent-living', 'Supported Independent Living', 'SIL, SDA partnerships, respite, and short-term accommodation.', 'ph_home', 40),
  ('plan-management', 'Plan Management', 'Registered plan managers handling claims and budgets.', 'ph_clipboard', 50),
  ('assistive-technology', 'Assistive Technology', 'Equipment, custom tech, and maintenance services.', 'ph_cpu', 60),
  ('behaviour-support', 'Behaviour Support', 'PBS practitioners, behavioural specialists, and training.', 'ph_brain', 70),
  ('transport-services', 'Transport & Travel Training', 'Accessible transport, travel training, and driver programs.', 'ph_car', 80)
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    icon = excluded.icon,
    sort_order = excluded.sort_order;

insert into public.funding_types (slug, label, description, sort_order)
values
  ('ndis', 'NDIS', 'National Disability Insurance Scheme participants', 10),
  ('my-aged-care', 'My Aged Care', 'Commonwealth Home Support / aged care programs', 20),
  ('medicare', 'Medicare', 'Medicare item rebates', 30),
  ('private', 'Private', 'Full-fee private clients', 40),
  ('workers-comp', 'Workers Compensation', 'Return-to-work and insurer-funded supports', 50)
on conflict (slug) do update
set label = excluded.label,
    description = excluded.description,
    sort_order = excluded.sort_order;

insert into public.provider_tags (label, category)
values
  ('NDIS registered', 'compliance'),
  ('24/7 support', 'service_hours'),
  ('Multilingual team', 'capability'),
  ('Aboriginal-led', 'identity'),
  ('Remote services available', 'coverage'),
  ('Youth specialists', 'audience'),
  ('Adult specialists', 'audience'),
  ('Mental health focus', 'specialty'),
  ('Complex needs ready', 'specialty'),
  ('Regional outreach', 'coverage')
on conflict (label) do update
set category = excluded.category;
