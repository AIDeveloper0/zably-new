# Zably Frontend

Next.js (App Router) frontend for the Zably public directory. This surface is SEO-first, renders only non-sensitive provider info, and pulls data from Supabase (Sydney region) using anon access keys.

## Day 3 deliverables

- App scaffolded with Next.js 16 + Tailwind v4, custom layout, fonts, and shared header/footer.
- Supabase helpers (`src/lib/supabase/*`) to query published providers via server components.
- Public routes:
  - `/` – marketing hero + featured providers.
  - `/providers` – searchable directory with filters for state, service category, and funding type.
  - `/providers/[slug]` – provider profile view (no PII beyond approved contact fields).
  - `/articles` – content hub with guides/checklists and moderation transparency.
  - `/portal` – provider portal landing page describing the secure login experience.
- Reusable UI: provider cards, search form, and filter panel.
- `.env.example` describing required Supabase env vars.

## Getting started

```bash
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_* using the Sydney Supabase project
npm run dev
```

Visit http://localhost:3000 to preview the public site. The search/fetch logic expects the Supabase schema + seed data created in `/zably-backend`.

> If you leave the `.env.local` values as the placeholders from `.env.example`, the frontend automatically uses mock provider data so you can preview the UI without a live database. Replace them with the real Supabase URL/anon key to query production data.

## Project structure

```
src/
  app/               # App Router routes
  components/        # UI primitives + layout
  config/site.ts     # Site metadata + nav config
  lib/               # Supabase clients, env parsing, helpers
```

## Notes

- All Supabase calls use the anon key and rely on RLS policies defined in the backend repo, so no personal data is exposed.
- Filters currently operate on published data only; additional moderation controls will ship alongside the provider portal.
- When deploying to Vercel, add the same `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` variables.

## Week 2 (Portal) work in progress

- `/portal/sign-in` magic-link flow wired to Supabase Auth (Sydney).
- `/dashboard` authenticated route group with responsive shell (sidebar/header) and overview metrics.
- Listing/review/lead placeholder pages fetch live data through the new server auth helpers.
