const VERSES = [
  {
    r: "1 Corinthians 10:31",
    t: "Whether therefore ye eat, or drink, or whatsoever ye do, do all to the glory of God.",
  },
  {
    r: "Colossians 3:23",
    t: "And whatsoever ye do, do it heartily, as to the Lord, and not unto men;",
  },
  {
    r: "Philippians 4:13",
    t: "I can do all things through Christ which strengtheneth me.",
  },
  {
    r: "Proverbs 3:5",
    t: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.",
  },
  {
    r: "Joshua 1:9",
    t: "Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.",
  },
  {
    r: "Psalm 46:1",
    t: "God is our refuge and strength, a very present help in trouble.",
  },
  {
    r: "Isaiah 40:31",
    t: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.",
  },
  {
    r: "Galatians 6:9",
    t: "And let us not be weary in well doing: for in due season we shall reap, if we faint not.",
  },
  { r: "Psalm 23:1", t: "The LORD is my shepherd; I shall not want." },
  {
    r: "Matthew 5:16",
    t: "Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.",
  },
  {
    r: "Psalm 118:24",
    t: "This is the day which the LORD hath made; we will rejoice and be glad in it.",
  },
  {
    r: "Jeremiah 29:11",
    t: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
  },
  {
    r: "Matthew 11:28",
    t: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.",
  },
  {
    r: "Proverbs 16:3",
    t: "Commit thy works unto the LORD, and thy thoughts shall be established.",
  },
  {
    r: "Psalm 119:105",
    t: "Thy word is a lamp unto my feet, and a light unto my path.",
  },
];
const VS = VERSES.filter((v) => v.t.length <= 100);
const NAMES = [
  "Ruth",
  "Caleb",
  "Naomi",
  "Eli",
  "Hannah",
  "Josiah",
  "Lydia",
  "Micah",
  "Esther",
  "Silas",
  "Tabitha",
  "Gideon",
];
const DLG = [
  [
    "Good morning! Did you read today’s verse?",
    "I did! It gave me such peace.",
  ],
  ["Your house looks great!", "Thanks! God blessed this town."],
  ["I just finished my morning run!", "Nice! Strength for serving, right?"],
  ["Want to pray together later?", "I’d love that. See you soon!"],
  ["I drank all my water today 💧", "Caring for the body God gave us!"],
  ["I cleaned my room this morning.", "A tidy home is a peaceful home."],
  ["Have you met our newest neighbor?", "Not yet, let’s go say hi!"],
  ["I’m so grateful for good friends.", "Me too. Thank you, Lord!"],
  ["How’s your streak going?", "Strong! One day at a time. 🔥"],
  ["Cold shower this morning, brr!", "Self-control builds character!"],
];
const NB = {
  meadow: {
    pl: "earth",
    eco: "meadow",
    n: "Meadow Valley",
    d: "Rolling green hills and wildflowers.",
    bud: "clover",
    ac: "#4cae6a",
    sky: ["#8fd0ff", "#e6f6ff"],
    hill: "#a9dca0",
    gr: ["#93d684", "#5fb56a"],
    road: "#dccca6",
    wc: "#6ec6ff",
    pc: "#5eb5e8",
    tree: "pine",
    hc: [
      ["#f3d9a8", "#c0504d"],
      ["#cfe3f5", "#3b6fd4"],
      ["#e8d4f5", "#7c4dbd"],
      ["#d8efd8", "#3f9d63"],
      ["#fde3e3", "#e5509a"],
    ],
  },
  seaside: {
    pl: "earth",
    eco: "seaside",
    n: "Seaside Harbor",
    d: "Warm sand, sea breeze and sailboats.",
    bud: "shell",
    ac: "#3a95e0",
    sky: ["#6fc3ff", "#fff1dc"],
    hill: "#f1deae",
    gr: ["#f8e9bd", "#e8d094"],
    road: "#d6bd88",
    wc: "#7fd6ff",
    pc: "#3fb0e8",
    tree: "palm",
    hc: [
      ["#ffffff", "#2f86d6"],
      ["#fff4e0", "#e5624a"],
      ["#e6f4ff", "#1f6fb5"],
      ["#ffffff", "#2aa6a0"],
      ["#fff0f0", "#e5509a"],
    ],
  },
  snowy: {
    pl: "earth",
    eco: "snowy",
    n: "Snowy Hollow",
    d: "Cozy cabins under fresh snow.",
    bud: "snowflake",
    ac: "#8bbbe0",
    sky: ["#a9c7e8", "#f3f8ff"],
    hill: "#dfeaf5",
    gr: ["#f4f8fd", "#d3e2f0"],
    road: "#c7d5e3",
    wc: "#d6ecfb",
    pc: "#cfe6f6",
    tree: "snowpine",
    roofStyle: "snow",
    hc: [
      ["#c98f5a", "#f1f6fb"],
      ["#b57b4a", "#eef4fa"],
      ["#d9a46c", "#f4f8fc"],
      ["#a86f40", "#edf3f9"],
      ["#c4864f", "#f1f6fb"],
    ],
  },
  oasis: {
    pl: "earth",
    eco: "oasis",
    n: "Sunny Oasis",
    d: "Golden dunes, palms and a hidden pond.",
    bud: "sunburst",
    ac: "#e0a040",
    sky: ["#ffc27a", "#fff2d1"],
    hill: "#efca82",
    gr: ["#f6d894", "#e2b566"],
    road: "#d6b676",
    wc: "#6ee0e0",
    pc: "#3fc9c9",
    tree: "palm",
    roofStyle: "flat",
    hc: [
      ["#f0d3a0", "#c0793f"],
      ["#e8c48c", "#b3672f"],
      ["#f5dcae", "#d08a4a"],
      ["#e0b87c", "#a95f2b"],
      ["#f2d19a", "#c77b3e"],
    ],
  },
  autumn: {
    pl: "earth",
    eco: "autumn",
    n: "Autumn Woods",
    d: "Crisp air and falling leaves.",
    bud: "acorn",
    ac: "#d9602a",
    sky: ["#ffb877", "#fff0dc"],
    hill: "#d9a35a",
    gr: ["#cfa850", "#9d7c36"],
    road: "#c8a878",
    wc: "#8fd0e8",
    pc: "#6ab8d8",
    tree: "autumn",
    hc: [
      ["#e8c999", "#b5472f"],
      ["#f0d6a8", "#a8562a"],
      ["#dcbb86", "#8f3b22"],
      ["#ecd0a0", "#c05a2a"],
      ["#e3c08a", "#9d4a2a"],
    ],
  },
  starlight: {
    pl: "earth",
    eco: "starlight",
    n: "Starlight Ridge",
    d: "Twilight peaks beneath glowing constellations.",
    bud: "starshape",
    ac: "#8a56c9",
    sky: ["#342a6e", "#8e76c9"],
    hill: "#564994",
    gr: ["#6859ab", "#463b7d"],
    road: "#b6aad9",
    wc: "#9bd0ff",
    pc: "#7ab6f5",
    tree: "starpine",
    hc: [
      ["#ede7ff", "#6b4dbd"],
      ["#dcd4f7", "#4d6fd4"],
      ["#f5e6ff", "#9a4dbd"],
      ["#e3ebff", "#3b5fa8"],
      ["#f7e4f5", "#c9509a"],
    ],
  },
  crystal: {
    pl: "earth",
    eco: "crystal",
    n: "Crystal Caverns",
    d: "Sparkling geodes and turquoise springs.",
    bud: "gem",
    ac: "#2aa6a0",
    sky: ["#4bb8b0", "#d8f7f2"],
    hill: "#74c9c2",
    gr: ["#88dcd4", "#49a89f"],
    road: "#cfe6e3",
    wc: "#8ff5ee",
    pc: "#52d9cf",
    tree: "crystaltree",
    roofStyle: "flat",
    hc: [
      ["#e6fbf9", "#268f8a"],
      ["#d8f0f7", "#3b78b5"],
      ["#ebfaf5", "#3f9d7a"],
      ["#e0f4fa", "#2a6f9c"],
      ["#f0f7ff", "#5a6fd4"],
    ],
  },
  sky: {
    pl: "earth",
    eco: "sky",
    n: "Sky Arch",
    d: "Sunlit cloud islands floating above the horizon.",
    bud: "earthplanet",
    ac: "#5b9bd5",
    sky: ["#68b8ff", "#eef8ff"],
    hill: "#b8e2ff",
    gr: ["#d6efff", "#9fd2f7"],
    road: "#fff5db",
    wc: "#7fd6ff",
    pc: "#52b8f5",
    tree: "cloudtree",
    hc: [
      ["#ffffff", "#4a86d9"],
      ["#fff8e6", "#e8941a"],
      ["#eef6ff", "#6a5fd6"],
      ["#ffffff", "#3fa35d"],
      ["#fff0f6", "#e5509a"],
    ],
  },
};

