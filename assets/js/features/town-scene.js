let NBC = NB.meadow;
const R = (x, y, w, h, f) =>
  '<rect x="' +
  x +
  '" y="' +
  y +
  '" width="' +
  w +
  '" height="' +
  h +
  '" fill="' +
  f +
  '"/>';
const RW = (x, y, w, h) =>
  '<rect class="win" x="' +
  x +
  '" y="' +
  y +
  '" width="' +
  w +
  '" height="' +
  h +
  '" fill="#bfe3ff"/>';
$("tsvg").innerHTML = `
  <defs>
    <linearGradient id="sk" x1="0" y1="0" x2="0" y2="1">
      <stop id="sk0" offset=".5" stop-color="#8fd0ff"/>
      <stop id="sk1" offset=".5" stop-color="#e6f6ff"/>
    </linearGradient>
    <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
      <stop id="gg0" offset=".5" stop-color="#93d684"/>
      <stop id="gg1" offset=".5" stop-color="#5fb56a"/>
    </linearGradient>
  </defs>
  <rect width="360" height="300" fill="url(#sk)"/>
  <g id="stars" opacity="0" fill="#fff">
    <path d="M20 20h4v4h-4zM48 60h4v4h-4zM76 16h4v4h-4zM110 44h4v4h-4zM140 14h4v4h-4zM168 70h4v4h-4zM196 28h4v4h-4zM226 56h4v4h-4zM252 16h4v4h-4zM270 80h4v4h-4zM30 92h4v4h-4zM90 86h4v4h-4zM330 70h4v4h-4zM344 20h4v4h-4z"/>
  </g>
  <g id="moon" opacity="0">
    <path d="M298 26h12v4h5v5h-5v12h-5v5h-9v-5h-5V31h7z" fill="#f4f1d6"/>
  </g>
  <g id="sunG">
    <path d="M300 10h10v7h-10zM300 63h10v7h-10zM275 35h7v10h-7zM328 35h7v10h-7zM284 20h6v6h-6zM320 20h6v6h-6zM284 54h6v6h-6zM320 54h6v6h-6z" fill="#ffe27a"/>
    <path d="M294 23h22v5h6v24h-6v5h-22v-5h-6V28h6z" fill="#ffe27a"/>
  </g>
  <g class="cl" fill="#fff" opacity=".9">
    <path d="M34 38h12v-8h16v-6h20v6h14v8h9v8H34z"/>
  </g>
  <g class="cl b" fill="#fff" opacity=".85">
    <path d="M188 61h10v-6h12v-6h18v6h14v6h8v8h-62z"/>
  </g>
  <path id="hillp" d="M0 126V110h20v-8h20v-8h30v8h24v8h24v10h26v-8h20v-8h30v-8h28v8h24v8h22v8h30v-8h25v-6h23v10h14v184H0z" fill="#a9dca0"/>
  <rect y="128" width="360" height="172" fill="url(#gg)"/>
  <path id="roadp" d="M0 232h40v-4h52v-4h176v4h52v4h40v42h-40v-4h-52v-4H92v4H40v4H0z" fill="#dccca6"/>
  <g id="flw" fill="#fff">
    <path d="M38 282h5v5h-5zM118 290h5v5h-5zM208 286h5v5h-5zM298 289h5v5h-5zM164 222h4v4h-4z"/>
  </g>
  <g id="decB"></g>
  <g id="bld"></g>
  <g id="town-birds" aria-hidden="true"></g>
  <g id="bfs"></g>
  <g id="decF"></g>
  <rect id="nightr" width="360" height="300" fill="#0a1a40" opacity="0" style="pointer-events:none"/>
  <g id="sleep-indicators"></g>
`;
const houseS = (i) => {
  const c = NBC.hc[i % 5];
  if (NBC.pl && NBC.pl !== "earth") {
    return R(-12, -30, 24, 4, "#9ad8ff") + R(-16, -26, 32, 4, "#9ad8ff") +
      R(-18, -22, 36, 10, "#bfe8ff") + R(-20, -14, 40, 4, c[1]) +
      R(-18, -10, 36, 10, c[0]) + R(-4, -9, 8, 9, "#3a4a5e") +
      RW(-14, -8, 6, 5) + RW(8, -8, 6, 5) + R(11, -36, 3, 10, "#d8e6f3") +
      R(10, -38, 5, 3, "#ff6a1a");
  }
  let o = R(-16, -22, 32, 22, c[0]);
  if (NBC.roofStyle === "flat") {
    o += R(-20, -26, 40, 4, c[1]) + R(-8, -30, 16, 4, c[1]);
  } else {
    o += R(-20, -26, 40, 4, c[1]) + R(-16, -30, 32, 4, c[1]) +
      R(-12, -34, 24, 4, c[1]) + R(-6, -38, 12, 4, c[1]) + R(8, -38, 5, 8, "#8a6a4a");
    if (NBC.roofStyle === "snow") o += R(-6, -38, 12, 2, "#fff") + R(-12, -34, 6, 2, "#fff") + R(6, -34, 6, 2, "#fff");
  }
  return o + R(-4, -14, 8, 14, "#6b4423") + RW(-13, -17, 6, 6) + RW(7, -17, 6, 6);
};
const tree = (x, y, s) => {
  const k = NBC.tree;
  let t = R(-2, -10, 4, 10, "#6b4423");
  if (k === "palm") {
    t += R(-2, -25, 4, 15, "#9b6a3a") + R(-12, -26, 24, 4, "#3fa35d") +
      R(-16, -22, 8, 4, "#3fa35d") + R(8, -22, 8, 4, "#3fa35d") + R(-4, -30, 8, 4, "#3fa35d");
  } else if (k === "autumn" || k === "cloudtree") {
    const color = k === "autumn" ? "#e8812a" : "#eef8ff";
    const light = k === "autumn" ? "#f0a030" : "#fff";
    t += R(-12, -22, 24, 10, color) + R(-8, -28, 16, 6, light) +
      R(-16, -18, 8, 6, color) + R(8, -18, 8, 6, light);
  } else if (k === "crystaltree") {
    t = R(-4, -24, 8, 24, "#52d9cf") + R(-8, -16, 4, 16, "#8ff5ee") +
      R(4, -18, 4, 18, "#2aa6a0") + R(-2, -28, 4, 4, "#8ff5ee");
  } else {
    const dark = k === "starpine" ? "#4f428a" : k === "snowpine" ? "#3a7a62" : "#2f8f4e";
    const light = k === "starpine" ? "#6d5bb8" : k === "snowpine" ? "#468f74" : "#3aa35d";
    t += R(-12, -12, 24, 6, dark) + R(-8, -18, 16, 6, dark) +
      R(-8, -23, 16, 5, light) + R(-5, -28, 10, 5, light) + R(-2, -32, 4, 4, light);
    if (k === "snowpine") t += R(-8, -18, 16, 2, "#fff") + R(-5, -28, 10, 2, "#fff");
    if (k === "starpine") t += R(-2, -36, 4, 4, "#ffe27a");
  }
  return (
    '<g transform="translate(' +
    x +
    " " +
    y +
    ") scale(" +
    s +
    ')"><g class="sway" style="animation-delay:-' +
    (x % 7) * 0.6 +
    's">' +
    t +
    "</g></g>"
  );
};
const flo = (x, y, c) =>
  '<g class="sway" style="animation-delay:-' +
  (x % 5) +
  's">' + R(x - 1, y - 7, 2, 7, "#3a8f4e") + R(x - 3, y - 10, 6, 4, c) + "</g>";
