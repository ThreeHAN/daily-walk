create table public.walk_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  display_name text not null,
  profile jsonb not null default '{}'::jsonb check (jsonb_typeof(profile) = 'object'),
  habits jsonb not null default '[]'::jsonb check (jsonb_typeof(habits) = 'array'),
  progress jsonb not null default '{}'::jsonb check (jsonb_typeof(progress) = 'object'),
  xp bigint not null default 0 check (xp >= 0),
  lifetime_xp bigint not null default 0 check (lifetime_xp >= 0),
  state_version integer not null default 3 check (state_version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id)
);

create table public.walk_daily_activity (
  profile_id uuid not null,
  owner_id uuid not null default auth.uid(),
  activity_date date not null,
  habit_checks jsonb not null default '{}'::jsonb check (jsonb_typeof(habit_checks) = 'object'),
  completed boolean not null default false,
  water_count smallint check (water_count between 0 and 8),
  journal text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (profile_id, activity_date),
  foreign key (profile_id, owner_id)
    references public.walk_profiles (id, owner_id) on delete cascade
);

alter table public.walk_profiles enable row level security;
alter table public.walk_daily_activity enable row level security;

create policy "Owners manage their profiles" on public.walk_profiles
  for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Owners manage their daily activity" on public.walk_daily_activity
  for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

revoke all on public.walk_profiles, public.walk_daily_activity from public, anon;
grant select, insert, update, delete on public.walk_profiles, public.walk_daily_activity to authenticated;

create function public.walk_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := clock_timestamp();
  return new;
end;
$$;

create trigger walk_profiles_updated_at before update on public.walk_profiles
  for each row execute function public.walk_set_updated_at();
create trigger walk_daily_activity_updated_at before update on public.walk_daily_activity
  for each row execute function public.walk_set_updated_at();
