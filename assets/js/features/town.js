function sayW(w, txt, ms) {
  w.say.textContent = txt;
  w.say._on = true;
  w.talking = true;
  clearTimeout(w._t);
  w._t = setTimeout(() => {
    w.say._on = false;
    w.talking = false;
  }, ms || 4200);
}
function pickT(w) {
  w.tx = rnd(24, TW.W - 24);
  w.ty = rnd(TW.H * 0.7, TW.H * 0.95);
}
let bmData = null,
  bmSlide = "b";
function renderBuddyModal() {
  if (!bmData) return;
  const w = bmData,
    pt = petById(w.companion || w.p.pet);
  const tabs = $("bslides");
  tabs.hidden = !pt;
  $("bsl-b").classList.toggle("on", bmSlide === "b");
  $("bsl-p").classList.toggle("on", bmSlide === "p");
  const body = $("bbody");
  body.innerHTML = "";
  if (bmSlide === "b" || !pt) {
    const card = el("div", "bcard");
    const stg = el("div", "bstage");
    const lookNoHeadPet = Object.assign({}, w.p, { pet: "none" });
    stg.appendChild(svgOf(lookNoHeadPet, 76, 84));
    card.appendChild(stg);
    card.appendChild(el("h4", "", w.n));
    const tags = el("div", "stags");
    tags.style.justifyContent = "center";
    const kt = el("span", "stag", w.k === "me" ? "Traveler" : "Person met");
    kt.style.background = "#3f9d63";
    tags.appendChild(kt);
    tags.appendChild(
      el(
        "span",
        "stag lvt",
        w.k === "me" ? "⭐ Level " + lvOf(S.xp) : "📍 " + NB[w.town].n,
      ),
    );
    if (pt) tags.appendChild(el("span", "stag", "🐾 Pet: " + pt.n));
    card.appendChild(tags);
    const meta = el("div", "bmeta");
    const addM = (k, v) => {
      const d = document.createElement("div");
      d.append(el("small", "", k), el("b", "", v));
      meta.appendChild(d);
    };
    if (w.ref) {
      addM("⏱ Time together", fmtDur(Date.now() - (w.ref.born || Date.now())));
      addM("👆 Times Tapped", String(w.ref.clicks || 0));
      addM("✅ Tasks Together", String(w.ref.tasks || 0));
    }
    addM("🐾 Companion", pt ? pt.n : "None");
    card.appendChild(meta);
    const quote =
      w.k === "me"
        ? "“Hi" +
          (S.p.name ? ", " + S.p.name : "") +
          "! We’re on a 🔥 " +
          curStreak +
          "-day streak!”"
        : "“Welcome to " + NB[w.town].n + "! It’s nice to meet you.”";
    card.appendChild(el("div", "bquote", quote));
    body.appendChild(card);
  } else {
    const card = el("div", "bcard");
    const stg = el("div", "bstage");
    stg.innerHTML = petSvg(pt.id, 66, 60);
    card.appendChild(stg);
    card.appendChild(el("h4", "", pt.n));
    const tags = el("div", "stags");
    tags.style.justifyContent = "center";
    const stgBadge = el("span", "stag", w.k === "me" ? "🔥 " + pt.st + "-Day Streak Reward" : "🐾 Town companion");
    stgBadge.style.background = "#3f9d63";
    tags.appendChild(stgBadge);
    tags.appendChild(el("span", "stag lvt", "Partner: " + w.n));
    card.appendChild(tags);
    const meta = el("div", "bmeta");
    const addM = (k, v) => {
      const d = document.createElement("div");
      d.append(el("small", "", k), el("b", "", v));
      meta.appendChild(d);
    };
    addM("✨ Trait", pt.d);
    if (w.k === "me") {
      addM("🏆 Unlock Streak", pt.st + (pt.st === 1 ? " day" : " days"));
      addM("📍 Favorite Spot", "Rests on " + w.n + "’s head");
    }
    addM("🏘 Town Role", "Follows " + w.n);
    card.appendChild(meta);
    card.appendChild(
      el(
        "div",
        "bquote",
        "“" + pt.n + " faithfully walks alongside " + w.n + " every day!”",
      ),
    );
    body.appendChild(card);
  }
}
function openBuddyModal(w, slide) {
  bmData = w;
  bmSlide = slide === "p" && petById(w.companion || w.p.pet) ? "p" : "b";
  renderBuddyModal();
  $("bm").classList.add("show");
}
$("bsl-b").onclick = () => {
  bmSlide = "b";
  renderBuddyModal();
};
$("bsl-p").onclick = () => {
  bmSlide = "p";
  renderBuddyModal();
};
$("bdone").onclick = () => $("bm").classList.remove("show");
$("bm").onclick = (e) => {
  if (e.target === $("bm")) $("bm").classList.remove("show");
};