function gdn() {
  const id = NBC.eco || Object.keys(NB).find((k) => NB[k] === NBC);
  if (id === "meadow")
    return (
      R(257, 210, 10, 8, "#3aa35d") + R(91, 208, 10, 8, "#3aa35d") +
      flo(268, 222, "#e5509a") +
      flo(256, 225, "#f0c14b") +
      flo(102, 223, "#fff") +
      flo(90, 224, "#e5509a") +
      flo(45, 226, "#f0c14b")
    );
  if (id === "seaside")
    return R(263, 204, 2, 20, "#8b5a2b") + R(251, 200, 26, 4, "#e5624a") +
      R(255, 196, 18, 4, "#e5624a") + R(261, 192, 6, 8, "#fff") +
      R(94, 220, 8, 8, "#e5509a") + R(96, 222, 4, 4, "#fff");
  if (id === "snowy")
    return R(257, 214, 14, 12, "#fff") + R(259, 205, 10, 9, "#fff") +
      R(261, 199, 6, 6, "#fff") + R(260, 207, 8, 2, "#c94a4a") +
      R(265, 202, 5, 2, "#ff8a3c") + R(89, 224, 18, 4, "#fff") + R(33, 228, 14, 4, "#fff");
  if (id === "oasis")
    return (
      '<g transform="translate(262 224)">' +
      R(-2.5, -16, 5, 16, "#3f9d63") +
      R(-8, -12, 3, 6, "#3f9d63") +
      R(-8, -12, 6, 3, "#3f9d63") +
      R(5, -14, 3, 6, "#3f9d63") +
      R(2, -14, 6, 3, "#3f9d63") +
      '</g><g transform="translate(96 226) scale(.8)">' +
      R(-2.5, -16, 5, 16, "#4cae6a") +
      R(-8, -11, 3, 6, "#4cae6a") +
      R(-8, -11, 6, 3, "#4cae6a") +
      "</g>"
    );
  if (id === "starlight")
    return R(261, 217, 6, 6, "#ffe27a") + R(95, 219, 6, 6, "#b8d8ff") + R(274, 220, 4, 6, "#ffe27a");
  if (id === "crystal")
    return R(260, 216, 8, 10, "#8ff5ee") + R(262, 212, 4, 4, "#8ff5ee") +
      R(268, 219, 6, 7, "#52d9cf") + R(94, 217, 8, 9, "#8ff5ee");
  if (id === "sky")
    return R(252, 221, 28, 6, "#fff") + R(260, 218, 14, 3, "#fff") + R(88, 222, 20, 6, "#fff");
  return R(258, 220, 12, 8, "#e8812a") + R(263, 217, 2, 3, "#4a7a2a") +
    R(271, 225, 10, 6, "#f0902a") + R(92, 222, 12, 8, "#e8812a") +
    R(36, 228, 20, 4, "#c24a22") + R(229, 228, 18, 4, "#d9602a");
}
const BLD = [
  {
    n: "First Home",
    at: 0,
    x: 82,
    y: 150,
    h: 1,
    d: "Where your journey began.",
    svg: () => houseS(0),
  },
  {
    n: "Garden",
    at: 60,
    x: 0,
    y: 0,
    cx: 345,
    cy: 205,
    d: "Trees, flowers and little touches that make it home.",
    svg: () =>
      tree(345, 205, 1) +
      tree(330, 214, 0.8) +
      tree(14, 208, 1) +
      tree(29, 215, 0.75) +
      gdn(),
  },
  {
    n: "Town Fountain",
    at: 150,
    x: 180,
    y: 200,
    d: "A gathering place in the town square.",
    svg: () =>
      R(-18, -8, 36, 8, "#9fb4c7") + R(-14, -10, 28, 4, NBC.wc) +
      R(-2, -22, 4, 14, "#9fb4c7") + '<g class="dr">' +
      R(-6, -25, 4, 4, "#bfe8ff") + R(3, -27, 4, 4, "#bfe8ff") + "</g>",
  },
  {
    n: "Second Home",
    at: 270,
    x: 140,
    y: 150,
    h: 1,
    d: "A new neighbor moves in.",
    svg: () => houseS(1),
  },
  {
    n: "Word Hall",
    at: 420,
    x: 208,
    y: 150,
    d: "A hall for reading and sharing Scripture.",
    svg: () =>
      R(-26, -24, 52, 24, "#d9b98a") +
      R(-30, -28, 60, 4, "#8b5a2b") + R(-24, -32, 48, 4, "#8b5a2b") +
      R(-18, -36, 36, 4, "#8b5a2b") + R(-10, -40, 20, 4, "#8b5a2b") +
      R(-5, -14, 10, 14, "#6b4423") +
      '<rect x="-10" y="-35" width="20" height="9" fill="#fff"/><g transform="translate(-6 -36.5) scale(.5)"><g class="flt">' +
      ICONS.book +
      "</g></g>",
  },
  {
    n: "Third Home",
    at: 600,
    x: 272,
    y: 150,
    h: 1,
    d: "The town keeps growing.",
    svg: () => houseS(2),
  },
  {
    n: "Chapel",
    at: 840,
    x: 50,
    y: 196,
    d: "A place to pray together.",
    svg: () =>
      R(-14, -22, 28, 22, "#f1ece2") +
      R(-18, -26, 36, 4, "#b04a3a") + R(-12, -30, 24, 4, "#b04a3a") +
      R(-6, -34, 12, 4, "#b04a3a") +
      R(-4, -46, 8, 13, "#f1ece2") +
      R(-6, -49, 12, 3, "#b04a3a") + R(-3, -54, 6, 5, "#b04a3a") +
      R(-0.8, -66, 1.6, 10, "#f0c14b") +
      R(-3.5, -63, 7, 1.6, "#f0c14b") +
      R(-3, -42, 6, 7, "#f0c14b") + R(-4, -10, 8, 10, "#6b4423"),
  },
  {
    n: "Fourth Home",
    at: 1140,
    x: 305,
    y: 196,
    h: 1,
    d: "Another family joins the community.",
    svg: () => houseS(3),
  },
  {
    n: "Lily Pond",
    at: 1500,
    x: 112,
    y: 200,
    d: "A quiet pond for reflection.",
    svg: () =>
      R(-24, -9, 48, 10, NBC.pc) + R(-19, -12, 38, 3, NBC.pc) +
      R(-12, -7, 8, 3, "#6fcf7f") + R(7, -5, 8, 3, "#6fcf7f") +
      R(-16, -5, 4, 2, "#ff9d42") + R(-12, -13, 24, 3, "#a0743f"),
  },
  {
    n: "Fifth Home",
    at: 1920,
    x: 250,
    y: 196,
    h: 1,
    d: "Your community is thriving.",
    svg: () => houseS(4),
  },
  {
    n: "Lighthouse of Light",
    at: 2400,
    x: 332,
    y: 148,
    d: "A beacon so others can find the way.",
    svg: () =>
      R(-7, -46, 14, 46, "#fff") +
      R(-7, -14, 14, 5, "#d64545") +
      R(-7, -30, 14, 5, "#d64545") +
      R(-6, -54, 12, 8, "#ffe27a") +
      R(-8, -58, 16, 4, "#d64545") + R(-4, -62, 8, 4, "#d64545"),
  },
  {
    n: "Community Hall",
    at: 3000,
    x: 30,
    y: 150,
    d: "The heart of Faith Town.",
    svg: () =>
      R(-22, -26, 44, 26, "#c9c1b4") +
      R(-26, -38, 10, 38, "#b5ad9f") +
      R(16, -38, 10, 38, "#b5ad9f") +
      R(-26, -42, 4, 4, "#b5ad9f") +
      R(-20, -42, 4, 4, "#b5ad9f") +
      R(16, -42, 4, 4, "#b5ad9f") +
      R(22, -42, 4, 4, "#b5ad9f") +
      R(-5, -14, 10, 14, "#6b4423") +
      R(-0.5, -58, 1, 18, "#6b4423") +
      R(0, -58, 12, 8, "#e5509a"),
  },
];
const TNAMES = [
  "Camp",
  "Hamlet",
  "Hamlet",
  "Village",
  "Village",
  "Township",
  "Township",
  "Town",
  "Town",
  "Big Town",
  "Big Town",
  "City of Light",
];
const rnd = (a, b) => a + Math.random() * (b - a);
const pk = (a) => a[Math.floor(Math.random() * a.length)];
function npcLook(i) {
  const g = (a, k) => a[(i * k + 3) % a.length];
  return {
    gender: g(["female", "male"], 1),
    skin: g(Object.keys(SKIN), 1),
    hair: g(["short", "long", "curly", "ponytail", "none"], 3),
    hairColor: g(Object.keys(HAIR_COLOR), 2),
    eyeColor: g(Object.keys(EYE_COLOR), 3),
    hat: "none",
    topStyle: g(["tee", "jacket", "stripes", "tee"], 3),
    topColor: g(Object.keys(COL), 7),
    pants: g(["blue", "black", "khaki", "green"], 3),
    shoes: g(["white", "black", "red", "blue"], 5),
    eyes: g(["normal", "round", "happy", "wink"], 3),
    glasses: g(["none", "none", "square", "round"], 7),
    mouth: g(["smile", "none", "open", "smile"], 5),
    body: g(Object.keys(BODY), 3),
    ex: i % 3 === 1 ? { scarf: true } : i % 3 === 2 ? { cheeks: true } : {},
  };
}
function townCast() {
  const out = [{ n: S.p.buddy || "Buddy", p: S.p, k: "me", ref: S.bs }];
  const town = S.nb.cur,
    townIndex = NBK.indexOf(town),
    start = townIndex * 3;
  for (let i = 0; i < 3; i++) {
    const seed = start + i;
    out.push({
      id: "town:" + town + ":" + i,
      n: NAMES[seed % NAMES.length],
      p: npcLook(seed),
      k: "local",
      town,
    });
  }
  S.res.forEach((r, i) => {
    if (i % NBK.length === townIndex)
      out.push({ id: "resident:" + i, n: r.n, p: r.l, k: "res", ref: r, town });
  });
  return out;
}
const vOfDay = () =>
  VERSES[[...today()].reduce((a, c) => a + c.charCodeAt(0), 0) % VERSES.length];
