begin;

create type public.health_urgency as enum ('emergency', 'urgent', 'routine', 'incomplete');

create table public.health_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  intake_payload jsonb not null check (jsonb_typeof(intake_payload) = 'object'),
  urgency public.health_urgency not null,
  rules_version text not null,
  acknowledged_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.health_safety_audit (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  health_event_id uuid not null references public.health_events(id) on delete cascade,
  urgency public.health_urgency not null,
  matched_rule_ids text[] not null default '{}',
  rules_version text not null,
  created_at timestamptz not null default now()
);

create index health_events_user_date on public.health_events (user_id, created_at desc);
create index health_audit_user_date on public.health_safety_audit (user_id, created_at desc);

alter table public.health_events enable row level security;
alter table public.health_safety_audit enable row level security;

create policy health_events_own_select on public.health_events for select to authenticated using ((select auth.uid()) = user_id);
create policy health_events_own_insert on public.health_events for insert to authenticated with check ((select auth.uid()) = user_id);
create policy health_events_own_delete on public.health_events for delete to authenticated using ((select auth.uid()) = user_id);
create policy health_audit_own_select on public.health_safety_audit for select to authenticated using ((select auth.uid()) = user_id);
create policy health_audit_own_insert on public.health_safety_audit for insert to authenticated with check (
  (select auth.uid()) = user_id and exists (
    select 1 from public.health_events event where event.id = health_event_id and event.user_id = (select auth.uid())
  )
);

commit;
