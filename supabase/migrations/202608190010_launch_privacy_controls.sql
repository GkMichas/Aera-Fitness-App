begin;

create table public.user_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  consent_kind text not null check (consent_kind in ('health_storage', 'product_analytics')),
  granted boolean not null default false,
  policy_version text not null default '2026-08-19',
  changed_at timestamptz not null default now(),
  unique (user_id, consent_kind)
);

alter table public.user_consents enable row level security;
create policy user_consents_own_all on public.user_consents for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_own_account() from public;
grant execute on function public.delete_own_account() to authenticated;

commit;
