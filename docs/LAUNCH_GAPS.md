# AERA launch-gap register

This file tracks implemented preview behavior that must be connected or hardened before production launch. It does not replace the product source-of-truth documents.

## Task 9 — Media completion (completed)

- Added 18 named, optimized exercise posters covering every curated V1 exercise media ID.
- Added mapped nutrition photography for both demo recipes.
- Added fully clothed synthetic front/side progress diptychs with persistent Demo labels.
- Replaced shared placeholder references across production and imported reference screens.
- Added automated media coverage and source-size validation.
- Exercise surfaces use the approved poster fallback and remain ready for optional first-party MP4 technique clips.

## Task 10 — Functional completion and launch QA (completed locally)

- Added persistent local-mode flows for meals, measurements, goals, daily check-ins, generated plans, weekly-plan acceptance and active-workout progress.
- Added a functional profile, privacy center, JSON export, deletion controls, honest local-mode labeling and account-aware entry screens.
- Added authenticated account export/deletion endpoints and the `202608190010_launch_privacy_controls.sql` consent/account-deletion migration.
- Added Coach and Health rate limits, no-store responses and security headers. Emergency Health results bypass the non-emergency rate-limit block.
- Added route-level loading/error UI, a functional landing page and a GitHub Actions quality gate.
- Added an automated English-only source audit. All catalog, engine, safety, media, TypeScript, lint and production-build checks pass locally.

## External production activation remaining

- Create or select the production Supabase project, add its URL/anon key, apply migrations `001`–`010`, and verify auth, private storage and RLS with real test accounts.
- Add the production Coach provider secret/URL and verify provider monitoring, budgets and fallback alerts.
- Choose a hosting target, add environment variables, deploy, then enable uptime/error monitoring and run the post-deploy smoke checklist.