const SPACE_CFG = {
  mars: {
    pre: "Mars",
    sky: ["#2b1018", "#c95a38"],
    hill: "#b5472a",
    gr: ["#d96b43", "#9c3a1e"],
    road: "#e0a888",
    buds: [
      "rocketbud",
      "craterbud",
      "frostorb",
      "solardome",
      "dustcore",
      "phobos",
      "marsgem",
      "marsplanet",
    ],
    names: [
      "Ares Bio-Dome",
      "Mariner Bay",
      "Olympus Frost",
      "Helios Dunes",
      "Canyon Colony",
      "Phobos Ridge",
      "Red Quartz Cavern",
      "Zephyr Aerostat",
    ],
    descs: [
      "Pressurized biodome meadows on Mars.",
      "Crimson shore beside ancient Martian seas.",
      "Frost-capped polar research outpost.",
      "Solar-powered desert oasis station.",
      "Rust-red canyon winds & astronaut habitats.",
      "Starlit Martian ridge under twin moons.",
      "Glowing red-quartz cavern outpost.",
      "High-altitude Martian sky-dock.",
    ],
  },
  jupiter: {
    pre: "Jupiter",
    sky: ["#241428", "#d98a3c"],
    hill: "#c97732",
    gr: ["#e8a454", "#b05d22"],
    road: "#f0cfa0",
    buds: [
      "stormeye",
      "tidepod",
      "cryocube",
      "ionflare",
      "amberorb",
      "galilean",
      "jovian",
      "jupiterplanet",
    ],
    names: [
      "Amber Meadow Deck",
      "Europa Tide Station",
      "Cryo Cloud Shelf",
      "Io Solar Atoll",
      "Saffron Gust Woods",
      "Galilean Observatory",
      "Jovian Geode Platform",
      "Great Red Skyport",
    ],
    descs: [
      "Floating biodome garden above Jupiter’s bands.",
      "Oceanic moon-tide research harbor.",
      "Sub-zero ice-crystal cloud station.",
      "Sunlit golden energy collector deck.",
      "Swirling amber-leaf sky arboretum.",
      "Deep-space starlight observatory.",
      "Turquoise crystal energy cavern.",
      "Stratospheric cloud-arch station.",
    ],
  },
  saturn: {
    pre: "Saturn",
    sky: ["#1e1936", "#d9b35a"],
    hill: "#c49c48",
    gr: ["#ebd07a", "#a88132"],
    road: "#f5e6b8",
    buds: [
      "ringling",
      "titanwave",
      "enceladus",
      "goldhalo",
      "duskring",
      "cassini",
      "ringgem",
      "saturnplanet",
    ],
    names: [
      "Ringview Meadow",
      "Titan Liquid Harbor",
      "Enceladus Geyser Base",
      "Golden Ring Oasis",
      "Amber Horizon Woods",
      "Cassini Star Spire",
      "Halo Crystal Vault",
      "Nimbus Ring Arch",
    ],
    descs: [
      "Greenhouse biodome framed by Saturn’s rings.",
      "Methane-sea harbor on Titan’s coast.",
      "Ice-geyser cryo habitat.",
      "Sun-drenched golden ring oasis.",
      "Warm amber-lit orbital arboretum.",
      "Twilight starlight tower beneath the rings.",
      "Luminous ring-crystal cavern.",
      "Floating cloud-island arch in Saturn’s sky.",
    ],
  },
  uranus: {
    pre: "Uranus",
    sky: ["#11283b", "#46b8cc"],
    hill: "#389cb0",
    gr: ["#7be0ed", "#2c8599"],
    road: "#c8f2f7",
    buds: [
      "cyanmist",
      "miranda",
      "glacier",
      "auroradisk",
      "oberon",
      "arielstar",
      "iceprism",
      "uranusplanet",
    ],
    names: [
      "Cyan Mist Meadow",
      "Miranda Cliff Harbor",
      "Glacier Dome Hollow",
      "Aurora Ice Oasis",
      "Oberon Twilight Woods",
      "Ariel Starlight Ridge",
      "Frost Prism Caverns",
      "Zephyr Cloud Arch",
    ],
    descs: [
      "Misty turquoise biodome valley.",
      "Ice-cliff harbor overlooking cyan seas.",
      "Sub-zero glacier astronaut station.",
      "Glowing aurora oasis outpost.",
      "Cool amber-lit orbital woods.",
      "Constellation ridge above Uranus.",
      "Sparkling frost-prism cavern.",
      "Floating sky-arch observatory.",
    ],
  },
  neptune: {
    pre: "Neptune",
    sky: ["#0b1438", "#2d5be0"],
    hill: "#2448b8",
    gr: ["#5c8ef2", "#1d3c9e"],
    road: "#bdd4ff",
    buds: [
      "triton",
      "abyssfin",
      "cometice",
      "blueflare",
      "nebula",
      "pulsar",
      "sapphire",
      "neptuneplanet",
    ],
    names: [
      "Triton Bio-Valley",
      "Sapphire Abyss Harbor",
      "Comet Ice Outpost",
      "Blue Beacon Oasis",
      "Nebula Drift Woods",
      "Pulsar Starlight Spire",
      "Sapphire Geode Cavern",
      "Cosmo Sky Citadel",
    ],
    descs: [
      "Deep-blue biodome valley on Triton.",
      "Sapphire ocean research harbor.",
      "Comet-ice cryo habitat.",
      "Radiant blue-star oasis station.",
      "Violet-amber nebula arboretum.",
      "Twin-star observatory ridge.",
      "Deep sapphire crystal cavern.",
      "A block-built royal pig kingdom above the clouds.",
    ],
  },
};

