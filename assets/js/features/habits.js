let PG = "h";
const PG_ORD = ["h", "t", "l"];

function getHabitGroupProgress(tasks, checks, groupId) {
  const groupTasks = tasks.filter((task) => (task.g || "more") === groupId);
  return {
    tasks: groupTasks,
    completed: groupTasks.filter((task) => checks[task.id]).length,
  };
}

function updateHabitChecks(day, changes) {
  const stamps = S.checkUpdatedAt === undefined ? {} : S.checkUpdatedAt;
  const daily = stamps && typeof stamps === "object" && !Array.isArray(stamps)
    ? (stamps[day] === undefined ? {} : stamps[day]) : null;
  const timestamp = (entry) => typeof entry === "number" ? entry : entry?.at;
  if (!daily || typeof daily !== "object" || Array.isArray(daily) ||
      changes.some(([id]) => daily[id] !== undefined &&
        (!Number.isSafeInteger(timestamp(daily[id])) || timestamp(daily[id]) <= 0 ||
          timestamp(daily[id]) >= Number.MAX_SAFE_INTEGER ||
          (typeof daily[id] !== "number" && (typeof daily[id] !== "object" ||
            typeof daily[id].value !== "boolean"))))) {
    reportPersistenceError("Could not update habit sync information. Changes were not saved.",
      new Error("Invalid habit change timestamps."));
    return false;
  }
  const nextStamps = { ...daily };
  const checks = { ...(S.checks[day] || {}) };
  for (const [id, checked] of changes) {
    checks[id] = checked;
    nextStamps[id] = { at: Math.max(Date.now(), (timestamp(daily[id]) || 0) + 1), value: checked };
  }
  S.checks[day] = checks;
  S.checkUpdatedAt = { ...stamps, [day]: nextStamps };
  return true;
}

function handleHabitCheck(task, checked, day) {
  if (!updateHabitChecks(day, [[task.id, checked]])) {
    render();
    return;
  }
  const completed = S.tasks.filter((item) => S.checks[day][item.id]).length;
  S.days[day] = completed === S.tasks.length;
  save();

  const effects = {};
  if (checked) {
    effects.completedHabitId = task.id;
    const groupId = task.g || "more";
    const group = getHabitGroupProgress(S.tasks, S.checks[day], groupId);
    if (group.completed === group.tasks.length) effects.completedGroupId = groupId;
    effects.allDone = S.days[day];
    const previousBuildings = builtN();
    const previousLevel = lvOf(S.xp);
    let gained = award("t:" + task.id, 10);
    if (gained) {
      S.bs.tasks = (S.bs.tasks || 0) + 1;
      save();
    }
    if (effects.completedGroupId) gained += award("g:" + groupId, 15);
    if (effects.allDone) gained += award("all", 30);
    effects.xpGain = gained;
    if (lvOf(S.xp) > previousLevel) effects.levelUp = lvOf(S.xp);
    if (builtN() > previousBuildings)
      effects.newBuilding = BLD[builtN() - 1].n;
    hop();
  }

  render(effects);
  if (checked) cheer(task, S.days[day]);
}

function go(p) {
  if (p === PG) return;
  const prevIdx = PG_ORD.indexOf(PG),
    nextIdx = PG_ORD.indexOf(p);
  PG = p;
  renderDashboardControls();
  $("pg-h").hidden = p !== "h";
  $("pg-t").hidden = p !== "t";
  $("pg-l").hidden = p !== "l";
  renderBottomNavigation();
  const el = $("pg-" + p);
  el.classList.remove("sl", "sr");
  void el.offsetWidth;
  el.classList.add(nextIdx >= prevIdx ? "sr" : "sl");
  scrollTo(0, 0);
  if (p === "t") townOpen();
  else townStop();
  if (p === "l") renderLeaderboard();
}
let sx = 0,
  sy = 0,
  sok = false;
