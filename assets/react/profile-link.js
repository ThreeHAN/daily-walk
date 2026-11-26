const linkPrefix = "dailywalk_admin_max:profile-link:v1:";

export function linkKey(userId, profileId) {
  return linkPrefix + encodeURIComponent(userId) + ":" + encodeURIComponent(profileId);
}

export function newProfileId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function activityFor(state) {
  const checks = state.checks || {};
  const days = state.days || {};
  const journal = state.jr || {};
  const water = { ...(state.waterHistory || {}) };
  if (state.water?.d) water[state.water.d] = state.water.n;
  const dates = new Set([...Object.keys(checks), ...Object.keys(days),
    ...Object.keys(journal), ...Object.keys(water)]);
  return Array.from(dates, (date) => ({
    date,
    checks: checks[date] || {},
    completed: !!days[date],
    water: Object.hasOwn(water, date) ? water[date] : null,
    journal: Object.hasOwn(journal, date) ? journal[date] : null,
  }));
}

export async function rpc(client, session, name, args) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const { data, error } = await client.rpc(name, args)
      .setHeader("Authorization", `Bearer ${session.access_token}`)
      .abortSignal(controller.signal);
    if (error) throw error;
    return data;
  } finally {
    clearTimeout(timer);
  }
}

export function profileFingerprint(state) {
  const { lastSaved, lastSeen, ...content } = state;
  function ordered(value) {
    if (Array.isArray(value)) return value.map(ordered);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.keys(value).sort().map((key) => [key, ordered(value[key])]));
    }
    return value;
  }
  return JSON.stringify(ordered(content));
}

async function cloudProfileExists(client, session, profileId) {
  const result = await rpc(client, session, "read_walk_profile", { profile_id: profileId });
  if (result === null) return false;
  if (!result || result.profile?.id !== profileId) throw new Error("Invalid cloud profile response");
  return true;
}

export async function linkProfile(client, session, getLocalProfile) {
  const { id, state } = getLocalProfile();
  const key = linkKey(session.user.id, id);
  const raw = localStorage.getItem(key);
  let link = raw === null ? null : JSON.parse(raw);
  if (link && (typeof link.id !== "string" || !["pending", "linked"].includes(link.status))) {
    throw new Error("Saved profile link is invalid");
  }
  if (link?.status === "linked") {
    if (!await cloudProfileExists(client, session, link.id)) {
      throw new Error("Linked cloud profile is missing");
    }
    return state.p.name || "Current profile";
  }
  if (!link) {
    link = { id: newProfileId(), status: "pending" };
    localStorage.setItem(key, JSON.stringify(link));
  } else {
    if (await cloudProfileExists(client, session, link.id)) {
      localStorage.setItem(key, JSON.stringify({ ...link, status: "linked" }));
      return state.p.name || "Current profile";
    }
  }

  const modifiedAt = Math.max(1, Date.now());
  const saved = await rpc(client, session, "save_walk_profile_checked", {
    profile_id: link.id,
    expected_modified_at: 0,
    modified_at: modifiedAt,
    state,
    activity: activityFor(state),
  });
  if (saved === false) {
    if (!await cloudProfileExists(client, session, link.id)) throw new Error("Profile could not be linked");
  } else if (saved !== true) {
    throw new Error("Invalid cloud save response");
  }
  localStorage.setItem(key, JSON.stringify({
    ...link, status: "linked",
    ...(saved === true ? { baseRevision: modifiedAt, baseFingerprint: profileFingerprint(state) } : {}),
  }));
  return state.p.name || "Current profile";
}