["mars", "jupiter", "saturn", "uranus", "neptune"].forEach((pl) => {
  const cfg = SPACE_CFG[pl];
  BASE_ECO.forEach((eco, idx) => {
    const base = NB[eco],
      id = pl + "_" + eco;
    NB[id] = {
      pl,
      eco,
      n: cfg.names[idx],
      d: cfg.descs[idx],
      bud: cfg.buds[idx],
      ac: base.ac,
      sky: eco === "starlight" ? base.sky : cfg.sky,
      hill: cfg.hill,
      gr: eco === "snowy" ? base.gr : cfg.gr,
      road: cfg.road,
      wc: base.wc,
      pc: base.pc,
      tree: base.tree,
      roofStyle: base.roofStyle,
      hc: [
        ["#f4f7fb", "#e5624a"],
        ["#e6eef8", "#3b6fd4"],
        ["#f7f9fc", "#ffb300"],
        ["#eaf4f8", "#2aa6a0"],
        ["#f3ebfa", "#8a56c9"],
      ],
    };
  });
});

NB.neptune_sky.n = "Pigpatch Sky Farm";
NB.neptune_sky.d = "A cheerful grassland farm beneath a bright blue sky.";
NB.neptune_sky.sky = ["#76c9ef", "#dff5ff"];
NB.neptune_sky.hill = "#83bb69";
NB.neptune_sky.gr = ["#92cf6c", "#4f9556"];
NB.neptune_sky.road = "#e5c789";
NB.neptune_sky.hc = [
  ["#ffd5df", "#d45f86"],
  ["#ffe0e7", "#8f5bd6"],
  ["#f7b6cb", "#e39b25"],
  ["#ffe6b3", "#cf668c"],
  ["#f3c5dc", "#6e72cb"],
];

const planetNbs = (pl) =>
  BASE_ECO.map((e) => (pl === "earth" ? e : pl + "_" + e));
