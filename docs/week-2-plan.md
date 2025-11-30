## Week 2 Plan – Provider Portal & Admin Tools

Focus: secure portal, role-aware dashboards, moderation workflows.

### Day 1 – Portal Architecture & Auth
- Finalise information architecture for portal (provider dashboard vs admin console).
- Implement Supabase auth helpers (server/browser) with cookie persistence.
- Build `/portal/sign-in` page with magic link (email OTP) flow and server actions for sign-in/out.
- Add guarded route group (e.g., `/dashboard`) that redirects unauthenticated users to sign-in.

### Day 2 – Provider Dashboard MVP
- Create responsive portal layout (sidebar, header, breadcrumbs).
- Surface key provider data: listing status, review count, lead count (placeholder data until backend endpoints ready).
- Add editable info cards for services, funding, contact info (read-only UI placeholders backed by Supabase fetches).
- Wire “Update listing” CTAs to forthcoming edit forms.

### Day 3 – Listing Management Forms
- Build forms for editing provider profile/locations/services using Supabase mutations.
- Add optimistic UI with validation + toast feedback.
- Respect RLS by ensuring updates use authenticated Supabase client (service role is **not** used in the client).

### Day 4 – Admin Moderation Views
- Introduce role-based routing (admin vs provider) using `user_profiles.role`.
- Create `/dashboard/reviews` moderation queue (pending/approved/rejected tabs).
- Add abuse reporting + right-of-reply placeholders in UI.

### Day 5 – Audit, Notifications & Polish
- Hook audit log viewer for admins (simple table).
- Add basic notifications (email templates / placeholders) for new reviews or leads.
- Tighten responsive styling, empty states, loading skeletons.
- Update documentation + demo walkthrough for stakeholders.

> Week 2 deliverables will live in the main Next.js app under a new `(portal)` route group so marketing pages remain unaffected.
