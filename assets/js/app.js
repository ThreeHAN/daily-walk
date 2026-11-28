let hideT,
  last = "",
  busy = false,
  cheerVersion = 0;
const buddyMessagePositions = new Map();
const buddyMessageClosings = [
  "",
  " Ask Jesus to guide your next step in love.",
  " Take a moment to thank God for His grace.",
  " Pray for someone who could use encouragement today.",
  " Consider how you might share this kindness with someone else.",
];
const buddyTaskTips = {
  wake: [
    "As you start the day, invite Jesus into your plans. Ask Him to help you notice someone you can encourage (Philippians 2:4).",
    "Your morning is a fresh opportunity to trust Christ. Thank Him for today and ask for wisdom in the next step (James 1:5).",
  ],
  water: [
    "While you drink, thank Jesus for the gift of water. Let this pause remind you to seek His living water too (John 4:14).",
    "Caring for your body can be a moment of gratitude to God. Take a sip and pray for someone who needs refreshment today (Matthew 25:35).",
  ],
  stretch: [
    "As you stretch, thank God for your body and invite His peace into your breathing (Philippians 4:6–7).",
    "Use this gentle pause to ask Jesus for strength and patience for the day ahead (Isaiah 40:31).",
  ],
  cold: [
    "As you practice doing something difficult, ask Christ for patience and remember that His grace is enough (2 Corinthians 12:9).",
    "Let this small challenge remind you to rely on God, not perfection. Pray for His strength as you continue your day (Philippians 4:13).",
  ],
  bfast: [
    "As you enjoy breakfast, thank Jesus for providing what you need and ask how you might share with someone else (Matthew 6:11).",
    "Let your morning meal be a pause to thank God and begin the day with a generous heart (Acts 2:46).",
  ],
  lunch: [
    "Take a moment over lunch to thank God for His care and pray for someone who needs a meal or a friend (Matthew 25:35).",
    "Let lunch be a midday pause with Jesus. Thank Him for the morning and ask for grace for the afternoon (Psalm 55:17).",
  ],
  dinner: [
    "At dinner, thank Christ for a gift from today and pray for the people around your table (Colossians 3:17).",
    "As the day ends, share a moment of gratitude with God and remember someone who could use encouragement (1 Thessalonians 5:11).",
  ],
  eat: [
    "Enjoy your food with gratitude rather than guilt. Thank God for nourishment and ask Him to help you care for yourself (1 Corinthians 10:31).",
    "Let this meal remind you of God's kindness. Pray for those who need food and consider a way to share (Matthew 25:35).",
  ],
  room: [
    "As you care for your room, ask Jesus to make it a place of peace and welcome for you and others (Romans 12:13).",
    "Offer this small act of care to God. A peaceful space can make room for rest and time with Him (Colossians 3:23).",
  ],
  run: [
    "As you move, thank God for what your body can do today and pray for someone who needs strength (Isaiah 40:31).",
    "Use a moment of exercise to talk with Jesus. Ask Him to help you persevere with kindness toward yourself (Hebrews 12:1–2).",
  ],
  pray: [
    "As you pray or read, listen for a reminder of Jesus' love. Carry one encouraging thought with you today (John 15:9).",
    "Bring an honest concern to Christ, then ask Him to guide one action you can take in love (Philippians 4:6–7).",
  ],
  good: [
    "Let this act of kindness reflect Jesus' love. Pray for the person you helped, without needing anything in return (John 13:34).",
    "Thank Christ for the chance to serve. Ask Him to help you notice another person's needs today (Philippians 2:4).",
  ],
};

