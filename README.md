# AERA — Stage 1 Production App

This repository is the first production-oriented implementation of AERA based on the approved 31-screen Claude Design reference and the AERA Design System/Application Specification.

## Stage 1 scope

Implemented now:

- Next.js App Router foundation
- TypeScript
- Tailwind CSS 4 token layer
- Responsive desktop sidebar + mobile bottom navigation
- AERA visual tokens
- Landing page
- Login and signup surfaces
- First onboarding path: goal → about → initial plan
- Home dashboard with design-system parity
- Functional preview surfaces for Coach, Training, Nutrition, Progress, Weekly Review and AERA Health
- Accessible labels/focus styles for form controls
- Demo data provider
- Curated exercise/equipment database and deterministic programming engine
- English food/recipe catalog with deterministic nutrition calculations
- Coach context, memory and provider abstraction
- Progress trends, weekly intelligence and private-photo model
- Health safety classification and escalation layer
- Named AERA media library with 18 exercise posters, nutrition photography and labeled progress demo media
- Unit/validation scripts for the core domain engines
- Source-of-truth design docs and 31-screen inventory
- Codex implementation roadmap

Not yet production-complete:

- Supabase authentication/data persistence
- Real AI orchestration/memory
- GDPR/privacy controls
- CI, deployment monitoring and final launch QA
- Optional first-party MP4 exercise technique clips; production poster fallback is complete

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Source of truth

Read these before changing product behavior or visual structure:

- `docs/source-of-truth/AERA_Design_System_V1.md`
- `docs/source-of-truth/AERA_Complete_Application_Spec_V1.md`
- `docs/SCREEN_INVENTORY.md`
- `AGENTS.md`

## Codex workflow

Use one phase at a time from `docs/CODEX_TASKS.md`. Each task has acceptance criteria. Do not ask Codex to implement the entire app in one pass.
