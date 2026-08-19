begin;

create table public.training_source_catalogs (
  id text primary key,
  name text not null,
  schema_version smallint not null,
  language text not null,
  source_file text not null,
  imported_at timestamptz not null default now()
);

create table public.training_source_equipment (
  catalog_id text not null references public.training_source_catalogs(id) on delete cascade,
  source_id text not null,
  category text not null,
  name text not null,
  primary_use text,
  equipment_type text,
  space_requirement text,
  cost_tier text,
  user_level text,
  coverage text,
  primary key (catalog_id, source_id)
);

create table public.training_source_exercises (
  catalog_id text not null references public.training_source_catalogs(id) on delete cascade,
  canonical_source_id text not null,
  source_ids text[] not null,
  name text not null,
  equipment_ids text[] not null,
  equipment_categories text[] not null,
  movement_patterns text[] not null,
  primary_muscles text[] not null,
  secondary_muscles text[] not null,
  difficulty_labels text[] not null,
  is_unilateral boolean not null default false,
  additional_equipment text[] not null default '{}',
  source_notes text[] not null default '{}',
  curation_status text not null default 'metadata_only' check (curation_status in ('metadata_only', 'in_review', 'curated', 'rejected')),
  curated_exercise_id text references public.exercises(id),
  primary key (catalog_id, canonical_source_id)
);

create index training_source_exercises_name on public.training_source_exercises(catalog_id, name);
create index training_source_exercises_equipment on public.training_source_exercises using gin(equipment_ids);
create index training_source_exercises_patterns on public.training_source_exercises using gin(movement_patterns);

alter table public.training_source_catalogs enable row level security;
alter table public.training_source_equipment enable row level security;
alter table public.training_source_exercises enable row level security;

create policy training_source_catalogs_read on public.training_source_catalogs for select to authenticated using (true);
create policy training_source_equipment_read on public.training_source_equipment for select to authenticated using (true);
create policy training_source_exercises_read on public.training_source_exercises for select to authenticated using (true);

commit;