function poke(w) {
  clickAnim(w);
  emo(w, pk(["✨", "💛", "🙏"]));
  if (w.id && !S.peopleMet.some((person) => person && person.id === w.id)) {
    S.peopleMet.push({
      id: w.id,
      name: w.n,
      town: w.town,
      look: { ...w.p, ex: { ...w.p.ex } },
    });
    save();
    fillIndex();
  }
  if (w.ref) {
    w.ref.clicks = (w.ref.clicks || 0) + 1;
    save();
  }
  let t;
  if (w.k === "me")
    t =
      "Hi" +
      (S.p.name ? ", " + S.p.name : "") +
      "! " +
      (curStreak
        ? "🔥 " + curStreak + "-day streak!"
        : "Let’s start a streak today!");
  else if (w.k === "res" || w.k === "local") t = "It’s nice to meet you!";
  else {
    const v = pk(VS);
    t = "📖 “" + v.t + "” " + v.r;
  }
  sayW(w, t, 4400);
  openBuddyModal(w, "b");
}
function townInit() {
  const sc = $("scene");
  TW.W = sc.clientWidth;
  TW.H = sc.clientHeight;
  TW.conv = null;
  const host = $("walkers");
  host.innerHTML = "";
  TW.ws = [];
  TW.pets = [];
  const petHost = document.createDocumentFragment();
  const residentPets = PETS.filter((pet) => pet.st && pet.id !== "firefly");
  townCast().forEach((c, i) => {
    const companion = petById(c.p.pet) || (i > 0 && (i - 1) % 3 === 0
      ? residentPets[(NBK.indexOf(c.town) + Math.floor((i - 1) / 3)) % residentPets.length]
      : null);
    const el = document.createElement("div");
    el.className = "w";
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.setAttribute("aria-label", c.k === "me" ? "Your traveler" : "Meet " + c.n);
    const fl = document.createElement("div");
    fl.className = "fl";
    const sv = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    sv.setAttribute("viewBox", "0 -6 56 70");
    sv.setAttribute("width", "30");
    sv.setAttribute("height", "33");
    sv.setAttribute("class", "wk");
    sv.style.setProperty("--bd", (-Math.random() * 5).toFixed(1) + "s");
    const townLook = companion ? Object.assign({}, c.p, { pet: "none" }) : c.p;
    sv.innerHTML = '<g class="bod">' + personLayers(townLook) + "</g>";
    fl.appendChild(sv);
    const say = document.createElement("div");
    say.className = "say";
    el.append(say, fl);
    host.appendChild(el);
    const w = Object.assign({}, c, {
      el,
      fl,
      say,
      companion: companion && companion.id,
      dir: 1,
      x: rnd(30, TW.W - 30),
      y: rnd(TW.H * 0.72, TW.H * 0.94),
      sp: 14 + Math.random() * 10,
      pause: Math.random() * 2,
      hold: false,
    });
    pickT(w);
    TW.ws.push(w);
    el.onclick = () => poke(w);
    el.onkeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        poke(w);
      }
    };
    if (!companion) return;
    const pel = document.createElement("div");
    pel.className = "tpet";
    pel.dataset.owner = c.id || "traveler";
    const pfl = document.createElement("div");
    pfl.className = "pfl";
    pfl.innerHTML = petSvg(companion.id, 24, 22);
    pel.appendChild(pfl);
    pel.onclick = (e) => {
      e.stopPropagation();
      emo(w, "🐾");
      openBuddyModal(w, "p");
    };
    petHost.appendChild(pel);
    TW.pets.push({
      el: pel,
      pfl,
      dir: 1,
      x: Math.max(16, w.x - 18),
      y: w.y + 2,
      id: companion.id,
      owner: w,
    });
  });
  host.appendChild(petHost);
  dayShade();
}
function convStep(t) {
  const c = TW.conv;
  if (!c) return;
  const close = Math.hypot(c.a.x - c.b.x, (c.a.y - c.b.y) * 2) < 48;
  if (c.s === 0 && (close || t - c.t0 > 9)) {
    c.s = 1;
    c.t1 = t;
    c.a.pause = 6;
    c.b.pause = 6;
    emo(c.a, "💬");
    c.a.fl.style.transform = c.b.x < c.a.x ? "scaleX(-1)" : "none";
    c.b.fl.style.transform = c.a.x < c.b.x ? "scaleX(-1)" : "none";
    sayW(c.a, c.l[0], 3500);
  } else if (c.s === 1 && t - c.t1 > 2.8) {
    c.s = 2;
    c.t2 = t;
    sayW(c.b, c.l[1], 3500);
  } else if (c.s === 2 && t - c.t2 > 3.6) {
    c.a.hold = c.b.hold = false;
    c.a.pause = c.b.pause = 0.3;
    pickT(c.a);
    pickT(c.b);
    TW.conv = null;
  }
}
function townEvent(t) {
  TW.next = t + 5 + Math.random() * 5;
  if (TW.conv) return;
  const ws = TW.ws;
  if (Math.random() < 0.3 || ws.length < 2) {
    const w = pk(ws),
      v = pk(VS);
    sayW(w, "📖 “" + v.t + "” " + v.r, 5200);
    return;
  }
  const a = pk(ws);
  let b = pk(ws);
  while (b === a) b = pk(ws);
  a.hold = b.hold = true;
  b.pause = 9;
  a.pause = 0;
  a.tx = b.x + (a.x < b.x ? -26 : 26);
  a.ty = b.y;
  TW.conv = { a, b, l: pk(DLG), s: 0, t0: t };
}
function clickAnim(w) {
  w.pause = 1.3;
  w.el.classList.remove("mv");
  rerun(w.fl.firstChild.firstChild, "hopw");
  w.el.classList.add("clk");
  clearTimeout(w._c);
  w._c = setTimeout(() => w.el.classList.remove("clk"), 950);
  const r = w.el.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height * 0.5, 14, CONF);
  const g = document.createElement("span");
  g.className = "ring";
  g.style.left = w.x + "px";
  g.style.top = w.y + "px";
  $("walkers").appendChild(g);
  setTimeout(() => g.remove(), 800);
}
function dust(x, y) {
  const e = document.createElement("span");
  e.className = "dust";
  e.style.left = x + "px";
  e.style.top = y + "px";
  $("walkers").appendChild(e);
  setTimeout(() => e.remove(), 650);
}
function emo(w, t) {
  const e = document.createElement("span");
  e.className = "emo";
  e.textContent = t;
  w.el.appendChild(e);
  setTimeout(() => e.remove(), 1050);
}
function dayShade() {
  const d = new Date(),
    h = d.getHours() + d.getMinutes() / 60,
    sleeping = h >= 20 || h < 7;
  if (sleeping !== TW.sleeping) {
    TW.sleeping = sleeping;
    TW.conv = null;
    TW.ws.forEach((w) => {
      w.hold = false;
      w.talking = false;
      w.say._on = false;
      clearTimeout(w._t);
    });
    if (!sleeping) TW.next = performance.now() / 1000 + 4;
  }
  $("walkers").hidden = sleeping;
  $("scene").classList.toggle("sleeping", sleeping);
  const isSpace = NB[V()] && NB[V()].pl !== "earth";
  if (isSpace) {
    $("nightr").setAttribute("opacity", "0.12");
    $("stars").setAttribute("opacity", "0.95");
    $("sunG").setAttribute("opacity", "0.55");
    $("moon").setAttribute("opacity", "0.85");
    $("scene").classList.remove("night");
    return;
  }
  let n;
  if (h >= 7 && h < 18) n = 0;
  else if (h >= 5 && h < 7) n = (7 - h) / 2;
  else if (h >= 18 && h < 20) n = (h - 18) / 2;
  else n = 1;
  $("nightr").setAttribute("opacity", (n * 0.45).toFixed(2));
  $("stars").setAttribute("opacity", Math.min(1, n * 1.5).toFixed(2));
  $("sunG").setAttribute("opacity", (1 - n).toFixed(2));
  $("moon").setAttribute("opacity", n.toFixed(2));
  $("scene").classList.toggle("night", n > 0.4);
}
function tick(ts) {
  if (!TW.on) return;
  const t = ts / 1000,
    dt = Math.min(0.06, t - (TW.last || t));
  TW.last = t;
  if (TW.sleeping) {
    TW.raf = requestAnimationFrame(tick);
    return;
  }
  TW.ws.forEach((w) => {
    if (w.pause > 0) {
      w.pause -= dt;
      w.el.classList.remove("mv");
    } else {
      const dx = w.tx - w.x,
        dy = (w.ty - w.y) * 1.4,
        d = Math.hypot(dx, dy);
      if (d < 3) {
        w.pause = w.hold ? 0.3 : 1.2 + Math.random() * 3.5;
        if (!w.hold) pickT(w);
        w.el.classList.remove("mv");
      } else {
        const st = Math.min(d, w.sp * dt);
        w.x += (dx / d) * st;
        w.y += ((dy / d) * st) / 1.4;
        w.el.classList.add("mv");
        if (Math.abs(dx) > 0.4) w.dir = dx < 0 ? -1 : 1;
        w.fl.style.transform = w.dir < 0 ? "scaleX(-1)" : "none";
        w.dd = (w.dd || 0) - dt;
        if (w.dd <= 0) {
          w.dd = 0.26;
          dust(w.x, w.y);
        }
      }
    }
    w.el.style.transform =
      "translate(" +
      w.x.toFixed(1) +
      "px," +
      w.y.toFixed(1) +
      "px) translate(-50%,-100%) scale(" +
      (0.8 + 0.3 * (w.y / TW.H)).toFixed(2) +
      ")";
    w.el.style.zIndex = w.talking ? 999 : Math.round(w.y);
    w.el.classList.toggle("tk", !!w.talking);
    const cn =
      "say" +
      (w.say._on ? " show" : "") +
      (w.x < 70 ? " l" : w.x > TW.W - 70 ? " r" : "");
    if (w.say.className !== cn) w.say.className = cn;
  });
  TW.pets.forEach((pt) => {
    const owner = pt.owner;
    const tx = Math.max(14, Math.min(TW.W - 14, owner.x - (owner.dir || 1) * 18)),
      ty = owner.y + 2;
    const dx = tx - pt.x,
      dy = ty - pt.y,
      d = Math.hypot(dx, dy);
    if (d > 4) {
      const spd = Math.min(34, Math.max(12, d * 1.8));
      const st = Math.min(d, spd * dt);
      pt.x += (dx / d) * st;
      pt.y += (dy / d) * st;
      pt.el.classList.add("mv");
      if (Math.abs(dx) > 1.5) pt.dir = dx < 0 ? -1 : 1;
    } else {
      pt.el.classList.remove("mv");
      pt.dir = owner.dir || 1;
    }
    pt.pfl.style.transform = pt.dir < 0 ? "scaleX(-1)" : "none";
    pt.el.style.transform =
      "translate(" +
      pt.x.toFixed(1) +
      "px," +
      pt.y.toFixed(1) +
      "px) translate(-50%,-100%) scale(" +
      (0.78 + 0.22 * (pt.y / TW.H)).toFixed(2) +
      ")";
    pt.el.style.zIndex = Math.round(pt.y) - 1;
  });
  convStep(t);
  if (t > TW.next) townEvent(t);
  TW.raf = requestAnimationFrame(tick);
}
function townStop() {
  TW.on = false;
  cancelAnimationFrame(TW.raf);
}
function townOpen() {
  townInfo();
  drawScene(true);
  townInit();
  const id = V(),
    built = nbBuilt(id).length,
    seen = S.nb.seen[id] === undefined ? built : S.nb.seen[id],
    nb = built - seen;
  if (nb > 0) {
    const names = BLD.slice(seen, built).map((b) => b.n);
    setTimeout(() => {
      toast(
        names.length > 3
          ? names.length + " new buildings in town!"
          : "New in town: " + names.join(", "),
      );
      document.querySelectorAll("#bld .bd.build").forEach((el) => {
        const r = el.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height * 0.7, 14, CONF);
      });
    }, 900);
  }
  if (S.nb.seen[id] !== built) {
    S.nb.seen[id] = built;
    save();
  }
  if (S.vday !== today()) {
    S.vday = today();
    save();
    const v = vOfDay(),
      me = TW.ws[0];
    setTimeout(() => {
      if (!TW.sleeping && TW.ws.includes(me)) sayW(me, "📖 “" + v.t + "” " + v.r, 7000);
    }, 1000);
  }
  TW.on = true;
  TW.last = 0;
  TW.next = performance.now() / 1000 + 4;
  cancelAnimationFrame(TW.raf);
  TW.raf = requestAnimationFrame(tick);
}
$("vcard").onclick = () => {
  if (TW.ws[0]) {
    const v = vOfDay();
    sayW(TW.ws[0], "📖 “" + v.t + "” " + v.r, 7000);
    clickAnim(TW.ws[0]);
  }
};
function fmtDur(ms) {
  const m = Math.max(0, Math.floor(ms / 6e4)),
    d = Math.floor(m / 1440),
    h = Math.floor((m % 1440) / 60),
    mi = m % 60;
  return (
    d +
    (d === 1 ? " day" : " days") +
    " · " +
    h +
    (h === 1 ? " hr" : " hrs") +
    " · " +
    mi +
    " min"
  );
}
const el = (t, c, x) => {
  const e = document.createElement(t);
  if (c) e.className = c;
  if (x != null) e.textContent = x;
  return e;
};
function svgOf(look, w, hh) {
  const sv = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  sv.setAttribute("viewBox", "0 -6 56 62");
  sv.setAttribute("width", w);
  sv.setAttribute("height", hh);
  sv.innerHTML = personLayers(look);
  return sv;
}
function fillStats() {
  const bl = [{ n: S.p.buddy || "Buddy", p: S.p, bs: S.bs, cur: true }].concat(
    S.res.map((r) => ({ n: r.n, p: r.l, bs: r, cur: false })),
  );
  const mc = Math.max(...bl.map((b) => b.bs.clicks || 0)),
    mt = Math.max(...bl.map((b) => b.bs.tasks || 0));
  const tt = bl.reduce((a, b) => a + (b.bs.tasks || 0), 0),
    tk = bl.reduce((a, b) => a + (b.bs.clicks || 0), 0);
  $("ssum").textContent =
    "👥 " +
    bl.length +
    (bl.length === 1 ? " buddy" : " buddies") +
    "  ·  ✅ " +
    tt +
    " tasks  ·  👆 " +
    tk +
    " taps";
  const L = $("slist");
  L.innerHTML = "";
  bl.forEach((b) => {
    const k = KINDS[b.p.kind] || KINDS.square,
      card = el("div", "scard");
    const pv = el("div", "spv");
    pv.appendChild(svgOf(b.p, 48, 52));
    const inf = el("div", "sinf");
    inf.appendChild(el("b", "", b.n));
    const tags = el("div", "stags");
    const kt = el("span", "stag", k.n + " · " + k.r);
    kt.style.background = k.c;
    tags.appendChild(kt);
    tags.appendChild(
      el(
        "span",
        "stag lvt",
        b.cur ? "⭐ Level " + lvOf(S.xp) : "🎓 Level 10 resident",
      ),
    );
    if (mc > 0 && (b.bs.clicks || 0) === mc)
      tags.appendChild(el("span", "stag hot", "🔥 Most clicked"));
    if (mt > 0 && (b.bs.tasks || 0) === mt)
      tags.appendChild(el("span", "stag hot", "🏆 Most tasks"));
    inf.appendChild(tags);
    inf.appendChild(
      el(
        "div",
        "srow",
        "⏱ In town: " + fmtDur(Date.now() - (b.bs.born || Date.now())),
      ),
    );
    inf.appendChild(
      el(
        "div",
        "srow",
        "👆 Tapped " +
          (b.bs.clicks || 0) +
          (b.bs.clicks === 1 ? " time" : " times"),
      ),
    );
    inf.appendChild(
      el("div", "srow", "✅ " + (b.bs.tasks || 0) + " tasks done together"),
    );
    card.append(pv, inf);
    L.appendChild(card);
  });
}
$("sbtn").onclick = () => {
  fillStats();
  $("sm").classList.add("show");
};
$("sdone").onclick = () => $("sm").classList.remove("show");
$("sm").onclick = (e) => {
  if (e.target === $("sm")) $("sm").classList.remove("show");
};
setInterval(() => {
  if ($("sm").classList.contains("show")) fillStats();
}, 20000);
const RAR = [
  ["circle", 50],
  ["triangle", 30],
  ["rectangle", 15],
  ["duck", 5],
];
function chestPool() {
  const pool = [
    ["circle", 40],
    ["triangle", 25],
    ["rectangle", 15],
  ];
  NBK.forEach((k) => {
    const b = NB[k].bud;
    if (b && unlockedKinds().has(b)) pool.push([b, 22]);
  });
  [
    "earthplanet",
    "marsplanet",
    "jupiterplanet",
    "saturnplanet",
    "uranusplanet",
    "neptuneplanet",
  ].forEach((pb) => {
    if (unlockedKinds().has(pb)) pool.push([pb, 10]);
  });
  pool.push(["duck", 6]);
  return pool;
}
function rollKind() {
  const pool = chestPool(),
    tot = pool.reduce((a, b) => a + b[1], 0);
  let r = Math.random() * tot;
  for (const t of pool) {
    if (r < t[1]) return t[0];
    r -= t[1];
  }
  return "circle";
}
const CHEST =
  '<svg viewBox="0 0 80 70" width="92" height="80" aria-hidden="true"><rect x="8" y="32" width="64" height="34" rx="4" fill="#8b5a2b"/><rect x="8" y="42" width="64" height="6" fill="#f0c14b"/><rect x="33" y="40" width="14" height="14" rx="2" fill="#f0c14b"/><circle cx="40" cy="46" r="2.2" fill="#6b4423"/><g class="lid"><path d="M8 32Q8 8 40 8Q72 8 72 32Z" fill="#a0692f"/><rect x="34" y="9" width="12" height="23" fill="#f0c14b"/></g></svg>';
