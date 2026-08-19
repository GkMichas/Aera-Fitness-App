begin;

alter table public.daily_check_ins
  add column sleep_duration_minutes smallint check (sleep_duration_minutes between 0 and 1440);

create table public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  week_end date not null,
  rules_version text not null,
  input_snapshot jsonb not null check (jsonb_typeof(input_snapshot) = 'object'),
  metrics jsonb not null check (jsonb_typeof(metrics) = 'object'),
  title text not null,
  insight text not null,
  recommendation text not null,
  evidence jsonb not null default '[]'::jsonb check (jsonb_typeof(evidence) = 'array'),
  status text not null default 'generated' check (status in ('generated', 'accepted', 'superseded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start),
  check (week_end >= week_start)
);

create index weekly_reviews_user_week on public.weekly_reviews (user_id, week_start desc);
create trigger weekly_reviews_set_updated_at before update on public.weekly_reviews for each row execute function public.set_updated_at();

alter table public.weekly_reviews enable row level security;
create policy weekly_reviews_own_all on public.weekly_reviews for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

commit;
