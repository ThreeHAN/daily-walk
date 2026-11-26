let userBarName = "Default Profile";
let userBarStatus = "All data saved ✓";
let userBarStatusTimer;
let cloudSyncStatus = "";
let persistenceFailed = false;
let profileUserInteraction = false;
let interactionFrame = 0;

for (const type of ["click", "input", "change", "submit", "keydown"]) {
  document.addEventListener(type, (event) => {
    if (!event.isTrusted) return;
    profileUserInteraction = true;
    cancelAnimationFrame(interactionFrame);
    interactionFrame = requestAnimationFrame(() => { profileUserInteraction = false; });
  }, true);
  window.addEventListener(type, (event) => {
    if (event.isTrusted) profileUserInteraction = false;
  });
}

function renderUserBar() {
  DailyWalkReact.renderProfileStatus({
    name: userBarName,
    status: userBarStatus,
    icon: icoSvg,
    iconTextParts,
  });
}

function updateUserBar(justSaved) {
  persistenceFailed = false;
  const u = USERS.find((x) => x.id === CUR_UID);
  const nm = (S.p.name || "").trim() || (u && u.label) || "Player 1";
  userBarName = nm + " · " + (S.p.buddy || "Buddy");
  userBarStatus = cloudSyncStatus || (justSaved ? "Saved just now ✓" : "All data saved ✓");
  clearTimeout(userBarStatusTimer);
  renderUserBar();
  userBarStatusTimer = setTimeout(() => {
    userBarStatus = cloudSyncStatus || "All data saved ✓";
    renderUserBar();
  }, 1800);
  if ($("syncst"))
    $("syncst").textContent =
      cloudSyncStatus || "Saved " +
      new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }) +
      " ✓";
}
function setCloudSyncStatus(status) {
  cloudSyncStatus = status;
  if (persistenceFailed) return;
  clearTimeout(userBarStatusTimer);
  userBarStatus = status || "All data saved ✓";
  renderUserBar();
  if ($("syncst")) $("syncst").textContent = userBarStatus;
}
function reportPersistenceError(message, error) {
  console.error(message, error);
  persistenceFailed = true;
  clearTimeout(userBarStatusTimer);
  userBarStatus = message;
  renderUserBar();
  if ($("syncst")) $("syncst").textContent = message;
}

