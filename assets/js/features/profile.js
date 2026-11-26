const WARRIOR_GEAR = [
  ["topStyle", "tunic", ITEM_NAMES.topStyle.tunic, 2],
  ["ex", "sword", ITEM_NAMES.ex.sword, 3],
  ["ex", "shield", ITEM_NAMES.ex.shield, 5],
  ["topStyle", "armor", ITEM_NAMES.topStyle.armor, 7],
  ["hat", "knight", ITEM_NAMES.hat.knight, 9],
];
const LOCKS = [
  ["hat", "cowboy", ITEM_NAMES.hat.cowboy, 2],
  ["ex", "backpack", ITEM_NAMES.ex.backpack, 2],
  ["ex", "scarf", ITEM_NAMES.ex.scarf, 2],
  ["topStyle", "jacket", ITEM_NAMES.topStyle.jacket, 2],
  ["hat", "tophat", ITEM_NAMES.hat.tophat, 3],
  ["glasses", "shades", ITEM_NAMES.glasses.shades, 3],
  ["topStyle", "stripes", ITEM_NAMES.topStyle.stripes, 3],
  ["ex", "cape", ITEM_NAMES.ex.cape, 4],
  ["ex", "bowtie", ITEM_NAMES.ex.bowtie, 4],
  ["hat", "wizard", ITEM_NAMES.hat.wizard, 5],
  ["hat", "crown", ITEM_NAMES.hat.crown, 6],
  ...WARRIOR_GEAR,
];
const lockLv = (c, k) => {
  if (
    Object.values(TOWN_GEAR).some(
      (gear) => gear.slot === c && gear.value === k && gearEarned(gear),
    )
  )
    return 0;
  const e = LOCKS.find((x) => x[0] === c && x[1] === k);
  return e ? e[3] : 0;
};
const TITLES = [
  "Newcomer",
  "Adventurer",
  "Warrior in Training",
  "Squire",
  "Shieldbearer",
  "Guardian",
  "Armored Warrior",
  "Champion",
  "Knight",
  "Legendary Warrior",
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
  const info = lvInfo();
  DailyWalkReact.renderLevelHero({
    level: info.n,
    title: ttl(info.n),
    into: info.into,
    need: info.need,
    percent: info.pct,
    max: info.max,
    icon: icoSvg,
    iconTextParts,
  });
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
      ? "Max level! Keep helping towns and exploring the world."
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
    b.setAttribute("aria-pressed", String(o[0] === cur));
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
      const selected = [...document.querySelectorAll("#wbody .chips")].find(
        (group) => group.dataset.k === el.dataset.k,
      );
      selected?.querySelector(".chip.on")?.focus({ preventScroll: true });
    };
    el.appendChild(b);
  });
}
let wTab = "gear";
let colorEditor = null;
const TABS = [
  ["person", "🧑 Appearance"],
  ["warrior", "🛡️ Warrior gear"],
  ["gear", "🎒 Town gear"],
  ["pets", "🐾 Pets"],
  ["tops", "👕 Tops"],
  ["bottoms", "👖 Bottoms"],
  ["face", "😎 Face"],
  ["extras", "✨ Extras"],
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
const TOP_STYLES = Object.entries(ITEM_NAMES.topStyle);
function optionCards(host, list, cur, pick, cat) {
  const grid = el("div", "pgrid");
  list.forEach(([value, name]) => {
    const equipped = value === cur;
    const need = cat ? lockLv(cat, value) : 0;
    const locked = need > lvOf(S.xp);
    const button = el("button", "pcard" + (equipped ? " on" : "") + (locked ? " lk" : ""));
    button.type = "button";
    button.disabled = locked && !equipped;
    button.setAttribute("aria-pressed", String(equipped));
    button.append(
      el("b", "", name),
      el("small", "", equipped ? "Equipped ✓" : locked ? "Unlocks at level " + need : "Equip"),
    );
    button.onclick = () => pick(value);
    grid.appendChild(button);
  });
  host.appendChild(grid);
  return grid;
}
function topSections(host, p) {
  optionCards(host, TOP_STYLES, p.topStyle, (v) => {
    colorEditor = "top";
    setP("topStyle", v);
  }, "topStyle");
  if (colorEditor === "top")
    sec(host, "Color", cn(COL), p.topColor, (v) => setP("topColor", v));
}
function townGearCards(host, items, p, grid = el("div", "pgrid")) {
  items.forEach((gear) => {
    const earned = gearEarned(gear);
    const unlocked = earned || (gear.slot === "hat" && lockLv("hat", gear.value) <= lvOf(S.xp));
    const equipped = gear.slot === "ex"
      ? !!p.ex[gear.value]
      : p[gear.slot] === gear.value &&
        (gear.slot !== "pantsStyle" || p.pants !== "none") &&
        (gear.slot !== "shoeStyle" || p.shoes !== "none");
    const sources = NBK.filter((id) => townRewards(id).includes(gear));
    const b = el("button", "pcard" + (equipped ? " on" : "") + (unlocked ? "" : " lk"));
    b.type = "button";
    b.disabled = !unlocked && !equipped;
    b.setAttribute("aria-pressed", String(equipped));
    b.append(
      el("b", "", gear.name),
      el("small", "", equipped
        ? "Equipped ✓ · Tap to remove"
        : unlocked ? "Equip" : "Help " + sources.map((id) => NB[id].n).join(" or ")),
    );
    b.onclick = () => {
      if (gear.slot === "ex") {
        colorEditor = null;
        p.ex[gear.value] = !p.ex[gear.value];
        save();
        paint();
        buildWd();
        if (PG === "t") townInit();
      } else {
        colorEditor = !equipped && gear.slot === "pantsStyle" ? "pants" :
          !equipped && gear.slot === "shoeStyle" ? "shoes" : null;
        if (!equipped && gear.slot === "pantsStyle" && p.pants === "none") p.pants = "black";
        if (!equipped && gear.slot === "shoeStyle" && p.shoes === "none") p.shoes = "black";
        const fallback = gear.slot === "pantsStyle" || gear.slot === "shoeStyle" ? "classic" : "none";
        setP(gear.slot, equipped ? fallback : gear.value);
      }
    };
    grid.appendChild(b);
  });
  host.appendChild(grid);
}
function pantsSections(host, p) {
  const grid = optionCards(host, [["classic", ITEM_NAMES.pantsStyle.classic]], p.pantsStyle, () => {
    colorEditor = "pants";
    if (p.pants === "none") p.pants = "black";
    setP("pantsStyle", "classic");
  });
  townGearCards(host, TOWN_CLOTHING.filter((gear) => gear.slot === "pantsStyle"), p, grid);
  if (colorEditor === "pants")
    sec(host, "Pants color", cn(PANTS), p.pants, (v) => setP("pants", v));
}
function shoeSections(host, p) {
  const grid = optionCards(host, [["classic", ITEM_NAMES.shoeStyle.classic], ["none", "No shoes"]],
    p.shoes === "none" ? "none" : p.shoeStyle, (v) => {
      colorEditor = v === "none" ? null : "shoes";
      if (v === "none") setP("shoes", "none");
      else {
        if (p.shoes === "none") p.shoes = "black";
        setP("shoeStyle", "classic");
      }
    });
  townGearCards(host, TOWN_CLOTHING.filter((gear) => gear.slot === "shoeStyle"), p, grid);
  if (colorEditor === "shoes" && p.shoes !== "none")
    sec(host, "Shoe color", cn(SHOES), p.shoes, (v) => setP("shoes", v));
}
function setP(k, v) {
  S.p[k] = v;
  save();
  paint();
  buildWd();
  if (PG === "t") townInit();
}
function buildWd() {
  $("wtabs").dataset.k = "tab";
  DailyWalkReact.renderWardrobeTabs({
    tabs: TABS,
    selected: wTab,
    popping: popTok && popTok.startsWith("tab:") ? popTok.slice(4) : null,
    icon: icoSvg,
    iconTextParts,
    onSelect: (v) => {
      popTok = "tab:" + v;
      wTab = v;
      colorEditor = null;
      rerun($("wbody"), "fx");
      buildWd();
    },
  });
  const h = $("wbody");
  h.innerHTML = "";
  const p = S.p;
  $("wardrobe-level").textContent = "Lv " + lvOf(S.xp) + " · " + ttl(lvOf(S.xp));
  if (wTab === "person") {
    h.appendChild(
      el(
        "div",
        "fl",
        "Hats and glasses can cover hair or eyes.",
      ),
    );
    sec(h, "Gender", [
      ["female", "Female"],
      ["male", "Male"],
    ], p.gender, (v) => setP("gender", v));
    sec(h, "Skin color", cn(SKIN), p.skin, (v) => setP("skin", v));
    sec(h, "Hair type", [
      ["none", "Bald"],
      ["short", "Short"],
      ["long", "Long"],
      ["curly", "Curly"],
      ["ponytail", "Ponytail"],
    ], p.hair, (v) => setP("hair", v));
    sec(h, "Hair color", cn(HAIR_COLOR), p.hairColor, (v) => setP("hairColor", v));
    sec(h, "Eye color", cn(EYE_COLOR), p.eyeColor, (v) => setP("eyeColor", v));
  }
  if (wTab === "warrior") {
    h.appendChild(el("div", "fl", "Earn XP from habits to unlock warrior gear. Tap an equipped item to take it off."));
    const grid = el("div", "pgrid");
    WARRIOR_GEAR.forEach(([slot, value, name, level]) => {
      const unlocked = lvOf(S.xp) >= level;
      const equipped = slot === "ex" ? !!p.ex[value] : p[slot] === value;
      const b = el("button", "pcard" + (equipped ? " on" : "") + (unlocked ? "" : " lk"));
      b.type = "button";
      b.disabled = !unlocked && !equipped;
      b.setAttribute("aria-pressed", String(equipped));
      b.append(el("b", "", name), el("small", "", equipped ? "Equipped ✓ · Tap to remove" : unlocked ? "Equip" : "Unlocks at level " + level));
      b.onclick = () => {
        if (slot === "ex") {
          colorEditor = null;
          p.ex[value] = !p.ex[value];
          save();
          paint();
          buildWd();
          if (PG === "t") townInit();
        } else {
          colorEditor = !equipped && slot === "topStyle" ? "top" : null;
          setP(slot, equipped ? (slot === "topStyle" ? "tee" : "none") : value);
        }
      };
      grid.appendChild(b);
    });
    h.appendChild(grid);
    if (colorEditor === "top")
      sec(h, "Color", cn(COL), p.topColor, (v) => setP("topColor", v));
  }
  if (wTab === "gear") {
    h.appendChild(el("div", "fl", "Help towns to earn gear. Tap an equipped reward to remove it."));
    const groups = [
      ["Hats", ["hat"]],
      ["Tops", ["topStyle"]],
      ["Pants", ["pantsStyle"]],
      ["Shoes", ["shoeStyle"]],
      ["Accessories", ["glasses", "ex"]],
    ];
    const rewards = Object.values(TOWN_GEAR);
    groups.forEach(([title, slots]) => {
      const group = el("section", "wardrobe-gear-group");
      group.appendChild(el("h4", "", title));
      let grid;
      if (title === "Hats") grid = optionCards(group, HATS.filter(([value]) =>
        !rewards.some((gear) => gear.slot === "hat" && gear.value === value)).map(([value, name]) =>
        [value, value === "none" ? "No hat" : name]), p.hat, (v) => {
        colorEditor = null;
        setP("hat", v === p.hat ? "none" : v);
      }, "hat");
      if (title === "Tops") topSections(group, p);
      if (title === "Pants") pantsSections(group, p);
      if (title === "Shoes") shoeSections(group, p);
      const items = rewards.filter((gear) => slots.includes(gear.slot));
      if (items.length) townGearCards(group, items, p, grid);
      h.appendChild(group);
    });
  }
  if (wTab === "tops") {
    topSections(h, p);
  }
  if (wTab === "bottoms") {
    h.appendChild(el("h4", "", "Pants"));
    pantsSections(h, p);
    h.appendChild(el("h4", "", "Shoes"));
    shoeSections(h, p);
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
    h.appendChild(el("h4", "", "Glasses"));
    optionCards(
      h,
      [
        ["none", "No glasses"],
        ["square", ITEM_NAMES.glasses.square],
        ["round", ITEM_NAMES.glasses.round],
        ["shades", ITEM_NAMES.glasses.shades],
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
    h.appendChild(el("div", "fl", "Tap to turn on or off"));
    const grid = el("div", "pgrid");
    const lv = lvOf(S.xp);
    [
      ...Object.entries(ITEM_NAMES.ex),
    ].forEach((o) => {
      const need = lockLv("ex", o[0]);
      const equipped = !!p.ex[o[0]];
      const lk = need > lv;
      const b = el("button", "pcard" + (equipped ? " on" : "") + (lk ? " lk" : ""));
      b.type = "button";
      b.disabled = lk && !equipped;
      b.setAttribute("aria-pressed", String(equipped));
      b.append(el("b", "", o[1]), el("small", "", equipped
        ? "Equipped ✓ · Tap to remove" : lk ? "Unlocks at level " + need : "Equip"));
      b.onclick = () => {
        S.p.ex = S.p.ex || {};
        S.p.ex[o[0]] = !S.p.ex[o[0]];
        save();
        paint();
        buildWd();
        if (PG === "t") townInit();
      };
      grid.appendChild(b);
    });
    h.appendChild(grid);
  }
  if (wTab === "pets") {
    const best = Math.max(curStreak, streakBest());
    const l = document.createElement("div");
    l.className = "fl";
    l.textContent =
      "Best streak: 🔥 " +
      best +
      " days · Active pet rests on your traveler’s head and follows them!";
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
        ? "🔒 Travel to " + NB[pt.nb].n
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
              ? "🌍 Travel to " +
                  NB[pt.nb].n +
                  " on the world map to unlock " +
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
  popTok = null;
}
function fillLv() {
  DailyWalkReact.renderLevelList({
    currentLevel: lvInfo().n,
    levels: Array.from({ length: 10 }, (_, index) => {
      const number = index + 1;
      return {
        number,
        title: ttl(number),
        start: LV_START(number),
        unlocks: LOCKS.filter((item) => item[3] === number).map((item) => item[2]),
      };
    }),
    icon: icoSvg,
    iconTextParts,
  });
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
    DailyWalkReact.renderProfileBanner({
      buddy: S.p.buddy || "Buddy",
      subtitle: "Level " + I.n + " · " + ttl(I.n) +
        (S.p.gender === "female" || S.p.gender === "male" ? " · " + cap(S.p.gender) : ""),
      progress: I.max ? "Max level reached! 🎉" : I.into + " / " + I.need + " XP to level " + (I.n + 1),
      percent: I.pct,
      streak: curStreak,
      xp: S.xp,
      name: S.p.name || "Friend",
      icon: icoSvg,
      iconTextParts,
    });
    $("go-grad").hidden = true;
  }
  if (v === "wd") buildWd();
  if (v === "lv") fillLv();
  if (v === "info") fillInfo(true);
}
$("prof").onclick = () => {
  view("menu");
  $("pm").classList.add("show");
};
$("go-wd").onclick = () => {
  wTab = "gear";
  colorEditor = null;
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
