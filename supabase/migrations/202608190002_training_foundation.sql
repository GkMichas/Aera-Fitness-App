begin;

create type public.exercise_difficulty as enum ('beginner', 'intermediate', 'advanced');
create type public.exercise_relation_kind as enum ('alternative', 'regression', 'progression');
create type public.workout_status as enum ('draft', 'scheduled', 'active', 'completed', 'skipped');
create type public.exercise_set_status as enum ('pending', 'completed', 'skipped');

create table public.equipment (id text primary key, name text not null unique, category text not null, created_at timestamptz not null default now());
create table public.muscles (id text primary key, name text not null unique, region text not null, created_at timestamptz not null default now());
create table public.movement_patterns (id text primary key, name text not null unique, description text not null, created_at timestamptz not null default now());
create table public.exercises (
  id text primary key, slug text not null unique, name text not null, summary text not null,
  difficulty public.exercise_difficulty not null,
  movement_pattern_id text not null references public.movement_patterns(id), media_id text not null,
  instructions jsonb not null default '[]'::jsonb check (jsonb_typeof(instructions) = 'array'),
  coaching_cues jsonb not null default '[]'::jsonb check (jsonb_typeof(coaching_cues) = 'array'),
  caution_tags text[] not null default '{}', is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.exercise_equipment (
  exercise_id text not null references public.exercises(id) on delete cascade,
  equipment_id text not null references public.equipment(id), primary key (exercise_id, equipment_id)
);
create table public.exercise_muscles (
  exercise_id text not null references public.exercises(id) on delete cascade,
  muscle_id text not null references public.muscles(id), is_primary boolean not null default false,
  primary key (exercise_id, muscle_id)
);
create table public.exercise_relations (
  exercise_id text not null references public.exercises(id) on delete cascade,
  related_exercise_id text not null references public.exercises(id) on delete cascade,
  kind public.exercise_relation_kind not null, primary key (exercise_id, related_exercise_id, kind),
  check (exercise_id <> related_exercise_id)
);

create table public.workouts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  name text not null, difficulty public.exercise_difficulty not null,
  duration_minutes smallint not null check (duration_minutes between 5 and 300),
  status public.workout_status not null default 'draft', scheduled_for date,
  source text not null default 'manual' check (source in ('manual', 'template', 'aera_engine')),
  rationale text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index workouts_user_schedule on public.workouts(user_id, scheduled_for desc);
create table public.workout_exercises (
  id uuid primary key default gen_random_uuid(), workout_id uuid not null references public.workouts(id) on delete cascade,
  exercise_id text not null references public.exercises(id), position smallint not null check (position > 0),
  sets smallint not null check (sets between 1 and 20), reps smallint check (reps between 1 and 500),
  duration_seconds smallint check (duration_seconds between 1 and 3600),
  rest_seconds smallint not null default 60 check (rest_seconds between 0 and 1800),
  target_rir smallint check (target_rir between 0 and 10), load_kg numeric(7,2) check (load_kg >= 0),
  notes text, unique(workout_id, position), check (reps is not null or duration_seconds is not null)
);
create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  workout_id uuid not null references public.workouts(id) on delete restrict,
  status public.workout_status not null default 'active', started_at timestamptz not null default now(),
  completed_at timestamptz, perceived_effort smallint check (perceived_effort between 1 and 5),
  notes text, created_at timestamptz not null default now(), check (completed_at is null or completed_at >= started_at)
);
create index workout_sessions_user_date on public.workout_sessions(user_id, started_at desc);
create table public.exercise_sets (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  workout_exercise_id uuid not null references public.workout_exercises(id) on delete restrict,
  exercise_id text not null references public.exercises(id), set_number smallint not null check (set_number between 1 and 20),
  status public.exercise_set_status not null default 'pending', reps smallint check (reps between 0 and 500),
  duration_seconds smallint check (duration_seconds between 0 and 3600), load_kg numeric(7,2) check (load_kg >= 0),
  rir smallint check (rir between 0 and 10), completed_at timestamptz,
  unique(session_id, workout_exercise_id, set_number)
);
create table public.training_pain_events (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.workout_sessions(id) on delete cascade,
  exercise_id text references public.exercises(id), body_area text not null,
  severity smallint not null check (severity between 1 and 10), description text, created_at timestamptz not null default now()
);

create trigger exercises_set_updated_at before update on public.exercises for each row execute function public.set_updated_at();
create trigger workouts_set_updated_at before update on public.workouts for each row execute function public.set_updated_at();

alter table public.equipment enable row level security;
alter table public.muscles enable row level security;
alter table public.movement_patterns enable row level security;
alter table public.exercises enable row level security;
alter table public.exercise_equipment enable row level security;
alter table public.exercise_muscles enable row level security;
alter table public.exercise_relations enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.exercise_sets enable row level security;
alter table public.training_pain_events enable row level security;

create policy equipment_read on public.equipment for select to authenticated using (true);
create policy muscles_read on public.muscles for select to authenticated using (true);
create policy movement_patterns_read on public.movement_patterns for select to authenticated using (true);
create policy exercises_read on public.exercises for select to authenticated using (is_active);
create policy exercise_equipment_read on public.exercise_equipment for select to authenticated using (true);
create policy exercise_muscles_read on public.exercise_muscles for select to authenticated using (true);
create policy exercise_relations_read on public.exercise_relations for select to authenticated using (true);
create policy workouts_own_all on public.workouts for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy workout_exercises_own_all on public.workout_exercises for all
using (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = (select auth.uid())))
with check (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = (select auth.uid())));
create policy workout_sessions_own_all on public.workout_sessions for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy exercise_sets_own_all on public.exercise_sets for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy training_pain_events_own_all on public.training_pain_events for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

commit;
