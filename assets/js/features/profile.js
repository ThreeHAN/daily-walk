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
  "Noob",
  "Castle Page",
  "Squire-At-Arms",
  "Armored Squire",
  "Vanguard Shield-Bearer",
  "Realm Defender",
  "Sworn Knight",
  "Realm Champion",
  "Royal Paladin",
  "Legendary Grandmaster",
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
  DailyWalkReact.renderLevelTitle("levelUp", n, ttl(n));
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
const APPEARANCE_OPTIONS = {
  gender: [["female", "Female"], ["male", "Male"]],
  skin: cn(SKIN),
  hair: [["none", "Bald"], ["short", "Short"], ["long", "Long"], ["curly", "Curly"], ["ponytail", "Ponytail"]],
  hairColor: cn(HAIR_COLOR),
  eyeColor: cn(EYE_COLOR),
};
const TOP_STYLES = Object.entries(ITEM_NAMES.topStyle);
function optionCards(list, cur, pick, cat) {
  return list.map(([value, name]) => {
    const selected = value === cur;
    const need = cat ? lockLv(cat, value) : 0;
    const locked = need > lvOf(S.xp);
    return {
      id: value, name, selected, locked,
      description: selected ? "Equipped ✓" : locked ? "Unlocks at level " + need : "Equip",
      onSelect: () => pick(value),
    };
  });
}
function topSections(p) {
  const cards = optionCards(TOP_STYLES, p.topStyle, (v) => {
    colorEditor = "top";
    setP("topStyle", v);
  }, "topStyle");
  const blocks = [{ type: "grid", cards }];
  if (colorEditor === "top")
    blocks.push({ type: "choice", section: wardrobeChoice("Color", "topColor", cn(COL)) });
  return blocks;
}
function townGearCards(items, p) {
  return items.map((gear) => {
    const earned = gearEarned(gear);
    const unlocked = earned || (gear.slot === "hat" && lockLv("hat", gear.value) <= lvOf(S.xp));
    const equipped = gear.slot === "ex"
      ? !!p.ex[gear.value]
      : p[gear.slot] === gear.value &&
        (gear.slot !== "pantsStyle" || p.pants !== "none") &&
        (gear.slot !== "shoeStyle" || p.shoes !== "none");
    const sources = NBK.filter((id) => townRewards(id).includes(gear));
    return {
      id: gear.slot + ":" + gear.value,
      name: gear.name,
      selected: equipped,
      locked: !unlocked,
      description: equipped
        ? "Equipped ✓ · Tap to remove"
        : unlocked ? "Equip" : "Help " + sources.map((id) => NB[id].n).join(" or "),
      onSelect: () => {
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
      },
    };
  });
}
function pantsSections(p) {
  const cards = optionCards([["classic", ITEM_NAMES.pantsStyle.classic]], p.pantsStyle, () => {
    colorEditor = "pants";
    if (p.pants === "none") p.pants = "black";
    setP("pantsStyle", "classic");
  });
  cards.push(...townGearCards(TOWN_CLOTHING.filter((gear) => gear.slot === "pantsStyle"), p));
  const blocks = [{ type: "grid", cards }];
  if (colorEditor === "pants")
    blocks.push({ type: "choice", section: wardrobeChoice("Pants color", "pants", cn(PANTS)) });
  return blocks;
}
function shoeSections(p) {
  const cards = optionCards([["classic", ITEM_NAMES.shoeStyle.classic], ["none", "No shoes"]],
    p.shoes === "none" ? "none" : p.shoeStyle, (v) => {
      colorEditor = v === "none" ? null : "shoes";
      if (v === "none") setP("shoes", "none");
      else {
        if (p.shoes === "none") p.shoes = "black";
        setP("shoeStyle", "classic");
      }
    });
  cards.push(...townGearCards(TOWN_CLOTHING.filter((gear) => gear.slot === "shoeStyle"), p));
  const blocks = [{ type: "grid", cards }];
  if (colorEditor === "shoes" && p.shoes !== "none")
    blocks.push({ type: "choice", section: wardrobeChoice("Shoe color", "shoes", cn(SHOES)) });
  return blocks;
}
function setP(k, v) {
  S.p[k] = v;
  save();
  paint();
  buildWd();
  if (PG === "t") townInit();
}
function wardrobeChoice(title, field, options) {
  return {
    title,
    options,
    value: S.p[field],
    popping: popTok && popTok.startsWith(title + ":") ? popTok.slice(title.length + 1) : null,
    onSelect: (value) => {
      popTok = title + ":" + value;
      setP(field, value);
      const selected = [...document.querySelectorAll("#wbody .chips")].find(
        (group) => group.dataset.k === title,
      );
      selected?.querySelector(".chip.on")?.focus({ preventScroll: true });
    },
  };
}
function renderWardrobePanel(tab, p) {
  const props = { tab, icon: icoSvg, iconTextParts };
  if (tab === "person") {
    props.sections = [
      wardrobeChoice("Gender", "gender", APPEARANCE_OPTIONS.gender),
      wardrobeChoice("Skin color", "skin", APPEARANCE_OPTIONS.skin),
      wardrobeChoice("Hair type", "hair", APPEARANCE_OPTIONS.hair),
      wardrobeChoice("Hair color", "hairColor", APPEARANCE_OPTIONS.hairColor),
      wardrobeChoice("Eye color", "eyeColor", APPEARANCE_OPTIONS.eyeColor),
    ];
  } else if (tab === "face") {
    props.sections = [
      wardrobeChoice("Eyes", "eyes", [
        ["normal", "Normal"], ["round", "Round"], ["happy", "Happy"], ["wink", "Wink"],
      ]),
      wardrobeChoice("Mouth", "mouth", [
        ["none", "None"], ["smile", "Smile"], ["open", "Open"],
      ]),
    ];
    props.glasses = [
      ["none", "No glasses"],
      ["square", ITEM_NAMES.glasses.square],
      ["round", ITEM_NAMES.glasses.round],
      ["shades", ITEM_NAMES.glasses.shades],
    ].map(([id, name]) => {
      const selected = id === p.glasses;
      const need = lockLv("glasses", id);
      const locked = need > lvOf(S.xp);
      return {
        id, name, selected, locked,
        description: selected ? "Equipped ✓" : locked ? "Unlocks at level " + need : "Equip",
        onSelect: () => setP("glasses", id),
      };
    });
  } else if (tab === "warrior" || tab === "extras") {
    props.sections = tab === "warrior" && colorEditor === "top"
      ? [wardrobeChoice("Color", "topColor", cn(COL))]
      : [];
    const items = tab === "warrior"
      ? WARRIOR_GEAR
      : Object.entries(ITEM_NAMES.ex).map(([id, name]) => ["ex", id, name, lockLv("ex", id)]);
    props.gear = items.map(([slot, id, name, level]) => {
      const selected = slot === "ex" ? !!p.ex[id] : p[slot] === id;
      const locked = level > lvOf(S.xp);
      return {
        id, name, selected, locked,
        description: selected ? "Equipped ✓ · Tap to remove" : locked ? "Unlocks at level " + level : "Equip",
        onSelect: () => {
          if (slot === "ex") {
            if (tab === "warrior") colorEditor = null;
            S.p.ex[id] = !S.p.ex[id];
            save();
            paint();
            buildWd();
            if (PG === "t") townInit();
          } else {
            colorEditor = !selected && slot === "topStyle" ? "top" : null;
            setP(slot, selected ? (slot === "topStyle" ? "tee" : "none") : id);
          }
        },
      };
    });
  } else if (tab === "gear" || tab === "tops" || tab === "bottoms") {
    if (tab === "tops") props.blocks = topSections(p);
    else if (tab === "bottoms") {
      props.blocks = [
        { type: "heading", title: "Pants" }, ...pantsSections(p),
        { type: "heading", title: "Shoes" }, ...shoeSections(p),
      ];
    } else {
      const rewards = Object.values(TOWN_GEAR);
      props.blocks = [
        { type: "note", text: "Help towns to earn gear. Tap an equipped reward to remove it." },
        ...[
          ["Hats", ["hat"]],
          ["Tops", ["topStyle"]],
          ["Pants", ["pantsStyle"]],
          ["Shoes", ["shoeStyle"]],
          ["Accessories", ["glasses", "ex"]],
        ].map(([title, slots]) => {
          let blocks = [];
          if (title === "Hats") {
            const cards = optionCards(HATS.filter(([value]) =>
              !rewards.some((gear) => gear.slot === "hat" && gear.value === value)).map(([value, name]) =>
              [value, value === "none" ? "No hat" : name]), p.hat, (v) => {
              colorEditor = null;
              setP("hat", v === p.hat ? "none" : v);
            }, "hat");
            blocks = [{ type: "grid", cards }];
          } else if (title === "Tops") blocks = topSections(p);
          else if (title === "Pants") blocks = pantsSections(p);
          else if (title === "Shoes") blocks = shoeSections(p);
          const items = rewards.filter((gear) => slots.includes(gear.slot));
          if (items.length) {
            const cards = townGearCards(items, p);
            if (title === "Hats") blocks[0].cards.push(...cards);
            else blocks.push({ type: "grid", cards });
          }
          return { type: "group", title, blocks };
        }),
      ];
    }
  } else if (tab === "pets") {
    props.best = Math.max(curStreak, streakBest());
    props.pets = {
      noneSelected: !p.pet || p.pet === "none",
      items: PETS.map((pt) => {
        const unlocked = isPetUnlocked(pt, props.best);
        if (unlocked && !S.pets[pt.id]) {
          S.pets[pt.id] = 1;
          save();
        }
        const selected = p.pet === pt.id;
        return {
          id: pt.id,
          name: pt.n,
          selected,
          unlocked,
          art: petSvg(pt.id, 34, 32),
          description: selected ? "Equipped ✓" : unlocked ? pt.d :
            pt.nb ? "🔒 Travel to " + NB[pt.nb].n : "🔒 " + pt.st + "-day streak",
        };
      }),
    };
    props.onPet = (pet, button) => {
      if (!pet) {
        setP("pet", "none");
      } else if (!pet.unlocked) {
        const pt = petById(pet.id);
        toast(pt.nb
          ? "🌍 Travel to " + NB[pt.nb].n + " on the world map to unlock " + pt.n + "!"
          : "🔥 Reach a " + pt.st + "-day streak to unlock " + pt.n + "!");
        rerun(button, "shake");
      } else {
        setP("pet", pet.selected ? "none" : pet.id);
      }
    };
  }
  DailyWalkReact.renderWardrobePanels(props);
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
  const p = S.p;
  const wardrobeLevel = lvOf(S.xp);
  DailyWalkReact.renderLevelTitle("wardrobe", wardrobeLevel, ttl(wardrobeLevel));
  renderWardrobePanel(wTab, p);
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
  DailyWalkReact.renderProfileInfo({
    name: S.p.name,
    buddy: S.p.buddy,
    streak: cur,
    best,
    total: tot,
    animate: !!anim,
    icon: icoSvg,
    iconTextParts,
    onName: (value) => {
      S.p.name = value.trim();
      save();
      render();
    },
    onBuddy: (value) => {
      S.p.buddy = value.trim();
      save();
      fillInfo();
    },
  });
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
      level: I.n,
      title: ttl(I.n),
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
