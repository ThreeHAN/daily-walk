begin;

insert into auth.users (id) values
  ('00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002');

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);

do $$
declare
  test_profile_id uuid := '10000000-0000-0000-0000-000000000001';
  state jsonb := '{"v":3,"p":{"name":"Test"},"tasks":[],"xp":30,"life":30}';
  activity jsonb := '[{"date":"2020-01-01","checks":{"wake":true},"completed":true,"water":4,"journal":"Test entry"},{"date":"2026-01-01","checks":{},"completed":false,"water":0}]';
begin
  if not public.save_walk_profile(test_profile_id, 200, state, activity) then
    raise exception 'Initial sync failed';
  end if;
  if (select count(*) from public.walk_daily_activity where profile_id = test_profile_id) <> 2 then
    raise exception 'Daily history was not saved';
  end if;
  if public.save_walk_profile(test_profile_id, 100, jsonb_set(state, '{xp}', '10'), '[]') then
    raise exception 'An older save overwrote a newer one';
  end if;
  if (select xp from public.walk_profiles where id = test_profile_id) <> 30 then
    raise exception 'Older save changed the profile';
  end if;
  begin
    perform public.save_walk_profile(test_profile_id, 300, jsonb_set(state, '{xp}', '40'),
      '[{"date":"2026-01-02","checks":{},"water":99}]');
    raise exception 'Invalid daily activity was accepted';
  exception when check_violation then
    null;
  end;
  if (select xp from public.walk_profiles where id = test_profile_id) <> 30 then
    raise exception 'Failed daily save was not rolled back';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
do $$
begin
  begin
    perform public.save_walk_profile(
      '10000000-0000-0000-0000-000000000001', 500,
      '{"v":3,"p":{"name":"Other"},"tasks":[],"xp":0,"life":0}', '[]');
    raise exception 'Another user could overwrite a profile';
  exception when insufficient_privilege or unique_violation then
    null;
  end;
end;
$$;

rollback;
