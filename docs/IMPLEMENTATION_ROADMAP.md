# AERA — Production Implementation Roadmap

## Phase 1 — Foundation & visual parity

Goal: convert the approved design into a maintainable app foundation.

- Next.js / TypeScript / Tailwind
- design tokens and reusable shell
- responsive desktop/mobile navigation
- landing/auth/onboarding starter path
- Home dashboard
- initial core surfaces
- demo data adapter
- accessibility baseline
- Codex engineering contract

## Phase 2 — Identity, onboarding & body profile

- Supabase project wiring
- email/password and Google auth
- complete 10-step onboarding
- profile, goals, measurements
- progress-photo private storage
- activity/training/nutrition preferences
- daily check-in persistence
- first-use/empty states
- RLS policies

## Phase 3 — Training system

- equipment master database
- exercise master database
- equipment↔exercise mappings
- muscle/movement taxonomy
- alternatives/regressions/progressions
- workout generator rules
- sets/reps/rest/RIR/RPE model
- progression engine
- session logging
- pain/soreness feedback events
- exercise library/search/filter
- video/media ID model

## Phase 4 — Nutrition system

- food database abstraction
- serving/portion data model
- meals and recipes
- deterministic calorie/macro math
- text meal parser with user confirmation
- meal planner
- ingredient-aware planning
- food search
- meal detail
- dietary/allergen tagging

## Phase 5 — AERA Coach, context & memory

- AI provider abstraction
- context builder
- intent router
- Coach Engine
- Training Engine bridge
- Nutrition Engine bridge
- persistent conversation model
- compact long-term user memory derived from structured data
- action cards
- failure/retry states

## Phase 6 — Body, progress & weekly review

- Body Dashboard
- weight/waist/strength charts
- progress photo comparison
- adherence metrics
- weekly review generation
- transparent trend rules
- AERA Body Insight

## Phase 7 — AERA Health & safety

- dedicated Health intake
- red-flag/safety classification
- uncertainty requirements
- escalation policy
- audit logging
- professional review checklist
- no-diagnosis guardrails

## Phase 8 — Media, accessibility & polish

- coherent AERA image library
- exercise videos/posters
- nutrition photography
- loading/skeleton/error states
- WCAG review
- keyboard/focus audit
- tablet/desktop parity
- performance/image optimization

## Phase 9 — Privacy, security, QA & launch

- GDPR/privacy consent UX
- data export/delete
- retention policy implementation
- analytics consent
- security review
- automated unit/integration/e2e tests
- CI
- staging deployment
- production deployment
- monitoring and error reporting
