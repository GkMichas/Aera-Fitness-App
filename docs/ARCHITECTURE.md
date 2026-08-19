# AERA — Target Architecture

```text
Clients
  ├── Next.js web app
  └── future iOS / Android app
          │
          ▼
AERA application/API layer
  ├── Auth & user context
  ├── Profile/body service
  ├── Training service
  ├── Nutrition service
  ├── Progress service
  ├── Coach orchestration
  └── Health safety service
          │
          ├── Supabase Postgres
          ├── Supabase private storage
          └── AI provider abstraction
```

## Core principle

Structured, deterministic services own the user's state and calculations. AI reads relevant structured context and produces explanations, plans within allowed rules, and conversational guidance.
