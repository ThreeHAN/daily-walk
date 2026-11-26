begin;
insert into auth.users (id) values
  ('00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-000000000002');
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);

do $$
declare
  id uuid := '10000000-0000-0000-0000-000000000001';
  state jsonb := '{"v":3,"p":{"name":"Test"},"tasks":[],"xp":30,"life":30}';
begin
  if not public.save_walk_profile_checked(id, 0, 100, state,
      '[{"date":"2020-01-01","checks":{"wake":true},"water":4}]') then
    raise exception 'Initial save failed';
  end if;
  if not public.save_walk_profile_checked(id, 100, 200, state,
      '[{"date":"2021-01-01","checks":{}}]') then
    raise exception 'Matching save failed';
  end if;
  if public.save_walk_profile_checked(id, 100, 300, state, '[]') then
    raise exception 'Stale save was accepted';
  end if;
  if jsonb_array_length(public.read_walk_profile(id)->'activity') <> 1
      or public.read_walk_profile(id)->'activity'->0->>'activity_date' <> '2021-01-01' then
    raise exception 'Activity snapshot was not replaced';
  end if;
  begin
    perform public.save_walk_profile_checked(id, 200, 300, state,
      '[{"date":"2022-01-01","water":99}]');
    raise exception 'Invalid activity was accepted';
  exception when check_violation then null;
  end;
  if (public.read_walk_profile(id)->'profile'->>'client_modified_at')::bigint <> 200
      or jsonb_array_length(public.read_walk_profile(id)->'activity') <> 1 then
    raise exception 'Failed save did not roll back';
  end if;
end;
$$;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
do $$
begin
  if public.read_walk_profile('10000000-0000-0000-0000-000000000001') is not null then
    raise exception 'Another user could read a profile';
  end if;
  begin
    perform public.save_walk_profile_checked('10000000-0000-0000-0000-000000000001', 0, 300,
      '{"v":3,"p":{},"tasks":[],"xp":0,"life":0}', '[]');
    raise exception 'Another user could overwrite a profile';
  exception when insufficient_privilege or unique_violation then null;
  end;
end;
$$;
rollback;
