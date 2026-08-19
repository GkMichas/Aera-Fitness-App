# AGENTS.md — AERA Engineering Contract

You are working on AERA, a mobile-first AI health, fitness, nutrition and wellness coach.

## Non-negotiable source of truth

Before making UI or product changes, read:

1. `docs/source-of-truth/AERA_Design_System_V1.md`
2. `docs/source-of-truth/AERA_Complete_Application_Spec_V1.md`
3. `docs/SCREEN_INVENTORY.md`
4. `docs/IMPLEMENTATION_ROADMAP.md`

The 31-screen reference HTML is in `docs/reference/AERA Screens.dc.html`.

## Design rules

- Preserve the approved information architecture.
- AERA is premium wellness + intelligent data, not a gym dashboard.
- Use AERA design tokens; do not hard-code one-off colors repeatedly.
- Mobile first; desktop must keep the persistent sidebar pattern.
- Training is video-forward; Nutrition is photography-forward; Coach stays visually calm.
- Never add fake functionality. If a feature is not implemented, keep it out of production navigation or clearly mark it as development-only.
- All interactive elements must be keyboard accessible and labeled.

## Engineering rules

- Next.js App Router + TypeScript.
- Keep business logic outside visual components.
- Supabase is the primary auth/database/storage backend.
- User-owned records must be protected by Row Level Security.
- Server-side AI calls only; no AI keys in the browser.
- Deterministic code owns BMI/BMR/TDEE, calorie targets, protein targets, progress math, adherence and training volume.
- LLMs interpret data; they do not invent user measurements or arithmetic.

## Safety rules

- AERA Health is not a diagnostic service.
- Health requests require a separate safety classification/escalation path.
- Never state or imply a diagnosis with certainty.
- Training pain/symptom events must be stored separately from ordinary workout feedback.

## Data foundations to build

- Equipment master database
- Exercise master database
- Equipment ↔ exercise mapping
- Muscle / movement-pattern taxonomy
- Exercise alternatives, regressions and progressions
- Food database
- Serving/portion model
- Recipe/meal model
- Workout programming rules
- AI context/memory policy

## Workflow

Implement one phase from `docs/CODEX_TASKS.md` at a time.
For each phase:

1. Inspect current code and source-of-truth docs.
2. State a concise plan.
3. Implement.
4. Run lint/build/tests available in the repo.
5. Fix failures.
6. Summarize changed files, known limitations and next phase.

Do not redesign AERA unless the source-of-truth docs are intentionally updated first.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
