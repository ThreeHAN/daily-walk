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
function toggleBuddyMessage() {
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
}
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

const dashboardBridge = {
  getSnapshot() {
    const day = today();
    const checks = S.checks[day] || {};
    const total = S.tasks.length;
    const completed = S.tasks.filter((task) => checks[task.id]).length;
    let streak = 0;
    const date = new Date();
    if (!S.days[day]) date.setDate(date.getDate() - 1);
    while (S.days[dkey(date)]) {
      streak++;
      date.setDate(date.getDate() - 1);
    }
    return { day, tasks: S.tasks, checks, completed, total, streak };
  },
  habitListProps(snapshot, effects) {
    return {
      groups: G,
      tasks: snapshot.tasks,
      checks: snapshot.checks,
      closedGroups: shut,
      effects,
      firstRender: firstR,
      previousWidths: prevW,
      icon: icoSvg,
      iconTextParts,
      defaultIcons: DEFIC,
      groupIcons: GIC,
      onCheck: (task, checked) => this.actions.checkHabit(task, checked, snapshot.day),
      onToggle: this.actions.toggleGroup,
      onRemove: this.actions.removeHabit,
    };
  },
  progressProps(snapshot) {
    return {
      completed: snapshot.completed,
      total: snapshot.total,
      percent: snapshot.total ? (snapshot.completed / snapshot.total) * 100 : 0,
      streak: snapshot.streak,
      icon: icoSvg,
      iconTextParts,
    };
  },
  waterProps() {
    return {
      cups: S.water.n,
      lastCup,
      onSelect: this.actions.selectWater,
      icon: icoSvg,
      iconTextParts,
    };
  },
  actions: {
    checkHabit: handleHabitCheck,
    toggleGroup(id) {
      shut[id] = !shut[id];
      render({ openedGroupId: !shut[id] ? id : null });
    },
    removeHabit(task) {
      S.tasks = S.tasks.filter((item) => item.id !== task.id);
      save();
      render();
      toast("Habit removed");
    },
    selectWater,
  },
};
function renderHabitProgress(snapshot) {
  DailyWalkReact.renderProgressSummary(dashboardBridge.progressProps(snapshot));
  const sbT = "🔥" + snapshot.streak;
  if ($("sb").textContent !== sbT) {
    $("sb").textContent = sbT;
    rerun($("sb"), "pulse");
  }
  curStreak = snapshot.streak;
  syncPetUnlocks(snapshot.streak);
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
  const snapshot = dashboardBridge.getSnapshot();
  tickClock();
  const fullEl = DailyWalkReact.renderHabitList(dashboardBridge.habitListProps(snapshot, effects));
  renderHabitProgress(snapshot);
  showHabitCompletionEffects(effects, fullEl);
  drawHero();
  drawWeek();
  checkNbWin();
  firstR = false;
}
function resetHabits() {
  const day = today();
  const ids = new Set([...S.tasks.map((task) => task.id), ...Object.keys(S.checks[day] || {})]);
  if (!updateHabitChecks(day, Array.from(ids, (id) => [id, false]))) {
    render();
    return;
  }
  S.days[day] = false;
  save();
  render();
}
function renderDashboardControls(portrait = personLayers({ ...S.p, pet: "none" })) {
  DailyWalkReact.renderDashboardControls({
    portrait,
    pet: petById(S.p.pet),
    currentPage: PG,
    onIndex: openIx,
    onProfile: openProfile,
    onReset: resetHabits,
    onAdd: openHabit,
    icon: icoSvg,
  });
}
function initDashboard() {
  $("av").onclick = toggleBuddyMessage;
  $("bubble").onclick = () => {
    $("bubble").classList.remove("show");
  };
  renderDashboardControls();
}
initAccounts();
initProfile();
initTownScene();
initWorldMap();
initTown();
initHabits();
initCollection();
initDashboard();
save();
paint();
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
function finishStartup({ appearance, skipSplash = false } = {}) {
  if (!startupPending) return;
  if (appearance && (readStoredUsers().length || readStoredJson(K_LEGACY) !== null)) {
    throw new Error("Local profiles changed. Reload before continuing.");
  }
  const previousAppearance = S.p;
  const previousSplash = S.splash;
  if (appearance) S.p = { ...S.p, ...appearance };
  if (appearance && skipSplash) S.splash = today();
  startupPending = false;
  if (!save()) {
    S.p = previousAppearance;
    S.splash = previousSplash;
    startupPending = true;
    throw new Error("Could not save this profile on this device.");
  }
  if (appearance) {
    paint();
    render();
  }
  if (!skipSplash) showSplash();
  maybeStartTour();
}

function openCloudProfile(ownerId, cloudId, remote, { appearance, skipSplash = false } = {}) {
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
    if (!cloudId && appearance) nextState.p = { ...nextState.p, ...appearance };
    if (!cloudId && appearance && skipSplash) nextState.splash = today();
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
  finishStartup({ skipSplash });
}

DailyWalkReact.renderGoogleAuth({
  needsOnboarding: !stateLoadError && !startupHasLegacy && readStoredUsers().length === 0,
  appearanceDefaults: Object.fromEntries(Object.keys(APPEARANCE_OPTIONS).map((key) => [key, S.p[key]])),
  appearanceOptions: APPEARANCE_OPTIONS,
  renderAvatar: (appearance) => personLayers({ ...newPlayerState().p, ...appearance }),
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
