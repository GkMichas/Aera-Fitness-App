begin;

create extension if not exists pgcrypto;

create type public.sex as enum ('male', 'female', 'other', 'prefer_not_to_say');
create type public.goal_kind as enum ('lose_fat', 'build_muscle', 'get_stronger', 'improve_fitness', 'maintain_weight', 'body_recomposition');
create type public.photo_view as enum ('front', 'side', 'back');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null default '',
  birth_date date,
  sex public.sex,
  height_cm numeric(5,2) check (height_cm between 80 and 260),
  current_weight_kg numeric(5,2) check (current_weight_kg between 25 and 400),
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  primary_goal public.goal_kind not null,
  secondary_goals public.goal_kind[] not null default '{}',
  target_weight_kg numeric(5,2) check (target_weight_kg between 25 and 400),
  target_date date,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index one_active_goal_per_user on public.goals(user_id) where is_active;

create table public.body_measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  measured_at timestamptz not null default now(),
  weight_kg numeric(5,2) check (weight_kg between 25 and 400),
  waist_cm numeric(5,2) check (waist_cm between 30 and 300),
  neck_cm numeric(5,2) check (neck_cm between 15 and 100),
  chest_cm numeric(5,2) check (chest_cm between 30 and 300),
  arm_cm numeric(5,2) check (arm_cm between 10 and 100),
  thigh_cm numeric(5,2) check (thigh_cm between 20 and 150),
  calf_cm numeric(5,2) check (calf_cm between 10 and 100),
  created_at timestamptz not null default now()
);

create index body_measurements_user_date on public.body_measurements(user_id, measured_at desc);

create table public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null unique,
  view public.photo_view not null,
  captured_on date not null default current_date,
  created_at timestamptz not null default now()
);

create table public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  activity_level text,
  training_locations text[] not null default '{}',
  equipment text[] not null default '{}',
  training_days_per_week smallint check (training_days_per_week between 1 and 7),
  session_duration_minutes smallint check (session_duration_minutes between 10 and 180),
  meals_per_day smallint check (meals_per_day between 1 and 10),
  dietary_preferences text[] not null default '{}',
  foods_avoided text[] not null default '{}',
  allergies text[] not null default '{}',
  motivation text,
  updated_at timestamptz not null default now()
);

create table public.onboarding_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_step smallint not null default 1 check (current_step between 1 and 10),
  completed_steps smallint[] not null default '{}',
  draft jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.daily_check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  check_in_date date not null default current_date,
  energy smallint check (energy between 1 and 10),
  sleep_quality smallint check (sleep_quality between 1 and 10),
  stress smallint check (stress between 1 and 10),
  soreness smallint check (soreness between 1 and 10),
  mood text,
  weight_kg numeric(5,2) check (weight_kg between 25 and 400),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, check_in_date)
);

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger goals_set_updated_at before update on public.goals for each row execute function public.set_updated_at();
create trigger preferences_set_updated_at before update on public.user_preferences for each row execute function public.set_updated_at();
create trigger onboarding_set_updated_at before update on public.onboarding_progress for each row execute function public.set_updated_at();
create trigger check_ins_set_updated_at before update on public.daily_check_ins for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, first_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'first_name', ''));
  insert into public.onboarding_progress (user_id) values (new.id);
  insert into public.user_preferences (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.goals enable row level security;
alter table public.body_measurements enable row level security;
alter table public.progress_photos enable row level security;
alter table public.user_preferences enable row level security;
alter table public.onboarding_progress enable row level security;
alter table public.daily_check_ins enable row level security;

create policy profiles_own_all on public.profiles for all using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy goals_own_all on public.goals for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy measurements_own_all on public.body_measurements for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy photos_own_all on public.progress_photos for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy preferences_own_all on public.user_preferences for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy onboarding_own_all on public.onboarding_progress for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy check_ins_own_all on public.daily_check_ins for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('progress-photos', 'progress-photos', false, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy progress_photos_storage_select on storage.objects for select to authenticated
using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy progress_photos_storage_insert on storage.objects for insert to authenticated
with check (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy progress_photos_storage_update on storage.objects for update to authenticated
using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy progress_photos_storage_delete on storage.objects for delete to authenticated
using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = (select auth.uid())::text);

commit;