function nextBuddyMessage(task) {
  const general = [
    `You did “${task.t}”! Offer it to God in a quick prayer. Whatever you do, do it as for the Lord (Colossians 3:23).`,
    `After “${task.t}”, thank Jesus for helping you take this step. Ask Him how it might help you serve someone (Philippians 2:4).`,
    `Bring “${task.t}” to Christ in prayer. Ask Him for wisdom to use what you have done with love and gratitude (Colossians 3:17).`,
  ];
  const messages = task.tip
    ? [task.tip, ...(Object.hasOwn(buddyTaskTips, task.id) ? buddyTaskTips[task.id] : general)]
    : general;
  const key = "dailywalk_admin_max:buddy-message:v1:" +
    encodeURIComponent(CUR_UID) + ":" + encodeURIComponent(task.id);
  let position = buddyMessagePositions.get(key);
  if (position === undefined) {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null && (!/^\d+$/.test(saved) || !Number.isSafeInteger(Number(saved))))
        throw new Error("Invalid buddy message position");
      position = saved === null ? 0 : Number(saved);
    } catch (error) {
      console.warn("Could not read buddy message position:", error);
      position = 0;
    }
  }
  const total = messages.length * buddyMessageClosings.length;
  const selected = position % total;
  const next = (selected + 1) % total;
  buddyMessagePositions.set(key, next);
  try {
    localStorage.setItem(key, String(next));
  } catch (error) {
    console.warn("Could not save buddy message position:", error);
  }
  return messages[selected % messages.length] +
    buddyMessageClosings[Math.floor(selected / messages.length)];
}

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
  b.textContent = lbl(txt);
  b.classList.remove("fading");
  b.classList.add("show");
  $("dot").classList.remove("on");
  clearTimeout(hideT);
  hideT = setTimeout(() => {
    b.classList.add("fading");
    hideT = setTimeout(dismissBuddyMessage, 300);
  }, 10000);
}
function dismissBuddyMessage() {
  clearTimeout(hideT);
  hideT = undefined;
  $("bubble").classList.remove("show", "fading");
}
function toggleBuddyMessage() {
  hop();
  const b = $("bubble");
  if (b.classList.contains("show")) {
    dismissBuddyMessage();
  } else {
    b.textContent = lbl(
      last ||
        "Hi! Check something off, and I'll share encouragement for doing it for God.",
    );
    b.classList.add("show");
    $("dot").classList.remove("on");
  }
}
async function cheer(t, all) {
  const version = ++cheerVersion;
  const end = all
    ? "\n\n🎉 You finished everything today. “Well done, good and faithful servant” (Matthew 25:21)."
    : "";
  say(nextBuddyMessage(t) + end);
  if (t.tip) return;
  if (busy || typeof claude === "undefined") return;
  busy = true;
  try {
    const sample = await claude.use("sample");
    if (!sample) return;
    const r = await sample(
      "You are a warm, encouraging Christian friend inside a habit app. The user just checked off this habit: “" +
        t.t +
        "”. In under 60 words, plain text, explain how they can do or use this habit for God: a short prayer or mindset plus one relevant Bible reference by citation only. Be gracious, not legalistic.",
      { cache: false },
    );
    if (r && r.text && version === cheerVersion && hideT !== undefined &&
        !$("bubble").classList.contains("fading")) {
      last = r.text + end;
      $("bubble").textContent = lbl(last);
    }
  } catch (e) {
    console.warn("Could not get buddy encouragement:", e);
  } finally {
    busy = false;
  }
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
      groups: habitGroupsForState(S),
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
      const previousTasks = S.tasks;
      S.tasks = S.tasks.filter((item) => item.id !== task.id);
      if (!save()) {
        S.tasks = previousTasks;
        return false;
      }
      render();
      toast("Habit removed");
      return true;
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
  $("bubble").onclick = dismissBuddyMessage;
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
function finishStartup({ name, appearance, habits, customHabitGroups, removedDefaultHabitGroups, skipSplash = false } = {}) {
  if (!startupPending) return;
  if (appearance && (readStoredUsers().length || readStoredJson(K_LEGACY) !== null)) {
    throw new Error("Local profiles changed. Reload before continuing.");
  }
  const previousAppearance = S.p;
  const previousTasks = S.tasks;
  const previousGroups = S.customHabitGroups;
  const previousRemoved = S.removedDefaultHabits;
  const previousRemovedGroups = S.removedDefaultHabitGroups;
  const previousSplash = S.splash;
  if (appearance) S.p = { ...S.p, ...appearance, name };
  if (habits) {
    S.tasks = habits.map((task) => ({ ...task }));
    S.customHabitGroups = customHabitGroups.map((group) => ({ ...group }));
    S.removedDefaultHabitGroups = [...removedDefaultHabitGroups];
    S.removedDefaultHabits = DEFAULTS.filter((task) => !habits.some((item) => item.id === task.id))
      .map((task) => task.id);
  }
  if (appearance && skipSplash) S.splash = today();
  startupPending = false;
  if (!save()) {
    S.p = previousAppearance;
    S.tasks = previousTasks;
    if (previousGroups === undefined) delete S.customHabitGroups;
    else S.customHabitGroups = previousGroups;
    if (previousRemoved === undefined) delete S.removedDefaultHabits;
    else S.removedDefaultHabits = previousRemoved;
    if (previousRemovedGroups === undefined) delete S.removedDefaultHabitGroups;
    else S.removedDefaultHabitGroups = previousRemovedGroups;
    S.splash = previousSplash;
    startupPending = true;
    throw new Error("Could not save this profile on this device.");
  }
  if (appearance || habits) {
    paint();
    render();
  }
  if (!skipSplash) showSplash();
  maybeStartTour();
}

function openCloudProfile(ownerId, cloudId, remote, { name, appearance, habits, customHabitGroups, removedDefaultHabitGroups, skipSplash = false } = {}) {
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
    if (!cloudId && appearance) nextState.p = { ...nextState.p, ...appearance, name };
    if (!cloudId && habits) {
      nextState.tasks = habits.map((task) => ({ ...task }));
      nextState.customHabitGroups = customHabitGroups.map((group) => ({ ...group }));
      nextState.removedDefaultHabitGroups = [...removedDefaultHabitGroups];
      nextState.removedDefaultHabits = DEFAULTS.filter((task) => !habits.some((item) => item.id === task.id))
        .map((task) => task.id);
    }
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
  habitDefaults: newPlayerState().tasks,
  habitGroups: G,
  habitIcons: HICONS,
  defaultHabitIcons: DEFIC,
  habitGroupIcons: GIC,
  icon: icoSvg,
  iconTextParts,
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
