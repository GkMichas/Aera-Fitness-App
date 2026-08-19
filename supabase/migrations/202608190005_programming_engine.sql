begin;

create table public.training_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  rules_version text not null,
  goal text not null check (goal in ('fat_loss', 'muscle_gain', 'strength', 'general_fitness', 'maintenance')),
  experience public.exercise_difficulty not null,
  days_per_week smallint not null check (days_per_week between 1 and 6),
  session_duration_minutes smallint not null check (session_duration_minutes in (15, 30, 45, 60)),
  equipment_ids text[] not null,
  excluded_caution_tags text[] not null default '{}',
  input_snapshot jsonb not null,
  rationale jsonb not null default '[]'::jsonb check (jsonb_typeof(rationale) = 'array'),
  status text not null default 'active' check (status in ('draft', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workouts
  add column training_plan_id uuid references public.training_plans(id) on delete set null,
  add column plan_day smallint check (plan_day between 1 and 7),
  add column focus text check (focus in ('full_body', 'upper', 'lower', 'push', 'pull'));

create index training_plans_user_date on public.training_plans(user_id, created_at desc);
create index workouts_training_plan on public.workouts(training_plan_id, plan_day);
create trigger training_plans_set_updated_at before update on public.training_plans for each row execute function public.set_updated_at();

alter table public.training_plans enable row level security;
create policy training_plans_own_all on public.training_plans for all
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

commit;
