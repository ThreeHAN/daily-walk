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
function render() {
  const d = today();
  const c = S.checks[d] || {};
  let fullEl = null,
    idx = 0;
  $("date").textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  tickClock();
  const L = $("list");
  L.innerHTML = "";
  G.forEach((g) => {
    const ts = S.tasks.filter((t) => (t.g || "more") === g.id);
    if (!ts.length) return;
    const dn = ts.filter((t) => c[t.id]).length;
    const sec = document.createElement("section");
    sec.className =
      "grp" +
      (shut[g.id] ? " shut" : "") +
      (dn === ts.length ? " full" : "") +
      (g.id === fullG ? " bounceG" : "") +
      (firstR ? " enter" : "");
    sec.style.setProperty("--i", idx++);
    sec.style.setProperty("--gc", g.c);
    if (g.id === fullG) fullEl = sec;
    const h = document.createElement("button");
    h.type = "button";
    h.className = "gh";
    const mk = (cl, tx) => {
      const e = document.createElement("span");
      e.className = cl;
      e.textContent = tx;
      return e;
    };
    h.append(
      mk("ge", g.e),
      mk("gn", g.n),
      mk("gc", dn === ts.length ? "✓ Done" : dn + "/" + ts.length),
      mk("chev", "⌄"),
    );
    h.onclick = () => {
      shut[g.id] = !shut[g.id];
      if (!shut[g.id]) openedG = g.id;
      render();
    };
    const bar = document.createElement("div");
    bar.className = "gbar";
    const bi = document.createElement("i");
    bi.style.width = (prevW[g.id] || 0) + "%";
    const nw = (dn / ts.length) * 100;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        bi.style.width = nw + "%";
      }),
    );
    prevW[g.id] = nw;
    bar.appendChild(bi);
    sec.append(h, bar);
    if (!shut[g.id]) {
      const body = document.createElement("div");
      body.className = "gb" + (openedG === g.id ? " fx" : "");
      ts.forEach((t) => {
        const el = document.createElement("div");
        el.className = "item" + (c[t.id] ? " done" : "");
        const lb = document.createElement("label");
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.dataset.id = t.id;
        cb.checked = !!c[t.id];
        if (t.id === justId) cb.className = "just";
        cb.onchange = () => {
          S.checks[d] = S.checks[d] || {};
          S.checks[d][t.id] = cb.checked;
          const n = S.tasks.filter((x) => S.checks[d][x.id]).length;
          S.days[d] = n === S.tasks.length;
          save();
          if (cb.checked) {
            justId = t.id;
            const gid = t.g || "more";
            if (
              S.tasks
                .filter((x) => (x.g || "more") === gid)
                .every((x) => S.checks[d][x.id])
            )
              fullG = gid;
            allDone = S.days[d];
            const tb = builtN();
            const lb = lvOf(S.xp);
            let gn = award("t:" + t.id, 10);
            if (gn) {
              S.bs.tasks = (S.bs.tasks || 0) + 1;
              save();
            }
            if (fullG) gn += award("g:" + gid, 15);
            if (allDone) gn += award("all", 30);
            xpGain = gn;
            if (lvOf(S.xp) > lb) lvUp = lvOf(S.xp);
            if (builtN() > tb) newB = BLD[builtN() - 1].n;
            hop();
          }
          render();
          if (cb.checked) cheer(t, S.days[d]);
        };
        const tx = document.createElement("span");
        tx.className = "t";
        tx.textContent = t.t;
        if (t.m) {
          const hr = new Date().getHours() + new Date().getMinutes() / 60;
          if (hr >= t.m[0] && hr < t.m[1] && !c[t.id]) {
            const nb = document.createElement("span");
            nb.className = "nowb";
            nb.textContent = "NOW";
            tx.append(" ", nb);
          }
        }
        if (t.s) {
          const sm = document.createElement("small");
          sm.textContent = t.s;
          tx.appendChild(sm);
        }
        const hi = document.createElement("span");
        hi.className = "hi";
        hi.innerHTML = icoSvg(t.ic || DEFIC[t.id] || GIC[t.g || "more"]);
        lb.append(cb, hi, tx);
        el.appendChild(lb);
        if (t.id === justAdded) el.classList.add("newrow");
        if (/^c\d+$/.test(String(t.id))) {
          el.classList.add("itrow");
          const dl = document.createElement("button");
          dl.type = "button";
          dl.className = "del";
          dl.setAttribute("aria-label", "Remove habit");
          dl.innerHTML = icoSvg("trash");
          dl.onclick = (ev) => {
            ev.stopPropagation();
            if (dl.classList.contains("arm")) {
              S.tasks = S.tasks.filter((x) => x.id !== t.id);
              save();
              render();
              toast("Habit removed");
            } else {
              dl.classList.add("arm");
              setTimeout(() => dl.classList.remove("arm"), 2600);
            }
          };
          el.appendChild(dl);
        }
        body.appendChild(el);
      });
      sec.appendChild(body);
    }
    L.appendChild(sec);
  });
  const n = S.tasks.filter((t) => c[t.id]).length,
    tot = S.tasks.length;
  $("fill").style.width = (tot ? (n / tot) * 100 : 0) + "%";
  $("count").textContent = n + " of " + tot + " done";
  let st = 0,
    dt = new Date();
  if (!S.days[today()]) dt.setDate(dt.getDate() - 1);
  while (S.days[dkey(dt)]) {
    st++;
    dt.setDate(dt.getDate() - 1);
  }
  $("streak").textContent = st ? "🔥 " + st + "-day streak" : "";
  const sbT = "🔥" + st;
  if ($("sb").textContent !== sbT) {
    $("sb").textContent = sbT;
    rerun($("sb"), "pulse");
  }
  curStreak = st;
  syncPetUnlocks(st);
  const jx = document.querySelector("input.just");
  if (jx) {
    const r = jx.getBoundingClientRect();
    burst(r.left + 13, r.top + 13, 10, CONF);
  }
  if (fullG && fullEl) {
    const r = fullEl.getBoundingClientRect();
    burst(r.right - 50, r.top + 22, 18, CONF);
  }
  if (allDone) burst(innerWidth / 2, 140, 36, CONF);
  if (xpGain && jx) {
    const r = jx.getBoundingClientRect();
    floatXP(r.left + 34, r.top - 6, "+" + xpGain + " XP");
  }
  if (lvUp) levelUp(lvUp);
  if (newB) {
    const nn = newB;
    setTimeout(
      () => toast("🏗️ Your town built: " + nn + "! Check the Town tab."),
      1600,
    );
    newB = "";
  }
  xpGain = 0;
  lvUp = 0;
  drawHero();
  drawWeek();
  checkNbWin();
  justId = null;
  justAdded = null;
  fullG = null;
  allDone = false;
  openedG = null;
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
icMO.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
});
addEventListener("beforeunload", save);
