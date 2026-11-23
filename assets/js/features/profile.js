const LOCKS = [
  ["hat", "cowboy", "🤠 Cowboy hat", 2],
  ["hat", "party", "🎉 Party hat", 2],
  ["ex", "backpack", "🎒 Backpack", 2],
  ["ex", "scarf", "🧣 Scarf", 2],
  ["topStyle", "jacket", "Jacket", 2],
  ["hat", "tophat", "🎩 Top hat", 3],
  ["hat", "phones", "🎧 Headphones", 3],
  ["glasses", "shades", "😎 Shades", 3],
  ["topStyle", "stripes", "Striped top", 3],
  ["ex", "cheeks", "🌸 Blush", 3],
  ["hat", "halo", "😇 Halo", 4],
  ["ex", "cape", "🦸 Cape", 4],
  ["ex", "bowtie", "🎀 Bow tie", 4],
  ["hat", "wizard", "🧙 Wizard hat", 5],
  ["hat", "crown", "👑 Crown", 6],
];
const lockLv = (c, k) => {
  const e = LOCKS.find((x) => x[0] === c && x[1] === k);
  return e ? e[3] : 0;
};
const TITLES = [
  "Newcomer",
  "Sprout",
  "Walker",
  "Faithful",
  "Steadfast",
  "Champion",
  "Shepherd",
  "Lightbearer",
  "Overcomer",
  "Legend",
];
const LV_START = (n) => 40 * n * (n - 1);
function lvOf(xp) {
  let n = 1;
  while (n < 10 && xp >= LV_START(n + 1)) n++;
  return n;
}
const ttl = (n) => TITLES[Math.min(n, TITLES.length) - 1];
function lvInfo() {
  const n = lvOf(S.xp),
    a = LV_START(n);
  if (n >= 10) return { n, a, b: a, need: 1, into: 1, pct: 100, max: true };
  const b = LV_START(n + 1);
  return {
    n,
    a,
    b,
    need: b - a,
    into: S.xp - a,
    pct: ((S.xp - a) / (b - a)) * 100,
  };
}
function award(k, amt) {
  if (S.aw.d !== today()) S.aw = { d: today(), k: {} };
  if (S.aw.k[k]) return 0;
  S.aw.k[k] = 1;
  S.xp += amt;
  S.life = (S.life || 0) + amt;
  S.nb.xp[S.nb.cur] = (S.nb.xp[S.nb.cur] || 0) + amt;
  save();
  return amt;
}
function drawHero() {
  const I = lvInfo();
  $("lvb").textContent = "Lv " + I.n;
  $("lvt").textContent = ttl(I.n);
  $("xpn").textContent = I.max ? "MAX 🎓" : I.into + " / " + I.need + " XP";
  $("xfill").style.width = I.pct + "%";
}
function toast(t) {
  const e = $("toast");
  e.textContent = t;
  rerun(e, "show");
  clearTimeout(e._t);
  e._t = setTimeout(() => e.classList.remove("show"), 2700);
}
function floatXP(x, y, t) {
  const e = document.createElement("span");
  e.className = "fxp";
  e.textContent = t;
  e.style.left = x + "px";
  e.style.top = y + "px";
  document.body.appendChild(e);
  setTimeout(() => e.remove(), 1000);
}
function levelUp(n) {
  $("lun").textContent = n;
  $("lut").textContent = ttl(n);
  const un = LOCKS.filter((x) => x[3] === n).map((x) => x[2]);
  $("luu").textContent =
    n >= 10
      ? "Max level! Open the Town tab to graduate your buddy into town and start a new one."
      : un.length
        ? "Unlocked: " + un.join(", ")
        : "Keep going, more rewards are ahead!";
  setTimeout(() => {
    $("lu").classList.add("show");
    burst(innerWidth / 2, innerHeight / 3, 44, CONF);
  }, 700);
}
$("lugo").onclick = () => {
  $("lu").classList.remove("show");
  hop();
};
$("hero").onclick = () => $("prof").click();
function chips(el, list, cur, pick, cat) {
  el.innerHTML = "";
  const lv = lvOf(S.xp);
  list.forEach((o) => {
    const b = document.createElement("button");
    b.type = "button";
    const need = cat ? lockLv(cat, o[0]) : 0,
      lk = need > lv;
    b.className =
      "chip" +
      (o[0] === cur ? " on" : "") +
      (lk ? " locked" : "") +
      (el.dataset.k + ":" + o[0] === popTok ? " pop" : "");
    if (o[2]) {
      const i = document.createElement("i");
      i.style.background = o[2];
      b.appendChild(i);
    }
    b.append(o[1]);
    if (lk) {
      const sm = document.createElement("small");
      sm.textContent = "🔒 Lv " + need;
      b.appendChild(sm);
    }
    b.onclick = () => {
      if (lk) {
        toast("🔒 Reach level " + need + " to unlock " + o[1]);
        rerun(b, "shake");
        return;
      }
      popTok = el.dataset.k + ":" + o[0];
      pick(o[0]);
    };
    el.appendChild(b);
  });
}
let wTab = "hats";
const TABS = [
  ["buddies", "🔷 Buddies"],
  ["hats", "🎩 Hats"],
  ["pets", "🐾 Pets"],
  ["tops", "👕 Tops"],
  ["bottoms", "👖 Bottoms"],
  ["face", "😎 Face"],
  ["extras", "✨ Extras"],
  ["color", "🎨 Color"],
];
function sec(host, title, list, cur, pick, cat) {
  const l = document.createElement("div");
  l.className = "fl";
  l.textContent = title;
  const c = document.createElement("div");
  c.className = "chips";
  c.dataset.k = title;
  l.appendChild(c);
  host.appendChild(l);
  chips(c, list, cur, pick, cat);
}
function setP(k, v) {
  S.p[k] = v;
  save();
  paint();
  react();
  buildWd();
}
function buildWd() {
  $("wtabs").dataset.k = "tab";
  chips($("wtabs"), TABS, wTab, (v) => {
    wTab = v;
    rerun($("wbody"), "fx");
    buildWd();
  });
  const h = $("wbody");
  h.innerHTML = "";
  const p = S.p;
  if (wTab === "buddies") {
    const l = document.createElement("div");
    l.className = "fl";
    l.textContent = "Tap any unlocked buddy to equip them instantly!";
    h.appendChild(l);
    if (!window._wdPl) window._wdPl = "all";
    const pbar = el("div", "ixpbar");
    [
      ["all", "✨ All"],
      ["earth", "🌍 Earth"],
      ["mars", "🔴 Mars"],
      ["jupiter", "🟠 Jupiter"],
      ["saturn", "🪐 Saturn"],
      ["uranus", "🩵 Uranus"],
      ["neptune", "🔵 Neptune"],
    ].forEach(([pid, lblTxt]) => {
      const b = el(
        "button",
        "ixpchip" + (window._wdPl === pid ? " on" : ""),
        lblTxt,
      );
      b.type = "button";
      b.onclick = () => {
        window._wdPl = pid;
        buildWd();
      };
      pbar.appendChild(b);
    });
    h.appendChild(pbar);
    const grid = document.createElement("div");
    grid.className = "pgrid";
    const unl = unlockedKinds();
    Object.keys(KINDS)
      .filter(
        (k) =>
          window._wdPl === "all" || (KINDS[k].pl || "earth") === window._wdPl,
      )
      .forEach((k) => {
        const kd = KINDS[k];
        const isUnl =
          k === "square" ||
          k === "circle" ||
          k === "triangle" ||
          k === "rectangle" ||
          k === "duck" ||
          unl.has(k);
        const eq = p.kind === k;
        const c = document.createElement("button");
        c.type = "button";
        c.className = "pcard" + (eq ? " on" : "") + (isUnl ? "" : " lk");
        const pv = document.createElement("div");
        pv.className = "ixp";
        pv.style.height = "60px";
        pv.style.margin = "0 0 4px";
        if (isUnl) {
          const lkLook = freshLook(k);
          [
            "hat",
            "topStyle",
            "topColor",
            "pants",
            "shoes",
            "eyes",
            "glasses",
            "mouth",
            "body",
            "ex",
          ].forEach((fk) => {
            if (p[fk] !== undefined) lkLook[fk] = p[fk];
          });
          pv.appendChild(svgOf(lkLook, 52, 56));
        } else {
          pv.appendChild(el("span", "ixq", "?"));
        }
        c.appendChild(pv);
        c.appendChild(el("b", "", isUnl ? kd.n : "???"));
        c.appendChild(
          el(
            "small",
            "",
            eq
              ? "Equipped ✓"
              : isUnl
                ? kd.r
                : "🔒 Settle " + (kd.nb ? NB[kd.nb].n : "town"),
          ),
        );
        c.onclick = () => {
          if (!isUnl) {
            toast(
              "🔒 Settle " +
                (kd.nb ? NB[kd.nb].n : "the ecosystem") +
                " on the Solar Map to unlock " +
                kd.n +
                "!",
            );
            rerun(c, "shake");
            return;
          }
          S.p.kind = k;
          if (!BODY[p.body]) S.p.body = kd.body;
          save();
          paint();
          react();
          buildWd();
          toast("Equipped " + kd.n + "!");
        };
        grid.appendChild(c);
      });
    h.appendChild(grid);
  }
  if (wTab === "hats") sec(h, "Hat", HATS, p.hat, (v) => setP("hat", v), "hat");
  if (wTab === "tops") {
    sec(
      h,
      "Style",
      [
        ["none", "None"],
        ["tee", "T-shirt"],
        ["jacket", "Jacket"],
        ["stripes", "Stripes"],
      ],
      p.topStyle,
      (v) => setP("topStyle", v),
      "topStyle",
    );
    if (p.topStyle !== "none")
      sec(h, "Color", cn(COL), p.topColor, (v) => setP("topColor", v));
  }
  if (wTab === "bottoms") {
    sec(h, "Pants", cz(PANTS), p.pants, (v) => setP("pants", v));
    sec(h, "Shoes", cz(SHOES), p.shoes, (v) => setP("shoes", v));
  }
  if (wTab === "face") {
    sec(
      h,
      "Eyes",
      [
        ["normal", "Normal"],
        ["round", "Round"],
        ["happy", "Happy"],
        ["wink", "Wink"],
      ],
      p.eyes,
      (v) => setP("eyes", v),
    );
    sec(
      h,
      "Glasses",
      [
        ["none", "None"],
        ["square", "Square"],
        ["round", "Round"],
        ["shades", "😎 Shades"],
      ],
      p.glasses,
      (v) => setP("glasses", v),
      "glasses",
    );
    sec(
      h,
      "Mouth",
      [
        ["none", "None"],
        ["smile", "Smile"],
        ["open", "Open"],
      ],
      p.mouth,
      (v) => setP("mouth", v),
    );
  }
  if (wTab === "extras") {
    const l = document.createElement("div");
    l.className = "fl";
    l.textContent = "Tap to turn on or off";
    const c = document.createElement("div");
    c.className = "chips";
    l.appendChild(c);
    h.appendChild(l);
    const lv = lvOf(S.xp);
    [
      ["scarf", "🧣 Scarf"],
      ["bowtie", "🎀 Bow tie"],
      ["cape", "🦸 Cape"],
      ["backpack", "🎒 Backpack"],
      ["cheeks", "🌸 Blush"],
    ].forEach((o) => {
      const need = lockLv("ex", o[0]),
        lk = need > lv;
      const b = document.createElement("button");
      b.type = "button";
      b.className =
        "chip" +
        (p.ex && p.ex[o[0]] ? " on" : "") +
        (lk ? " locked" : "") +
        ("x:" + o[0] === popTok ? " pop" : "");
      b.textContent = o[1];
      if (lk) {
        const sm = document.createElement("small");
        sm.textContent = "🔒 Lv " + need;
        b.appendChild(sm);
      }
      b.onclick = () => {
        if (lk) {
          toast("🔒 Reach level " + need + " to unlock " + o[1]);
          rerun(b, "shake");
          return;
        }
        popTok = "x:" + o[0];
        S.p.ex = S.p.ex || {};
        S.p.ex[o[0]] = !S.p.ex[o[0]];
        save();
        paint();
        react();
        buildWd();
      };
      c.appendChild(b);
    });
  }
  if (wTab === "pets") {
    const best = Math.max(curStreak, streakBest());
    const l = document.createElement("div");
    l.className = "fl";
    l.textContent =
      "Best streak: 🔥 " +
      best +
      " days · Active pet rests on your buddy’s head & follows in Faith Town!";
    h.appendChild(l);
    const grid = document.createElement("div");
    grid.className = "pgrid";
    const noneBtn = document.createElement("button");
    noneBtn.type = "button";
    noneBtn.className = "pcard" + (!p.pet || p.pet === "none" ? " on" : "");
    noneBtn.innerHTML =
      '<div style="height:34px;display:grid;place-items:center;font-size:20px;color:var(--mute)">∅</div><b>No Pet</b><small>Rest on your own</small>';
    noneBtn.onclick = () => setP("pet", "none");
    grid.appendChild(noneBtn);
    PETS.forEach((pt) => {
      const unl = isPetUnlocked(pt, best);
      if (unl && !S.pets[pt.id]) {
        S.pets[pt.id] = 1;
        save();
      }
      const on = p.pet === pt.id;
      const reqTxt = pt.nb
        ? "🔒 Settle " + NB[pt.nb].n
        : "🔒 " + pt.st + "-day streak";
      const c = document.createElement("button");
      c.type = "button";
      c.className = "pcard" + (on ? " on" : "") + (unl ? "" : " lk");
      c.innerHTML =
        petSvg(pt.id, 34, 32) +
        "<b>" +
        pt.n +
        "</b><small>" +
        (on ? "Equipped ✓" : unl ? pt.d : reqTxt) +
        "</small>";
      c.onclick = () => {
        if (!unl) {
          toast(
            pt.nb
              ? "🚀 Settle " +
                  NB[pt.nb].n +
                  " on the Solar Map to unlock " +
                  pt.n +
                  "!"
              : "🔥 Reach a " + pt.st + "-day streak to unlock " + pt.n + "!",
          );
          rerun(c, "shake");
          return;
        }
        setP("pet", on ? "none" : pt.id);
      };
      grid.appendChild(c);
    });
    h.appendChild(grid);
  }
  if (wTab === "color")
    sec(h, "Body color", cn(BODY), p.body, (v) => setP("body", v));
  popTok = null;
}
function fillLv() {
  const I = lvInfo(),
    L = $("lvlist");
  L.innerHTML = "";
  for (let n = 1; n <= 10; n++) {
    const r = document.createElement("div");
    r.className =
      "lvrow" + (n < I.n ? " past" : "") + (n === I.n ? " cur" : "");
    const nb = document.createElement("span");
    nb.className = "lvn";
    nb.textContent = n;
    const t = document.createElement("div");
    const b = document.createElement("b");
    b.textContent = ttl(n);
    const sm = document.createElement("small");
    const un = LOCKS.filter((x) => x[3] === n).map((x) => x[2]);
    sm.textContent =
      (n === 1 ? "Start here" : LV_START(n) + " XP") +
      (un.length ? " · Unlocks " + un.join(", ") : "");
    t.append(b, sm);
    const st = document.createElement("span");
    st.textContent = n < I.n ? "✓" : n === I.n ? "⭐" : "🔒";
    r.append(nb, t, st);
    L.appendChild(r);
  }
}
function fillInfo(anim) {
  const cur = curStreak,
    best = Math.max(streakBest(), cur);
  let tot = 0;
  Object.values(S.checks).forEach((o) => {
    Object.values(o).forEach((v) => {
      if (v) tot++;
    });
  });
  const f = (el, n) => (anim ? countTo(el, n) : (el.textContent = n));
  f($("s1"), cur);
  f($("s2"), best);
  f($("s3"), tot);
  $("pn").value = S.p.name;
  $("bn").value = S.p.buddy;
  $("pst").textContent =
    (S.p.buddy || "Buddy") +
    (cur
      ? " is cheering for your " + cur + "-day streak!"
      : " is ready when you are!");
  renderUsers();
}
function view(v) {
  ["menu", "wd", "lv", "info"].forEach((x) => {
    $("v-" + x).hidden = x !== v;
  });
  rerun($("v-" + v), "fx");
  if (v === "menu") {
    const I = lvInfo();
    $("mt").textContent = S.p.buddy || "Buddy";
    $("mst").textContent = "Level " + I.n + " · " + ttl(I.n);
    $("mxt").textContent = I.max
      ? "Max level reached! 🎉"
      : I.into + " / " + I.need + " XP to level " + (I.n + 1);
    $("mp1").textContent = "🔥 " + curStreak + "-day streak";
    $("mp2").textContent = "⭐ " + S.xp + " XP";
    $("mp3").textContent = "👤 " + (S.p.name || "Friend");
    $("go-grad").hidden = !maxed();
    const x = $("mxf");
    x.style.width = "0%";
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        x.style.width = I.pct + "%";
      }),
    );
  }
  if (v === "wd") buildWd();
  if (v === "lv") fillLv();
  if (v === "info") fillInfo(true);
}
$("prof").onclick = () => {
  view("menu");
  $("pm").classList.add("show");
};
$("go-bud").onclick = () => {
  wTab = "buddies";
  view("wd");
};
$("go-wd").onclick = () => {
  if (wTab === "buddies") wTab = "hats";
  view("wd");
};
$("go-lv").onclick = () => view("lv");
$("go-info").onclick = () => view("info");
document.querySelectorAll("[data-back]").forEach((b) => {
  b.onclick = () => view("menu");
});
$("pdone").onclick = () => {
  $("pm").classList.remove("show");
  hop();
};
$("pm").onclick = (e) => {
  if (e.target === $("pm")) $("pm").classList.remove("show");
};
$("pn").oninput = () => {
  S.p.name = $("pn").value.trim();
  save();
  render();
};
$("bn").oninput = () => {
  S.p.buddy = $("bn").value.trim();
  save();
  fillInfo();
};
