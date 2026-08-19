# Supabase setup

1. Create a Supabase project.
2. Run migrations with the Supabase CLI or paste the SQL files from `supabase/migrations` into the SQL editor in filename order.
3. Copy `.env.example` to `.env.local` and provide the project URL and publishable/anon key.
4. Add `http://localhost:3000/auth/callback` to the Auth redirect allow list for local development.

The `progress-photos` bucket is private. Its storage policies restrict every object to a path whose first segment is the authenticated user ID.

The training catalog migration creates read-only master tables plus user-owned workout, session, set and pain-event tables. Import `data/training/catalog.v1.json` only through a trusted server or admin process; clients must never create exercise metadata.

The Home Gym workbook is normalized into the English-only `data/training/home-gym-database.v1.json`. Migration `202608190003` stores this source catalog separately with an explicit curation status, so metadata-only records cannot silently become workout-engine exercises.

Migration `202608190005` persists deterministic training-plan inputs, the rules version and rationale, then links generated workout days back to that immutable plan context.
