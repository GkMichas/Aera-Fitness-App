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
- Read-only core surfaces for Coach, Training, Nutrition, You, Weekly Review and AERA Health
- Accessible labels/focus styles for form controls
- Demo data provider
- Source-of-truth design docs and 31-screen inventory
- Codex implementation roadmap

Not yet production-complete:

- Supabase authentication/data persistence
- All onboarding steps
- Exercise/equipment database
- Training programming engine
- Nutrition food/recipe database
- Real AI orchestration/memory
- Health safety engine
- Full media library and exercise videos
- GDPR/privacy controls
- automated tests and CI

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