const TW = {
  on: false,
  ws: [],
  pets: [],
  sleeping: false,
  raf: 0,
  last: 0,
  next: 0,
  W: 0,
  H: 0,
  conv: null,
};
function V() {
  return S.nb.cur;
}
const snowF = () => {
  let o = "";
  for (let i = 0; i < 30; i++) {
    const t = 5 + (i % 5);
    o +=
      '<rect class="snf" x="' +
      ((i * 37) % 360) +
      '" y="0" width="' +
      (2 + (i % 3)) +
      '" height="' + (2 + (i % 3)) +
      '" fill="#fff" style="--t:' +
      t +
      "s;animation-delay:-" +
      ((i * 1.3) % t).toFixed(1) +
      's"/>';
  }
  return o;
};
const leafF = () => {
  const cs = ["#e8812a", "#d9602a", "#f0a030", "#c24a22"];
  let o = "";
  for (let i = 0; i < 16; i++) {
    const t = 7 + (i % 5);
    o +=
      '<rect class="lvf" x="' +
      ((i * 47) % 360) +
      '" y="0" width="6" height="4" fill="' +
      cs[i % 4] +
      '" style="--t:' +
      t +
      "s;animation-delay:-" +
      ((i * 1.7) % t).toFixed(1) +
      's"/>';
  }
  return o;
};
const BG = {
  seaside: {
    back: () =>
      R(0, 100, 360, 30, "#4aa8ee") + R(0, 100, 360, 8, "#86d6ff") +
      R(8, 114, 30, 2, "#fff") + R(124, 122, 30, 2, "#fff") + R(240, 110, 30, 2, "#fff") +
      R(61, 114, 18, 4, "#8b5a2b") + R(70, 99, 2, 15, "#8b5a2b") +
      R(72, 103, 5, 9, "#fff") + R(65, 107, 5, 7, "#ffd9c0"),
  },
  snowy: {
    back: () =>
      '<path d="M0 128v-12h14v-10h12V96h8v-8h8v8h10v10h12v10h12v-8h8V94h8V80h4V70h8v10h8v14h8v14h10v12h34v-12h10V98h8v-6h10v6h10v12h14v12h34v-12h12V96h10V80h10v16h10v14h16v10h14v-12h14v20z" fill="#b9cde2"/>' +
      R(96, 70, 8, 10, "#fff") + R(282, 80, 10, 8, "#fff") + R(34, 88, 8, 8, "#fff"),
    front: snowF,
  },
  oasis: {
    back: () =>
      R(0, 120, 360, 12, "#f4d28e") + R(52, 118, 68, 10, "#e3b878") +
      R(64, 108, 44, 10, "#e3b878") + R(76, 98, 20, 10, "#e3b878") +
      R(82, 92, 8, 6, "#e3b878") + R(90, 108, 18, 20, "#c99a56") +
      R(132, 118, 52, 10, "#e3b878") + R(144, 108, 28, 10, "#e3b878") + R(154, 102, 8, 6, "#e3b878"),
  },
  autumn: {
    back: () => {
      const cs = ["#e8812a", "#d9602a", "#f0a030", "#c24a22"];
      let o = '<rect y="118" width="360" height="14" fill="#b88a3a"/>';
      for (let i = 0; i < 22; i++)
        o += R(i * 17, 100 + (i % 3) * 4, 20, 28, cs[i % 4]);
      return o;
    },
    front: leafF,
  },
  starlight: {
    back: () =>
      '<path d="M0 128v-12h12v-12h12V92h12V80h10v-6h8v6h10v12h12v12h12v12h12v12zM200 128v-12h16v-12h16V92h16V80h16v-8h16v8h16v12h16v12h16v12h16v12z" fill="#43377a"/><path d="M85 128v-12h14v-12h14V92h14V80h14V66h14v14h14v12h14v12h14v12h14v12z" fill="#4f428a"/>' +
      R(48, 46, 4, 4, "#ffe27a") + R(153, 38, 4, 4, "#ffe27a") + R(238, 52, 4, 4, "#fff"),
  },
  crystal: {
    back: () =>
      R(18, 104, 36, 24, "#52d9cf") + R(26, 88, 20, 16, "#52d9cf") + R(32, 76, 8, 12, "#8ff5ee") +
      R(280, 100, 44, 28, "#52d9cf") + R(290, 84, 24, 16, "#52d9cf") + R(298, 72, 8, 12, "#8ff5ee") +
      R(44, 110, 28, 18, "#8ff5ee") + R(312, 108, 32, 20, "#8ff5ee"),
  },
  sky: {
    back: () =>
      R(22, 110, 96, 18, "#fff") + R(40, 102, 60, 8, "#fff") +
      R(124, 106, 112, 22, "#fff") + R(145, 98, 70, 8, "#fff") +
      R(249, 112, 92, 16, "#fff") + R(266, 104, 58, 8, "#fff"),
  },
};
const bfHTML = () =>
  [
    [70, 232, 0.5],
    [250, 244, 0.42],
  ]
    .map(
      (b, i) =>
        '<g transform="translate(' +
        b[0] +
        " " +
        b[1] +
        ')"><g class="bfl' +
        (i ? " b2" : "") +
        '"><g transform="scale(' +
        b[2] +
        ')">' +
        ICONS.butterfly +
        "</g></g></g>",
    )
    .join("");
