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
  S.checks[today()] = {};
  S.days[today()] = true;
  save();
  render();
};
save();
paint();
render();
drawWater();
drawJr();
showSplash();
hydrate();
iconize(document.body);
initTutorial();
icMO.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
});
addEventListener("beforeunload", save);
