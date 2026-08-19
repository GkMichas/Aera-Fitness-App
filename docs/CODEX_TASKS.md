# AERA — Codex Task Queue

Use these as sequential Codex tasks. Do not merge phases into one giant task.

## Task 1 — Audit and harden Stage 1 foundation

Read `AGENTS.md`, both source-of-truth docs, the 31-screen inventory and `docs/reference/AERA Screens.dc.html`.

Then:

1. Audit the current Next.js project for design-system fidelity, accessibility and maintainability.
2. Preserve the approved AERA information architecture.
3. Fix any TypeScript, lint or build errors.
4. Refactor repeated visual patterns into reusable components where that improves maintainability.
5. Ensure Home matches the approved desktop/mobile direction without adding fake features.
6. Do not begin Supabase or AI work yet.
7. Run build/lint and report results.

Acceptance criteria:

- project builds cleanly
- Home is responsive
- desktop sidebar + mobile bottom nav work
- no unlabeled inputs
- source-of-truth docs remain unchanged

## Task 2 — Supabase, auth and complete onboarding

Implement Phase 2 from `IMPLEMENTATION_ROADMAP.md`.

Before coding, design the schema and RLS policy set for users, profiles, goals, measurements, progress photos, preferences and daily check-ins.

Do not expose private photos or health-related data publicly.

Acceptance criteria:

- real auth
- onboarding persists
- private per-user data
- all 10 onboarding screens represented
- empty/first-use Home state supported

## Task 3 — Training data foundation

Implement the Training data model before AI workout generation.

Create scalable schema/import format for:

- equipment
- exercises
- muscles
- movement patterns
- equipment↔exercise links
- alternatives
- regressions
- progressions
- media IDs
- caution tags

Then implement Exercise Library and workout/session domain models.

Do not let the LLM invent exercise metadata.

## Task 4 — Deterministic workout programming engine

Create deterministic rules for exercise selection, weekly frequency, sets, reps, rest, RIR/RPE and progression based on user goal, experience, available equipment and recent session performance.

LLM text can explain the plan but must not own progression arithmetic.

## Task 5 — Nutrition data and logging

Build food/portion/meal/recipe models, deterministic macro calculations, food search and confirmed AI-assisted text parsing.

## Task 6 — Coach context and memory

Build AI provider abstraction, intent routing and relevant-context assembly. Never send all user data blindly to every request.

## Task 7 — Progress and weekly intelligence

Implement Body Dashboard, trend charts, progress photo comparison, weekly review and transparent progress insights.

## Task 8 — Health safety layer

Implement AERA Health as a separately governed safety workflow. No diagnosis. Add red-flag escalation, uncertainty and logging.

## Task 9 — Media and visual completion

Replace demo placeholders with a consistent AERA media library, exercise video assets/posters and nutrition imagery. Preserve the 70% clarity / 30% visual storytelling rule.

## Task 10 — Security, privacy and launch QA

Implement privacy/data controls, tests, CI, accessibility audit, performance work and deployment readiness.