function askGrad() {
  $("cs").className = "cs show";
  csIntro();
}
function csIntro() {
  const b = $("csb");
  b.innerHTML = "";
  const nm = S.p.buddy || "Buddy";
  b.append(el("div", "cstitle", "🎓 " + nm + " reached Level 10!"));
  const bw = el("div", "csbud");
  bw.appendChild(svgOf(S.p, 110, 122));
  b.appendChild(bw);
  b.append(
    el(
      "p",
      "cssub",
      nm + " is ready to move into Faith Town. Time to meet your next buddy!",
    ),
  );
  const go = el("button", "done", "Continue ›");
  go.type = "button";
  go.onclick = csChests;
  b.appendChild(go);
  const no = el("button", "back", "Not yet");
  no.type = "button";
  no.onclick = () => {
    $("cs").className = "cs";
  };
  b.appendChild(no);
  setTimeout(() => burst(innerWidth / 2, innerHeight / 3, 36, CONF), 300);
}
function csChests() {
  const b = $("csb");
  b.innerHTML = "";
  const picked = { v: false };
  b.append(el("div", "cstitle", "Pick a chest!"));
  b.append(el("p", "cssub", "Which buddy will join you next?"));
  const lg = el("div", "leg2");
  chestPool().forEach((r) => {
    const kd = KINDS[r[0]];
    const c = el("span", "stag", kd.n + " · " + kd.r);
    c.style.background = kd.c;
    lg.appendChild(c);
  });
  b.appendChild(lg);
  const row = el("div", "crow"),
    cws = [];
  for (let i = 0; i < 3; i++) {
    const cw = el("div", "cw");
    cw.style.setProperty("--d", -i * 0.7 + "s");
    const slot = el("div", "slot"),
      ch = el("button", "chest");
    ch.type = "button";
    ch.innerHTML = CHEST;
    const lt = el("div", "light"),
      lb = el("div", "clbl", "?");
    cw.append(lt, slot, ch, lb);
    row.appendChild(cw);
    cws.push({ cw, slot, ch, lb });
    ch.onclick = () => {
      if (picked.v) return;
      picked.v = true;
      pickChest(i, cws, b);
    };
  }
  b.appendChild(row);
  b.appendChild(el("div", "cshint", "Tap a chest to open it"));
}
function showKind(c, kind, dim) {
  const w = el("div", "bud" + (dim ? " dim" : ""));
  w.appendChild(svgOf(freshLook(kind), 56, 62));
  c.slot.appendChild(w);
  c.lb.textContent = KINDS[kind].n + " · " + KINDS[kind].r;
  c.lb.style.color = KINDS[kind].c;
}
function pickChest(i, cws, b) {
  const rolls = [rollKind(), rollKind(), rollKind()],
    kind = rolls[i],
    c = cws[i],
    k = KINDS[kind];
  rolls.forEach((r) => {
    S.seenK[r] = 1;
  });
  save();
  b.querySelector(".cshint").remove();
  cws.forEach((x, n) => {
    if (n !== i) x.cw.classList.add("fade");
  });
  c.ch.classList.add("shake");
  setTimeout(() => {
    c.ch.classList.remove("shake");
    c.cw.classList.add("open");
    showKind(c, kind, false);
    const cs = $("cs");
    if (kind === "duck") {
      cs.classList.add("leg", "flash");
      burst(innerWidth / 2, innerHeight / 2, 80, [
        "#ffd23f",
        "#ffb300",
        "#fff3b0",
        "#ff9d2e",
        "#fff",
      ]);
    } else burst(innerWidth / 2, innerHeight / 2, 34, [k.c, "#fff", "#f0c14b"]);
    const rb = el(
      "div",
      "rar",
      kind === "duck" ? "✨ LEGENDARY! ✨" : k.r.toUpperCase() + "!",
    );
    rb.style.color = k.c;
    if (kind === "duck") rb.classList.add("gold");
    b.appendChild(rb);
    setTimeout(() => {
      cws.forEach((x, n) => {
        if (n !== i) {
          x.cw.classList.remove("fade");
          x.cw.classList.add("open", "dimc");
          showKind(x, rolls[n], true);
        }
      });
    }, 700);
    setTimeout(() => {
      const f = el("div", "csf");
      f.append(el("p", "cssub", "Name your new " + k.n + " buddy:"));
      const inp = document.createElement("input");
      inp.id = "csn";
      inp.maxLength = 20;
      inp.placeholder = "Buddy";
      f.appendChild(inp);
      const go = el("button", "done", "Welcome, " + k.n + " Buddy! ›");
      go.type = "button";
      go.onclick = () => finishCut(kind);
      f.appendChild(go);
      b.appendChild(f);
    }, 1500);
  }, 1000);
}
function finishCut(kind) {
  const nm = ($("csn").value || "").trim() || "Buddy",
    look = {};
  [
    "kind",
    "hat",
    "topStyle",
    "topColor",
    "pants",
    "shoes",
    "eyes",
    "glasses",
    "mouth",
    "body",
    "pet",
  ].forEach((k) => {
    look[k] = S.p[k];
  });
  look.ex = Object.assign({}, S.p.ex || {});
  S.res.push({
    n: S.p.buddy || "Buddy",
    l: look,
    born: S.bs.born,
    clicks: S.bs.clicks || 0,
    tasks: S.bs.tasks || 0,
    gradAt: Date.now(),
  });
  Object.assign(S.p, freshLook(kind), { buddy: nm });
  S.bs = { born: Date.now(), clicks: 0, tasks: 0 };
  S.xp = 0;
  save();
  paint();
  drawHero();
  render();
  $("cs").className = "cs";
  if (PG !== "t") go("t");
  else townOpen();
  setTimeout(() => {
    toast(
      "🎉 " +
        nm +
        " the " +
        KINDS[kind].n +
        " is your new buddy! Your old buddy moved into town.",
    );
    burst(innerWidth / 2, innerHeight / 3, 44, CONF);
  }, 700);
}
$("gbtn").onclick = askGrad;
$("go-grad").onclick = () => {
  $("pm").classList.remove("show");
  askGrad();
};
