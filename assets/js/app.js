let hideT,
  last = "",
  busy = false;
function hop() {
  const a = $("pal");
  a.classList.remove("hop");
  void a.getBoundingClientRect();
  a.classList.add("hop");
  setTimeout(() => a.classList.remove("hop"), 750);
}
function say(txt) {
  last = txt;
  const b = $("bubble");
  if (b.classList.contains("show")) b.textContent = lbl(txt);
  else $("dot").classList.add("on");
}
$("av").onclick = () => {
  hop();
  const b = $("bubble");
  if (b.classList.contains("show")) {
    b.classList.remove("show");
  } else {
    b.textContent = lbl(
      last ||
        "Hi! Check something off, then tap me to see how to do it for God.",
    );
    b.classList.add("show");
    $("dot").classList.remove("on");
  }
};
$("bubble").onclick = () => {
  $("bubble").classList.remove("show");
};
async function cheer(t, all) {
  const end = all
    ? "\n\n🎉 You finished everything today. “Well done, good and faithful servant” (Matthew 25:21)."
    : "";
  if (t.tip) {
    say(t.tip + end);
    return;
  }
  const fb =
    "You did “" +
    t.t +
    "”! Offer it to God in a quick prayer. Whatever you do, do it as for the Lord (Colossians 3:23)." +
    end;
  say(fb);
  if (busy) return;
  let sample = null;
  try {
    sample = await claude.use("sample");
  } catch (e) {}
  if (!sample) return;
  busy = true;
  try {
    const r = await sample(
      "You are a warm, encouraging Christian friend inside a habit app. The user just checked off this habit: “" +
        t.t +
        "”. In under 60 words, plain text, explain how they can do or use this habit for God: a short prayer or mindset plus one relevant Bible reference by citation only. Be gracious, not legalistic.",
      { cache: false },
    );
    if (r && r.text) say(r.text + end);
  } catch (e) {}
  busy = false;
}
const prevW = {};
let firstR = true;

function renderHabitGroups(d, c, effects) {
  return DailyWalkReact.renderHabitList({
    groups: G,
    tasks: S.tasks,
    checks: c,
    closedGroups: shut,
    effects,
    firstRender: firstR,
    previousWidths: prevW,
    icon: icoSvg,
    iconTextParts,
    defaultIcons: DEFIC,
    groupIcons: GIC,
    onCheck: (task, checked) => handleHabitCheck(task, checked, d),
    onToggle: (id) => {
      shut[id] = !shut[id];
      render({ openedGroupId: !shut[id] ? id : null });
    },
    onRemove: (task) => {
      S.tasks = S.tasks.filter((item) => item.id !== task.id);
      save();
      render();
      toast("Habit removed");
    },
  });
}

function renderHabitProgress(c) {
  const n = S.tasks.filter((t) => c[t.id]).length,
    tot = S.tasks.length;
  let st = 0,
    dt = new Date();
  if (!S.days[today()]) dt.setDate(dt.getDate() - 1);
  while (S.days[dkey(dt)]) {
    st++;
    dt.setDate(dt.getDate() - 1);
  }
  DailyWalkReact.renderProgressSummary({
    completed: n,
    total: tot,
    percent: tot ? (n / tot) * 100 : 0,
    streak: st,
    icon: icoSvg,
    iconTextParts,
  });
  const sbT = "🔥" + st;
  if ($("sb").textContent !== sbT) {
    $("sb").textContent = sbT;
    rerun($("sb"), "pulse");
  }
  curStreak = st;
  syncPetUnlocks(st);
}

function showHabitCompletionEffects(effects, fullEl) {
  const jx = document.querySelector("input.just");
  if (jx) {
    const r = jx.getBoundingClientRect();
    burst(r.left + 13, r.top + 13, 10, CONF);
  }
  if (effects.completedGroupId && fullEl) {
    const r = fullEl.getBoundingClientRect();
    burst(r.right - 50, r.top + 22, 18, CONF);
  }
  if (effects.allDone) burst(innerWidth / 2, 140, 36, CONF);
  if (effects.xpGain && jx) {
    const r = jx.getBoundingClientRect();
    floatXP(r.left + 34, r.top - 6, "+" + effects.xpGain + " XP");
  }
  if (effects.levelUp) levelUp(effects.levelUp);
  if (effects.newBuilding) {
    const nn = effects.newBuilding;
    setTimeout(
      () => toast("🏗️ Your help brought " + nn + " to town! Check the World tab."),
      1600,
    );
  }
}

