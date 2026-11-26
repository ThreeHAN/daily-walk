const linkPrefix = "dailywalk_admin_max:profile-link:v1:";

function linkKey(userId, profileId) {
  return linkPrefix + encodeURIComponent(userId) + ":" + encodeURIComponent(profileId);
}

function newProfileId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function activityFor(state) {
  const checks = state.checks || {};
  const days = state.days || {};
  const journal = state.jr || {};
  const water = { ...(state.waterHistory || {}) };
  if (state.water?.d && !(state.water.d in water)) water[state.water.d] = state.water.n;
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

async function rpc(client, session, name, args) {
  const { data, error } = await client.rpc(name, args)
    .setHeader("Authorization", `Bearer ${session.access_token}`);
  if (error) throw error;
  return data;
}

export async function linkProfile(client, session, getLocalProfile) {
  const { id, state } = getLocalProfile();
  const key = linkKey(session.user.id, id);
  const raw = localStorage.getItem(key);
  let link = raw === null ? null : JSON.parse(raw);
  if (link && (typeof link.id !== "string" || !["pending", "linked"].includes(link.status))) {
    throw new Error("Saved profile link is invalid");
  }
  if (link?.status === "linked") return state.p.name || "Current profile";
  if (!link) {
    link = { id: newProfileId(), status: "pending" };
    localStorage.setItem(key, JSON.stringify(link));
  } else {
    const existing = await rpc(client, session, "read_walk_profile", { profile_id: link.id });
    if (existing) {
      localStorage.setItem(key, JSON.stringify({ ...link, status: "linked" }));
      return state.p.name || "Current profile";
    }
  }

  const saved = await rpc(client, session, "save_walk_profile_checked", {
    profile_id: link.id,
    expected_modified_at: 0,
    modified_at: Math.max(1, Date.now()),
    state,
    activity: activityFor(state),
  });
  if (!saved) {
    const existing = await rpc(client, session, "read_walk_profile", { profile_id: link.id });
    if (!existing) throw new Error("Profile could not be linked");
  }
  localStorage.setItem(key, JSON.stringify({ ...link, status: "linked" }));
  return state.p.name || "Current profile";
}
