import { activityFor, linkKey, linkProfile, profileFingerprint, rpc } from "./profile-link.js";

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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

export async function connectCloudProfile(client, session, getLocalProfile, id, sessionIsCurrent) {
  const profile = getLocalProfile();
  await readCloud(client, session, id);
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

export async function syncProfile(client, session, getLocalProfile, replaceLocalProfile, choice, conflict, sessionIsCurrent) {
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
  const localChanged = localFingerprint !== baseFingerprint;
  const remoteChanged = remote.revision !== link.baseRevision;
  if (!choice && remoteChanged && localChanged && profileFingerprint(remote.state) === localFingerprint) {
    localStorage.setItem(key, JSON.stringify({ ...link, baseRevision: remote.revision, baseFingerprint: localFingerprint }));
    return { message: "Profile is up to date." };
  }
  if (choice && (!conflict || conflict.profileId !== local.id || conflict.cloudId !== link.id
      || conflict.revision !== remote.revision || conflict.localFingerprint !== localFingerprint)) {
    return { conflict: { profileId: local.id, cloudId: link.id, revision: remote.revision, localFingerprint },
      conflictChanged: true };
  }
  if (!choice && (link.baseRevision == null || (localChanged && remoteChanged))) {
    return { conflict: { profileId: local.id, cloudId: link.id, revision: remote.revision, localFingerprint } };
  }
  if (choice === "local" || (!choice && localChanged)) {
    const current = getLocalProfile();
    if (current.id !== local.id || profileFingerprint(current.state) !== localFingerprint) {
      throw new Error("The local profile changed during sync.");
    }
    const revision = await saveCloud(client, session, link, local, remote.revision);
    requireSession();
    if (localStorage.getItem(key) !== JSON.stringify(link)) {
      throw new Error("The profile link changed during sync.");
    }
    if (revision === null) {
      const latest = await readCloud(client, session, link.id);
      requireSession();
      if (localStorage.getItem(key) !== JSON.stringify(link)) {
        throw new Error("The profile link changed during sync.");
      }
      return { conflict: { profileId: local.id, cloudId: link.id, revision: latest.revision, localFingerprint },
        conflictChanged: true };
    }
    localStorage.setItem(key, JSON.stringify({ ...link, baseRevision: revision, baseFingerprint: localFingerprint }));
    const afterSave = getLocalProfile();
    if (afterSave.id !== local.id || profileFingerprint(afterSave.state) !== localFingerprint) {
      return { message: "Profile uploaded, but newer local changes still need syncing." };
    }
    return { message: "Profile uploaded." };
  }
  if (choice === "cloud" || remoteChanged) {
    const updated = replaceLocalProfile(local, remote.state, { backup: choice === "cloud" });
    localStorage.setItem(key, JSON.stringify({
      ...link, baseRevision: remote.revision, baseFingerprint: profileFingerprint(updated),
    }));
    return { message: choice === "cloud"
      ? "Profile downloaded. The previous local profile was kept as a backup."
      : "Profile downloaded." };
  }
  return { message: "Profile is up to date." };
}