function render(effects = {}) {
  const d = today();
  const c = S.checks[d] || {};
  tickClock();
  const fullEl = renderHabitGroups(d, c, effects);
  renderHabitProgress(c);
  showHabitCompletionEffects(effects, fullEl);
  drawHero();
  drawWeek();
  checkNbWin();
  firstR = false;
}
$("reset").onclick = () => {
  const day = today();
  const ids = new Set([...S.tasks.map((task) => task.id), ...Object.keys(S.checks[day] || {})]);
  if (!updateHabitChecks(day, Array.from(ids, (id) => [id, false]))) {
    render();
    return;
  }
  S.days[day] = false;
  save();
  render();
};
save();
paint();
DailyWalkReact.renderTownBirds();
function getSavedProfileForSync(id = CUR_UID) {
  if (stateLoadError) throw new Error("Saved profiles could not be loaded.");
  if (!USERS.some((user) => user.id === id)) throw new Error("The local profile is no longer available.");
  const stored = readStoredProfile(id);
  if ((id === CUR_UID && DailyWalkReact.profileFingerprint(S) !== DailyWalkReact.profileFingerprint(stored)) ||
      JSON.stringify(readStoredUsers()) !== JSON.stringify(USERS)) {
    throw new Error("Local profiles changed. Reload before syncing.");
  }
  return { id, state: stored };
}
function finishStartup() {
  if (!startupPending) return;
  startupPending = false;
  if (!save()) {
    startupPending = true;
    throw new Error("Could not save this profile on this device.");
  }
  showSplash();
  maybeStartTour();
}

function openCloudProfile(ownerId, cloudId, remote) {
  if (stateLoadError) throw stateLoadError;
  const storedUsers = readStoredUsers();
  if (storedUsers.length && JSON.stringify(storedUsers) !== JSON.stringify(USERS)) {
    throw new Error("Local profiles changed. Reload before continuing.");
  }
  const existing = cloudId && storedUsers.find((user) => {
    const raw = localStorage.getItem(DailyWalkReact.linkKey(ownerId, user.id));
    const link = raw === null ? null : JSON.parse(raw);
    return link?.status === "linked" && link.id === cloudId;
  });
  let nextId = existing?.id;
  let nextState;
  if (existing) {
    nextState = hydrateState(readStoredProfile(nextId));
  } else {
    nextId = "u_cloud_" + DailyWalkReact.newProfileId();
    nextState = cloudId ? hydrateState(remote.state) : newPlayerState("Player 1");
    const previousUsers = storedUsers.length ? storedUsers : startupHasLegacy ? USERS : [];
    const nextUsers = [...previousUsers, profileMetadata(nextId, nextState, previousUsers)];
    const writes = [
      ...(startupHasLegacy && !storedUsers.length ? [[uKey(CUR_UID), JSON.stringify(S)]] : []),
      [uKey(nextId), JSON.stringify(nextState)],
      ...(cloudId ? [[DailyWalkReact.linkKey(ownerId, nextId), JSON.stringify({
        id: cloudId, status: "linked", baseRevision: remote.revision,
        baseFingerprint: DailyWalkReact.profileFingerprint(nextState),
      })]] : []),
      [K_USERS, JSON.stringify(nextUsers)],
      [K_CUR, nextId],
    ];
    const previous = writes.map(([key]) => [key, localStorage.getItem(key)]);
    try {
      for (const [key, value] of writes) localStorage.setItem(key, value);
    } catch (error) {
      for (const [key, value] of previous.reverse()) {
        try {
          if (value === null) localStorage.removeItem(key);
          else localStorage.setItem(key, value);
        } catch (rollbackError) {
          console.error("Could not restore local profiles after startup failed", rollbackError);
        }
      }
      throw error;
    }
    USERS = nextUsers;
    startupHasLegacy = false;
  }
  CUR_UID = nextId;
  S = nextState;
  Object.keys(shut).forEach((key) => delete shut[key]);
  paint();
  render();
  drawWater();
  drawJr();
  finishStartup();
}

