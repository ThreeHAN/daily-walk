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
  if (!v || v.search(ICRE) < 0 || !t.parentNode) return;
  const f = document.createDocumentFragment();
  v.split(ICRE).forEach((x, i) => {
    if (i % 2) f.appendChild(icoSpan(EMO[x]));
    else if (x) f.appendChild(document.createTextNode(x));
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
  exercise: "runner",
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
  run: "runner",
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
