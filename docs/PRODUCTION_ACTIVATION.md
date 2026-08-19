# AERA production activation

The repository is fully runnable in local mode without credentials. Local mode stores user changes only in that browser and labels this behavior in the UI.

## Supabase

1. Create the production project and configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Apply every migration in `supabase/migrations` in filename order, including `202608190010_launch_privacy_controls.sql`.
3. Configure the allowed site URL and callback URLs for `/auth/callback`.
4. Verify email and Google authentication, onboarding completion, private progress-photo storage, export and deletion with dedicated test accounts.
5. Confirm anonymous users cannot read any user-owned table or the private `progress-photos` bucket.

## Coach provider

Configure either `AERA_COACH_PROVIDER_URL` plus `AERA_COACH_PROVIDER_KEY`, or the supported OpenAI provider variables documented in `.env.example`. Keep the deterministic local provider available as an explicit degraded-mode fallback.

## Deploy and smoke test

Run `npm test`, `npm run typecheck`, `npm run lint` and `npm run build`. After deployment, test sign-up, onboarding, one workout set, one meal, one measurement, Coach, emergency Health guidance, export and account deletion. Configure error reporting and uptime alerts before inviting users.
