create type public.meal_type as enum ('breakfast', 'lunch', 'dinner', 'snack');

create table public.foods (
  id text primary key,
  name text not null,
  aliases text[] not null default '{}',
  category text not null,
  calories_per_100g numeric(8,2) not null check (calories_per_100g >= 0),
  protein_g_per_100g numeric(8,2) not null check (protein_g_per_100g >= 0),
  carbs_g_per_100g numeric(8,2) not null check (carbs_g_per_100g >= 0),
  fat_g_per_100g numeric(8,2) not null check (fat_g_per_100g >= 0),
  allergens text[] not null default '{}',
  dietary_tags text[] not null default '{}',
  source text not null,
  source_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.food_servings (
  id text primary key,
  food_id text not null references public.foods(id) on delete cascade,
  label text not null,
  grams numeric(8,2) not null check (grams > 0),
  unique (food_id, label)
);

create table public.nutrition_targets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  calories integer not null check (calories > 0),
  protein_g numeric(8,2) not null check (protein_g >= 0),
  carbs_g numeric(8,2) not null check (carbs_g >= 0),
  fat_g numeric(8,2) not null check (fat_g >= 0),
  updated_at timestamptz not null default now()
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  prep_minutes integer not null default 0 check (prep_minutes >= 0),
  servings numeric(8,2) not null default 1 check (servings > 0),
  instructions jsonb not null default '[]'::jsonb,
  substitutions jsonb not null default '[]'::jsonb,
  media_id text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipe_items (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  food_id text not null references public.foods(id),
  grams numeric(8,2) not null check (grams > 0),
  position integer not null default 0
);

create table public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  meal_type public.meal_type not null,
  logged_at timestamptz not null default now(),
  source_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.meal_items (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals(id) on delete cascade,
  food_id text not null references public.foods(id),
  grams numeric(8,2) not null check (grams > 0),
  calories numeric(8,2) not null check (calories >= 0),
  protein_g numeric(8,2) not null check (protein_g >= 0),
  carbs_g numeric(8,2) not null check (carbs_g >= 0),
  fat_g numeric(8,2) not null check (fat_g >= 0)
);

create table public.meal_parse_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_text text not null,
  parsed_items jsonb not null default '[]'::jsonb,
  unparsed_items jsonb not null default '[]'::jsonb,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create index meals_user_logged_at_idx on public.meals (user_id, logged_at desc);
create index meal_items_meal_id_idx on public.meal_items (meal_id);
create index meal_parse_drafts_user_created_idx on public.meal_parse_drafts (user_id, created_at desc);
create index foods_name_idx on public.foods using gin (to_tsvector('english', name));

alter table public.foods enable row level security;
alter table public.food_servings enable row level security;
alter table public.nutrition_targets enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_items enable row level security;
alter table public.meals enable row level security;
alter table public.meal_items enable row level security;
alter table public.meal_parse_drafts enable row level security;

create policy "Authenticated users read foods" on public.foods for select to authenticated using (true);
create policy "Authenticated users read servings" on public.food_servings for select to authenticated using (true);
create policy "Users manage own nutrition target" on public.nutrition_targets for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users read public or own recipes" on public.recipes for select to authenticated using (is_public or auth.uid() = owner_id);
create policy "Users manage own recipes" on public.recipes for all to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "Users read accessible recipe items" on public.recipe_items for select to authenticated using (exists (select 1 from public.recipes where recipes.id = recipe_items.recipe_id and (recipes.is_public or recipes.owner_id = auth.uid())));
create policy "Users manage own recipe items" on public.recipe_items for all to authenticated using (exists (select 1 from public.recipes where recipes.id = recipe_items.recipe_id and recipes.owner_id = auth.uid())) with check (exists (select 1 from public.recipes where recipes.id = recipe_items.recipe_id and recipes.owner_id = auth.uid()));
create policy "Users manage own meals" on public.meals for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own meal items" on public.meal_items for all to authenticated using (exists (select 1 from public.meals where meals.id = meal_items.meal_id and meals.user_id = auth.uid())) with check (exists (select 1 from public.meals where meals.id = meal_items.meal_id and meals.user_id = auth.uid()));
create policy "Users manage own meal drafts" on public.meal_parse_drafts for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger foods_set_updated_at before update on public.foods for each row execute function public.set_updated_at();
create trigger nutrition_targets_set_updated_at before update on public.nutrition_targets for each row execute function public.set_updated_at();
create trigger recipes_set_updated_at before update on public.recipes for each row execute function public.set_updated_at();
create trigger meals_set_updated_at before update on public.meals for each row execute function public.set_updated_at();