DailyWalkReact.renderGoogleAuth({
  getLocalProfile: () => getSavedProfileForSync(),
  getSyncLocalProfile: getSavedProfileForSync,
  getSyncTargets: (ownerId) => [
    CUR_UID,
    ...USERS.filter((user) => user.id !== CUR_UID &&
      localStorage.getItem(DailyWalkReact.linkKey(ownerId, user.id)) !== null).map((user) => user.id),
  ],
  hasCurrentLink: (ownerId) => {
    if (stateLoadError || !readStoredUsers().some((user) => user.id === CUR_UID)) return false;
    const raw = localStorage.getItem(DailyWalkReact.linkKey(ownerId, CUR_UID));
    const link = raw === null ? null : JSON.parse(raw);
    return link?.status === "linked" || link?.status === "pending";
  },
  finishStartup,
  openCloudProfile,
  setSyncStatus: setCloudSyncStatus,
  backupCloudProfile: (local, remote) => {
    getSavedProfileForSync(local.id);
    const backupId = "u_backup_" + DailyWalkReact.newProfileId();
    const state = hydrateState(JSON.parse(JSON.stringify(remote)));
    const user = profileMetadata(backupId, state, USERS);
    user.label = (state.p.name || "Profile") + " (cloud sync backup)";
    localStorage.setItem(uKey(backupId), JSON.stringify(state));
    try {
      localStorage.setItem(K_USERS, JSON.stringify([...USERS, user]));
    } catch (error) {
      try {
        localStorage.removeItem(uKey(backupId));
      } catch (rollbackError) {
        console.error("Could not remove incomplete cloud backup", rollbackError);
      }
      throw error;
    }
    USERS = [...USERS, user];
  },
  replaceLocalProfile: (local, remote, { backup }) => {
    const active = CUR_UID === local.id;
    const preserveDraft = active && $("jt") && $("jt").value !== String(S.jr[today()] || "");
    if ((active && DailyWalkReact.profileFingerprint(S) !== DailyWalkReact.profileFingerprint(local.state)) ||
        DailyWalkReact.profileFingerprint(readStoredProfile(local.id)) !== DailyWalkReact.profileFingerprint(local.state) ||
        JSON.stringify(readStoredUsers()) !== JSON.stringify(USERS)) {
      throw new Error("The local profile changed during sync. Retry.");
    }
    const previousUsers = USERS;
    const previousProfile = JSON.stringify(readStoredProfile(local.id));
    const nextState = hydrateState(remote);
    nextState.lastSaved = Date.now();
    let updatedUsers = USERS.slice();
    const idx = updatedUsers.findIndex((user) => user.id === local.id);
    if (idx < 0) throw new Error("The local profile is no longer available.");
    if (backup) {
      const backupId = "u_backup_" + DailyWalkReact.newProfileId();
      const user = updatedUsers[idx];
      localStorage.setItem(uKey(backupId), previousProfile);
      updatedUsers.push({ ...user, id: backupId, label: (user.label || "Profile") + " (sync backup)" });
    }
    updatedUsers[idx] = profileMetadata(local.id, nextState, updatedUsers);
    localStorage.setItem(K_USERS, JSON.stringify(updatedUsers));
    try {
      localStorage.setItem(uKey(local.id), JSON.stringify(nextState));
    } catch (error) {
      try {
        localStorage.setItem(K_USERS, JSON.stringify(previousUsers));
      } catch (rollbackError) {
        console.error("Could not restore the local profile index after sync failed", rollbackError);
      }
      throw error;
    }
    USERS = updatedUsers;
    if (active) {
      S = nextState;
      Object.keys(shut).forEach((key) => delete shut[key]);
      paint();
      render();
      drawWater();
      drawJr(preserveDraft);
      if (PG === "t") townOpen();
      if (!save()) throw new Error("Could not finish saving the cloud profile.");
    }
    return readStoredProfile(local.id);
  },
});
render();
drawWater();
drawJr();
hydrate();
iconize(document.body);
initTutorial();
icMO.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
});
addEventListener("beforeunload", save);