function renderBottomNavigation() {
  DailyWalkReact.renderBottomNav({ currentPage: PG, onNavigate: go, icon: icoSvg });
}
function initHabits() {
  renderBottomNavigation();
  addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches[0];
      sx = t.clientX;
      sy = t.clientY;
      sok = !e.target.closest(
        ".modal,.splash,.lvup,.cs,.gl,.tv,.tabs,.lb-tabs,input,select",
      );
    },
    { passive: true },
  );
  addEventListener(
    "touchend",
    (e) => {
      if (!sok) return;
      const t = e.changedTouches[0],
        dx = t.clientX - sx,
        dy = t.clientY - sy;
      if (Math.abs(dx) > 70 && Math.abs(dy) < 55) {
        const i = PG_ORD.indexOf(PG);
        const ni =
          dx < 0 ? Math.min(PG_ORD.length - 1, i + 1) : Math.max(0, i - 1);
        go(PG_ORD[ni]);
      }
    },
    { passive: true },
  );
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) townStop();
    else if (PG === "t") {
      TW.on = true;
      TW.last = 0;
      cancelAnimationFrame(TW.raf);
      TW.raf = requestAnimationFrame(tick);
    }
  });
  addEventListener("resize", () => {
    if (PG === "t") {
      TW.W = $("scene").clientWidth;
      TW.H = $("scene").clientHeight;
    }
  });
  setInterval(() => {
    if (PG === "t") dayShade();
  }, 60000);
  setInterval(refreshHabitClock, 20000);
  $("hm").onclick = (e) => {
    if (e.target === $("hm")) $("hm").classList.remove("show");
  };
}
function tickClock() {
  DailyWalkReact.renderDashboardHeading({
    now: new Date(),
    name: S.p.name,
    icon: icoSvg,
    iconTextParts,
  });
}
let lastKey = today(),
  lastCup = -1;
function drawWater() {
  if (S.water.d !== today()) {
    S.water = { d: today(), n: 0 };
    save();
  }
  DailyWalkReact.renderWater(dashboardBridge.waterProps());
}
function selectWater(index) {
  S.water.n = S.water.n === index + 1 ? index : index + 1;
  S.waterHistory[S.water.d] = S.water.n;
  lastCup = index;
  save();
  drawWater();
  if (S.water.n === 8) waterGoal();
}
function waterGoal() {
  if (shut.nutrition) {
    shut.nutrition = false;
    render();
  }
  const task = S.tasks.find((item) => item.id === "water");
  const day = today();
  if (task && !(S.checks[day] || {})[task.id])
    handleHabitCheck(task, true, day);
}
function drawJr(preserveDraft = false) {
  const day = today();
  DailyWalkReact.renderJournal({
    day,
    entry: String(S.jr[day] || ""),
    entries: S.jr,
    preserveDraft,
    onSave: saveJournal,
    icon: icoSvg,
    iconTextParts,
  });
}
function saveJournal(draft) {
  const v = draft.trim();
  if (!v) {
    toast("Write a little something first 🙏");
    return;
  }
  S.jr[today()] = v.slice(0, 600);
  save();
  const lb = lvOf(S.xp),
    gn = award("jr", 10);
  drawHero();
  drawJr();
  checkNbWin();
  if (gn) {
    const r = $("jsave").getBoundingClientRect();
    floatXP(r.left + 20, r.top - 6, "+10 XP");
    burst(r.left + 40, r.top, 12, CONF);
    if (lvOf(S.xp) > lb) levelUp(lvOf(S.xp));
  } else toast("Entry updated ✓");
}
function drawWeek() {
  DailyWalkReact.renderWeeklyChart({
    tasks: S.tasks,
    checks: S.checks,
    now: new Date(),
    previousWidths: (drawWeek.previousWidths ||= {}),
    icon: icoSvg,
    iconTextParts,
  });
}
function mealsNow() {
  const hr = new Date().getHours() + new Date().getMinutes() / 60,
    c = S.checks[today()] || {};
  const want = S.tasks.filter(
    (t) => t.m && hr >= t.m[0] && hr < t.m[1] && !c[t.id],
  ).length;
  if (want !== document.querySelectorAll(".nowb").length) render();
}
function refreshHabitClock() {
  tickClock();
  if (today() !== lastKey) {
    lastKey = today();
    save();
    render();
    drawWater();
    drawJr();
  } else mealsNow();
}
function openHabit() {
  DailyWalkReact.renderHabitEditor({
    groups: G,
    groupIcons: GIC,
    icons: HICONS,
    icon: icoSvg,
    iconTextParts,
    onAdd: addHabit,
    rerun,
  });
  $("hm").classList.add("show");
}
function addHabit({ name, description, group, icon }) {
  const id = "c" + Date.now();
  S.tasks.push({ id, g: group, ic: icon, t: name, s: description });
  shut[group] = false;
  save();
  $("hm").classList.remove("show");
  render({ addedHabitId: id });
  toast("Habit added!");
  const r = document.querySelector(".newrow");
  if (r) {
    r.scrollIntoView({ behavior: "smooth", block: "center" });
    const q = r.getBoundingClientRect();
    burst(q.left + 40, q.top + 20, 18, CONF);
  }
}
