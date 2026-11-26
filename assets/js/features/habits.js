let PG = "h";
const PG_ORD = ["h", "t", "l"];

function getHabitGroupProgress(tasks, checks, groupId) {
  const groupTasks = tasks.filter((task) => (task.g || "more") === groupId);
  return {
    tasks: groupTasks,
    completed: groupTasks.filter((task) => checks[task.id]).length,
  };
}

function handleHabitCheck(task, checked, day) {
  S.checks[day] = S.checks[day] || {};
  S.checks[day][task.id] = checked;
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

setInterval(() => {
  if (PG === "t") dayShade();
}, 60000);
function go(p) {
  if (p === PG) return;
  const prevIdx = PG_ORD.indexOf(PG),
    nextIdx = PG_ORD.indexOf(p);
  PG = p;
  $("fab").hidden = p !== "h";
  $("pg-h").hidden = p !== "h";
  $("pg-t").hidden = p !== "t";
  $("pg-l").hidden = p !== "l";
  document
    .querySelectorAll(".nv")
    .forEach((b) => b.classList.toggle("on", b.dataset.p === p));
  const el = $("pg-" + p);
  el.classList.remove("sl", "sr");
  void el.offsetWidth;
  el.classList.add(nextIdx >= prevIdx ? "sr" : "sl");
  scrollTo(0, 0);
  if (p === "t") townOpen();
  else townStop();
  if (p === "l") renderLeaderboard();
}
document.querySelectorAll(".nv").forEach((b) => {
  b.onclick = () => go(b.dataset.p);
});
let sx = 0,
  sy = 0,
  sok = false;
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
function tickClock() {
  const d = new Date(),
    h = d.getHours();
  const e = h < 5 ? "🌙" : h < 12 ? "🌅" : h < 17 ? "☀️" : h < 20 ? "🌇" : "🌙",
    g =
      h < 5
        ? "Good night"
        : h < 12
          ? "Good morning"
          : h < 17
            ? "Good afternoon"
            : "Good evening";
  $("clock").textContent =
    e +
    " " +
    g +
    (S.p.name ? ", " + S.p.name : "") +
    " · " +
    d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
let lastKey = today(),
  lastCup = -1;
function drawWater() {
  if (S.water.d !== today()) S.water = { d: today(), n: 0 };
  DailyWalkReact.renderWater({
    cups: S.water.n,
    lastCup,
    onSelect: (index) => {
      S.water.n = S.water.n === index + 1 ? index : index + 1;
      lastCup = index;
      save();
      drawWater();
      if (S.water.n === 8) waterGoal();
    },
  });
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
function drawJr() {
  const d = today(),
    t = S.jr[d] || "";
  $("jt").value = t;
  $("jst").textContent = t ? "Saved today ✓" : "";
  const L = $("jl");
  L.innerHTML = "";
  Object.keys(S.jr)
    .sort()
    .reverse()
    .filter((k) => k !== d)
    .slice(0, 3)
    .forEach((k) => {
      const r = document.createElement("div");
      r.className = "jrow";
      const b = document.createElement("b");
      b.textContent = new Date(k + "T12:00:00").toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      const sp = document.createElement("span");
      sp.textContent = S.jr[k];
      r.append(b, sp);
      L.appendChild(r);
    });
}
$("jsave").onclick = () => {
  const v = $("jt").value.trim();
  if (!v) {
    toast("Write a little something first 🙏");
    return;
  }
  S.jr[today()] = v.slice(0, 600);
  const ks = Object.keys(S.jr).sort();
  while (ks.length > 30) delete S.jr[ks.shift()];
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
};
const wkPrev = {};
function drawWeek() {
  const box = $("wk7");
  box.innerHTML = "";
  const tot = S.tasks.length || 1;
  let sum = 0;
  for (let k = 6; k >= 0; k--) {
    const dt = new Date();
    dt.setDate(dt.getDate() - k);
    const key = dkey(dt),
      c = S.checks[key] || {};
    const n = S.tasks.filter((t) => c[t.id]).length,
      pct = Math.round((n / tot) * 100);
    sum += pct;
    const col = document.createElement("div");
    col.className = "wcol" + (k === 0 ? " td" : "");
    const bar = document.createElement("div");
    bar.className = "wbar";
    const f = document.createElement("i");
    f.style.height = (wkPrev[key] || 0) + "%";
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        f.style.height = pct + "%";
      }),
    );
    wkPrev[key] = pct;
    bar.appendChild(f);
    const l = document.createElement("span");
    l.className = "wl";
    l.textContent = dt.toLocaleDateString(undefined, { weekday: "narrow" });
    const pp = document.createElement("span");
    pp.className = "wp";
    pp.textContent = n;
    col.append(bar, l, pp);
    box.appendChild(col);
  }
  $("wavg").textContent = "avg " + Math.round(sum / 7) + "% per day";
}
function mealsNow() {
  const hr = new Date().getHours() + new Date().getMinutes() / 60,
    c = S.checks[today()] || {};
  const want = S.tasks.filter(
    (t) => t.m && hr >= t.m[0] && hr < t.m[1] && !c[t.id],
  ).length;
  if (want !== document.querySelectorAll(".nowb").length) render();
}
setInterval(() => {
  tickClock();
  if (today() !== lastKey) {
    lastKey = today();
    S.days[today()] = true;
    save();
    render();
    drawWater();
    drawJr();
  } else mealsNow();
}, 20000);
let hd = { g: "more", ic: "star" };
function buildHabit() {
  const gc = G.find((x) => x.id === hd.g).c;
  const pv = $("hprev");
  pv.style.setProperty("--gc", gc);
  pv.innerHTML = "";
  const hi = document.createElement("span");
  hi.className = "hi";
  hi.innerHTML = icoSvg(hd.ic);
  const tx = document.createElement("div");
  const b = document.createElement("b");
  b.textContent = $("hn").value.trim() || "Your new habit";
  const sm = document.createElement("small");
  sm.textContent = $("hw").value.trim() || G.find((x) => x.id === hd.g).n;
  tx.append(b, sm);
  pv.append(hi, tx);
  const gt = $("hg");
  gt.innerHTML = "";
  G.forEach((g) => {
    const bt = document.createElement("button");
    bt.type = "button";
    bt.className = "gt" + (g.id === hd.g ? " on" : "");
    bt.style.setProperty("--gc", g.c);
    bt.innerHTML = icoSvg(GIC[g.id]);
    const l = document.createElement("span");
    l.textContent = g.n;
    bt.appendChild(l);
    bt.onclick = () => {
      hd.g = g.id;
      buildHabit();
    };
    gt.appendChild(bt);
  });
  const it = $("hi");
  it.innerHTML = "";
  HICONS.forEach((n) => {
    const bt = document.createElement("button");
    bt.type = "button";
    bt.className = "it" + (n === hd.ic ? " on" : "");
    bt.setAttribute("aria-label", n);
    bt.innerHTML = icoSvg(n);
    bt.onclick = () => {
      hd.ic = n;
      buildHabit();
    };
    it.appendChild(bt);
  });
}
function openHabit() {
  hd = { g: "more", ic: "star" };
  $("hn").value = "";
  $("hw").value = "";
  buildHabit();
  $("hm").classList.add("show");
}
$("fab").onclick = openHabit;
$("hn").oninput = buildHabit;
$("hw").oninput = buildHabit;
$("hm").onclick = (e) => {
  if (e.target === $("hm")) $("hm").classList.remove("show");
};
$("hadd").onclick = () => {
  const v = $("hn").value.trim();
  if (!v) {
    rerun($("hn"), "bad");
    $("hn").focus();
    return;
  }
  const id = "c" + Date.now();
  S.tasks.push({ id, g: hd.g, ic: hd.ic, t: v, s: $("hw").value.trim() });
  shut[hd.g] = false;
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
};
