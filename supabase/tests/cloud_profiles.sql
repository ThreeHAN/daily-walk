begin;

insert into auth.users (id) values
  ('00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002');

do $$
begin
  if has_table_privilege('anon', 'public.walk_profiles', 'select')
     or has_table_privilege('anon', 'public.walk_daily_activity', 'select')
     or has_table_privilege('anon', 'public.walk_profiles', 'insert')
     or has_table_privilege('anon', 'public.walk_daily_activity', 'insert') then
    raise exception 'Anonymous users can access cloud data';
  end if;
end;
$$;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);

insert into public.walk_profiles (id, display_name, xp, lifetime_xp)
values ('10000000-0000-0000-0000-000000000001', 'First player', 100, 120);

insert into public.walk_profiles (id, display_name)
values ('10000000-0000-0000-0000-000000000003', 'Another profile');

insert into public.walk_daily_activity (profile_id, activity_date, habit_checks, water_count, journal)
values
  ('10000000-0000-0000-0000-000000000001', '2020-01-01', '{"wake": true}', 2, 'First entry'),
  ('10000000-0000-0000-0000-000000000001', '2026-01-01', '{"water": true}', 8, 'Later entry');

do $$
declare
  previous_update timestamptz;
  next_update timestamptz;
begin
  if (select count(*) from public.walk_profiles) <> 2 then
    raise exception 'An account could not create multiple profiles';
  end if;
  if (select count(*) from public.walk_daily_activity) <> 2 then
    raise exception 'Daily activity across years was not saved';
  end if;
  select updated_at into previous_update from public.walk_profiles
    where id = '10000000-0000-0000-0000-000000000001';
  perform pg_sleep(0.01);
  update public.walk_profiles set xp = 110
    where id = '10000000-0000-0000-0000-000000000001';
  select updated_at into next_update from public.walk_profiles
    where id = '10000000-0000-0000-0000-000000000001';
  if next_update <= previous_update then
    raise exception 'Profile updated_at did not advance';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);

do $$
begin
  if exists (select 1 from public.walk_profiles)
     or exists (select 1 from public.walk_daily_activity) then
    raise exception 'Another user can read private data';
  end if;
  update public.walk_profiles set display_name = 'Unauthorized'
    where id = '10000000-0000-0000-0000-000000000001';
  if found then
    raise exception 'Another user can update a profile';
  end if;
  delete from public.walk_daily_activity
    where profile_id = '10000000-0000-0000-0000-000000000001';
  if found then
    raise exception 'Another user can delete daily activity';
  end if;
  begin
    insert into public.walk_profiles (owner_id, display_name)
    values ('00000000-0000-0000-0000-000000000001', 'Impersonation');
    raise exception 'Another user can create a profile as the owner';
  exception when insufficient_privilege then
    null;
  end;
  begin
    insert into public.walk_daily_activity (profile_id, owner_id, activity_date)
    values ('10000000-0000-0000-0000-000000000001',
            '00000000-0000-0000-0000-000000000001', '2027-01-01');
    raise exception 'Another user can insert activity as the owner';
  exception when insufficient_privilege then
    null;
  end;
  begin
    insert into public.walk_daily_activity (profile_id, activity_date)
    values ('10000000-0000-0000-0000-000000000001', '2027-01-01');
    raise exception 'Another user can attach activity to a foreign profile';
  exception when foreign_key_violation then
    null;
  end;
end;
$$;

insert into public.walk_profiles (id, display_name)
values ('10000000-0000-0000-0000-000000000002', 'Second player');

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
delete from public.walk_profiles where id = '10000000-0000-0000-0000-000000000001';
do $$
begin
  if exists (select 1 from public.walk_daily_activity) then
    raise exception 'Deleting a profile did not delete its activity';
  end if;
end;
$$;

rollback;
