import { activityFor, linkKey, linkProfile, profileFingerprint, rpc } from "./profile-link.js";

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

const gameplayFields = [
  "tasks", "customHabitGroups", "removedDefaultHabits", "removedDefaultHabitGroups", "water", "waterHistory", "xp", "life",
  "aw", "nb", "bs", "res", "pets", "peopleMet", "seenK", "tseen",
];
const missing = Symbol("missing");

function sameValue(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function mergeValue(before, device, cloud, result) {
  if (sameValue(device, cloud)) return device;
  if (sameValue(before, device)) return cloud;
  if (sameValue(before, cloud)) return device;
  if (before === missing && isObject(device) && isObject(cloud)) before = {};
  if (!isObject(before) || !isObject(device) || !isObject(cloud)) {
    result.backup = true;
    return device;
  }
  const entries = [];
  for (const key of new Set([...Object.keys(before), ...Object.keys(device), ...Object.keys(cloud)])) {
    const read = (object) => Object.hasOwn(object, key) ? object[key] : missing;
    const value = mergeValue(read(before), read(device), read(cloud), result);
    if (value !== missing) entries.push([key, value]);
  }
  return Object.fromEntries(entries);
}

function mergeHabitChecks(base, local, remote, tasks, result) {
  const states = [base, local, remote];
  for (const state of states) {
    if (!isObject(state.checks) || !isObject(state.days) ||
        (state.checkUpdatedAt !== undefined && !isObject(state.checkUpdatedAt))) {
      throw new Error("Habit sync data is invalid.");
    }
    for (const daily of Object.values(state.checks)) {
      if (!isObject(daily) || Object.values(daily).some((value) => typeof value !== "boolean")) {
        throw new Error("Habit sync data is invalid.");
      }
    }
    for (const daily of Object.values(state.checkUpdatedAt || {})) {
      if (!isObject(daily) || Object.values(daily).some((entry) => {
        const time = typeof entry === "number" ? entry : entry?.at;
        return !Number.isSafeInteger(time) || time <= 0 ||
          (typeof entry !== "number" && (!isObject(entry) || typeof entry.value !== "boolean"));
      })) {
        throw new Error("Habit sync timestamps are invalid.");
      }
    }
  }
  const checks = {};
  const stamps = {};
  const days = {};
  const dates = new Set(states.flatMap((state) => [
    ...Object.keys(state.checks), ...Object.keys(state.days), ...Object.keys(state.checkUpdatedAt || {}),
  ]));
  for (const date of dates) {
    const records = states.map((state) => ({
      checks: state.checks[date] || {},
      stamps: state.checkUpdatedAt?.[date] || {},
      day: Object.hasOwn(state.days, date) ? state.days[date] : missing,
    }));
    const [before, device, cloud] = records;
    const changed = (a, b) => !sameValue(a.checks, b.checks) || !sameValue(a.stamps, b.stamps);
    const ids = new Set(records.flatMap((record) => [...Object.keys(record.checks), ...Object.keys(record.stamps)]));
    const nextChecks = {};
    const nextStamps = {};
    for (const id of ids) {
      const read = (record) => ({
        value: Object.hasOwn(record.checks, id) ? record.checks[id] : missing,
        stamp: Object.hasOwn(record.stamps, id) ? record.stamps[id] : missing,
      });
      const [old, left, right] = records.map(read);
      const time = (record) => typeof record.stamp === "number" ? record.stamp : record.stamp?.at;
      const trusted = (record) => typeof record.stamp === "number" ||
        (isObject(record.stamp) && record.stamp.value === record.value);
      let selected;
      if (sameValue(left, right)) selected = left;
      else if (trusted(left) && trusted(right)) selected = time(left) >= time(right) ? left : right;
      else if (sameValue(old, right)) selected = left;
      else if (sameValue(old, left)) selected = right;
      else if (left.value === right.value) {
        selected = trusted(left) !== trusted(right) ? (trusted(left) ? left : right)
          : (time(left) || 0) >= (time(right) || 0) ? left : right;
      } else {
        selected = left;
        if (right.value !== missing) result.backup = true;
      }
      if (selected.value !== missing) nextChecks[id] = selected.value;
      if (selected.stamp !== missing) nextStamps[id] = selected.stamp;
    }
    if (records.some((record) => Object.keys(record.checks).length) || Object.keys(nextChecks).length) {
      checks[date] = nextChecks;
    } else if (states.some((state) => Object.hasOwn(state.checks, date))) {
      checks[date] = {};
    }
    if (Object.keys(nextStamps).length) stamps[date] = nextStamps;
    if (changed(before, device) || changed(before, cloud)) {
      days[date] = tasks.length > 0 && tasks.every((task) => nextChecks[task.id] === true);
    } else {
      const day = mergeValue(before.day, device.day, cloud.day, result);
      if (day !== missing) days[date] = day;
    }
  }
  return { checks, days, ...(states.some((state) => state.checkUpdatedAt !== undefined) ? { checkUpdatedAt: stamps } : {}) };
}

function mergeProfile(base, local, remote) {
  // Gameplay changes can share derived rewards even when their individual fields differ.
  const gameplay = (state) => Object.fromEntries(gameplayFields
    .filter((key) => Object.hasOwn(state, key)).map((key) => [key, state[key]]));
  const result = { backup: false };
  let cloud = remote;
  if (!sameValue(gameplay(base), gameplay(local)) && !sameValue(gameplay(base), gameplay(remote))) {
    result.backup = true;
    cloud = { ...remote };
    for (const key of gameplayFields) {
      if (Object.hasOwn(base, key)) cloud[key] = base[key];
      else delete cloud[key];
    }
  }
  const habitChanged = (state) => !sameValue(base.checks, state.checks) ||
    !sameValue(base.checkUpdatedAt, state.checkUpdatedAt);
  if ((!sameValue(base.tasks, local.tasks) && habitChanged(remote)) ||
      (!sameValue(base.tasks, remote.tasks) && habitChanged(local))) result.backup = true;
  const withoutHabits = ({ checks, days, checkUpdatedAt, ...rest }) => rest;
  const merged = mergeValue(withoutHabits(base), withoutHabits(local), withoutHabits(cloud), result);
  const habits = mergeHabitChecks(base, local, remote, merged.tasks, result);
  return { state: { ...merged, ...habits }, backup: result.backup };
}

function readLink(session, profile) {
  const key = linkKey(session.user.id, profile.id);
  const raw = localStorage.getItem(key);
  const link = raw === null ? null : JSON.parse(raw);
  if (!link || link.status !== "linked" || typeof link.id !== "string") {
    throw new Error("The current profile is not linked to this account.");
  }
  if ((link.baseRevision !== undefined || link.baseFingerprint !== undefined)
      && (!Number.isSafeInteger(link.baseRevision) || link.baseRevision < 0
        || typeof link.baseFingerprint !== "string")) {
    throw new Error("Saved sync metadata is invalid.");
  }
  let baseFingerprint;
  if (link.baseFingerprint !== undefined) {
    const baseline = JSON.parse(link.baseFingerprint);
    if (!isObject(baseline)) throw new Error("Saved sync metadata is invalid.");
    baseFingerprint = profileFingerprint(baseline);
  }
  return { key, link, baseFingerprint };
}

function cloudState(snapshot) {
  const { profile, activity } = snapshot;
  if (!isObject(profile) || !isObject(profile.progress) || !isObject(profile.profile)
      || !Array.isArray(profile.habits) || !Array.isArray(activity)
      || !Number.isSafeInteger(profile.client_modified_at) || profile.client_modified_at < 0
      || !Number.isSafeInteger(profile.xp) || profile.xp < 0
      || !Number.isSafeInteger(profile.lifetime_xp) || profile.lifetime_xp < 0
      || !Number.isSafeInteger(profile.state_version) || profile.state_version <= 0) {
    throw new Error("Cloud profile data is invalid.");
  }
  const stored = profile.progress._dailyWalkSyncSnapshot;
  if (Object.hasOwn(profile.progress, "_dailyWalkSyncSnapshot")) {
    if (!isObject(stored) || !isObject(stored.p) || !Array.isArray(stored.tasks)
        || !isObject(stored.checks) || !isObject(stored.days)
        || !isObject(stored.jr) || !isObject(stored.waterHistory)
        || !Number.isSafeInteger(stored.xp) || stored.xp < 0
        || !Number.isSafeInteger(stored.life) || stored.life < 0
        || !Number.isSafeInteger(stored.v) || stored.v <= 0) {
      throw new Error("Cloud profile snapshot is invalid.");
    }
    return stored;
  }
  const state = {
    ...profile.progress,
    p: profile.profile,
    tasks: profile.habits,
    xp: profile.xp,
    life: profile.lifetime_xp,
    v: profile.state_version,
    checks: {}, days: {}, jr: {}, waterHistory: {},
  };
  for (const entry of activity) {
    if (!isObject(entry) || !/^\d{4}-\d{2}-\d{2}$/.test(entry.activity_date)
        || !isObject(entry.habit_checks) || typeof entry.completed !== "boolean"
        || (entry.water_count !== null && (!Number.isInteger(entry.water_count) || entry.water_count < 0 || entry.water_count > 8))
        || (entry.journal !== null && typeof entry.journal !== "string")) {
      throw new Error("Cloud activity is invalid.");
    }
    state.checks[entry.activity_date] = entry.habit_checks;
    state.days[entry.activity_date] = entry.completed;
    if (entry.water_count !== null) state.waterHistory[entry.activity_date] = entry.water_count;
    if (entry.journal !== null) state.jr[entry.activity_date] = entry.journal;
  }
  return state;
}

export async function readCloud(client, session, id) {
  const snapshot = await rpc(client, session, "read_walk_profile", { profile_id: id });
  if (!snapshot || snapshot.profile?.id !== id || snapshot.profile?.owner_id !== session.user.id) {
    throw new Error("Linked cloud profile is missing or invalid.");
  }
  return { revision: snapshot.profile.client_modified_at, state: cloudState(snapshot) };
}

export async function listCloudProfiles(client, session) {
  const profiles = [];
  for (let offset = 0; ; offset += 1000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    let response;
    try {
      response = await client.from("walk_profiles")
        .select("id,display_name").order("id").range(offset, offset + 999)
        .setHeader("Authorization", `Bearer ${session.access_token}`)
        .abortSignal(controller.signal);
    } finally {
      clearTimeout(timer);
    }
    const { data, error } = response;
    if (error) throw error;
    if (!Array.isArray(data) || data.some((profile) => typeof profile.id !== "string" ||
        typeof profile.display_name !== "string")) throw new Error("Invalid cloud profile list.");
    profiles.push(...data);
    if (data.length < 1000) return profiles;
  }
}

export async function connectCloudProfile(client, session, getLocalProfile, replaceLocalProfile, id, sessionIsCurrent) {
  const profile = getLocalProfile();
  const remote = await readCloud(client, session, id);
  if (!sessionIsCurrent()) throw new Error("The signed-in account changed during sync.");
  const current = getLocalProfile();
  if (current.id !== profile.id || profileFingerprint(current.state) !== profileFingerprint(profile.state)) {
    throw new Error("The local profile changed during sync.");
  }
  const key = linkKey(session.user.id, profile.id);
  const raw = localStorage.getItem(key);
  const existing = raw === null ? null : JSON.parse(raw);
  if (existing?.status === "linked" && existing.id === id) return;
  localStorage.setItem(key, JSON.stringify({ id, status: "linked" }));
  let updated;
  try {
    updated = profileFingerprint(profile.state) === profileFingerprint(remote.state)
      ? profile.state : replaceLocalProfile(profile, remote.state, { backup: true });
  } catch (error) {
    try {
      const current = getLocalProfile();
      if (current.id === profile.id &&
          profileFingerprint(current.state) === profileFingerprint(profile.state)) {
        if (raw === null) localStorage.removeItem(key);
        else localStorage.setItem(key, raw);
      }
    } catch (rollbackError) {
      console.error("Could not restore the previous cloud link", rollbackError);
    }
    throw error;
  }
  localStorage.setItem(key, JSON.stringify({
    id, status: "linked", baseRevision: remote.revision,
    baseFingerprint: profileFingerprint(updated),
  }));
}

async function saveCloud(client, session, link, local, revision) {
  const modifiedAt = Math.max(Date.now(), revision + 1);
  if (!Number.isSafeInteger(modifiedAt)) throw new Error("Cloud version is invalid.");
  const saved = await rpc(client, session, "save_walk_profile_checked", {
    profile_id: link.id,
    expected_modified_at: revision,
    modified_at: modifiedAt,
    state: { ...local.state, _dailyWalkSyncSnapshot: local.state },
    activity: activityFor(local.state),
  });
  if (saved !== true && saved !== false) throw new Error("Invalid cloud save response.");
  return saved ? modifiedAt : null;
}

export async function syncProfile(client, session, getLocalProfile, replaceLocalProfile, backupCloudProfile, sessionIsCurrent, attempt = 0) {
  function requireSession() {
    if (!sessionIsCurrent()) throw new Error("The signed-in account changed during sync.");
  }
  requireSession();
  const local = getLocalProfile();
  const raw = localStorage.getItem(linkKey(session.user.id, local.id));
  const existing = raw === null ? null : JSON.parse(raw);
  if (!existing || existing.status === "pending") {
    await linkProfile(client, session, () => local);
    requireSession();
    const current = getLocalProfile();
    if (current.id !== local.id || profileFingerprint(current.state) !== profileFingerprint(local.state)) {
      throw new Error("The local profile changed during sync.");
    }
  }
  const { key, link, baseFingerprint } = readLink(session, local);
  const remote = await readCloud(client, session, link.id);
  requireSession();
  if (localStorage.getItem(key) !== JSON.stringify(link)) {
    throw new Error("The profile link changed during sync.");
  }
  const localFingerprint = profileFingerprint(local.state);
  const remoteFingerprint = profileFingerprint(remote.state);
  const localChanged = localFingerprint !== baseFingerprint;
  const remoteChanged = remote.revision !== link.baseRevision && remoteFingerprint !== baseFingerprint;
  if (remote.revision !== link.baseRevision && localChanged && remoteFingerprint === localFingerprint) {
    localStorage.setItem(key, JSON.stringify({ ...link, baseRevision: remote.revision, baseFingerprint: localFingerprint }));
    return { message: "Profile is up to date." };
  }
  let upload = local;
  let uploadFingerprint = localFingerprint;
  if ((localChanged && remoteChanged) || link.baseRevision == null) {
    const base = baseFingerprint === undefined ? { checks: {}, days: {} } : JSON.parse(baseFingerprint);
    const merged = mergeProfile(base, JSON.parse(localFingerprint), JSON.parse(remoteFingerprint));
    if (merged.backup) backupCloudProfile(local, remote.state);
    if (profileFingerprint(merged.state) !== localFingerprint) {
      for (const key of ["lastSaved", "lastSeen"]) {
        if (Object.hasOwn(local.state, key)) merged.state[key] = local.state[key];
      }
      const updated = replaceLocalProfile(local, merged.state, { backup: false });
      upload = { ...local, state: updated };
      uploadFingerprint = profileFingerprint(updated);
    }
  }
  if (localChanged || link.baseRevision == null) {
    const current = getLocalProfile();
    if (current.id !== local.id || profileFingerprint(current.state) !== uploadFingerprint) {
      throw new Error("The local profile changed during sync.");
    }
    const revision = await saveCloud(client, session, link, upload, remote.revision);
    requireSession();
    if (localStorage.getItem(key) !== JSON.stringify(link)) {
      throw new Error("The profile link changed during sync.");
    }
    if (revision === null) {
      if (attempt < 2) {
        return syncProfile(client, session, getLocalProfile, replaceLocalProfile, backupCloudProfile, sessionIsCurrent, attempt + 1);
      }
      throw new Error("Cloud profile changed repeatedly during sync. Retry.");
    }
    localStorage.setItem(key, JSON.stringify({ ...link, baseRevision: revision, baseFingerprint: uploadFingerprint }));
    const afterSave = getLocalProfile();
    if (afterSave.id !== local.id || profileFingerprint(afterSave.state) !== uploadFingerprint) {
      return { message: "Profile uploaded, but newer local changes still need syncing." };
    }
    return { message: upload === local ? "Profile uploaded." : "Profile changes merged and synced." };
  }
  if (remoteChanged) {
    const updated = replaceLocalProfile(local, remote.state, { backup: false });
    localStorage.setItem(key, JSON.stringify({
      ...link, baseRevision: remote.revision, baseFingerprint: profileFingerprint(updated),
    }));
    return { message: "Profile downloaded." };
  }
  if (remote.revision !== link.baseRevision) {
    localStorage.setItem(key, JSON.stringify({ ...link, baseRevision: remote.revision, baseFingerprint: localFingerprint }));
  }
  return { message: "Profile is up to date." };
}
