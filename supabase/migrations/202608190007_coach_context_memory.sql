begin;

create type public.coach_intent as enum ('training', 'nutrition', 'progress', 'recovery', 'general', 'health_safety');
create type public.coach_message_role as enum ('user', 'assistant', 'system');
create type public.coach_memory_status as enum ('active', 'superseded', 'deleted');

create table public.coach_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  last_intent public.coach_intent,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.coach_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.coach_conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.coach_message_role not null,
  content text not null check (char_length(content) between 1 and 12000),
  intent public.coach_intent,
  provider text,
  action_cards jsonb not null default '[]'::jsonb check (jsonb_typeof(action_cards) = 'array'),
  context_manifest jsonb not null default '[]'::jsonb check (jsonb_typeof(context_manifest) = 'array'),
  created_at timestamptz not null default now()
);

create table public.coach_memory_facts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  scope public.coach_intent not null check (scope <> 'health_safety'),
  fact_key text not null check (char_length(fact_key) between 1 and 80),
  summary text not null check (char_length(summary) between 1 and 500),
  source_table text not null,
  source_record_id text,
  status public.coach_memory_status not null default 'active',
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, scope, fact_key)
);

create index coach_conversations_user_date on public.coach_conversations (user_id, last_message_at desc);
create index coach_messages_conversation_date on public.coach_messages (conversation_id, created_at);
create index coach_memory_user_scope on public.coach_memory_facts (user_id, scope, status, updated_at desc);

create trigger coach_conversations_set_updated_at before update on public.coach_conversations for each row execute function public.set_updated_at();
create trigger coach_memory_set_updated_at before update on public.coach_memory_facts for each row execute function public.set_updated_at();

create or replace function public.sync_coach_memory_from_preferences()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  delete from public.coach_memory_facts
  where user_id = new.user_id and source_table = 'user_preferences'
    and fact_key in ('preferred_session_duration', 'dietary_preferences', 'motivation');

  if new.session_duration_minutes is not null then
    insert into public.coach_memory_facts (user_id, scope, fact_key, summary, source_table, source_record_id)
    values (new.user_id, 'training', 'preferred_session_duration',
      pg_catalog.concat('Prefers training sessions around ', new.session_duration_minutes, ' minutes.'),
      'user_preferences', new.user_id::text);
  end if;

  if pg_catalog.array_length(new.dietary_preferences, 1) > 0 then
    insert into public.coach_memory_facts (user_id, scope, fact_key, summary, source_table, source_record_id)
    values (new.user_id, 'nutrition', 'dietary_preferences',
      pg_catalog.concat('Dietary preferences: ', pg_catalog.array_to_string(new.dietary_preferences, ', '), '.'),
      'user_preferences', new.user_id::text);
  end if;

  if new.motivation is not null and pg_catalog.length(pg_catalog.btrim(new.motivation)) > 0 then
    insert into public.coach_memory_facts (user_id, scope, fact_key, summary, source_table, source_record_id)
    values (new.user_id, 'general', 'motivation',
      pg_catalog.concat('Stated motivation: ', pg_catalog.left(pg_catalog.btrim(new.motivation), 420)),
      'user_preferences', new.user_id::text);
  end if;

  return new;
end;
$$;

create trigger user_preferences_sync_coach_memory
after insert or update of session_duration_minutes, dietary_preferences, motivation on public.user_preferences
for each row execute function public.sync_coach_memory_from_preferences();

alter table public.coach_conversations enable row level security;
alter table public.coach_messages enable row level security;
alter table public.coach_memory_facts enable row level security;

create policy coach_conversations_own_all on public.coach_conversations for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy coach_messages_own_all on public.coach_messages for all to authenticated
using ((select auth.uid()) = user_id and exists (
  select 1 from public.coach_conversations conversation
  where conversation.id = conversation_id and conversation.user_id = (select auth.uid())
))
with check ((select auth.uid()) = user_id and exists (
  select 1 from public.coach_conversations conversation
  where conversation.id = conversation_id and conversation.user_id = (select auth.uid())
));

create policy coach_memory_own_read on public.coach_memory_facts for select to authenticated
using ((select auth.uid()) = user_id);

create policy coach_memory_own_delete on public.coach_memory_facts for delete to authenticated
using ((select auth.uid()) = user_id);

insert into public.coach_memory_facts (user_id, scope, fact_key, summary, source_table, source_record_id)
select user_id, 'training', 'preferred_session_duration',
  pg_catalog.concat('Prefers training sessions around ', session_duration_minutes, ' minutes.'),
  'user_preferences', user_id::text
from public.user_preferences where session_duration_minutes is not null
on conflict (user_id, scope, fact_key) do update set summary = excluded.summary, updated_at = now();

insert into public.coach_memory_facts (user_id, scope, fact_key, summary, source_table, source_record_id)
select user_id, 'nutrition', 'dietary_preferences',
  pg_catalog.concat('Dietary preferences: ', pg_catalog.array_to_string(dietary_preferences, ', '), '.'),
  'user_preferences', user_id::text
from public.user_preferences where pg_catalog.array_length(dietary_preferences, 1) > 0
on conflict (user_id, scope, fact_key) do update set summary = excluded.summary, updated_at = now();

commit;