function applyBiome(id) {
  const c = NB[id],
    eco = c.eco || id,
    isSpace = c.pl && c.pl !== "earth";
  $("sk0").setAttribute("stop-color", c.sky[0]);
  $("sk1").setAttribute("stop-color", c.sky[1]);
  $("gg0").setAttribute("stop-color", c.gr[0]);
  $("gg1").setAttribute("stop-color", c.gr[1]);
  $("hillp").setAttribute("fill", c.hill);
  $("roadp").setAttribute("fill", c.road);
  $("flw").style.display = id === "meadow" ? "" : "none";
  const royalPig =
    id === "neptune_sky"
      ? {
          back: () =>
            R(17, 48, 76, 12, "#fff") + R(35, 42, 40, 6, "#fff") +
            R(261, 60, 88, 12, "#fff") + R(280, 54, 50, 6, "#fff") +
            '<g transform="translate(35 62) scale(.82)">' +
            R(8, 37, 56, 47, "#b9473f") + R(0, 34, 72, 5, "#7f3130") +
            R(8, 28, 56, 6, "#7f3130") + R(16, 22, 40, 6, "#7f3130") +
            R(24, 16, 24, 6, "#7f3130") + R(31, 10, 10, 6, "#7f3130") +
            R(20, 52, 32, 32, "#fff5e8") + R(24, 56, 24, 28, "#7a2e2c") +
            R(31, 25, 10, 10, "#dff3fa") + "</g>" +
            R(235, 96, 10, 10, "#fff") + R(272, 105, 8, 8, "#fff") + R(315, 100, 10, 10, "#fff"),
        }
      : {};
  const bg = royalPig.back ? royalPig : BG[eco] || {};
  $("decB").innerHTML = bg.back ? bg.back() : "";
  $("decF").innerHTML = bg.front ? bg.front() : "";
  $("bfs").innerHTML =
    isSpace || eco === "seaside" || eco === "snowy" ? "" : bfHTML();
  $("scene").dataset.nb = id;
}
function drawScene(animNew) {
  const id = V();
  NBC = NB[id];
  applyBiome(id);
  const x = nbXp(id),
    built = BLD.filter((b) => x >= b.at);
  let g = "",
    sleep = "";
  const seen = S.nb.seen[id] === undefined ? built.length : S.nb.seen[id];
  built.forEach((b, i) => {
    g +=
      '<g transform="translate(' +
      b.x +
      " " +
      b.y +
      ')"><g class="bd' +
      (animNew && i >= seen ? " build" : "") +
      '" data-i="' +
      i +
      '">' +
      b.svg() +
      "</g></g>";
    if (b.h)
      sleep += '<g transform="translate(' + b.x + " " + b.y +
       ')"><text class="sleep-z" x="9" y="-43">ZZZZ</text></g>';
  });
  const nx = BLD.find((b) => x < b.at);
  if (nx)
    g +=
      '<g transform="translate(' +
      (nx.cx || nx.x) +
      " " +
      ((nx.cy || nx.y) - 4) +
      ')"><g class="cons"><g transform="translate(-8 -16) scale(.67)">' +
      ICONS.cone +
      "</g></g></g>";
  $("bld").innerHTML = g;
  $("sleep-indicators").innerHTML = sleep;
}
function initTownScene() {
  $("bld").onclick = (e) => {
    const b = e.target.closest(".bd");
    if (b) {
      const x = BLD[+b.dataset.i];
      rerun(b, "wob");
      toast(x.n + ": " + x.d);
    }
  };
}
function townInfo() {
  const id = V(),
    c = NB[id],
    x = nbXp(id),
    built = BLD.filter((b) => x >= b.at),
    n = built.length,
    nx = BLD.find((b) => x < b.at);
  $("tnm").textContent = "Town help";
  $("tnb").textContent = c.n;
  $("tlv").textContent =
    Math.min(100, Math.floor((x / MAXAT) * 100)) + "% helped";
  if (nx) {
    $("tbar").style.width = Math.min(100, (x / MAXAT) * 100) + "%";
    $("tnx").textContent =
      Math.min(x, MAXAT) + " / " + MAXAT + " help XP · Next: " + nx.n;
  } else {
    $("tbar").style.width = "100%";
    $("tnx").textContent = "Town helped! Gear earned: " + townRewardNames(id);
  }
  countTo($("tc1"), BLD.filter((b) => b.h && x >= b.at).length);
  countTo($("tc2"), townCast().length);
  countTo($("tc3"), Math.min(x, MAXAT));
  renderDailyVerse();
  $("gcard").hidden = true;
  const fin = nbDone(id);
  $("ncard").hidden = !fin;
  if (fin)
    $("nct").textContent =
      "Your traveler earned " +
      townRewardNames(id) +
      ". Choose your next town on the world map.";
  $("homeb").hidden = true;
  $("wsub").textContent =
    NBK.filter((k) => nbDone(k)).length + " / " + NBK.length + " towns helped";
  $("tsub").textContent = WORLD_REGIONS[c.pl || "earth"] + " · " + c.d;
  $("ixsub").textContent =
    S.peopleMet.length + (S.peopleMet.length === 1 ? " person met" : " people met");
}
