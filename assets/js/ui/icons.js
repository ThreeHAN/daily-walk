const EMO = {
  "🔥": "flame",
  "⭐": "star",
  "📖": "book",
  "🎓": "grad",
  "🎉": "party",
  "🔒": "lock",
  "🙏": "pray",
  "✅": "check",
  "✨": "sparkle",
  "🎩": "tophat",
  "😎": "shades",
  "🏗": "crane",
  "👤": "user",
  "💧": "drop",
  "🦋": "butterfly",
  "👥": "people",
  "📊": "chart",
  "📈": "chart",
  "👕": "shirt",
  "🏆": "trophy",
  "🏘": "town",
  "☀": "sun",
  "👑": "crown",
  "😇": "halo",
  "🤠": "cowboy",
  "🧙": "wizard",
  "🎧": "phones",
  "🎒": "pack",
  "🧣": "scarf",
  "🌸": "blush",
  "🦸": "cape",
  "🎀": "bow",
  "👆": "tap",
  "🌙": "moon",
  "🏠": "house",
  "🥗": "salad",
  "🏃": "runner",
  "🧹": "broom",
  "🧢": "cap",
  "👖": "pants",
  "🎨": "palette",
  "🚧": "cone",
  "💛": "heart",
  "💬": "chat",
  "⏱": "clock",
  "🌅": "sunrise",
  "🌇": "sunset",
  "🌍": "globe",
};
const ICRE = new RegExp("(" + Object.keys(EMO).join("|") + ")\uFE0F?", "gu");
const iconTextParts = (text) =>
  text.split(ICRE).map((part, i) => (i % 2 ? { icon: EMO[part] } : { text: part }));
const icoSvg = (n) =>
  '<svg viewBox="0 0 24 24" aria-hidden="true">' +
  (ICONS[n] || ICONS.star) +
  "</svg>";
function icoSpan(n) {
  const e = document.createElement("span");
  e.className = "ic";
  e.setAttribute("aria-hidden", "true");
  e.innerHTML = icoSvg(n);
  return e;
}
function fixText(t) {
  const v = t.nodeValue;
  if (!v || v.search(ICRE) < 0 || !t.parentNode || t.parentElement?.closest("#list, #journal, #week, #progress-summary, #hero, #dashboard-heading, #ubar, #hm, #lblist, #leaderboard-summary, #ulist, #ix, #bbody, #buddy-stats, #lvlist, #glist, #wtabs, #profile-banner, #profile-info, #spw, #wbody")) return;
  const f = document.createDocumentFragment();
  iconTextParts(v).forEach((part) => {
    if (part.icon) f.appendChild(icoSpan(part.icon));
    else if (part.text) f.appendChild(document.createTextNode(part.text));
  });
  t.parentNode.replaceChild(f, t);
}
function iconize(root) {
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => {
      const p = n.parentNode;
      if (!p) return NodeFilter.FILTER_REJECT;
      const t = p.nodeName;
      if (
        t === "SCRIPT" ||
        t === "STYLE" ||
        t === "TEXTAREA" ||
        t === "OPTION" ||
        t === "text" ||
        t === "TITLE"
      )
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const list = [];
  let n;
  while ((n = w.nextNode())) if (n.nodeValue.search(ICRE) >= 0) list.push(n);
  list.forEach(fixText);
}
function hydrate() {
  document.querySelectorAll("[data-i]").forEach((e) => {
    e.innerHTML = icoSvg(e.dataset.i);
  });
}
const icMO = new MutationObserver((ms) => {
  ms.forEach((m) => {
    if (m.type === "characterData") {
      fixText(m.target);
    } else
      m.addedNodes.forEach((n) => {
        if (n.nodeType === 3) fixText(n);
        else if (
          n.nodeType === 1 &&
          n.nodeName !== "svg" &&
          !(n.classList && n.classList.contains("ic"))
        )
          iconize(n);
      });
  });
});
const GIC = {
  morning: "sunrise",
  nutrition: "salad",
  exercise: "dumbbell",
  cleaning: "broom",
  faith: "pray",
  more: "star",
};
const DEFIC = {
  wake: "sunrise",
  cold: "snow",
  water: "drop",
  bfast: "apple",
  lunch: "sun",
  dinner: "moon",
  eat: "salad",
  stretch: "leaf",
  run: "dumbbell",
  room: "broom",
  pray: "pray",
  good: "heart",
};
const HICONS = [
  "runner",
  "dumbbell",
  "drop",
  "salad",
  "apple",
  "broom",
  "bed",
  "book",
  "pray",
  "heart",
  "sun",
  "moon",
  "leaf",
  "pencil",
  "music",
  "star",
];
