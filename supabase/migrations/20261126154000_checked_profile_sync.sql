create function public.save_walk_profile_checked(
  profile_id uuid,
  expected_modified_at bigint,
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
  if expected_modified_at is null or expected_modified_at < 0
     or modified_at is null or modified_at <= expected_modified_at
     or jsonb_typeof(state) is distinct from 'object'
     or jsonb_typeof(state->'p') is distinct from 'object'
     or jsonb_typeof(state->'tasks') is distinct from 'array'
     or jsonb_typeof(activity) is distinct from 'array' then
    raise exception 'Invalid profile data';
  end if;

  insert into public.walk_profiles as p (
    id, owner_id, display_name, profile, habits, progress,
    xp, lifetime_xp, state_version, client_modified_at
  )
  select profile_id, owner, coalesce(nullif(state->'p'->>'name', ''), 'Player'),
    state->'p', state->'tasks',
    state - 'p' - 'tasks' - 'checks' - 'days' - 'jr' - 'waterHistory',
    (state->>'xp')::bigint, (state->>'life')::bigint,
    (state->>'v')::integer, modified_at
  where expected_modified_at = 0 or exists (
    select 1 from public.walk_profiles existing
    where existing.id = profile_id and existing.owner_id = owner
      and existing.client_modified_at = expected_modified_at
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
  where p.owner_id = owner and p.client_modified_at = expected_modified_at
  returning id into saved_id;

  if saved_id is null then
    return false;
  end if;

  delete from public.walk_daily_activity a where a.profile_id = saved_id;
  insert into public.walk_daily_activity (
    profile_id, owner_id, activity_date, habit_checks,
    completed, water_count, journal
  )
  select saved_id, owner, (entry->>'date')::date,
    coalesce(entry->'checks', '{}'::jsonb),
    coalesce((entry->>'completed')::boolean, false),
    (entry->>'water')::smallint, entry->>'journal'
  from jsonb_array_elements(activity) as entry;
  return true;
end;
$$;

create function public.read_walk_profile(profile_id uuid)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'profile', to_jsonb(p),
    'activity', coalesce((
      select jsonb_agg(to_jsonb(a) order by a.activity_date)
      from public.walk_daily_activity a where a.profile_id = p.id
    ), '[]'::jsonb)
  )
  from public.walk_profiles p where p.id = profile_id;
$$;

revoke all on function public.save_walk_profile_checked(uuid, bigint, bigint, jsonb, jsonb) from public, anon;
grant execute on function public.save_walk_profile_checked(uuid, bigint, bigint, jsonb, jsonb) to authenticated;
revoke all on function public.read_walk_profile(uuid) from public, anon;
grant execute on function public.read_walk_profile(uuid) to authenticated;
