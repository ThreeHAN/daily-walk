const HATS = [
  ["none", "None"],
  ["cap", "🧢 Cap"],
  ["beanie", "Beanie"],
  ["tophat", "🎩 Top hat"],
  ["crown", "👑 Crown"],
  ["halo", "😇 Halo"],
  ["party", "🎉 Party"],
  ["cowboy", "🤠 Cowboy"],
  ["wizard", "🧙 Wizard"],
  ["phones", "🎧 Headphones"],
];
const COL = {
  blue: "#3b6fd4",
  green: "#3f9d63",
  purple: "#8a56c9",
  red: "#c94a4a",
  black: "#333333",
  yellow: "#e8b830",
  pink: "#e5509a",
};
const BODY = {
  orange: "#d97757",
  yellow: "#e8b830",
  green: "#4aa56d",
  blue: "#4a86d9",
  purple: "#8f63cf",
  pink: "#e87aa6",
  gray: "#8a8f98",
};
const PANTS = {
  blue: "#3b5fa8",
  black: "#2b2b2b",
  khaki: "#b79a5b",
  green: "#3f7d53",
};
const SHOES = {
  white: "#f2f2f2",
  black: "#222222",
  red: "#c94a4a",
  blue: "#3b6fd4",
};
const cap = (k) => k[0].toUpperCase() + k.slice(1);
const cn = (o) => Object.keys(o).map((k) => [k, cap(k), o[k]]);
const cz = (o) => [["none", "None", ""]].concat(cn(o));
const HAT = {
  cap: '<rect x="11" y="2" width="34" height="8" fill="#2f5fb3"/><rect x="30" y="8" width="22" height="4" fill="#244a8c"/>',
  beanie:
    '<rect x="25" y="0" width="6" height="5" fill="#f0c14b"/><rect x="11" y="4" width="34" height="7" fill="#7c4dbd"/><rect x="11" y="9" width="34" height="3" fill="#5f3a96"/>',
  tophat:
    '<rect x="17" y="0" width="22" height="9" fill="#222"/><rect x="17" y="6" width="22" height="2" fill="#f0c14b"/><rect x="9" y="8" width="38" height="3" fill="#222"/>',
  crown:
    '<polygon points="11,9 11,1 19,5 28,0 37,5 45,1 45,9" fill="#f0c14b"/>',
  halo: '<ellipse cx="28" cy="3" rx="13" ry="3.2" fill="none" stroke="#f0c14b" stroke-width="2.4"/>',
  party:
    '<polygon points="28,-4 19,9 37,9" fill="#e5509a"/><rect x="25" y="2" width="6" height="2" fill="#fff"/><rect x="23" y="6" width="10" height="2" fill="#fff"/>',
  cowboy:
    '<rect x="15" y="0" width="26" height="8" fill="#8b5a2b"/><rect x="15" y="5" width="26" height="2" fill="#5a3a1a"/><rect x="5" y="7" width="46" height="3" fill="#8b5a2b"/>',
  wizard:
    '<polygon points="28,-5 18,9 38,9" fill="#3a2a8a"/><rect x="26" y="1" width="3" height="3" fill="#f0c14b"/><rect x="22" y="5" width="2" height="2" fill="#f0c14b"/><rect x="9" y="8" width="38" height="3" fill="#3a2a8a"/>',
  phones:
    '<path d="M12 14 Q12 2 28 2 Q44 2 44 14" fill="none" stroke="#333" stroke-width="3"/><rect x="8" y="13" width="5" height="11" fill="#e5509a"/><rect x="43" y="13" width="5" height="11" fill="#e5509a"/>',
};
function dk(h, f) {
  const n = parseInt(h.slice(1), 16),
    m = 1 - f;
  return (
    "#" +
    [(n >> 16) & 255, (n >> 8) & 255, n & 255]
      .map((v) =>
        Math.round(v * m)
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
const PLANETS = {
  earth: {
    id: "earth",
    n: "Earth",
    order: 1,
    icon: "🌍",
    d: "Our home world of rolling hills, oceans, forests & skies.",
    sea: ["#86d6ff", "#3a95e0", "#1b5fa8"],
    halo: "#9fdcff",
    space: false,
  },
  mars: {
    id: "mars",
    n: "Mars",
    order: 2,
    icon: "🔴",
    d: "The Red Planet — crimson canyons, polar ice caps & domed colonies.",
    sea: ["#ff9c70", "#d95830", "#7a2312"],
    halo: "#ff9c70",
    space: true,
  },
  jupiter: {
    id: "jupiter",
    n: "Jupiter",
    order: 3,
    icon: "🟠",
    d: "The Gas Giant — swirling amber cloud bands & floating sky stations.",
    sea: ["#ffd194", "#d98a3c", "#7c4318"],
    halo: "#ffd194",
    space: true,
  },
  saturn: {
    id: "saturn",
    n: "Saturn",
    order: 4,
    icon: "🪐",
    d: "The Ringed Jewel — golden horizons & luminous ice-ring outposts.",
    sea: ["#ffe8a3", "#d9b35a", "#7a5e22"],
    halo: "#ffe8a3",
    space: true,
    ring: true,
  },
  uranus: {
    id: "uranus",
    n: "Uranus",
    order: 5,
    icon: "🩵",
    d: "The Ice Giant — serene cyan mists & crystalline orbital domes.",
    sea: ["#a8f5ff", "#46b8cc", "#195c6e"],
    halo: "#a8f5ff",
    space: true,
  },
  neptune: {
    id: "neptune",
    n: "Neptune",
    order: 6,
    icon: "🔵",
    d: "The Deep Blue World — sapphire winds & starlit ocean habitats.",
    sea: ["#7aa8ff", "#2d5be0", "#10256e"],
    halo: "#7aa8ff",
    space: true,
  },
};
const PLANET_LIST = ["earth", "mars", "jupiter", "saturn", "uranus", "neptune"];
const BASE_ECO = [
  "meadow",
  "seaside",
  "snowy",
  "oasis",
  "autumn",
  "starlight",
  "crystal",
  "sky",
];

const KINDS = {
  square: {
    n: "Square",
    r: "Starter",
    c: "#b8863b",
    body: "orange",
    pl: "earth",
  },
  circle: { n: "Circle", r: "Common", c: "#7f95ab", body: "blue", pl: "earth" },
  triangle: {
    n: "Triangle",
    r: "Uncommon",
    c: "#3f9d63",
    body: "green",
    pl: "earth",
  },
  rectangle: {
    n: "Rectangle",
    r: "Rare",
    c: "#6a8de0",
    body: "purple",
    pl: "earth",
  },
  clover: {
    n: "Meadow Clover",
    r: "Meadow",
    c: "#4cae6a",
    body: "green",
    nb: "meadow",
    pl: "earth",
  },
  shell: {
    n: "Seaside Scallop",
    r: "Seaside",
    c: "#3a95e0",
    body: "blue",
    nb: "seaside",
    pl: "earth",
  },
  snowflake: {
    n: "Snowy Crystal",
    r: "Snowy",
    c: "#70a8d8",
    body: "blue",
    nb: "snowy",
    pl: "earth",
  },
  sunburst: {
    n: "Oasis Sunburst",
    r: "Oasis",
    c: "#e0a040",
    body: "yellow",
    nb: "oasis",
    pl: "earth",
  },
  acorn: {
    n: "Autumn Acorn",
    r: "Autumn",
    c: "#d9602a",
    body: "orange",
    nb: "autumn",
    pl: "earth",
  },
  starshape: {
    n: "Starlight Star",
    r: "Starlight",
    c: "#8a56c9",
    body: "purple",
    nb: "starlight",
    pl: "earth",
  },
  gem: {
    n: "Crystal Gem",
    r: "Crystal",
    c: "#2aa6a0",
    body: "blue",
    nb: "crystal",
    pl: "earth",
  },
  cloudshape: {
    n: "Sky Puff",
    r: "Sky",
    c: "#5b9bd5",
    body: "pink",
    nb: "mars_meadow",
    pl: "earth",
  },
  earthplanet: {
    n: "Earth World",
    r: "Legendary Planet",
    c: "#3a95e0",
    body: "blue",
    nb: "sky",
    pl: "earth",
  },
  duck: {
    n: "Duck",
    r: "Legendary",
    c: "#ffb300",
    body: "yellow",
    pl: "earth",
  },
  // Space Buddies unlocked across Mars, Jupiter, Saturn, Uranus & Neptune ecosystems
  rocketbud: {
    n: "Astro Rocket",
    r: "Space",
    c: "#e5624a",
    body: "orange",
    nb: "mars_meadow",
    pl: "mars",
  },
  craterbud: {
    n: "Crater Hopper",
    r: "Space",
    c: "#d95830",
    body: "orange",
    nb: "mars_seaside",
    pl: "mars",
  },
  frostorb: {
    n: "Polar Probe",
    r: "Space",
    c: "#70b8e8",
    body: "blue",
    nb: "mars_snowy",
    pl: "mars",
  },
  solardome: {
    n: "Helios Dome",
    r: "Space",
    c: "#e8a838",
    body: "yellow",
    nb: "mars_oasis",
    pl: "mars",
  },
  dustcore: {
    n: "Canyon Core",
    r: "Space",
    c: "#c95a2a",
    body: "orange",
    nb: "mars_autumn",
    pl: "mars",
  },
  phobos: {
    n: "Twin Moon",
    r: "Space",
    c: "#9a6bd6",
    body: "purple",
    nb: "mars_starlight",
    pl: "mars",
  },
  marsgem: {
    n: "Red Quartz",
    r: "Space",
    c: "#2aa6a0",
    body: "pink",
    nb: "mars_crystal",
    pl: "mars",
  },
  aerowing: {
    n: "Mars Glider",
    r: "Space",
    c: "#5b9bd5",
    body: "blue",
    nb: "mars_meadow",
    pl: "mars",
  },
  marsplanet: {
    n: "Mars World",
    r: "Legendary Planet",
    c: "#d95830",
    body: "orange",
    nb: "mars_sky",
    pl: "mars",
  },
  stormeye: {
    n: "Storm Eye",
    r: "Gas Giant",
    c: "#e08a3c",
    body: "orange",
    nb: "jupiter_meadow",
    pl: "jupiter",
  },
  tidepod: {
    n: "Europa Pod",
    r: "Gas Giant",
    c: "#3a95e0",
    body: "blue",
    nb: "jupiter_seaside",
    pl: "jupiter",
  },
  cryocube: {
    n: "Cryo Cube",
    r: "Gas Giant",
    c: "#70a8d8",
    body: "blue",
    nb: "jupiter_snowy",
    pl: "jupiter",
  },
  ionflare: {
    n: "Io Flare",
    r: "Gas Giant",
    c: "#e8b830",
    body: "yellow",
    nb: "jupiter_oasis",
    pl: "jupiter",
  },
  amberorb: {
    n: "Amber Eddy",
    r: "Gas Giant",
    c: "#d9602a",
    body: "orange",
    nb: "jupiter_autumn",
    pl: "jupiter",
  },
  galilean: {
    n: "Galilean Star",
    r: "Gas Giant",
    c: "#8a56c9",
    body: "purple",
    nb: "jupiter_starlight",
    pl: "jupiter",
  },
  jovian: {
    n: "Jovian Prism",
    r: "Gas Giant",
    c: "#2aa6a0",
    body: "green",
    nb: "jupiter_crystal",
    pl: "jupiter",
  },
  stratos: {
    n: "Stratos Buoy",
    r: "Gas Giant",
    c: "#5b9bd5",
    body: "pink",
    nb: "jupiter_meadow",
    pl: "jupiter",
  },
  jupiterplanet: {
    n: "Jupiter World",
    r: "Legendary Planet",
    c: "#d98a3c",
    body: "yellow",
    nb: "jupiter_sky",
    pl: "jupiter",
  },
  ringling: {
    n: "Ringlet",
    r: "Ringed",
    c: "#e0b040",
    body: "yellow",
    nb: "saturn_meadow",
    pl: "saturn",
  },
  titanwave: {
    n: "Titan Wave",
    r: "Ringed",
    c: "#3a95e0",
    body: "blue",
    nb: "saturn_seaside",
    pl: "saturn",
  },
  enceladus: {
    n: "Ice Geyser",
    r: "Ringed",
    c: "#70b8e8",
    body: "blue",
    nb: "saturn_snowy",
    pl: "saturn",
  },
  goldhalo: {
    n: "Solar Ring",
    r: "Ringed",
    c: "#e8b830",
    body: "yellow",
    nb: "saturn_oasis",
    pl: "saturn",
  },
  duskring: {
    n: "Amber Ring",
    r: "Ringed",
    c: "#d9602a",
    body: "orange",
    nb: "saturn_autumn",
    pl: "saturn",
  },
  cassini: {
    n: "Cassini Star",
    r: "Ringed",
    c: "#8a56c9",
    body: "purple",
    nb: "saturn_starlight",
    pl: "saturn",
  },
  ringgem: {
    n: "Halo Crystal",
    r: "Ringed",
    c: "#2aa6a0",
    body: "green",
    nb: "saturn_crystal",
    pl: "saturn",
  },
  cloudring: {
    n: "Nimbus Ring",
    r: "Ringed",
    c: "#5b9bd5",
    body: "pink",
    nb: "saturn_meadow",
    pl: "saturn",
  },
  saturnplanet: {
    n: "Saturn World",
    r: "Legendary Planet",
    c: "#d9b35a",
    body: "yellow",
    nb: "saturn_sky",
    pl: "saturn",
  },
  cyanmist: {
    n: "Cyan Mist",
    r: "Ice Giant",
    c: "#3cb8cc",
    body: "blue",
    nb: "uranus_meadow",
    pl: "uranus",
  },
  miranda: {
    n: "Miranda Crest",
    r: "Ice Giant",
    c: "#3a95e0",
    body: "blue",
    nb: "uranus_seaside",
    pl: "uranus",
  },
  glacier: {
    n: "Glacier Core",
    r: "Ice Giant",
    c: "#70c8e8",
    body: "blue",
    nb: "uranus_snowy",
    pl: "uranus",
  },
  auroradisk: {
    n: "Aurora Disk",
    r: "Ice Giant",
    c: "#4cae6a",
    body: "green",
    nb: "uranus_oasis",
    pl: "uranus",
  },
  oberon: {
    n: "Oberon Leaf",
    r: "Ice Giant",
    c: "#d9602a",
    body: "orange",
    nb: "uranus_autumn",
    pl: "uranus",
  },
  arielstar: {
    n: "Ariel Nova",
    r: "Ice Giant",
    c: "#8a56c9",
    body: "purple",
    nb: "uranus_starlight",
    pl: "uranus",
  },
  iceprism: {
    n: "Frost Prism",
    r: "Ice Giant",
    c: "#2aa6a0",
    body: "blue",
    nb: "uranus_crystal",
    pl: "uranus",
  },
  breezepuff: {
    n: "Zephyr Puff",
    r: "Ice Giant",
    c: "#5b9bd5",
    body: "pink",
    nb: "uranus_meadow",
    pl: "uranus",
  },
  uranusplanet: {
    n: "Uranus World",
    r: "Legendary Planet",
    c: "#46b8cc",
    body: "blue",
    nb: "uranus_sky",
    pl: "uranus",
  },
  triton: {
    n: "Triton Crest",
    r: "Deep Space",
    c: "#3b6fd4",
    body: "blue",
    nb: "neptune_meadow",
    pl: "neptune",
  },
  abyssfin: {
    n: "Deep Current",
    r: "Deep Space",
    c: "#2f5fb3",
    body: "blue",
    nb: "neptune_seaside",
    pl: "neptune",
  },
  cometice: {
    n: "Comet Shard",
    r: "Deep Space",
    c: "#70a8d8",
    body: "blue",
    nb: "neptune_snowy",
    pl: "neptune",
  },
  blueflare: {
    n: "Blue Beacon",
    r: "Deep Space",
    c: "#4a86d9",
    body: "yellow",
    nb: "neptune_oasis",
    pl: "neptune",
  },
  nebula: {
    n: "Nebula Drift",
    r: "Deep Space",
    c: "#8f63cf",
    body: "purple",
    nb: "neptune_autumn",
    pl: "neptune",
  },
  pulsar: {
    n: "Pulsar Star",
    r: "Deep Space",
    c: "#8a56c9",
    body: "purple",
    nb: "neptune_starlight",
    pl: "neptune",
  },
  sapphire: {
    n: "Sapphire Core",
    r: "Deep Space",
    c: "#2aa6a0",
    body: "blue",
    nb: "neptune_crystal",
    pl: "neptune",
  },
  cosmo: {
    n: "Cosmo Legend",
    r: "Deep Space",
    c: "#ffb300",
    body: "yellow",
    nb: "neptune_meadow",
    pl: "neptune",
  },
  neptuneplanet: {
    n: "Neptune World",
    r: "Legendary Planet",
    c: "#2d5be0",
    body: "blue",
    nb: "neptune_sky",
    pl: "neptune",
  },
};

const GEO = {
  square: {
    bx: [11, 45],
    bd: (c) => R(11, 8, 34, 36, c),
    tp: (c) => R(11, 34, 34, 10, c),
    zip: [27, 34, 2, 10],
    st: [
      [11, 37, 34],
      [11, 41, 34],
    ],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [15, 42],
      [32, 42],
    ],
    lw: 9,
    lh: 12,
    hat: [0, 1],
    et: "",
    my: 0,
  },
  circle: {
    bx: [11, 45],
    bd: (c) => '<circle cx="28" cy="26" r="18" fill="' + c + '"/>',
    tp: (c) => '<path d="M11.9 34A18 18 0 0 0 44.1 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 10],
    st: [
      [13.8, 37, 28.4],
      [18.1, 41, 19.8],
    ],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [19, 42],
      [29, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  triangle: {
    bx: [13, 43],
    bd: (c) => '<polygon points="28,10 6,44 50,44" fill="' + c + '"/>',
    tp: (c) => '<polygon points="8.6,40 47.4,40 50,44 6,44" fill="' + c + '"/>',
    zip: [27, 40, 2, 4],
    st: [[7.6, 41.5, 40.8]],
    arm: [
      [7.5, 28],
      [39.5, 28],
    ],
    ls: [
      [14, 43],
      [33, 43],
    ],
    lw: 9,
    lh: 11,
    hat: [2, 0.6],
    et: "translate(2.8 6.4) scale(.9)",
    my: 4.5,
  },
  rectangle: {
    bx: [15, 41],
    bd: (c) => R(15, 6, 26, 40, c),
    tp: (c) => R(15, 34, 26, 12, c),
    zip: [27, 34, 2, 12],
    st: [
      [15, 37, 26],
      [15, 41, 26],
      [15, 45, 26],
    ],
    arm: [
      [5, 20],
      [41, 20],
    ],
    ls: [
      [17, 44],
      [31, 44],
    ],
    lw: 8,
    lh: 10,
    hat: [-2, 0.75],
    et: "",
    my: 0,
  },
  clover: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="21" cy="19" r="10.5" fill="' +
      c +
      '"/><circle cx="35" cy="19" r="10.5" fill="' +
      c +
      '"/><circle cx="21" cy="33" r="10.5" fill="' +
      c +
      '"/><circle cx="35" cy="33" r="10.5" fill="' +
      c +
      '"/><rect x="19" y="17" width="18" height="18" fill="' +
      c +
      '"/>',
    tp: (c) =>
      '<path d="M12.5 34A10.5 10.5 0 0 0 28 41.5A10.5 10.5 0 0 0 43.5 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 8],
    st: [[14, 37, 28]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [17, 42],
      [31, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [1, 0.85],
    et: "",
    my: 0,
  },
  shell: {
    bx: [11, 45],
    bd: (c) =>
      '<path d="M28 8C15 8 8 18 10 30C11.5 38 18 44 28 44C38 44 44.5 38 46 30C48 18 41 8 28 8Z" fill="' +
      c +
      '"/><path d="M28 10V42M20 12L24 42M36 12L32 42" stroke="rgba(255,255,255,.22)" stroke-width="1.4" stroke-linecap="round"/>',
    tp: (c) =>
      '<path d="M11 34C13 40 19 44 28 44C37 44 43 40 45 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 10],
    st: [
      [13.5, 37, 29],
      [17.5, 41, 21],
    ],
    arm: [
      [3, 23],
      [43, 23],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  snowflake: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,6 33,14 43,12 40,21 47,26 40,31 43,40 33,38 28,46 23,38 13,40 16,31 9,26 16,21 13,12 23,14" fill="' +
      c +
      '"/>',
    tp: (c) =>
      '<polygon points="15,34 41,34 43,40 33,38 28,46 23,38 13,40" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 11],
    st: [[16, 37, 24]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [17, 42],
      [31, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [-1, 0.8],
    et: "",
    my: 0,
  },
  sunburst: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,5 32,12 40,9 40,17 47,20 43,27 47,34 40,37 40,45 32,42 28,48 24,42 16,45 16,37 9,34 13,27 9,20 16,17 16,9 24,12" fill="' +
      c +
      '"/>',
    tp: (c) =>
      '<polygon points="14,34 42,34 40,45 32,42 28,48 24,42 16,45" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 12],
    st: [[16, 37, 24]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [17, 43],
      [31, 43],
    ],
    lw: 8,
    lh: 11,
    hat: [-1, 0.8],
    et: "",
    my: 0,
  },
  acorn: {
    bx: [12, 44],
    bd: (c) =>
      '<path d="M13 21H43C43 35 36 44 28 45C20 44 13 35 13 21Z" fill="' +
      c +
      '"/><path d="M10 18C10 11 18 8 28 8C38 8 46 11 46 18V21H10Z" fill="' +
      dk(c, 0.28) +
      '"/><rect x="26.5" y="4" width="3" height="5" rx="1.2" fill="' +
      dk(c, 0.38) +
      '"/>',
    tp: (c) =>
      '<path d="M14.5 33H41.5C39.5 40 34 44.5 28 45C22 44.5 16.5 40 14.5 33Z" fill="' +
      c +
      '"/>',
    zip: [27, 33, 2, 11],
    st: [
      [16, 36, 24],
      [19, 40, 18],
    ],
    arm: [
      [4, 23],
      [42, 23],
    ],
    ls: [
      [18, 43],
      [30, 43],
    ],
    lw: 8,
    lh: 11,
    hat: [0, 0.88],
    et: "translate(0 2)",
    my: 2,
  },
  starshape: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,6 34.5,18.5 48,20.5 38,30 40.5,44 28,37.5 15.5,44 18,30 8,20.5 21.5,18.5" fill="' +
      c +
      '"/>',
    tp: (c) =>
      '<polygon points="17.2,34 38.8,34 40.5,44 28,37.5 15.5,44" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 4],
    st: [[17, 36.5, 22]],
    arm: [
      [4, 23],
      [42, 23],
    ],
    ls: [
      [17, 41],
      [31, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [-1, 0.72],
    et: "translate(0 1)",
    my: 1,
  },
  gem: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="18,8 38,8 47,20 28,45 9,20" fill="' +
      c +
      '"/><polygon points="18,8 38,8 34,20 22,20" fill="rgba(255,255,255,.22)"/><polygon points="22,20 34,20 28,45" fill="rgba(255,255,255,.12)"/>',
    tp: (c) => '<polygon points="18.8,33 37.2,33 28,45" fill="' + c + '"/>',
    zip: [27, 33, 2, 11],
    st: [[20.5, 35.5, 15]],
    arm: [
      [4, 22],
      [42, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.82],
    et: "translate(0 -1)",
    my: -1,
  },
  cloudshape: {
    bx: [11, 45],
    bd: (c) =>
      '<circle cx="17" cy="29" r="9" fill="' +
      c +
      '"/><circle cx="39" cy="29" r="9" fill="' +
      c +
      '"/><circle cx="24" cy="19" r="10.5" fill="' +
      c +
      '"/><circle cx="34" cy="21" r="9.5" fill="' +
      c +
      '"/><rect x="16" y="24" width="24" height="14" rx="6" fill="' +
      c +
      '"/>',
    tp: (c) =>
      '<path d="M10.5 34H45.5A8.5 8.5 0 0 1 37 39H19A8.5 8.5 0 0 1 10.5 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 5],
    st: [[13, 36.5, 30]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 38],
      [30, 38],
    ],
    lw: 8,
    lh: 14,
    hat: [1, 0.85],
    et: "translate(0 1)",
    my: 1,
  },
  duck: {
    bx: [12, 44],
    bd: (c) => '<ellipse cx="28" cy="28" rx="17" ry="16" fill="' + c + '"/>',
    tp: (c) => '<path d="M12.2 34A17 16 0 0 0 43.8 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 10],
    st: [
      [13.9, 37, 28.2],
      [18.1, 41, 19.8],
    ],
    arm: [
      [4, 24],
      [42, 24],
    ],
    ls: [
      [20, 43],
      [32, 43],
    ],
    lw: 3,
    lh: 7,
    hat: [4, 0.8],
    et: "translate(0 -3)",
    my: 0,
  },

  // Distinct Planet-Themed & Planet-As-Buddy Geometries
  rocketbud: {
    bx: [14, 42],
    bd: (c) =>
      '<path d="M28 4C19 13 15 24 15 36H41C41 24 37 13 28 4Z" fill="' +
      c +
      '"/><polygon points="15,30 8,42 15,40" fill="' +
      dk(c, 0.25) +
      '"/><polygon points="41,30 48,42 41,40" fill="' +
      dk(c, 0.25) +
      '"/><rect x="21" y="36" width="14" height="6" rx="2" fill="#555"/>',
    tp: (c) => '<rect x="16" y="31" width="24" height="5" fill="' + c + '"/>',
    zip: [27, 31, 2, 5],
    st: [[16, 33.5, 24]],
    arm: [
      [5, 24],
      [41, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 11,
    hat: [0, 0.7],
    et: "translate(0 1)",
    my: 1,
  },
  craterbud: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="16" fill="' +
      c +
      '"/><circle cx="21" cy="20" r="3" fill="' +
      dk(c, 0.3) +
      '"/><circle cx="35" cy="28" r="4" fill="' +
      dk(c, 0.3) +
      '"/><circle cx="25" cy="34" r="2.5" fill="' +
      dk(c, 0.3) +
      '"/>',
    tp: (c) => '<path d="M12 34A16 16 0 0 0 44 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[14, 37, 28]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  frostorb: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,6 33,15 45,15 35,22 39,34 28,27 17,34 21,22 11,15 23,15" fill="' +
      c +
      '"/><circle cx="28" cy="23" r="6" fill="#fff" opacity=".5"/>',
    tp: (c) => '<polygon points="17,34 39,34 28,27" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[16, 36, 24]],
    arm: [
      [4, 22],
      [42, 22],
    ],
    ls: [
      [18, 41],
      [30, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  solardome: {
    bx: [12, 44],
    bd: (c) =>
      '<path d="M12 28A16 18 0 0 1 44 28V42H12Z" fill="' +
      c +
      '"/><path d="M14 26A14 14 0 0 1 42 26Z" fill="rgba(255,255,255,.45)"/><line x1="28" y1="10" x2="28" y2="42" stroke="' +
      dk(c, 0.4) +
      '" stroke-width="1.2"/>',
    tp: (c) => '<rect x="12" y="34" width="32" height="8" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[12, 37, 32]],
    arm: [
      [3, 24],
      [43, 24],
    ],
    ls: [
      [16, 42],
      [32, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "translate(0 2)",
    my: 2,
  },
  dustcore: {
    bx: [12, 44],
    bd: (c) =>
      '<path d="M13 21H43C43 35 36 44 28 45C20 44 13 35 13 21Z" fill="' +
      c +
      '"/><path d="M14 24Q28 18 42 24" stroke="' +
      dk(c, 0.35) +
      '" stroke-width="2" fill="none"/><path d="M16 30Q28 24 40 30" stroke="' +
      dk(c, 0.35) +
      '" stroke-width="2" fill="none"/>',
    tp: (c) =>
      '<path d="M14.5 33H41.5C39.5 40 34 44.5 28 45C22 44.5 16.5 40 14.5 33Z" fill="' +
      c +
      '"/>',
    zip: [27, 33, 2, 11],
    st: [[16, 36, 24]],
    arm: [
      [4, 23],
      [42, 23],
    ],
    ls: [
      [18, 43],
      [30, 43],
    ],
    lw: 8,
    lh: 11,
    hat: [0, 0.88],
    et: "",
    my: 1,
  },
  phobos: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="24" r="14" fill="' +
      c +
      '"/><circle cx="22" cy="18" r="3.5" fill="#fff3b0"/><circle cx="34" cy="28" r="2.5" fill="#fff3b0"/>',
    tp: (c) => '<path d="M14 32A14 14 0 0 0 42 32Z" fill="' + c + '"/>',
    zip: [27, 32, 2, 8],
    st: [[16, 35, 24]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 41],
      [30, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  marsgem: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="18,8 38,8 47,20 28,45 9,20" fill="' +
      c +
      '"/><polygon points="28,12 36,22 28,40 20,22" fill="rgba(255,255,255,.35)"/>',
    tp: (c) => '<polygon points="18.8,33 37.2,33 28,45" fill="' + c + '"/>',
    zip: [27, 33, 2, 11],
    st: [[20.5, 35.5, 15]],
    arm: [
      [4, 22],
      [42, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.82],
    et: "translate(0 -1)",
    my: -1,
  },
  aerowing: {
    bx: [13, 43],
    bd: (c) =>
      '<path d="M28 6L46 32H10Z" fill="' +
      c +
      '"/><rect x="23" y="32" width="10" height="10" fill="' +
      dk(c, 0.25) +
      '"/>',
    tp: (c) => '<rect x="18" y="36" width="20" height="6" fill="' + c + '"/>',
    zip: [27, 36, 2, 6],
    st: [[18, 39, 20]],
    arm: [
      [6, 24],
      [42, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 10,
    hat: [0, 0.75],
    et: "",
    my: 1,
  },

  stormeye: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="16" fill="' +
      c +
      '"/><ellipse cx="28" cy="20" rx="12" ry="3" fill="' +
      dk(c, 0.3) +
      '"/><ellipse cx="28" cy="28" rx="14" ry="3" fill="' +
      dk(c, 0.3) +
      '"/><ellipse cx="28" cy="36" rx="10" ry="2.5" fill="' +
      dk(c, 0.3) +
      '"/>',
    tp: (c) => '<path d="M12 34A16 16 0 0 0 44 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[14, 37, 28]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  tidepod: {
    bx: [12, 44],
    bd: (c) =>
      '<path d="M14 16C14 10 20 8 28 8C36 8 42 10 42 16V36C42 42 36 44 28 44C20 44 14 42 14 36Z" fill="' +
      c +
      '"/><circle cx="28" cy="26" r="6" fill="#7fd49a" opacity=".85"/>',
    tp: (c) => '<rect x="14" y="34" width="28" height="10" fill="' + c + '"/>',
    zip: [27, 34, 2, 10],
    st: [[14, 38, 28]],
    arm: [
      [3, 23],
      [43, 23],
    ],
    ls: [
      [17, 44],
      [31, 44],
    ],
    lw: 8,
    lh: 10,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  cryocube: {
    bx: [12, 44],
    bd: (c) =>
      '<rect x="12" y="10" width="32" height="32" rx="4" fill="' +
      c +
      '"/><rect x="16" y="14" width="24" height="24" rx="2" fill="rgba(255,255,255,.45)"/>',
    tp: (c) => '<rect x="12" y="34" width="32" height="8" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[12, 37, 32]],
    arm: [
      [3, 24],
      [43, 24],
    ],
    ls: [
      [16, 42],
      [32, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "translate(0 2)",
    my: 2,
  },
  ionflare: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,4 34,16 46,18 36,27 39,40 28,33 17,40 20,27 10,18 22,16" fill="' +
      c +
      '"/><circle cx="28" cy="25" r="7" fill="#fff" opacity=".6"/>',
    tp: (c) =>
      '<polygon points="17,34 39,34 39,40 28,33 17,40" fill="' + c + '"/>',
    zip: [27, 34, 2, 6],
    st: [[18, 36, 20]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 41],
      [30, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  amberorb: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="16" fill="' +
      c +
      '"/><path d="M16 22Q28 14 40 22" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><path d="M16 30Q28 22 40 30" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>',
    tp: (c) => '<path d="M12 34A16 16 0 0 0 44 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[14, 37, 28]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  galilean: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="15" fill="' +
      c +
      '"/><circle cx="18" cy="16" r="3.5" fill="#fff"/><circle cx="38" cy="34" r="3" fill="#fff"/><circle cx="36" cy="16" r="2.5" fill="#fff"/>',
    tp: (c) => '<path d="M13 34A15 15 0 0 0 43 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[15, 37, 26]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  jovian: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="18,8 38,8 47,20 28,45 9,20" fill="' +
      c +
      '"/><ellipse cx="28" cy="24" rx="12" ry="4" fill="rgba(255,255,255,.3)"/>',
    tp: (c) => '<polygon points="18.8,33 37.2,33 28,45" fill="' + c + '"/>',
    zip: [27, 33, 2, 11],
    st: [[20.5, 35.5, 15]],
    arm: [
      [4, 22],
      [42, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.82],
    et: "translate(0 -1)",
    my: -1,
  },
  stratos: {
    bx: [11, 45],
    bd: (c) =>
      '<rect x="12" y="16" width="32" height="20" rx="10" fill="' +
      c +
      '"/><circle cx="28" cy="26" r="6" fill="#fff" opacity=".5"/>',
    tp: (c) =>
      '<path d="M12 32H44V36A8 8 0 0 1 36 44H20A8 8 0 0 1 12 36Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 8],
    st: [[14, 37, 28]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },

  ringling: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="15" fill="' +
      c +
      '"/><ellipse cx="28" cy="28" rx="24" ry="5.5" transform="rotate(-14 28 28)" fill="none" stroke="#ffe49e" stroke-width="3.2"/>',
    tp: (c) => '<path d="M14 33A15 15 0 0 0 42 33Z" fill="' + c + '"/>',
    zip: [27, 33, 2, 8],
    st: [[16, 36, 24]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [19, 41],
      [29, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  titanwave: {
    bx: [11, 45],
    bd: (c) =>
      '<path d="M28 8C15 8 8 18 10 30C11.5 38 18 44 28 44C38 44 44.5 38 46 30C48 18 41 8 28 8Z" fill="' +
      c +
      '"/><path d="M12 26Q28 20 44 26" stroke="#fff" stroke-width="2.5" fill="none"/><path d="M12 33Q28 27 44 33" stroke="#fff" stroke-width="2.5" fill="none"/>',
    tp: (c) =>
      '<path d="M11 34C13 40 19 44 28 44C37 44 43 40 45 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 10],
    st: [[13.5, 37, 29]],
    arm: [
      [3, 23],
      [43, 23],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  enceladus: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="16" fill="' +
      c +
      '"/><path d="M28 10V20M24 14L32 16" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
    tp: (c) => '<path d="M12 34A16 16 0 0 0 44 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[14, 37, 28]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  goldhalo: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="15" fill="' +
      c +
      '"/><circle cx="28" cy="26" r="19" fill="none" stroke="#ffe27a" stroke-width="2.5" stroke-dasharray="4 2"/>',
    tp: (c) => '<path d="M13 34A15 15 0 0 0 43 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[15, 37, 26]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  duskring: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="15" fill="' +
      c +
      '"/><ellipse cx="28" cy="28" rx="22" ry="5" transform="rotate(15 28 28)" fill="none" stroke="#f0c14b" stroke-width="3"/>',
    tp: (c) => '<path d="M13 34A15 15 0 0 0 43 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[15, 37, 26]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  cassini: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,6 34.5,18.5 48,20.5 38,30 40.5,44 28,37.5 15.5,44 18,30 8,20.5 21.5,18.5" fill="' +
      c +
      '"/><ellipse cx="28" cy="26" rx="20" ry="4.5" fill="none" stroke="#ffe27a" stroke-width="2.5"/>',
    tp: (c) =>
      '<polygon points="17.2,34 38.8,34 40.5,44 28,37.5 15.5,44" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 4],
    st: [[17, 36.5, 22]],
    arm: [
      [4, 23],
      [42, 23],
    ],
    ls: [
      [17, 41],
      [31, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [-1, 0.72],
    et: "",
    my: 1,
  },
  ringgem: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="18,8 38,8 47,20 28,45 9,20" fill="' +
      c +
      '"/><ellipse cx="28" cy="26" rx="22" ry="5" transform="rotate(-10 28 26)" fill="none" stroke="#ffe27a" stroke-width="3"/>',
    tp: (c) => '<polygon points="18.8,33 37.2,33 28,45" fill="' + c + '"/>',
    zip: [27, 33, 2, 11],
    st: [[20.5, 35.5, 15]],
    arm: [
      [4, 22],
      [42, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.82],
    et: "translate(0 -1)",
    my: -1,
  },
  cloudring: {
    bx: [11, 45],
    bd: (c) =>
      '<circle cx="17" cy="29" r="9" fill="' +
      c +
      '"/><circle cx="39" cy="29" r="9" fill="' +
      c +
      '"/><ellipse cx="28" cy="28" rx="22" ry="5" fill="none" stroke="#ffe27a" stroke-width="3"/>',
    tp: (c) =>
      '<path d="M10.5 34H45.5A8.5 8.5 0 0 1 37 39H19A8.5 8.5 0 0 1 10.5 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 5],
    st: [[13, 36.5, 30]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 38],
      [30, 38],
    ],
    lw: 8,
    lh: 14,
    hat: [1, 0.85],
    et: "",
    my: 1,
  },

  cyanmist: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="16" fill="' +
      c +
      '"/><path d="M12 20Q28 14 44 20" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="3" stroke-linecap="round"/>',
    tp: (c) => '<path d="M12 34A16 16 0 0 0 44 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[14, 37, 28]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  miranda: {
    bx: [11, 45],
    bd: (c) =>
      '<path d="M28 8C15 8 8 18 10 30C11.5 38 18 44 28 44C38 44 44.5 38 46 30C48 18 41 8 28 8Z" fill="' +
      c +
      '"/><polygon points="28,14 33,26 23,26" fill="#fff" opacity=".85"/>',
    tp: (c) =>
      '<path d="M11 34C13 40 19 44 28 44C37 44 43 40 45 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 10],
    st: [[13.5, 37, 29]],
    arm: [
      [3, 23],
      [43, 23],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  glacier: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,6 40,16 36,40 20,40 16,16" fill="' +
      c +
      '"/><path d="M28 6V40M20 22L36 22" stroke="rgba(255,255,255,.4)" stroke-width="2"/>',
    tp: (c) => '<polygon points="16,34 36,34 36,40 20,40" fill="' + c + '"/>',
    zip: [27, 34, 2, 6],
    st: [[18, 36, 20]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 41],
      [30, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  auroradisk: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="16" fill="' +
      c +
      '"/><ellipse cx="28" cy="26" rx="20" ry="7" fill="none" stroke="#4cae6a" stroke-width="3" stroke-dasharray="6 3"/>',
    tp: (c) => '<path d="M12 34A16 16 0 0 0 44 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[14, 37, 28]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  oberon: {
    bx: [12, 44],
    bd: (c) =>
      '<path d="M13 21H43C43 35 36 44 28 45C20 44 13 35 13 21Z" fill="' +
      c +
      '"/><circle cx="28" cy="26" r="7" fill="#3fa35d"/>',
    tp: (c) =>
      '<path d="M14.5 33H41.5C39.5 40 34 44.5 28 45C22 44.5 16.5 40 14.5 33Z" fill="' +
      c +
      '"/>',
    zip: [27, 33, 2, 11],
    st: [[16, 36, 24]],
    arm: [
      [4, 23],
      [42, 23],
    ],
    ls: [
      [18, 43],
      [30, 43],
    ],
    lw: 8,
    lh: 11,
    hat: [0, 0.88],
    et: "",
    my: 1,
  },
  arielstar: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,6 34.5,18.5 48,20.5 38,30 40.5,44 28,37.5 15.5,44 18,30 8,20.5 21.5,18.5" fill="' +
      c +
      '"/><circle cx="28" cy="26" r="5" fill="#a8f5ff"/>',
    tp: (c) =>
      '<polygon points="17.2,34 38.8,34 40.5,44 28,37.5 15.5,44" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 4],
    st: [[17, 36.5, 22]],
    arm: [
      [4, 23],
      [42, 23],
    ],
    ls: [
      [17, 41],
      [31, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [-1, 0.72],
    et: "",
    my: 1,
  },
  iceprism: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="18,8 38,8 47,20 28,45 9,20" fill="' +
      c +
      '"/><line x1="28" y1="8" x2="28" y2="45" stroke="#fff" stroke-width="2"/>',
    tp: (c) => '<polygon points="18.8,33 37.2,33 28,45" fill="' + c + '"/>',
    zip: [27, 33, 2, 11],
    st: [[20.5, 35.5, 15]],
    arm: [
      [4, 22],
      [42, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.82],
    et: "translate(0 -1)",
    my: -1,
  },
  breezepuff: {
    bx: [11, 45],
    bd: (c) =>
      '<circle cx="17" cy="29" r="9" fill="' +
      c +
      '"/><circle cx="39" cy="29" r="9" fill="' +
      c +
      '"/><circle cx="24" cy="19" r="10.5" fill="' +
      c +
      '"/><path d="M14 26Q28 20 42 26" stroke="#fff" stroke-width="2" fill="none"/>',
    tp: (c) =>
      '<path d="M10.5 34H45.5A8.5 8.5 0 0 1 37 39H19A8.5 8.5 0 0 1 10.5 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 5],
    st: [[13, 36.5, 30]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 38],
      [30, 38],
    ],
    lw: 8,
    lh: 14,
    hat: [1, 0.85],
    et: "",
    my: 1,
  },

  triton: {
    bx: [12, 44],
    bd: (c) =>
      '<circle cx="28" cy="26" r="15" fill="' +
      c +
      '"/><path d="M20 18L28 12L36 18" stroke="#ff8aa8" stroke-width="3" fill="none" stroke-linecap="round"/>',
    tp: (c) => '<path d="M13 34A15 15 0 0 0 43 34Z" fill="' + c + '"/>',
    zip: [27, 34, 2, 8],
    st: [[15, 37, 26]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.8],
    et: "",
    my: 0,
  },
  abyssfin: {
    bx: [11, 45],
    bd: (c) =>
      '<path d="M28 8C15 8 8 18 10 30C11.5 38 18 44 28 44C38 44 44.5 38 46 30C48 18 41 8 28 8Z" fill="' +
      c +
      '"/><path d="M8 20L4 14L10 24Z" fill="#2f5fb3"/><path d="M48 20L52 14L46 24Z" fill="#2f5fb3"/>',
    tp: (c) =>
      '<path d="M11 34C13 40 19 44 28 44C37 44 43 40 45 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 10],
    st: [[13.5, 37, 29]],
    arm: [
      [3, 23],
      [43, 23],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  cometice: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,6 33,14 43,12 40,21 47,26 40,31 43,40 33,38 28,46 23,38 13,40 16,31 9,26 16,21 13,12 23,14" fill="' +
      c +
      '"/><path d="M28 20L36 32H20Z" fill="#70a8d8"/>',
    tp: (c) =>
      '<polygon points="15,34 41,34 43,40 33,38 28,46 23,38 13,40" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 11],
    st: [[16, 37, 24]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [17, 42],
      [31, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [-1, 0.8],
    et: "",
    my: 0,
  },
  blueflare: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,5 32,12 40,9 40,17 47,20 43,27 47,34 40,37 40,45 32,42 28,48 24,42 16,45 16,37 9,34 13,27 9,20 16,17 16,9 24,12" fill="' +
      c +
      '"/><circle cx="28" cy="26" r="6" fill="#fff3b0"/>',
    tp: (c) =>
      '<polygon points="14,34 42,34 40,45 32,42 28,48 24,42 16,45" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 12],
    st: [[16, 37, 24]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [17, 43],
      [31, 43],
    ],
    lw: 8,
    lh: 11,
    hat: [-1, 0.8],
    et: "",
    my: 0,
  },
  nebula: {
    bx: [11, 45],
    bd: (c) =>
      '<circle cx="17" cy="29" r="9" fill="' +
      c +
      '"/><circle cx="39" cy="29" r="9" fill="' +
      c +
      '"/><circle cx="24" cy="19" r="10.5" fill="' +
      c +
      '"/><circle cx="34" cy="21" r="9.5" fill="' +
      c +
      '"/><path d="M20 20Q28 32 36 20" stroke="#ffb300" stroke-width="2.5" fill="none"/>',
    tp: (c) =>
      '<path d="M10.5 34H45.5A8.5 8.5 0 0 1 37 39H19A8.5 8.5 0 0 1 10.5 34Z" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 5],
    st: [[13, 36.5, 30]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 38],
      [30, 38],
    ],
    lw: 8,
    lh: 14,
    hat: [1, 0.85],
    et: "",
    my: 1,
  },
  pulsar: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,6 34.5,18.5 48,20.5 38,30 40.5,44 28,37.5 15.5,44 18,30 8,20.5 21.5,18.5" fill="' +
      c +
      '"/><line x1="12" y1="26" x2="44" y2="26" stroke="#fff" stroke-width="3"/><line x1="28" y1="10" x2="28" y2="42" stroke="#fff" stroke-width="3"/>',
    tp: (c) =>
      '<polygon points="17.2,34 38.8,34 40.5,44 28,37.5 15.5,44" fill="' +
      c +
      '"/>',
    zip: [27, 34, 2, 4],
    st: [[17, 36.5, 22]],
    arm: [
      [4, 23],
      [42, 23],
    ],
    ls: [
      [17, 41],
      [31, 41],
    ],
    lw: 8,
    lh: 12,
    hat: [-1, 0.72],
    et: "",
    my: 1,
  },
  sapphire: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="18,8 38,8 47,20 28,45 9,20" fill="' +
      c +
      '"/><circle cx="28" cy="24" r="8" fill="#8ff5ee" opacity=".7"/>',
    tp: (c) => '<polygon points="18.8,33 37.2,33 28,45" fill="' + c + '"/>',
    zip: [27, 33, 2, 11],
    st: [[20.5, 35.5, 15]],
    arm: [
      [4, 22],
      [42, 22],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.82],
    et: "translate(0 -1)",
    my: -1,
  },
  cosmo: {
    bx: [12, 44],
    bd: (c) =>
      '<polygon points="28,4 34,16 47,16 37,25 41,38 28,31 15,38 19,25 9,16 22,16" fill="' +
      c +
      '"/><circle cx="28" cy="23" r="11" fill="#ffb300"/><path d="M22 23L26 27L34 19" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>',
    tp: (c) =>
      '<rect x="18" y="33" width="20" height="7" rx="3" fill="' + c + '"/>',
    zip: [27, 33, 2, 7],
    st: [[19, 36, 18]],
    arm: [
      [3, 22],
      [43, 22],
    ],
    ls: [
      [18, 40],
      [30, 40],
    ],
    lw: 8,
    lh: 13,
    hat: [-2, 0.75],
    et: "",
    my: 0,
  },

  earthplanet: {
    bx: [10, 46],
    bd: (c) =>
      '<circle cx="28" cy="26" r="18" fill="#3a95e0"/><path d="M12 20Q18 14 26 22T38 18T42 32Q36 40 24 36T14 28Z" fill="#3aa35d"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',
    tp: (c) => '<rect x="16" y="36" width="24" height="6" fill="#2b7cd3"/>',
    zip: [27, 36, 2, 6],
    st: [[18, 39, 20]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  marsplanet: {
    bx: [10, 46],
    bd: (c) =>
      '<circle cx="28" cy="26" r="18" fill="#d95830"/><circle cx="20" cy="18" r="4" fill="#a83a1a"/><circle cx="36" cy="30" r="5" fill="#a83a1a"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',
    tp: (c) => '<rect x="16" y="36" width="24" height="6" fill="#b03e1c"/>',
    zip: [27, 36, 2, 6],
    st: [[18, 39, 20]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  jupiterplanet: {
    bx: [10, 46],
    bd: (c) =>
      '<circle cx="28" cy="26" r="18" fill="#d98a3c"/><ellipse cx="28" cy="16" rx="14" ry="3" fill="#c2722b"/><ellipse cx="28" cy="24" rx="16" ry="3.5" fill="#f0c684"/><ellipse cx="28" cy="33" rx="12" ry="3" fill="#c2722b"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',
    tp: (c) => '<rect x="16" y="36" width="24" height="6" fill="#b57228"/>',
    zip: [27, 36, 2, 6],
    st: [[18, 39, 20]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  saturnplanet: {
    bx: [10, 46],
    bd: (c) =>
      '<circle cx="28" cy="26" r="16" fill="#d9b35a"/><ellipse cx="28" cy="28" rx="25" ry="5.5" transform="rotate(-15 28 28)" fill="none" stroke="#ffe49e" stroke-width="4"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',
    tp: (c) => '<rect x="16" y="36" width="24" height="6" fill="#c49c48"/>',
    zip: [27, 36, 2, 6],
    st: [[18, 39, 20]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  uranusplanet: {
    bx: [10, 46],
    bd: (c) =>
      '<circle cx="28" cy="26" r="18" fill="#46b8cc"/><ellipse cx="28" cy="26" rx="22" ry="5" transform="rotate(75 28 26)" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="2.5"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',
    tp: (c) => '<rect x="16" y="36" width="24" height="6" fill="#3296a8"/>',
    zip: [27, 36, 2, 6],
    st: [[18, 39, 20]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
  neptuneplanet: {
    bx: [10, 46],
    bd: (c) =>
      '<circle cx="28" cy="26" r="18" fill="#2d5be0"/><path d="M16 20Q28 14 40 20T36 34Q28 40 20 34Z" fill="#193aa8"/><circle cx="21" cy="22" r="2.5" fill="#111"/><circle cx="35" cy="22" r="2.5" fill="#111"/><path d="M26 27Q28 30 30 27" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>',
    tp: (c) => '<rect x="16" y="36" width="24" height="6" fill="#1d3fbc"/>',
    zip: [27, 36, 2, 6],
    st: [[18, 39, 20]],
    arm: [
      [2, 24],
      [44, 24],
    ],
    ls: [
      [18, 42],
      [30, 42],
    ],
    lw: 8,
    lh: 12,
    hat: [0, 0.85],
    et: "",
    my: 0,
  },
};
const PETS = [
  {
    id: "firefly",
    n: "Firefly",
    st: 1,
    d: "A glowing evening spark",
    svg: '<ellipse cx="14" cy="17" rx="5.5" ry="4.5" fill="#ffe27a" opacity=".55"/><ellipse cx="14" cy="16" rx="4.2" ry="3.4" fill="#3b3348"/><ellipse cx="14" cy="17.5" rx="3.5" ry="2.2" fill="#ffd23f"/><ellipse cx="10.2" cy="13" rx="3.2" ry="1.8" transform="rotate(-25 10.2 13)" fill="#dff4ff" opacity=".9"/><ellipse cx="17.8" cy="13" rx="3.2" ry="1.8" transform="rotate(25 17.8 13)" fill="#dff4ff" opacity=".9"/><circle cx="12.6" cy="15" r=".8" fill="#fff"/><circle cx="15.4" cy="15" r=".8" fill="#fff"/>',
  },
  {
    id: "chick",
    n: "Little Chick",
    st: 3,
    d: "Sunny chirping friend",
    svg: '<circle cx="14" cy="16" r="5.5" fill="#ffd23f"/><path d="M12.5 11Q14 8 15.5 11" fill="#ffb300"/><polygon points="14,16.5 11.8,18 16.2,18" fill="#ff8a1f"/><circle cx="12" cy="15" r=".9" fill="#222"/><circle cx="16" cy="15" r=".9" fill="#222"/><path d="M11 21v1.5M17 21v1.5" stroke="#ff8a1f" stroke-width="1.3" stroke-linecap="round"/>',
  },
  {
    id: "bunny",
    n: "Meadow Bunny",
    st: 5,
    d: "Soft ears & gentle hops",
    svg: '<ellipse cx="11.2" cy="8.5" rx="1.8" ry="4.8" fill="#f7f2eb" stroke="#d9cfc3" stroke-width=".7"/><ellipse cx="16.8" cy="8.5" rx="1.8" ry="4.8" fill="#f7f2eb" stroke="#d9cfc3" stroke-width=".7"/><ellipse cx="11.2" cy="8.8" rx=".8" ry="3" fill="#ffb8c6"/><ellipse cx="16.8" cy="8.8" rx=".8" ry="3" fill="#ffb8c6"/><circle cx="14" cy="16" r="5.4" fill="#f7f2eb"/><circle cx="12.1" cy="15.2" r=".9" fill="#222"/><circle cx="15.9" cy="15.2" r=".9" fill="#222"/><circle cx="14" cy="17.2" r="1" fill="#ff8aa8"/>',
  },
  {
    id: "lamb",
    n: "Woolly Lamb",
    st: 7,
    d: "Gentle shepherd’s companion",
    svg: '<circle cx="10.5" cy="13.5" r="3.4" fill="#fff"/><circle cx="17.5" cy="13.5" r="3.4" fill="#fff"/><circle cx="14" cy="12" r="3.8" fill="#fff"/><circle cx="10.5" cy="17.5" r="3.4" fill="#fff"/><circle cx="17.5" cy="17.5" r="3.4" fill="#fff"/><ellipse cx="14" cy="16.5" rx="4.2" ry="3.8" fill="#f2d6be"/><ellipse cx="9" cy="15.5" rx="2" ry="1.2" fill="#e0b899"/><ellipse cx="19" cy="15.5" rx="2" ry="1.2" fill="#e0b899"/><circle cx="12.5" cy="16" r=".9" fill="#222"/><circle cx="15.5" cy="16" r=".9" fill="#222"/><circle cx="14" cy="17.8" r=".8" fill="#d98880"/>',
  },
  {
    id: "puppy",
    n: "Loyal Pup",
    st: 10,
    d: "Tail-wagging trail buddy",
    svg: '<ellipse cx="9" cy="15" rx="2.2" ry="4.2" transform="rotate(15 9 15)" fill="#8b5a2b"/><ellipse cx="19" cy="15" rx="2.2" ry="4.2" transform="rotate(-15 19 15)" fill="#8b5a2b"/><circle cx="14" cy="16" r="5.5" fill="#d49b63"/><ellipse cx="14" cy="17.8" rx="2.8" ry="2.1" fill="#f6e3cc"/><circle cx="12.1" cy="15" r=".9" fill="#222"/><circle cx="15.9" cy="15" r=".9" fill="#222"/><circle cx="14" cy="17" r="1.1" fill="#222"/>',
  },
  {
    id: "dove",
    n: "Peace Dove",
    st: 14,
    d: "Messenger of calm & hope",
    svg: '<path d="M5 14Q9 9 13 13" fill="#e8f1fa"/><path d="M23 14Q19 9 15 13" fill="#e8f1fa"/><circle cx="14" cy="15.5" r="5" fill="#fff" stroke="#d8e6f3" stroke-width=".8"/><polygon points="14,16.5 12.2,17.8 15.8,17.8" fill="#f0a830"/><circle cx="12.3" cy="14.8" r=".85" fill="#222"/><circle cx="15.7" cy="14.8" r=".85" fill="#222"/><path d="M15.5 17.6l3.5 1.2M17.2 18.2l1-1.2" stroke="#4cae6a" stroke-width="1.1" stroke-linecap="round"/>',
  },
  {
    id: "kitten",
    n: "Cozy Kitten",
    st: 18,
    d: "Purring pocket friend",
    svg: '<polygon points="9.2,13.5 10.2,8.2 13.5,12" fill="#f0a05a"/><polygon points="18.8,13.5 17.8,8.2 14.5,12" fill="#f0a05a"/><circle cx="14" cy="16" r="5.4" fill="#f0a05a"/><circle cx="12.1" cy="15.3" r=".9" fill="#222"/><circle cx="15.9" cy="15.3" r=".9" fill="#222"/><polygon points="14,17 13,18 15,18" fill="#ff7a98"/><path d="M8.5 16.5h2.4M8.5 18h2.4M17.1 16.5h2.4M17.1 18h2.4" stroke="#8b5a2b" stroke-width=".8" stroke-linecap="round"/>',
  },
  {
    id: "turtle",
    n: "Steady Turtle",
    st: 21,
    d: "Slow, faithful & persistent",
    svg: '<path d="M8.5 17.5a5.5 5 0 0 1 11 0z" fill="#3f9d63"/><path d="M11 14.5h6M14 12.5v5" stroke="#2a6e44" stroke-width="1"/><circle cx="20.2" cy="16.5" r="2.3" fill="#7fd49a"/><circle cx="20.9" cy="16" r=".7" fill="#222"/><rect x="9.5" y="17.5" width="2.2" height="2.6" rx="1" fill="#7fd49a"/><rect x="16.3" y="17.5" width="2.2" height="2.6" rx="1" fill="#7fd49a"/>',
  },
  {
    id: "hermitcrab",
    n: "Hermit Crab",
    st: 24,
    d: "Curious shell-dwelling explorer",
    svg: '<path d="M9.4 18.8 7 21m4.4-1.9-.9 2.7m6.1-2.9 1 2.7m-.4-3.6 3 1.8" fill="none" stroke="#c9583f" stroke-width="1.25" stroke-linecap="round"/><ellipse cx="14" cy="18.2" rx="5.7" ry="3.1" fill="#ed8058"/><path d="M9.1 17.1C8.2 13.6 10.3 8.5 14.3 8c4.1-.5 7.5 3 7.3 6.6-.2 3.7-4 5.8-7.5 4.2-2.7-1.2-3.1-4.4-1.1-5.8 1.5-1.1 3.5-.1 3.1 1.5" fill="#d3bd93" stroke="#8d7450" stroke-width=".9"/><path d="M16.1 14.5c-.9 1.3-3.6 1.1-3.7-1.1-.1-1.8 2-3.4 3.8-2.1 1.6 1.1 1.4 3.7-.1 4.5" fill="none" stroke="#8d7450" stroke-width="1" stroke-linecap="round"/><path d="M10.1 17.7 7.2 15.2m4.1 2.2-1.2-3.3" fill="none" stroke="#ed8058" stroke-width="1.2" stroke-linecap="round"/><ellipse cx="6.8" cy="14.8" rx="1.15" ry="1.45" transform="rotate(-25 6.8 14.8)" fill="#f28b61"/><ellipse cx="9.8" cy="13.9" rx="1.15" ry="1.45" transform="rotate(-10 9.8 13.9)" fill="#f28b61"/><circle cx="6.9" cy="14.7" r=".48" fill="#222"/><circle cx="9.9" cy="13.8" r=".48" fill="#222"/><path d="M7.1 18.2c-1.8-1.1-3.2.5-1.7 1.4 1 .6 2.1-.2 2.5-1m11.3-1.3c1.4-1.5 3-.3 2.2.9-.6.9-1.8.6-2.4-.1" fill="#ed8058" stroke="#c9583f" stroke-width=".65"/><path d="M6.1 20c-1 .2-1.7.8-1.7 1.6m12.3-4.1 2.1.8" fill="none" stroke="#c9583f" stroke-width="1" stroke-linecap="round"/>',
  },
  {
    id: "owl",
    n: "Wise Owl",
    st: 25,
    d: "Night-watch scripture reader",
    svg: '<polygon points="9.5,12 10.5,8.5 13,11.5" fill="#7c5a42"/><polygon points="18.5,12 17.5,8.5 15,11.5" fill="#7c5a42"/><circle cx="14" cy="16" r="5.5" fill="#7c5a42"/><circle cx="11.8" cy="15.2" r="2.1" fill="#fff3b0"/><circle cx="16.2" cy="15.2" r="2.1" fill="#fff3b0"/><circle cx="11.8" cy="15.2" r="1" fill="#222"/><circle cx="16.2" cy="15.2" r="1" fill="#222"/><polygon points="14,16.4 13,17.8 15,17.8" fill="#f0a830"/>',
  },
  {
    id: "lion",
    n: "Lion Cub",
    st: 30,
    d: "Bold & courageous champion",
    svg: '<circle cx="14" cy="15.8" r="7.2" fill="#b86228"/><circle cx="14" cy="15.8" r="5.1" fill="#f2b84b"/><circle cx="10.2" cy="11.5" r="1.7" fill="#f2b84b"/><circle cx="17.8" cy="11.5" r="1.7" fill="#f2b84b"/><circle cx="12.2" cy="15.2" r=".9" fill="#222"/><circle cx="15.8" cy="15.2" r=".9" fill="#222"/><polygon points="14,16.6 12.8,17.8 15.2,17.8" fill="#6b3818"/>',
  },
  // Space Pets unlocked by settling space ecosystems
  {
    id: "astrobot",
    n: "Rover Bot",
    nb: "mars_meadow",
    pl: "mars",
    d: "Beep-boop Mars explorer",
    svg: '<rect x="8.5" y="12" width="11" height="8" rx="2.5" fill="#e8eef5" stroke="#8a9bb0" stroke-width=".9"/><line x1="14" y1="8.5" x2="14" y2="12" stroke="#8a9bb0" stroke-width="1.3"/><circle cx="14" cy="8" r="1.4" fill="#ff6a1a"/><rect x="10.2" y="14" width="7.6" height="3.2" rx="1.2" fill="#223344"/><circle cx="12.2" cy="15.6" r=".9" fill="#6ee0ff"/><circle cx="15.8" cy="15.6" r=".9" fill="#6ee0ff"/><circle cx="10.5" cy="20.6" r="1.4" fill="#444"/><circle cx="17.5" cy="20.6" r="1.4" fill="#444"/>',
  },
  {
    id: "stardust",
    n: "Star Puff",
    nb: "mars_starlight",
    pl: "mars",
    d: "Twinkling cosmic sprite",
    svg: '<polygon points="14,7.5 16,13 21.5,13.5 17.2,17 18.5,22 14,19 9.5,22 10.8,17 6.5,13.5 12,13" fill="#ffe27a"/><circle cx="12.4" cy="15.2" r=".85" fill="#2b2622"/><circle cx="15.6" cy="15.2" r=".85" fill="#2b2622"/>',
  },
  {
    id: "mooncat",
    n: "Astro Kitty",
    nb: "jupiter_meadow",
    pl: "jupiter",
    d: "Space-helmet purring pal",
    svg: '<circle cx="14" cy="15.5" r="7.4" fill="rgba(180,230,255,.35)" stroke="#9ad8ff" stroke-width="1"/><polygon points="10,13.5 11,9 13.5,12" fill="#f5b06a"/><polygon points="18,13.5 17,9 14.5,12" fill="#f5b06a"/><circle cx="14" cy="16" r="4.6" fill="#f5b06a"/><circle cx="12.4" cy="15.4" r=".8" fill="#222"/><circle cx="15.6" cy="15.4" r=".8" fill="#222"/><polygon points="14,16.8 13.2,17.6 14.8,17.6" fill="#ff7a98"/>',
  },
  {
    id: "cloudwhale",
    n: "Sky Whale",
    nb: "jupiter_sky",
    pl: "jupiter",
    d: "Gentle gas-giant glider",
    svg: '<ellipse cx="14" cy="16" rx="6.5" ry="4.4" fill="#6ab8ff"/><polygon points="6,16 3.5,13.5 4.5,16 3.5,18.5" fill="#4a95e0"/><ellipse cx="14" cy="17.5" rx="4.5" ry="2" fill="#d8f0ff"/><circle cx="17.2" cy="15.2" r=".9" fill="#222"/><path d="M13 11.5q-1-2.5-2.5-2M14 11.5q1-2.5 2.5-2" stroke="#bfe8ff" stroke-width="1" fill="none" stroke-linecap="round"/>',
  },
  {
    id: "ringfox",
    n: "Ring Fox",
    nb: "saturn_meadow",
    pl: "saturn",
    d: "Golden-tailed ring runner",
    svg: '<polygon points="9.2,13.5 10.2,8 13.5,12" fill="#e88a2a"/><polygon points="18.8,13.5 17.8,8 14.5,12" fill="#e88a2a"/><circle cx="14" cy="16" r="5.2" fill="#f09c38"/><ellipse cx="14" cy="17.5" rx="3.4" ry="2.2" fill="#fff5e0"/><circle cx="12.1" cy="15.2" r=".85" fill="#222"/><circle cx="15.9" cy="15.2" r=".85" fill="#222"/><circle cx="14" cy="16.8" r=".9" fill="#222"/>',
  },
  {
    id: "saturnowl",
    n: "Halo Owl",
    nb: "saturn_starlight",
    pl: "saturn",
    d: "Stargazer of Saturn’s rings",
    svg: '<ellipse cx="14" cy="16.5" rx="8.8" ry="2.4" fill="none" stroke="#ffe27a" stroke-width="1.3"/><circle cx="14" cy="15.8" r="5" fill="#8f63cf"/><circle cx="12" cy="15" r="1.8" fill="#fff3b0"/><circle cx="16" cy="15" r="1.8" fill="#fff3b0"/><circle cx="12" cy="15" r=".85" fill="#222"/><circle cx="16" cy="15" r=".85" fill="#222"/><polygon points="14,16.4 13,17.8 15,17.8" fill="#ffd23f"/>',
  },
  {
    id: "iceaxolotl",
    n: "Frost Axolotl",
    nb: "uranus_meadow",
    pl: "uranus",
    d: "Smiling cyan crystal swimmer",
    svg: '<path d="M8 13l-2.2-1.5M7.8 15.5l-2.4 0M8.2 18l-2 1.5M20 13l2.2-1.5M20.2 15.5l2.4 0M19.8 18l2 1.5" stroke="#ff8aa8" stroke-width="1.3" stroke-linecap="round"/><circle cx="14" cy="16" r="5.2" fill="#9bf2ff"/><circle cx="12" cy="15.2" r=".85" fill="#222"/><circle cx="16" cy="15.2" r=".85" fill="#222"/><path d="M12.5 17.3q1.5 1.2 3 0" stroke="#222" stroke-width="1" fill="none" stroke-linecap="round"/>',
  },
  {
    id: "cometpup",
    n: "Comet Pup",
    nb: "neptune_meadow",
    pl: "neptune",
    d: "Sapphire space-suit hound",
    svg: '<circle cx="14" cy="15.5" r="7.4" fill="rgba(160,210,255,.35)" stroke="#8ab8ff" stroke-width="1"/><ellipse cx="9.6" cy="15.5" rx="1.8" ry="3.5" fill="#3b6fd4"/><ellipse cx="18.4" cy="15.5" rx="1.8" ry="3.5" fill="#3b6fd4"/><circle cx="14" cy="16" r="4.6" fill="#7aa8ff"/><circle cx="12.3" cy="15.2" r=".85" fill="#222"/><circle cx="15.7" cy="15.2" r=".85" fill="#222"/><circle cx="14" cy="16.8" r="1" fill="#222"/>',
  },
  {
    id: "nebula",
    n: "Nebula Dragon",
    nb: "neptune_sky",
    pl: "neptune",
    d: "Cosmic guardian of the outer rim",
    svg: '<polygon points="9.5,12 8,7.5 12.2,11" fill="#ffd23f"/><polygon points="18.5,12 20,7.5 15.8,11" fill="#ffd23f"/><circle cx="14" cy="16" r="5.4" fill="#6a5fd6"/><circle cx="12" cy="15.2" r=".95" fill="#ffe27a"/><circle cx="16" cy="15.2" r=".95" fill="#ffe27a"/><path d="M12 17.6q2 1.2 4 0" stroke="#fff" stroke-width="1.1" fill="none" stroke-linecap="round"/>',
  },
];
function freshLook(k) {
  return {
    kind: k,
    hat: "none",
    topStyle: "none",
    topColor: "blue",
    pants: "none",
    shoes: "none",
    eyes: "normal",
    glasses: "none",
    mouth: "none",
    body: KINDS[k].body,
    pet: "none",
    ex: {},
  };
}
function layers(pp) {
  const p = pp || S.p,
    k = GEO[p.kind] ? p.kind : "square",
    g = GEO[k],
    duck = k === "duck";
  const bc = BODY[p.body] || BODY[KINDS[k].body],
    lm = dk(bc, 0.22),
    ts = p.topStyle,
    tc = COL[p.topColor] || COL.blue,
    ex = p.ex || {};
  const arm = ts !== "none" ? tc : lm,
    pc = PANTS[p.pants] || (duck ? "#ff9d2e" : lm),
    sh = SHOES[p.shoes],
    b0 = g.bx[0],
    b1 = g.bx[1];
  let o = "";
  if (ex.cape)
    o +=
      '<polygon points="' +
      (b0 - 3) +
      ",16 " +
      (b1 + 3) +
      ",16 " +
      (b1 + 9) +
      ",56 " +
      (b0 - 9) +
      ',56" fill="#7c4dbd"/>';
  if (ex.backpack)
    o +=
      '<rect x="' +
      (b1 - 4) +
      '" y="18" width="13" height="22" rx="2" fill="#3b6fd4"/><rect x="' +
      (b1 - 1) +
      '" y="27" width="7" height="7" fill="#2a54a8"/>';
  g.ls.forEach((l, i) => {
    const cls = i ? "leg-r" : "leg-l";
    if (duck)
      o +=
        '<g class="' +
        cls +
        '"><rect x="' +
        (l[0] + 1) +
        '" y="' +
        l[1] +
        '" width="3" height="7" fill="' +
        pc +
        '"/><ellipse cx="' +
        (l[0] + 2.5) +
        '" cy="52" rx="' +
        (sh ? 7 : 6) +
        '" ry="' +
        (sh ? 3 : 2.5) +
        '" fill="' +
        (sh || "#ff9d2e") +
        '"/></g>';
    else
      o +=
        '<g class="' +
        cls +
        '">' +
        R(l[0], l[1], g.lw, g.lh, pc) +
        (sh ? R(l[0] - 1, l[1] + g.lh - 4, g.lw + 2, 4, sh) : "") +
        "</g>";
  });
  g.arm.forEach((a, i) => {
    const cls = i ? "arm-r" : "arm-l";
    if (duck)
      o +=
        '<g class="' +
        cls +
        '"><ellipse cx="' +
        (a[0] + 5) +
        '" cy="' +
        (a[1] + 7) +
        '" rx="5" ry="7" fill="' +
        arm +
        '"/></g>';
    else o += '<g class="' + cls + '">' + R(a[0], a[1], 10, 9, arm) + "</g>";
  });
  o += g.bd(bc);
  if (duck) o += '<path d="M25 13Q24 7 28 8Q27 10 28 13Z" fill="' + bc + '"/>';
  if (ts !== "none") {
    o += g.tp(tc);
    if (ts === "jacket")
      o += R(g.zip[0], g.zip[1], g.zip[2], g.zip[3], "rgba(0,0,0,.25)");
    if (ts === "stripes")
      g.st.forEach((t) => {
        o += R(t[0], t[1], t[2], 2, "rgba(255,255,255,.45)");
      });
  }
  if (duck)
    o +=
      '<ellipse cx="28" cy="31" rx="7" ry="3.6" fill="#ff9d2e"/><path d="M21.5 31H34.5" stroke="#d9791a" stroke-width=".8"/>';
  const et = g.et ? ' transform="' + g.et + '"' : "";
  if (ex.cheeks)
    o +=
      "<g" +
      et +
      '><rect x="14" y="28" width="5" height="3" fill="#ff8aa8" opacity=".85"/><rect x="37" y="28" width="5" height="3" fill="#ff8aa8" opacity=".85"/></g>';
  if (!duck && p.mouth !== "none") {
    const mm =
      p.mouth === "smile"
        ? '<path d="M24 31 Q28 34.5 32 31" fill="none" stroke="#111" stroke-width="2" stroke-linecap="round"/>'
        : '<ellipse cx="28" cy="32" rx="3" ry="2.4" fill="#111"/>';
    o += '<g transform="translate(0 ' + g.my + ')">' + mm + "</g>";
  }
  let e =
    '<rect x="19" y="19" width="5" height="8" fill="#111"/><rect x="32" y="19" width="5" height="8" fill="#111"/>';
  if (p.eyes === "round")
    e =
      '<circle cx="21.5" cy="23" r="3.2" fill="#111"/><circle cx="34.5" cy="23" r="3.2" fill="#111"/>';
  if (p.eyes === "happy")
    e =
      '<path d="M18.5 25 Q21.5 18.5 24.5 25" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round"/><path d="M31.5 25 Q34.5 18.5 37.5 25" fill="none" stroke="#111" stroke-width="2.4" stroke-linecap="round"/>';
  if (p.eyes === "wink")
    e =
      '<rect x="19" y="19" width="5" height="8" fill="#111"/><rect x="31" y="24" width="7" height="2.2" fill="#111"/>';
  let gl = "";
  if (p.glasses === "square")
    gl =
      '<rect x="16.5" y="17" width="10" height="12" fill="none" stroke="#111" stroke-width="1.8"/><rect x="29.5" y="17" width="10" height="12" fill="none" stroke="#111" stroke-width="1.8"/><rect x="26" y="21" width="4" height="1.8" fill="#111"/>';
  if (p.glasses === "round")
    gl =
      '<circle cx="21.5" cy="23" r="6" fill="none" stroke="#111" stroke-width="1.8"/><circle cx="34.5" cy="23" r="6" fill="none" stroke="#111" stroke-width="1.8"/><rect x="27" y="22" width="2" height="1.8" fill="#111"/>';
  if (p.glasses === "shades")
    gl =
      '<rect x="16" y="18" width="12" height="9" rx="1" fill="#111"/><rect x="29" y="18" width="12" height="9" rx="1" fill="#111"/><rect x="28" y="20" width="2" height="2" fill="#111"/><rect x="18" y="19" width="4" height="2" fill="rgba(255,255,255,.35)"/>';
  o += "<g" + et + '><g class="eyes">' + e + "</g>" + gl + "</g>";
  if (ex.scarf)
    o +=
      R(b0, 33, b1 - b0, 5, "#c94a4a") +
      R(b1 - 9, 36, 6, 12, "#c94a4a") +
      R(b1 - 9, 43, 6, 2, "rgba(255,255,255,.4)");
  if (ex.bowtie)
    o +=
      '<polygon points="28,36 20,32 20,40" fill="#c94a4a"/><polygon points="28,36 36,32 36,40" fill="#c94a4a"/><rect x="26" y="34" width="4" height="4" fill="#8f2f2f"/>';
  if (HAT[p.hat])
    o +=
      '<g transform="translate(28 0) scale(' +
      g.hat[1] +
      " 1) translate(-28 " +
      g.hat[0] +
      ')">' +
      HAT[p.hat] +
      "</g>";
  o += headPetLayer(p, k);
  return o;
}
function paint() {
  const l = layers();
  $("pal").innerHTML = l;
  document.querySelectorAll(".pv").forEach((e) => {
    e.innerHTML = l;
  });
}
function streakBest() {
  const ds = Object.keys(S.days)
    .filter((k) => S.days[k])
    .sort();
  let best = 0,
    run = 0,
    prev = null;
  ds.forEach((k) => {
    const t = Date.parse(k);
    run = prev !== null && t - prev === 864e5 ? run + 1 : 1;
    if (run > best) best = run;
    prev = t;
  });
  return best;
}