function profileMetadata(id, state, users) {
  const idx = users.findIndex((x) => x.id === id);
  return {
    id,
    label:
      (state.p.name || "").trim() ||
      (idx >= 0 ? users[idx].label : "Player " + (users.length + 1)),
    updated: state.lastSaved,
    lv: typeof lvOf === "function" ? lvOf(state.xp) : 1,
    buddy: state.p.buddy || "Buddy",
    town:
      typeof NB !== "undefined" && NB[state.nb.cur]
        ? NB[state.nb.cur].n
        : "Meadow Valley",
  };
}
function save(userInitiated = false) {
  if (startupPending) return false;
  if (stateLoadError) {
    reportPersistenceError(
      "Could not load saved profiles. Changes are not saved; reload to retry.",
      stateLoadError,
    );
    return false;
  }
  S.lastSaved = Date.now();
  const idx = USERS.findIndex((x) => x.id === CUR_UID);
  const meta = profileMetadata(CUR_UID, S, USERS);
  const updatedUsers = USERS.slice();
  if (idx >= 0) updatedUsers[idx] = meta;
  else updatedUsers.push(meta);
  let changed = false;
  const fromUser = userInitiated === true || profileUserInteraction;
  try {
    if (fromUser) {
      const previous = localStorage.getItem(uKey(CUR_UID));
      changed = previous === null ||
        DailyWalkReact.profileFingerprint(JSON.parse(previous)) !== DailyWalkReact.profileFingerprint(S);
    }
    writeStoredProfile(CUR_UID, S, updatedUsers);
  } catch (e) {
    reportPersistenceError(
      "Changes not saved. Check browser storage and retry.",
      e,
    );
    return false;
  }
  USERS = updatedUsers;
  updateUserBar(true);
  if (fromUser && changed) {
    window.dispatchEvent(new CustomEvent("dailywalk:profile-saved", { detail: { id: CUR_UID } }));
  }
  return true;
}
function renderUsers() {
  DailyWalkReact.renderProfileList({
    users: USERS,
    currentId: CUR_UID,
    icon: icoSvg,
    iconTextParts,
    onSwitch: switchUser,
    onDelete: (id) => {
      const remainingUsers = USERS.filter((user) => user.id !== id);
      try {
        deleteStoredProfile(id, remainingUsers, USERS);
      } catch (error) {
        reportPersistenceError(
          "Could not remove profile. Check browser storage.",
          error,
        );
        return;
      }
      USERS = remainingUsers;
      renderUsers();
      toast("Profile removed");
    }
  });
}
function switchUser(id) {
  if (!save()) return;
  let nextState;
  try {
    nextState = hydrateState(readStoredProfile(id));
  } catch (e) {
    reportPersistenceError(
      "Could not load profile. Current profile unchanged.",
      e,
    );
    return;
  }
  const previousId = CUR_UID;
  const previousState = S;
  CUR_UID = id;
  S = nextState;
  if (!save()) {
    CUR_UID = previousId;
    S = previousState;
    return;
  }
  Object.keys(shut).forEach((k) => delete shut[k]);
  paint();
  render();
  drawWater();
  drawJr();
  if (PG === "t") townOpen();
  view("info");
  toast(
    "Switched to " +
      (S.p.name || USERS.find((x) => x.id === id)?.label || "User"),
  );
  setTimeout(() => {
    if (typeof maybeStartTour === "function") maybeStartTour();
  }, 200);
}
function createNewUser() {
  if (!save()) return;
  const num = USERS.length + 1;
  const id = "u_" + Date.now();
  const previousId = CUR_UID;
  const previousState = S;
  const nextState = newPlayerState("Player " + num);
  CUR_UID = id;
  S = nextState;
  if (!save()) {
    CUR_UID = previousId;
    S = previousState;
    return;
  }
  Object.keys(shut).forEach((k) => delete shut[k]);
  paint();
  render();
  drawWater();
  drawJr();
  if (PG === "t") townOpen();
  view("info");
  toast("Created fresh profile: Player " + num);
  setTimeout(() => {
    if (typeof maybeStartTour === "function") maybeStartTour();
  }, 200);
  setTimeout(() => {
    const inp = $("pn");
    if (inp) {
      inp.focus();
      inp.select();
    }
  }, 150);
}
$("ubar").onclick = () => {
  view("info");
  $("pm").classList.add("show");
};
$("uadd").onclick = createNewUser;
$("uexp").onclick = () => {
  save();
  const blob = new Blob(
    [
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          user: USERS.find((x) => x.id === CUR_UID),
          data: S,
        },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  const slug =
    (S.p.name || "daily-walk").toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
    "backup";
  a.download = slug + "-" + today() + ".json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast("Save file downloaded!");
};

const K_FRIENDS = "dailywalk_universal:friends:v1";
let lbSort = "xp";
function calcStreakForState(stObj) {
  if (!stObj || !stObj.days) return 0;
  let st = 0,
    dt = new Date();
  if (!stObj.days[today()]) dt.setDate(dt.getDate() - 1);
  while (stObj.days[dkey(dt)]) {
    st++;
    dt.setDate(dt.getDate() - 1);
  }
  return st;
}
function calcTotalTasksForState(stObj) {
  if (!stObj) return 0;
  let tot = 0;
  if (stObj.checks)
    Object.values(stObj.checks).forEach((o) => {
      if (o && typeof o === "object")
        Object.values(o).forEach((v) => {
          if (v) tot++;
        });
    });
  return Math.max(tot, Number(stObj.bs && stObj.bs.tasks) || 0);
}
function calcTownsDoneForState(stObj) {
  if (!stObj || !stObj.nb || !stObj.nb.xp) return 0;
  return Object.values(stObj.nb.xp).filter((v) => (Number(v) || 0) >= MAXAT)
    .length;
}
function gatherUniversalAccounts() {
  const map = new Map();
  // 1. Scan all localStorage keys for any Daily Walk account (Starter, Admin Account, legacy, or any user)
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.includes(":u:") || k === K_LEGACY) {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object" || !parsed.p) continue;
        const isMe = k === uKey(CUR_UID);
        const stObj = isMe ? S : parsed;
        const uid = isMe ? CUR_UID : k;
        const name = ((stObj.p && stObj.p.name) || "").trim() || "Walker";
        const buddy = ((stObj.p && stObj.p.buddy) || "Buddy").trim();
        const xp = Math.max(Number(stObj.life) || 0, Number(stObj.xp) || 0);
        const lv = lvOf(Number(stObj.xp) || 0);
        const streak = calcStreakForState(stObj);
        const bestStreak = Math.max(streak, 0);
        const towns = calcTownsDoneForState(stObj);
        const tasks = calcTotalTasksForState(stObj);
        const edition = k.startsWith("dailywalk_admin")
          ? "Admin Account"
          : "Starter";
        map.set(uid, {
          id: uid,
          name,
          buddy,
          look: stObj.p,
          xp,
          lv,
          streak,
          towns,
          tasks,
          edition,
          isMe,
          updated: stObj.lastSaved || Date.now(),
        });
      }
    }
  } catch (e) {}
  // 2. Merge any universally imported Friend Codes
  try {
    const fr = JSON.parse(localStorage.getItem(K_FRIENDS) || "[]");
    if (Array.isArray(fr)) {
      fr.forEach((f) => {
        if (f && f.id && !map.has(f.id)) {
          map.set(
            f.id,
            Object.assign({ isMe: false, edition: "Friend Code" }, f),
          );
        }
      });
    }
  } catch (e) {}
  // Ensure current active account is always present & up-to-date
  map.set(CUR_UID, {
    id: CUR_UID,
    name: (S.p.name || "").trim() || "You",
    buddy: (S.p.buddy || "Buddy").trim(),
    look: S.p,
    xp: Math.max(Number(S.life) || 0, Number(S.xp) || 0),
    lv: lvOf(S.xp),
    streak: curStreak,
    towns: calcTownsDoneForState(S),
    tasks: calcTotalTasksForState(S),
    edition: K_USERS.includes("master") ? "Admin Account" : "Starter",
    isMe: true,
    updated: Date.now(),
  });
  return Array.from(map.values());
}
function renderLeaderboard() {
  const listEl = $("lblist");
  if (!listEl) return;
  document
    .querySelectorAll(".lb-tab")
    .forEach((b) => b.classList.toggle("on", b.dataset.lbt === lbSort));
  const all = gatherUniversalAccounts();
  all.sort((a, b) => {
    if (lbSort === "streak") return b.streak - a.streak || b.xp - a.xp;
    if (lbSort === "town") return b.towns - a.towns || b.xp - a.xp;
    if (lbSort === "tasks") return b.tasks - a.tasks || b.xp - a.xp;
    return b.xp - a.xp || b.streak - a.streak;
  });
  const K_HIDDEN = "dailywalk_admin:hidden_ids:v1";
  let hiddenIds = [];
  try {
    hiddenIds = JSON.parse(localStorage.getItem(K_HIDDEN) || "[]");
  } catch (e) {}
  const filteredAll = all.filter((u) => !hiddenIds.includes(u.id));
  $("lbcnt").textContent =
    filteredAll.length + (filteredAll.length === 1 ? " Account" : " Accounts");
  const myIdx = filteredAll.findIndex((x) => x.isMe);
  const me = filteredAll[myIdx] || filteredAll[0] || all[0];
  $("lbmyrk").textContent = myIdx >= 0 ? "#" + (myIdx + 1) : "-";
  $("lbmynm").textContent = me.name + " · " + me.buddy;
  $("lbmyxp").textContent =
    lbSort === "streak"
      ? "🔥 " + me.streak + "d"
      : lbSort === "town"
        ? "🌍 " + me.towns + "/48"
        : lbSort === "tasks"
          ? "✅ " + me.tasks
          : "⭐ " + me.xp.toLocaleString() + " XP";
  DailyWalkReact.renderLeaderboardList({
    accounts: filteredAll.map((u) => ({
      ...u,
      avatar: svgOf(u.look || freshLook("square"), 36, 40).outerHTML,
    })),
    sort: lbSort,
    icon: icoSvg,
    iconTextParts,
    onRemove: (u) => {
      try {
        localStorage.setItem(K_HIDDEN, JSON.stringify([...hiddenIds, u.id]));
      } catch (error) {
        console.error("Could not hide leaderboard account", error);
        toast("Could not hide account. Check browser storage and retry.");
        return;
      }
      renderLeaderboard();
      toast("Removed " + u.name + " from Leaderboard");
    },
  });
}
document.querySelectorAll(".lb-tab").forEach((b) => {
  b.onclick = () => {
    lbSort = b.dataset.lbt;
    renderLeaderboard();
  };
});
$("lbshare").onclick = () => {
  const me = gatherUniversalAccounts().find((x) => x.isMe);
  if (!me) return;
  const payload = {
    id:
      "fr_" +
      (me.name || "walker").toLowerCase().replace(/[^a-z0-9]/g, "") +
      "_" +
      me.xp,
    name: me.name,
    buddy: me.buddy,
    look: me.look,
    xp: me.xp,
    lv: me.lv,
    streak: me.streak,
    towns: me.towns,
    tasks: me.tasks,
  };
  const code =
    "DW1:" + btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(code)
      .then(() =>
        toast(
          "📋 Friend Code copied! Anyone can paste it on their Leaderboard.",
        ),
      )
      .catch(() => prompt("Copy your Universal Friend Code:", code));
  } else {
    prompt("Copy your Universal Friend Code:", code);
  }
};
$("lbreset").onclick = () => {
  try {
    localStorage.removeItem("dailywalk_admin:hidden_ids:v1");
    renderLeaderboard();
    toast("All hidden accounts restored!");
  } catch (e) {}
};
$("lbaddf").onclick = () => {
  const raw = prompt(
    "Paste a friend's Universal Friend Code (starts with DW1:) to add them to your Leaderboard:",
  );
  if (!raw) return;
  try {
    const clean = raw.trim().replace(/^DW1:/, "");
    const parsed = JSON.parse(decodeURIComponent(escape(atob(clean))));
    if (!parsed || !parsed.name || typeof parsed.xp !== "number")
      throw new Error("Bad code");
    const fr = JSON.parse(localStorage.getItem(K_FRIENDS) || "[]");
    const idx = fr.findIndex(
      (x) => x.id === parsed.id || x.name === parsed.name,
    );
    if (idx >= 0) fr[idx] = parsed;
    else fr.push(parsed);
    localStorage.setItem(K_FRIENDS, JSON.stringify(fr));
    renderLeaderboard();
    toast("🎉 Added " + parsed.name + " to the Universal Leaderboard!");
  } catch (e) {
    toast("❌ Invalid Friend Code — please paste the full DW1:... code");
  }
};
addEventListener("storage", () => {
  if (PG === "l") renderLeaderboard();
});

$("uimp").onclick = () => $("ufile").click();
$("ufile").onchange = (e) => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const parsed = JSON.parse(rd.result);
      const data = parsed && parsed.data ? parsed.data : parsed;
      if (!data || typeof data !== "object" || !data.tasks)
        throw new Error("Invalid file");
      S = hydrateState(data);
      const saved = save(true);
      paint();
      render();
      drawWater();
      drawJr();
      if (PG === "t") townOpen();
      view("info");
      toast(
        saved
          ? "Save file restored! ✓"
          : "Restored in memory, but changes are not saved",
      );
    } catch (err) {
      toast("Could not read that backup file");
    }
    $("ufile").value = "";
  };
  rd.readAsText(f);
};
