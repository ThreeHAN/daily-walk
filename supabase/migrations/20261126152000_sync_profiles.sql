alter table public.walk_profiles
  add column client_modified_at bigint not null default 0
    check (client_modified_at >= 0);

create function public.save_walk_profile(
  profile_id uuid,
  modified_at bigint,
  state jsonb,
  activity jsonb
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  owner uuid := auth.uid();
  saved_id uuid;
begin
  if owner is null then
    raise exception 'Authentication required';
  end if;
  if modified_at is null or modified_at <= 0
     or jsonb_typeof(state) is distinct from 'object'
     or jsonb_typeof(state->'p') is distinct from 'object'
     or jsonb_typeof(state->'tasks') is distinct from 'array'
     or jsonb_typeof(activity) is distinct from 'array' then
    raise exception 'Invalid profile data';
  end if;

  insert into public.walk_profiles as p (
    id, owner_id, display_name, profile, habits, progress,
    xp, lifetime_xp, state_version, client_modified_at
  ) values (
    profile_id, owner, coalesce(nullif(state->'p'->>'name', ''), 'Player'),
    state->'p', state->'tasks',
    state - 'p' - 'tasks' - 'checks' - 'days' - 'jr' - 'waterHistory',
    (state->>'xp')::bigint, (state->>'life')::bigint,
    (state->>'v')::integer, modified_at
  )
  on conflict (id) do update set
    display_name = excluded.display_name,
    profile = excluded.profile,
    habits = excluded.habits,
    progress = excluded.progress,
    xp = excluded.xp,
    lifetime_xp = excluded.lifetime_xp,
    state_version = excluded.state_version,
    client_modified_at = excluded.client_modified_at
  where p.owner_id = owner and p.client_modified_at < excluded.client_modified_at
  returning id into saved_id;

  if saved_id is null then
    return false;
  end if;

  insert into public.walk_daily_activity (
    profile_id, owner_id, activity_date, habit_checks,
    completed, water_count, journal
  )
  select saved_id, owner, (entry->>'date')::date,
    coalesce(entry->'checks', '{}'::jsonb),
    coalesce((entry->>'completed')::boolean, false),
    (entry->>'water')::smallint, entry->>'journal'
  from jsonb_array_elements(activity) as entry
  on conflict on constraint walk_daily_activity_pkey do update set
    habit_checks = excluded.habit_checks,
    completed = excluded.completed,
    water_count = excluded.water_count,
    journal = excluded.journal;

  return true;
end;
$$;

revoke all on function public.save_walk_profile(uuid, bigint, jsonb, jsonb) from public, anon;
grant execute on function public.save_walk_profile(uuid, bigint, jsonb, jsonb) to authenticated;
