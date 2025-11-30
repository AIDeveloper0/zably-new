## Supabase setup (Week 1)

Everything in this folder is geared to the Sydney (`ap-southeast-2`) Supabase region so that personal data never leaves Australia. Use the Supabase CLI or dashboard to run the steps below.

---

### Day 1 – Project + Core Schema

1. **Create the project**

   ```bash
   supabase projects create zably --db-password "<secure>" --org-id <org> --region ap-southeast-2
   ```

   Save `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.

2. **Auth configuration**

   - Enable Email OTP / magic link.
   - Require email confirmations.
   - Add allowed redirect URLs for localhost + production.

3. **Run migrations and storage policies**

   ```bash
   supabase migration up
   psql "$SUPABASE_DB_URL" -f supabase/storage/seed_buckets.sql
   ```

   The migration enables the required extensions (`postgis`, `pg_trgm`, `citext`, etc.), creates every table (providers, services, funding, tags, reviews, audit logs), wires RLS so only published providers are public, adds helper functions (`is_admin`, `assign_user_role`), and registers audit triggers for providers/reviews. The storage script adds the `public-media` and `provider-uploads` buckets with tight policies.

4. **Frontend environment variables**

   ```
   NEXT_PUBLIC_SUPABASE_URL=<SUPABASE_URL>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUPABASE_ANON_KEY>
   SUPABASE_SERVICE_ROLE_KEY=<restricted-use server env only>
   ```

---

### Day 2 – Access & Data Prep

1. **Reference data (services, funding, tags)**

   ```bash
   psql "$SUPABASE_DB_URL" -f supabase/seeds/reference_data.sql
   ```

   This script upserts the primary service categories, funding streams, and moderation tags used across the directory.

2. **Sample providers (~200 listings)**

   ```bash
   psql "$SUPABASE_DB_URL" -f supabase/seeds/sample_providers.sql
   ```

   - Generates 200 realistic providers distributed across all Australian states (extra weight on NSW/VIC due to the array cycling).
   - Each provider gets two service categories, two funding options, two capability tags, and a primary location entry.
   - Private contact details are stored in `provider_private_profiles` to demonstrate the split between public vs. restricted data.
   - Re-running the script cleans up any previous `sample-provider-*` rows before inserting fresh data.

3. **Assign roles**

   Use the helper function to elevate admins or moderators after their auth profile exists:

   ```sql
   select public.assign_user_role('00000000-0000-0000-0000-000000000000', 'admin');
   ```

   Replace the UUID with the Supabase Auth user ID. The function updates `user_profiles` and keeps audit history consistent.

4. **Audit logging**

   `public.log_provider_audit` and `public.log_review_audit` automatically create entries in `audit_logs` for inserts/updates/deletes, giving moderators a privacy trail with actor IDs, status transitions, and timestamps. Nothing to run—these fire once the migrations are in place.

---

### Notes

- All scripts are idempotent and safe to re-run in non-production environments.
- Sample data is for development/testing only. Before launch, either remove the `sample-provider-*` rows or replace them with vetted imports.
- For automation you can bundle the SQL files into a single command (`psql ... -f reference_data.sql -f sample_providers.sql`), but keeping them separate makes it easy to reseed just the taxonomies.