const NBK = Object.keys(NB);
NBK.forEach((k) => {
  if (S.nb.xp && S.nb.xp[k] !== undefined && NB[k].bud) S.seenK[NB[k].bud] = 1;
});
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
const houseS = (i) => {
  // When on a space planet (Mars, Jupiter, Saturn, Uranus, Neptune), render Astronaut Space Habitats & Domed Modules!
  if (NBC.pl && NBC.pl !== "earth") {
    const c = NBC.hc[i % 5];
    let o =
      '<path d="M-17 -12A17 17 0 0 1 17 -12Z" fill="rgba(165,230,255,.38)" stroke="#9ad8ff" stroke-width="1.2"/>';
    o +=
      '<ellipse cx="0" cy="-21" rx="7" ry="3" fill="rgba(255,255,255,.45)"/>';
    o += R(-18, -12, 36, 12, c[0]) + R(-20, -14, 40, 3, c[1]);
    o +=
      '<rect x="-5" y="-10" width="10" height="10" rx="4" fill="#3a4a5e" stroke="' +
      c[1] +
      '" stroke-width="1.4"/>';
    o +=
      '<circle class="win" cx="-11" cy="-6" r="2.6" fill="#9be8ff"/><circle class="win" cx="11" cy="-6" r="2.6" fill="#9be8ff"/>';
    o +=
      '<line x1="12" y1="-26" x2="12" y2="-36" stroke="#d8e6f3" stroke-width="1.4"/><circle class="tw" cx="12" cy="-37" r="2" fill="#ff6a1a"/>';
    return o;
  }
  const c = NBC.hc[i % 5],
    flat = NBC.roofStyle === "flat",
    snow = NBC.roofStyle === "snow";
  let o = R(-16, -22, 32, 22, c[0]);
  if (flat) o += R(-19, -26, 38, 5, c[1]) + R(-7, -30, 14, 5, c[1]);
  else {
    o +=
      '<polygon points="-20,-22 0,-38 20,-22" fill="' +
      c[1] +
      '"' +
      (snow ? ' stroke="#b9cde0" stroke-width="1"' : "") +
      "/>" +
      R(8, -36, 5, 9, "#8a6a4a") +
      '<circle class="sm" cx="10.5" cy="-39" r="2.2" fill="#fff" style="animation-delay:-' +
      i * 0.7 +
      's"/><circle class="sm" cx="10.5" cy="-39" r="2" fill="#fff" style="animation-delay:-' +
      (i * 0.7 + 1.5) +
      's"/>';
  }
  return (
    o + R(-4, -14, 8, 14, "#6b4423") + RW(-13, -17, 6, 6) + RW(7, -17, 6, 6)
  );
};
const tree = (x, y, s) => {
  const k = NBC.tree;
  let t = "";
  if (k === "pine")
    t =
      R(-1.5, -5, 3, 5, "#6b4423") +
      '<polygon points="-10,-5 0,-22 10,-5" fill="#2f8f4e"/><polygon points="-7,-16 0,-32 7,-16" fill="#3aa35d"/>';
  if (k === "snowpine")
    t =
      R(-1.5, -5, 3, 5, "#6b4423") +
      '<polygon points="-10,-5 0,-22 10,-5" fill="#3a7a62"/><polygon points="-7,-16 0,-32 7,-16" fill="#468f74"/><polygon points="-7.5,-12 0,-22 7.5,-12 4.5,-13.5 0,-18 -4.5,-13.5" fill="#fff"/><polygon points="-4.4,-24 0,-32 4.4,-24 2,-25.5 0,-28.5 -2,-25.5" fill="#fff"/>';
  if (k === "palm") {
    t =
      '<path d="M0 0Q4 -10 -1 -24" stroke="#9b6a3a" stroke-width="3" fill="none" stroke-linecap="round"/><g transform="translate(-1 -24)">';
    [-170, -130, -90, -50, -10].forEach((a) => {
      t +=
        '<ellipse cx="9" cy="0" rx="9" ry="3" fill="#3fa35d" transform="rotate(' +
        a +
        ')"/>';
    });
    t +=
      '<circle cx="-1.5" cy="2" r="1.6" fill="#7a4a22"/><circle cx="1.5" cy="2" r="1.6" fill="#7a4a22"/></g>';
  }
  if (k === "autumn")
    t =
      R(-1.8, -9, 3.6, 9, "#6b4423") +
      '<circle cx="0" cy="-20" r="11" fill="#e8812a"/><circle cx="-6" cy="-15" r="7" fill="#d9602a"/><circle cx="6" cy="-16" r="7" fill="#f0a030"/>';
  if (k === "starpine")
    t =
      R(-1.5, -5, 3, 5, "#4a3a70") +
      '<polygon points="-10,-5 0,-22 10,-5" fill="#4f428a"/><polygon points="-7,-16 0,-32 7,-16" fill="#6d5bb8"/><circle class="tw" cx="0" cy="-34" r="2.2" fill="#ffe27a"/>';
  if (k === "crystaltree")
    t =
      '<polygon points="-4,0 0,-26 4,0" fill="#52d9cf"/><polygon points="-9,0 -4,-17 0,0" fill="#8ff5ee"/><polygon points="0,0 5,-19 9,0" fill="#2aa6a0"/>';
  if (k === "cloudtree")
    t =
      R(-1.4, -8, 2.8, 8, "#d9b88c") +
      '<circle cx="0" cy="-18" r="9" fill="#fff"/><circle cx="-6" cy="-14" r="6" fill="#eef8ff"/><circle cx="6" cy="-14" r="6" fill="#eef8ff"/>';
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
  's"><line x1="' +
  x +
  '" y1="' +
  y +
  '" x2="' +
  x +
  '" y2="' +
  (y - 7) +
  '" stroke="#3a8f4e" stroke-width="1"/><circle cx="' +
  x +
  '" cy="' +
  (y - 8) +
  '" r="2.4" fill="' +
  c +
  '"/></g>';
function gdn() {
  const id = NBC.eco || Object.keys(NB).find((k) => NB[k] === NBC);
  if (id === "meadow")
    return (
      '<circle cx="262" cy="214" r="5" fill="#3aa35d"/><circle cx="96" cy="212" r="5" fill="#3aa35d"/>' +
      flo(268, 222, "#e5509a") +
      flo(256, 225, "#f0c14b") +
      flo(102, 223, "#fff") +
      flo(90, 224, "#e5509a") +
      flo(45, 226, "#f0c14b")
    );
  if (id === "seaside")
    return '<g transform="translate(264 224)"><rect x="-.8" y="-20" width="1.6" height="20" fill="#8b5a2b"/><path d="M-13 -20a13 10 0 0 1 26 0z" fill="#e5624a"/><path d="M-4 -20Q-3 -28 0 -29Q3 -28 4 -20z" fill="#fff"/></g><circle cx="98" cy="224" r="4.5" fill="#fff" stroke="#e5509a" stroke-width="1.6"/><ellipse cx="60" cy="228" rx="3" ry="2" fill="#ffd9e0"/><ellipse cx="232" cy="228" rx="3" ry="2" fill="#fff"/>';
  if (id === "snowy")
    return '<g transform="translate(264 226)"><circle cy="-6" r="7" fill="#fff" stroke="#c9d8e8"/><circle cy="-16" r="5" fill="#fff" stroke="#c9d8e8"/><circle cy="-23" r="3.6" fill="#fff" stroke="#c9d8e8"/><polygon points="0,-23 6,-22 0,-21.4" fill="#ff8a3c"/><circle cx="-1.3" cy="-24.2" r=".6" fill="#222"/><circle cx="1.3" cy="-24.2" r=".6" fill="#222"/><rect x="-4" y="-19" width="8" height="1.8" fill="#c94a4a"/></g><ellipse cx="98" cy="226" rx="9" ry="3" fill="#fff"/><ellipse cx="40" cy="230" rx="7" ry="2.4" fill="#fff"/>';
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
    return '<circle class="tw" cx="264" cy="220" r="3" fill="#ffe27a"/><circle class="tw" style="animation-delay:-1s" cx="98" cy="222" r="2.5" fill="#b8d8ff"/><polygon points="274,226 276,220 278,226" fill="#ffe27a"/>';
  if (id === "crystal")
    return '<polygon points="260,226 264,214 268,226" fill="#8ff5ee"/><polygon points="266,226 270,217 274,226" fill="#52d9cf"/><polygon points="94,226 98,215 102,226" fill="#8ff5ee"/>';
  if (id === "sky")
    return '<ellipse cx="264" cy="224" rx="12" ry="5" fill="#fff"/><ellipse cx="272" cy="222" rx="8" ry="4" fill="#fff"/><ellipse cx="98" cy="225" rx="10" ry="4" fill="#fff"/>';
  return '<ellipse cx="264" cy="224" rx="6" ry="5" fill="#e8812a"/><rect x="263" y="217" width="2" height="3" fill="#4a7a2a"/><ellipse cx="276" cy="228" rx="5" ry="4.2" fill="#f0902a"/><ellipse cx="98" cy="226" rx="6" ry="5" fill="#e8812a"/><ellipse cx="46" cy="230" rx="10" ry="3" fill="#c24a22"/><ellipse cx="238" cy="230" rx="9" ry="3" fill="#d9602a"/>';
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
      '<ellipse cx="0" cy="-4" rx="18" ry="7" fill="#9fb4c7"/><ellipse class="wtr" cx="0" cy="-5" rx="14" ry="5" fill="' +
      NBC.wc +
      '"/><ellipse class="rip" cx="0" cy="-5" rx="14" ry="5"/><ellipse class="rip b" cx="0" cy="-5" rx="14" ry="5"/>' +
      R(-2, -22, 4, 17, "#9fb4c7") +
      '<circle class="dr" cx="-4" cy="-24" r="2" fill="#bfe8ff"/><circle class="dr b" cx="4" cy="-24" r="2" fill="#bfe8ff"/><circle class="dr c" cx="0" cy="-26" r="1.8" fill="#bfe8ff"/><circle class="dr d" cx="-7" cy="-22" r="1.5" fill="#bfe8ff"/>',
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
      '<polygon points="-30,-24 0,-42 30,-24" fill="#8b5a2b"/>' +
      R(-5, -14, 10, 14, "#6b4423") +
      '<rect x="-10" y="-35" width="20" height="9" rx="2" fill="#fff"/><g transform="translate(-6 -36.5) scale(.5)"><g class="flt">' +
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
      '<polygon points="-18,-22 0,-34 18,-22" fill="#b04a3a"/>' +
      R(-4, -46, 8, 13, "#f1ece2") +
      '<polygon points="-5,-46 0,-56 5,-46" fill="#b04a3a"/>' +
      R(-0.8, -66, 1.6, 10, "#f0c14b") +
      R(-3.5, -63, 7, 1.6, "#f0c14b") +
      '<path class="bell" d="M-2.5 -35Q-2.5 -42 0 -42Q2.5 -42 2.5 -35Z" fill="#f0c14b"/><circle class="tw" cx="0" cy="-62" r="3.5" fill="#fff3b0"/><path d="M-4 0V-9A4 4 0 0 1 4 -9V0Z" fill="#6b4423"/>',
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
      '<ellipse cx="0" cy="-4" rx="26" ry="9" fill="' +
      NBC.pc +
      '"/><ellipse class="rip" cx="0" cy="-4" rx="24" ry="8"/><ellipse class="rip b" cx="0" cy="-4" rx="24" ry="8"/><ellipse class="lily" cx="-8" cy="-5" rx="5" ry="2" fill="#6fcf7f"/><ellipse class="lily" style="animation-delay:-1.7s" cx="9" cy="-3" rx="4" ry="1.6" fill="#6fcf7f"/><ellipse class="fish" cx="-14" cy="-4" rx="3" ry="1.5" fill="#ff9d42"/><path d="M-12 -6Q0 -18 12 -6" fill="none" stroke="#a0743f" stroke-width="3"/>',
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
      '<polygon points="-7,0 7,0 5,-46 -5,-46" fill="#fff"/>' +
      R(-6.4, -14, 12.8, 5, "#d64545") +
      R(-5.6, -30, 11.2, 5, "#d64545") +
      R(-6, -54, 12, 8, "#ffe27a") +
      '<g class="beam"><polygon points="0,-50 72,-60 72,-40" fill="#fff3b0"/><polygon points="0,-50 -72,-60 -72,-40" fill="#fff3b0"/><animateTransform attributeName="transform" type="rotate" from="0 0 -50" to="360 0 -50" dur="8s" repeatCount="indefinite"/></g><circle class="glow" cx="0" cy="-50" r="13" fill="#fff3b0"/><polygon points="-8,-54 0,-64 8,-54" fill="#d64545"/>',
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
      '<path d="M-5 0V-12A5 5 0 0 1 5 -12V0Z" fill="#6b4423"/>' +
      R(-0.5, -58, 1, 18, "#6b4423") +
      '<polygon class="flag" points="0.5,-58 12,-54 0.5,-50" fill="#e5509a"/>',
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
    hat: g(["none", "cap", "beanie", "cowboy", "none", "phones"], 5),
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
  S.res.forEach((r) => out.push({ n: r.n, p: r.l, k: "res", ref: r }));
  return out;
}
const vOfDay = () =>
  VERSES[[...today()].reduce((a, c) => a + c.charCodeAt(0), 0) % VERSES.length];
const TW = {
  on: false,
  ws: [],
  raf: 0,
  last: 0,
  next: 0,
  W: 0,
  H: 0,
  conv: null,
};
function V() {
  return S.nb.view || S.nb.cur;
}
const snowF = () => {
  let o = "";
  for (let i = 0; i < 30; i++) {
    const t = 5 + (i % 5);
    o +=
      '<circle class="snf" cx="' +
      ((i * 37) % 360) +
      '" cy="0" r="' +
      (1 + (i % 3) * 0.6) +
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
      '<ellipse class="lvf" cx="' +
      ((i * 47) % 360) +
      '" cy="0" rx="3.2" ry="1.7" fill="' +
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
      '<rect y="100" width="360" height="30" fill="#4aa8ee"/><rect y="100" width="360" height="8" fill="#86d6ff" opacity=".6"/><path class="wave" d="M8 114q6-4 12 0t12 0t12 0" stroke="#fff" stroke-width="1.4" fill="none" opacity=".75"/><path class="wave b" d="M124 122q6-4 12 0t12 0t12 0" stroke="#fff" stroke-width="1.4" fill="none" opacity=".75"/><path class="wave" d="M240 110q6-4 12 0t12 0t12 0" stroke="#fff" stroke-width="1.4" fill="none" opacity=".75"/><g transform="translate(70 114)"><g class="boat"><path d="M-9 0h18l-3 5h-12z" fill="#8b5a2b"/><polygon points="0,-15 0,-1 8,-1" fill="#fff"/><polygon points="-1.5,-12 -1.5,-1 -8,-1" fill="#ffd9c0"/></g></g>',
  },
  snowy: {
    back: () =>
      '<polygon points="0,128 38,88 62,112 100,70 138,118 188,92 236,122 286,80 330,110 360,96 360,128" fill="#b9cde2"/><polygon points="100,70 91,84 99,81 106,86" fill="#fff"/><polygon points="286,80 277,94 285,91 293,96" fill="#fff"/><polygon points="38,88 31,98 38,96 44,100" fill="#fff"/><polygon points="188,92 181,102 188,100 195,104" fill="#fff"/>',
    front: snowF,
  },
  oasis: {
    back: () =>
      '<path d="M0 128Q90 106 180 126T360 118V132H0z" fill="#f4d28e"/><polygon points="52,128 86,92 120,128" fill="#e3b878"/><polygon points="86,92 120,128 100,128" fill="#c99a56"/><polygon points="132,128 158,102 184,128" fill="#e3b878"/><polygon points="158,102 184,128 168,128" fill="#c99a56"/>',
  },
  autumn: {
    back: () => {
      const cs = ["#e8812a", "#d9602a", "#f0a030", "#c24a22"];
      let o = '<rect y="118" width="360" height="14" fill="#b88a3a"/>';
      for (let i = 0; i < 22; i++)
        o +=
          '<circle cx="' +
          (i * 17 + 6) +
          '" cy="' +
          (118 + (i % 3) * 2) +
          '" r="' +
          (10 + (i % 4) * 2) +
          '" fill="' +
          cs[i % 4] +
          '"/>';
      return o;
    },
    front: leafF,
  },
  starlight: {
    back: () =>
      '<polygon points="0,128 50,74 105,128" fill="#43377a"/><polygon points="85,128 155,66 225,128" fill="#4f428a"/><polygon points="200,128 275,72 350,128" fill="#43377a"/><circle class="tw" cx="50" cy="48" r="1.6" fill="#ffe27a"/><circle class="tw" style="animation-delay:-1.2s" cx="155" cy="40" r="1.8" fill="#ffe27a"/><circle class="tw" style="animation-delay:-.6s" cx="240" cy="54" r="1.5" fill="#fff"/>',
  },
  crystal: {
    back: () =>
      '<polygon points="18,128 36,76 54,128" fill="#52d9cf" opacity=".75"/><polygon points="44,128 58,92 72,128" fill="#8ff5ee" opacity=".85"/><polygon points="280,128 302,72 324,128" fill="#52d9cf" opacity=".75"/><polygon points="312,128 328,88 344,128" fill="#8ff5ee" opacity=".85"/>',
  },
  sky: {
    back: () =>
      '<ellipse cx="70" cy="116" rx="48" ry="14" fill="#fff" opacity=".85"/><ellipse cx="180" cy="112" rx="56" ry="15" fill="#fff" opacity=".9"/><ellipse cx="295" cy="118" rx="46" ry="13" fill="#fff" opacity=".85"/>',
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
            '<g><ellipse cx="55" cy="52" rx="38" ry="12" fill="#fff" opacity=".85"/><ellipse cx="305" cy="64" rx="44" ry="13" fill="#fff" opacity=".82"/><g transform="translate(35 62) scale(.82)"><path d="M0 40 36 8 72 40" fill="#7f3130"/><path d="M8 37 36 15 64 37V84H8Z" fill="#b9473f"/><path d="M20 84V54L36 40 52 54V84Z" fill="#7a2e2c" stroke="#fff5e8" stroke-width="4"/><path d="m21 55 30 28m0-28L21 83" stroke="#fff5e8" stroke-width="3"/><path d="M31 25h10v10H31z" fill="#dff3fa" stroke="#fff5e8" stroke-width="3"/></g><g fill="#fff"><circle cx="240" cy="101" r="5"/><circle cx="276" cy="109" r="4"/><circle cx="320" cy="105" r="5"/></g></g>',
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
  let g = "";
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
}
$("bld").onclick = (e) => {
  const b = e.target.closest(".bd");
  if (b) {
    const x = BLD[+b.dataset.i];
    rerun(b, "wob");
    toast(x.n + ": " + x.d);
  }
};
function townInfo() {
  const id = V(),
    c = NB[id],
    x = nbXp(id),
    built = BLD.filter((b) => x >= b.at),
    n = built.length,
    nx = BLD.find((b) => x < b.at);
  $("tnm").textContent = "Lv " + n;
  $("tnb").textContent = c.n;
  $("tlv").textContent =
    (id === S.nb.cur ? "" : "Visiting · ") + n + "/" + BLD.length;
  if (nx) {
    const pa = built[n - 1].at;
    $("tbar").style.width = ((x - pa) / (nx.at - pa)) * 100 + "%";
    $("tnx").textContent = "Next: " + nx.n + " · " + (nx.at - x) + " XP";
  } else {
    $("tbar").style.width = "100%";
    $("tnx").textContent = "Complete!";
  }
  countTo($("tc1"), BLD.filter((b) => b.h && x >= b.at).length);
  countTo($("tc2"), townCast().length);
  countTo($("tc3"), Math.min(x, MAXAT));
  const v = vOfDay();
  $("vtx").textContent = "“" + v.t + "”";
  $("vref").textContent = "— " + v.r;
  $("gcard").hidden = !maxed();
  const home = id === S.nb.cur,
    fin = home && nbDone(id);
  $("ncard").hidden = !fin;
  if (fin)
    $("nct").textContent = worldDone()
      ? "Every neighborhood is complete. Your whole world is built!"
      : "Choose where your community goes next.";
  if (fin && worldDone()) {
    const nxPl = nextPlanet();
    $("nct").textContent = nxPl
      ? "🚀 All of " +
        PLANETS[c.pl].n +
        " is complete! Launch to " +
        PLANETS[nxPl].n +
        " now!"
      : "🌌 Every planet in the Solar System is 100% complete!";
  }
  $("homeb").hidden = home;
  $("hbn").textContent = "Return to " + NB[S.nb.cur].n;
  const curPl = c.pl || "earth",
    plDoneN = planetNbs(curPl).filter((k) => nbDone(k)).length;
  $("wsub").textContent =
    PLANETS[curPl].icon +
    " " +
    PLANETS[curPl].n +
    ": " +
    plDoneN +
    "/8 complete · " +
    PLANET_LIST.filter((p) => planetDone(p)).length +
    "/" +
    PLANET_LIST.length +
    " planets";
  $("tsub").textContent =
    PLANETS[curPl].icon + " " + PLANETS[curPl].n + " · " + c.d;
}
// Spherical coordinates [lon°, lat°, rx, ry] around the 3D Earth globe
const GP = {
  meadow: [-22, 12, 28, 20],
  seaside: [26, 22, 22, 15],
  snowy: [-5, 52, 24, 14],
  oasis: [68, -14, 25, 17],
  autumn: [-72, -20, 23, 15],
  starlight: [116, 28, 24, 16],
  crystal: [162, -24, 25, 17],
  sky: [-132, 16, 24, 16],
};
const GLB = {
  lon: 15,
  lat: 12,
  vLon: 0.22,
  drag: false,
  moved: false,
  lx: 0,
  ly: 0,
  raf: 0,
};
let gsel = null;
function gProj(lon, lat) {
  const la = ((lon + GLB.lon) * Math.PI) / 180,
    ph = (lat * Math.PI) / 180,
    ph0 = (GLB.lat * Math.PI) / 180;
  const cp = Math.cos(ph),
    sp = Math.sin(ph),
    cp0 = Math.cos(ph0),
    sp0 = Math.sin(ph0);
  const x = cp * Math.sin(la),
    y = cp0 * sp - sp0 * cp * Math.cos(la),
    z = sp0 * sp + cp0 * cp * Math.cos(la);
  return { x: 120 + 108 * x, y: 120 - 108 * y, z };
}
function gGridSvg() {
  let o = "";
  [-60, -30, 0, 30, 60].forEach((lat) => {
    let d = "",
      pen = false;
    for (let lon = -180; lon <= 180; lon += 10) {
      const p = gProj(lon, lat);
      if (p.z > 0) {
        d += (pen ? "L" : "M") + p.x.toFixed(1) + " " + p.y.toFixed(1);
        pen = true;
      } else pen = false;
    }
    if (d) o += '<path d="' + d + '"/>';
  });
  for (let lon = -150; lon <= 180; lon += 30) {
    let d = "",
      pen = false;
    for (let lat = -85; lat <= 85; lat += 10) {
      const p = gProj(lon, lat);
      if (p.z > 0) {
        d += (pen ? "L" : "M") + p.x.toFixed(1) + " " + p.y.toFixed(1);
        pen = true;
      } else pen = false;
    }
    if (d) o += '<path d="' + d + '"/>';
  }
  return o;
}
function gCloudsSvg() {
  const cs = [
    [-40, 34, 24, 5.5, 0.55],
    [50, -32, 28, 6.5, 0.5],
    [135, 18, 22, 5, 0.5],
    [-125, -26, 25, 6, 0.45],
  ];
  return cs
    .map((c) => {
      const p = gProj(c[0], c[1]);
      if (p.z <= 0.08) return "";
      const sc = (0.55 + 0.45 * p.z).toFixed(2);
      return (
        '<ellipse cx="' +
        p.x.toFixed(1) +
        '" cy="' +
        p.y.toFixed(1) +
        '" rx="' +
        (c[2] * sc).toFixed(1) +
        '" ry="' +
        (c[3] * sc).toFixed(1) +
        '" fill="#fff" opacity="' +
        (c[4] * Math.min(1, p.z * 2)).toFixed(2) +
        '"/>'
      );
    })
    .join("");
}
function viewPlanet() {
  return S.nb.vplanet || S.nb.planet || "earth";
}
function renderGlobeFrame() {
  const vpl = viewPlanet(),
    plCfg = PLANETS[vpl] || PLANETS.earth;
  $("gs0").setAttribute("stop-color", plCfg.sea[0]);
  $("gs1").setAttribute("stop-color", plCfg.sea[1]);
  $("gs2").setAttribute("stop-color", plCfg.sea[2]);
  $("ghalo").setAttribute("fill", plCfg.halo);
  $("gringb").setAttribute("opacity", plCfg.ring ? "1" : "0");
  $("gringf").setAttribute("opacity", plCfg.ring ? "1" : "0");
  $("ggrid").innerHTML = gGridSvg();
  const pNbs = planetNbs(vpl);
  const vis = pNbs
    .map((id) => {
      const eco = NB[id].eco || id,
        g = GP[eco] || GP.meadow,
        p = gProj(g[0], g[1]);
      return { id, g, p };
    })
    .sort((a, b) => a.p.z - b.p.z);
  let isl = "",
    pins = "";
  vis.forEach(({ id, g, p }) => {
    if (p.z <= 0.02) return;
    const sc = 0.55 + 0.45 * p.z,
      fo = Math.min(1, p.z * 3.2).toFixed(2);
    const rx = (g[2] * sc).toFixed(1),
      ry = (g[3] * sc * (0.65 + 0.35 * Math.abs(p.z))).toFixed(1);
    const c = NB[id],
      st = nbState(id),
      lk = st === "locked" || st === "avail";
    isl +=
      '<g class="isl' +
      (st === "locked" ? " lk" : "") +
      '" data-id="' +
      id +
      '" opacity="' +
      fo +
      '"><ellipse cx="' +
      p.x.toFixed(1) +
      '" cy="' +
      (p.y + 2 * sc).toFixed(1) +
      '" rx="' +
      (+rx + 3 * sc).toFixed(1) +
      '" ry="' +
      (+ry + 3 * sc).toFixed(1) +
      '" fill="#fff" opacity=".35"/><ellipse cx="' +
      p.x.toFixed(1) +
      '" cy="' +
      p.y.toFixed(1) +
      '" rx="' +
      rx +
      '" ry="' +
      ry +
      '" fill="' +
      c.gr[1] +
      '"/><ellipse cx="' +
      p.x.toFixed(1) +
      '" cy="' +
      (p.y - 2 * sc).toFixed(1) +
      '" rx="' +
      (+rx * 0.86).toFixed(1) +
      '" ry="' +
      (+ry * 0.8).toFixed(1) +
      '" fill="' +
      c.gr[0] +
      '"/>';
    const hn = lk ? 0 : BLD.filter((b) => b.h && nbXp(id) >= b.at).length;
    for (let k = 0; k < hn; k++) {
      const hx = p.x - +rx * 0.55 + k * (+rx * 0.5),
        hy = p.y + (k % 2 ? 4 : -3) * sc;
      isl +=
        '<g transform="translate(' +
        hx.toFixed(1) +
        " " +
        hy.toFixed(1) +
        ") scale(" +
        sc.toFixed(2) +
        ')"><rect x="-3" y="-3" width="6" height="4.5" fill="' +
        c.hc[k][0] +
        '"/><polygon points="-4,-3 0,-7 4,-3" fill="' +
        c.hc[k][1] +
        '"/></g>';
    }
    isl += "</g>";
    if (p.z > 0.12) {
      const ic =
        st === "locked"
          ? "lock"
          : st === "cur"
            ? "house"
            : st === "done"
              ? "check"
              : st === "visited"
                ? "town"
                : "sparkle";
      const ps = (0.72 + 0.28 * p.z).toFixed(2),
        po = Math.min(1, (p.z - 0.12) * 4).toFixed(2);
      pins +=
        '<g class="pin' +
        (st === "avail" ? " av" : "") +
        (st === "cur" ? " me" : "") +
        '" data-id="' +
        id +
        '" opacity="' +
        po +
        '" transform="translate(' +
        p.x.toFixed(1) +
        " " +
        (p.y - +ry - 8 * sc).toFixed(1) +
        ") scale(" +
        ps +
        ')"><g class="pinb"><circle r="9" fill="#fff" stroke="' +
        c.ac +
        '" stroke-width="2.4"/><g transform="translate(-6 -6) scale(.5)">' +
        ICONS[ic] +
        "</g></g></g>";
    }
  });
  $("gisl").innerHTML = isl;
  $("gcld").innerHTML = gCloudsSvg();
  $("gpins").innerHTML = pins;
}
function globeLoop() {
  if (!$("gl").classList.contains("show")) {
    GLB.raf = 0;
    return;
  }
  if (!GLB.drag) {
    GLB.lon = (GLB.lon + GLB.vLon) % 360;
    GLB.vLon += (0.22 - GLB.vLon) * 0.05;
  }
  renderGlobeFrame();
  GLB.raf = requestAnimationFrame(globeLoop);
}
function startGlobe() {
  if (!GLB.raf) GLB.raf = requestAnimationFrame(globeLoop);
}
function stopGlobe() {
  if (GLB.raf) {
    cancelAnimationFrame(GLB.raf);
    GLB.raf = 0;
  }
}
const gsvEl = $("gsv");
gsvEl.addEventListener("pointerdown", (e) => {
  GLB.drag = true;
  GLB.moved = false;
  GLB.lx = e.clientX;
  GLB.ly = e.clientY;
  GLB.vLon = 0;
  if (gsvEl.setPointerCapture)
    try {
      gsvEl.setPointerCapture(e.pointerId);
    } catch (err) {}
});
gsvEl.addEventListener("pointermove", (e) => {
  if (!GLB.drag) return;
  const dx = e.clientX - GLB.lx,
    dy = e.clientY - GLB.ly;
  if (Math.hypot(dx, dy) > 4) GLB.moved = true;
  GLB.lon = (GLB.lon + dx * 0.55) % 360;
  GLB.lat = Math.max(-55, Math.min(55, GLB.lat + dy * 0.45));
  GLB.vLon = dx * 0.35;
  GLB.lx = e.clientX;
  GLB.ly = e.clientY;
  renderGlobeFrame();
});
["pointerup", "pointercancel"].forEach((ev) =>
  gsvEl.addEventListener(ev, () => {
    GLB.drag = false;
  }),
);

function unlockedKinds() {
  const out = new Set(["square", "circle", "triangle", "rectangle", "duck"]);
  NBK.forEach((k) => {
    if (S.nb.xp[k] !== undefined && NB[k].bud) out.add(NB[k].bud);
  });
  if (S.nb.xp.meadow !== undefined) out.add("cloudshape");
  if (S.nb.xp.mars_meadow !== undefined) out.add("aerowing");
  if (S.nb.xp.jupiter_meadow !== undefined) out.add("stratos");
  if (S.nb.xp.saturn_meadow !== undefined) out.add("cloudring");
  if (S.nb.xp.uranus_meadow !== undefined) out.add("breezepuff");
  if (S.nb.xp.neptune_meadow !== undefined) out.add("cosmo");
  return out;
}
function worldCard(id) {
  const c = NB[id],
    st = nbState(id),
    x = nbXp(id),
    d = document.createElement("div");
  d.className =
    "wc" + (id === S.nb.cur ? " cur" : "") + (gsel === id ? " sel" : "");
  d.id = "wc-" + id;
  const sw = document.createElement("div");
  sw.className = "wsw";
  sw.style.background =
    "linear-gradient(180deg," +
    c.sky[0] +
    "," +
    c.sky[1] +
    " 55%," +
    c.gr[0] +
    " 55%," +
    c.gr[1] +
    ")";
  const inf = document.createElement("div");
  inf.className = "winf";
  const b = document.createElement("b");
  b.textContent = c.n;
  const sm = document.createElement("small");
  sm.textContent = c.d;
  const bar = document.createElement("div");
  bar.className = "wbar2";
  const bi = document.createElement("i");
  bi.style.width = Math.min(100, (x / MAXAT) * 100) + "%";
  bi.style.background = c.ac;
  bar.appendChild(bi);
  const tg = document.createElement("span");
  tg.className = "wtg";
  tg.textContent =
    id === S.nb.cur
      ? nbDone(id)
        ? "Your neighborhood · complete"
        : "Your neighborhood"
      : st === "done"
        ? "Complete"
        : st === "visited"
          ? "Visited"
          : st === "avail"
            ? "Ready to settle"
            : "Locked until " + NB[S.nb.cur].n + " is complete";
  inf.append(b, sm, bar, tg);
  if (c.bud && KINDS[c.bud]) {
    const unl = unlockedKinds().has(c.bud);
    const wb = document.createElement("div");
    wb.className = "wbud" + (unl ? "" : " lk");
    wb.appendChild(svgOf(freshLook(c.bud), 20, 22));
    const wt = document.createElement("span");
    wt.textContent =
      (unl ? "Unlocked buddy: " : "Unlocks buddy: ") + KINDS[c.bud].n;
    wb.appendChild(wt);
    inf.appendChild(wb);
  }
  d.append(sw, inf);
  const bt = document.createElement("button");
  bt.type = "button";
  bt.className = "wbt";
  if (st === "cur" || st === "done" || st === "visited") {
    bt.textContent = V() === id ? "Viewing" : "Visit";
    bt.disabled = V() === id;
    bt.onclick = () => visit(id);
  } else if (st === "avail") {
    bt.textContent = "Settle here";
    bt.classList.add("go");
    bt.onclick = () => {
      if (bt.classList.contains("arm")) settle(id);
      else {
        bt.classList.add("arm");
        bt.textContent = "Tap again";
        setTimeout(() => {
          bt.classList.remove("arm");
          bt.textContent = "Settle here";
        }, 2600);
      }
    };
  } else {
    bt.textContent = "Locked";
    bt.disabled = true;
  }
  d.appendChild(bt);
  return d;
}
function drawWorld() {
  const vpl = viewPlanet(),
    plCfg = PLANETS[vpl] || PLANETS.earth,
    pNbs = planetNbs(vpl);
  $("glt").textContent = plCfg.icon + " " + plCfg.n;
  const pb = $("pbar");
  pb.innerHTML = "";
  PLANET_LIST.forEach((pid, idx) => {
    const pc = PLANETS[pid],
      unl = planetUnlocked(pid),
      done = planetDone(pid);
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pchip" + (pid === vpl ? " on" : "") + (unl ? "" : " lk");
    const dot = document.createElement("i");
    dot.style.background = pc.sea[1];
    b.append(
      dot,
      document.createTextNode(pc.n + (done ? " ✓" : unl ? "" : " 🔒")),
    );
    b.onclick = () => {
      if (!unl) {
        const prev = PLANETS[PLANET_LIST[idx - 1]];
        toast(
          "🚀 Complete all 8 ecosystems on " +
            prev.n +
            " to unlock " +
            pc.n +
            "!",
        );
        return;
      }
      S.nb.vplanet = pid;
      gsel = null;
      drawWorld();
    };
    pb.appendChild(b);
  });
  renderGlobeFrame();
  const doneCnt = pNbs.filter((k) => nbDone(k)).length;
  $("glh").textContent =
    "Drag " +
    plCfg.n +
    " to spin · " +
    doneCnt +
    " of 8 ecosystems complete" +
    (doneCnt === 8 && nextPlanet()
      ? " · ready for " + PLANETS[nextPlanet()].n + "!"
      : "");
  const L = $("glist");
  L.innerHTML = "";
  pNbs.forEach((k) => L.appendChild(worldCard(k)));
}
$("gsvg").onclick = (e) => {
  if (GLB.moved) return;
  const g = e.target.closest("[data-id]");
  if (g) {
    gsel = g.dataset.id;
    drawWorld();
    const c = $("wc-" + gsel);
    if (c) c.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};
function openWorld() {
  gsel = null;
  const curPl = (NB[V()] && NB[V()].pl) || S.nb.planet || "earth";
  S.nb.vplanet = curPl;
  const eco = (NB[V()] && NB[V()].eco) || "meadow";
  const g = GP[eco] || GP.meadow;
  GLB.lon = -g[0];
  GLB.lat = g[1];
  drawWorld();
  $("gl").classList.add("show");
  startGlobe();
}
$("wbtn").onclick = openWorld;
$("nbtn").onclick = openWorld;
$("glx").onclick = () => {
  $("gl").classList.remove("show");
  stopGlobe();
};
$("homeb").onclick = () => visit(S.nb.cur);
function visit(id) {
  S.nb.view = id;
  if (NB[id] && NB[id].pl) S.nb.vplanet = NB[id].pl;
  save();
  $("gl").classList.remove("show");
  stopGlobe();
  if (PG !== "t") go("t");
  else townOpen();
}
function settle(id) {
  const cur = S.nb.cur,
    carry = Math.max(0, nbXp(cur) - MAXAT);
  const newPl = (NB[id] && NB[id].pl) || "earth";
  S.nb.xp[cur] = MAXAT;
  S.nb.xp[id] = carry;
  S.nb.cur = id;
  S.nb.view = id;
  S.nb.planet = newPl;
  S.nb.vplanet = newPl;
  S.nb.seen[id] = 0;
  const bud = NB[id] && NB[id].bud;
  if (bud) S.seenK[bud] = 1;
  save();
  syncPetUnlocks(curStreak);
  $("gl").classList.remove("show");
  stopGlobe();
  travel(id);
}
function travel(id) {
  const c = NB[id],
    t = $("tv");
  t.style.background =
    "linear-gradient(180deg," + c.sky[0] + "," + c.sky[1] + ")";
  $("tvn").textContent = "Welcome to " + c.n;
  $("tvd").textContent = c.d;
  t.classList.add("show");
  setTimeout(() => {
    t.classList.remove("show");
    if (PG !== "t") go("t");
    else townOpen();
    setTimeout(() => burst(innerWidth / 2, innerHeight / 3, 40, CONF), 500);
  }, 2600);
}
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
    kd = KINDS[w.p.kind] || KINDS.square,
    pt = petById(w.p.pet);
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
    const kt = el("span", "stag", kd.n + " · " + kd.r);
    kt.style.background = kd.c;
    tags.appendChild(kt);
    tags.appendChild(
      el(
        "span",
        "stag lvt",
        w.k === "me" ? "⭐ Level " + lvOf(S.xp) : "🎓 Level 10 Resident",
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
    addM(
      "⏱ Time in Town",
      fmtDur(Date.now() - ((w.ref && w.ref.born) || Date.now())),
    );
    addM("👆 Times Tapped", String((w.ref && w.ref.clicks) || 0));
    addM("✅ Tasks Together", String((w.ref && w.ref.tasks) || 0));
    addM("🐾 Companion", pt ? pt.n : "None");
    card.appendChild(meta);
    const quote =
      w.k === "me"
        ? "“Hi" +
          (S.p.name ? ", " + S.p.name : "") +
          "! We’re on a 🔥 " +
          curStreak +
          "-day streak!”"
        : "“I reached Level 10 and moved into " + NB[V()].n + "! 🎓”";
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
    const stgBadge = el("span", "stag", "🔥 " + pt.st + "-Day Streak Reward");
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
    addM("🏆 Unlock Streak", pt.st + (pt.st === 1 ? " day" : " days"));
    addM("📍 Favorite Spot", "Rests on " + w.n + "’s head");
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
  bmSlide = slide === "p" && petById(w.p.pet) ? "p" : "b";
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
  else if (w.k === "res") t = "I reached level 10 and moved into town! 🎓";
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
  townCast().forEach((c) => {
    const el = document.createElement("div");
    el.className = "w";
    const fl = document.createElement("div");
    fl.className = "fl";
    const sv = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    sv.setAttribute("viewBox", "0 -6 56 62");
    sv.setAttribute("width", "30");
    sv.setAttribute("height", "33");
    sv.setAttribute("class", "wk");
    sv.style.setProperty("--bd", (-Math.random() * 5).toFixed(1) + "s");
    // In Faith Town, render active buddy without duplicate head-pet since the pet walks right behind them
    const isSpaceTown = NB[V()] && NB[V()].pl !== "earth";
    const townLook =
      c.k === "me" ? Object.assign({}, c.p, { pet: "none" }) : c.p;
    const helm = isSpaceTown
      ? '<circle class="sp-helmet" cx="28" cy="24" r="23" fill="rgba(180,235,255,.18)" stroke="rgba(220,248,255,.75)" stroke-width="1.6"/>'
      : "";
    sv.innerHTML = '<g class="bod">' + layers(townLook) + helm + "</g>";
    fl.appendChild(sv);
    const say = document.createElement("div");
    say.className = "say";
    el.append(say, fl);
    host.appendChild(el);
    const w = Object.assign({}, c, {
      el,
      fl,
      say,
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
  });
  TW.pet = null;
  const actPet = petById(S.p.pet);
  if (actPet && TW.ws[0]) {
    const me = TW.ws[0];
    const pel = document.createElement("div");
    pel.className = "tpet";
    const pfl = document.createElement("div");
    pfl.className = "pfl";
    pfl.innerHTML = petSvg(actPet.id, 24, 22);
    pel.appendChild(pfl);
    pel.onclick = (e) => {
      e.stopPropagation();
      emo(me, "🐾");
      openBuddyModal(me, "p");
    };
    host.appendChild(pel);
    TW.pet = {
      el: pel,
      pfl,
      dir: 1,
      x: Math.max(16, me.x - 18),
      y: me.y + 2,
      id: actPet.id,
    };
  }
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
  const isSpace = NB[V()] && NB[V()].pl !== "earth";
  if (isSpace) {
    $("nightr").setAttribute("opacity", "0.12");
    $("stars").setAttribute("opacity", "0.95");
    $("sunG").setAttribute("opacity", "0.55");
    $("moon").setAttribute("opacity", "0.85");
    $("scene").classList.remove("night");
    return;
  }
  const d = new Date(),
    h = d.getHours() + d.getMinutes() / 60;
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
  if (TW.pet && TW.ws[0]) {
    const me = TW.ws[0],
      pt = TW.pet;
    const tx = Math.max(14, Math.min(TW.W - 14, me.x - (me.dir || 1) * 18)),
      ty = me.y + 2;
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
      pt.dir = me.dir || 1;
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
  }
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
  dayShade();
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
    setTimeout(() => sayW(me, "📖 “" + v.t + "” " + v.r, 7000), 1000);
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
  sv.innerHTML = layers(look);
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
