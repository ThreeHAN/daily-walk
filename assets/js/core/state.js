const DEFAULTS = [
  {
    id: "wake",
    g: "morning",
    t: "Wake up on time",
    s: "Give God the first minutes",
    tip: "Give God your first thoughts before your phone. Psalm 5:3 talks about bringing your morning to Him and waiting expectantly. Pray something simple like “This day is Yours.” Discipline is a way of showing up for the day God gave you.",
  },
  {
    id: "water",
    g: "nutrition",
    t: "Drink water",
    s: "Stay hydrated",
    tip: "Let each sip be a quick thank-you to God. Jesus spoke of living water (John 4:14), so pray “Fill me, Lord.” Caring for your body is stewardship (1 Corinthians 6:19–20).",
  },
  {
    id: "stretch",
    g: "exercise",
    t: "Do stretches",
    s: "Loosen up and breathe",
    tip: "Stretching is a quiet moment to slow down. Breathe in, pray a line like “The Lord is my shepherd” (Psalm 23), and breathe out worry. Thank Him for a body that moves (Psalm 139:14).",
  },
  {
    id: "cold",
    g: "morning",
    t: "Cold shower",
    s: "Train self-control",
    tip: "Doing something hard on purpose is practice in self-control, a fruit of the Spirit (Galatians 5:22–23). Pray “God, give me strength” through the first thirty seconds. Do it as discipline, not to prove yourself. Your worth is already settled in Christ.",
  },
  {
    id: "bfast",
    g: "nutrition",
    m: [5, 11],
    t: "Breakfast",
    s: "Morning · start the day nourished",
    tip: "Start the day with thanks. Pray before you eat and choose something that fuels you, like protein, fruit, or whole grains. Jesus called Himself the bread of life (John 6:35), so let this meal remind you He is all you need.",
  },
  {
    id: "lunch",
    g: "nutrition",
    m: [11, 15],
    t: "Lunch",
    s: "Midday · pause and refuel",
    tip: "Pause in the middle of the day to thank God for the morning. Eat slowly and enjoy it, and share a table if you can. Acts 2:46 describes believers eating together with glad and sincere hearts.",
  },
  {
    id: "dinner",
    g: "nutrition",
    m: [16, 21],
    t: "Dinner",
    s: "Evening · end the day with gratitude",
    tip: "Close the day with gratitude. Give thanks, eat until you are satisfied, and name one blessing from today. Psalm 136:1 reminds us to give thanks to the LORD, for He is good.",
  },
  {
    id: "eat",
    g: "nutrition",
    t: "Eat healthy",
    s: "Fuel your body well",
    tip: "Your body is a gift, so caring for it is a way of thanking God (1 Corinthians 6:19–20). Pray before you eat and choose food with gratitude, not guilt. 1 Corinthians 10:31 says to do even eating and drinking for His glory.",
  },
  {
    id: "room",
    g: "cleaning",
    t: "Clean my room",
    s: "Make space that’s peaceful",
    tip: "Order reflects a God of peace (1 Corinthians 14:33). Put on worship music, pray for whoever will walk into this space, and do it “as for the Lord” (Colossians 3:23). A tidy place makes room for rest, prayer, and hospitality.",
  },
  {
    id: "run",
    g: "exercise",
    t: "Run / exercise",
    s: "Strength for serving",
    tip: "Strength helps you serve others longer (1 Timothy 4:8). Use your run as prayer time: pray for a person on each lap or mile and thank God for a body that moves. The effort teaches perseverance (Hebrews 12:1).",
  },
  {
    id: "pray",
    g: "faith",
    t: "Pray & read Scripture",
    s: "Start with God",
    tip: "Even five quiet minutes counts. Read a short passage, ask God what He is saying, and pray for one person by name. Consistency matters more than length.",
  },
  {
    id: "good",
    g: "faith",
    t: "Do something good for someone",
    s: "Small kindness counts",
    tip: "Galatians 6:10 says to do good to everyone as you have the chance. Jesus said serving others is serving Him (Matthew 25:40), so small kindnesses are real worship.",
  },
];
const K_LEGACY = "dailywalk_admin_max:legacy";
const K_USERS = "dailywalk_admin_max:users:v3";
const K_CUR = "dailywalk_admin_max:cur:v3";
const uKey = (id) => "dailywalk_admin_max:u:" + id;
const dkey = (d) =>
  d.getFullYear() +
  "-" +
  String(d.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(d.getDate()).padStart(2, "0");
const today = () => dkey(new Date());

function newPlayerState(userName) {
  const now = Date.now();
  return {
    v: 3,
    createdAt: now,
    lastSaved: now,
    tasks: DEFAULTS.map((d) => ({ ...d })),
    checks: {},
    days: {},
    p: {
      name: userName || "Player 1",
      buddy: "Buddy",
      hat: "none",
      topStyle: "tee",
      topColor: "blue",
      pants: "black",
      shoes: "white",
      pantsStyle: "classic",
      shoeStyle: "classic",
      eyes: "happy",
      glasses: "none",
      mouth: "smile",
      body: "yellow",
      kind: "square",
      pet: "none",
      gender: "unspecified",
      skin: "medium",
      hair: "short",
      hairColor: "brown",
      eyeColor: "brown",
      ex: {},
    },
    pets: {},
    water: { d: today(), n: 0 },
    waterHistory: {},
    jr: {},
    xp: 0,
    life: 0,
    aw: { d: today(), k: {} },
    res: [],
    peopleMet: [],
    nb: {
      planet: "earth",
      vplanet: "earth",
      cur: "meadow",
      view: "meadow",
      xp: {},
      seen: {},
      cel: {},
      pcel: {},
    },
    seenK: {},
    bs: { born: now, clicks: 0, tasks: 0 },
    tseen: 0,
    splash: "",
    vday: "",
    tutorialDone: false,
  };
}

function freshState(userName) {
  const days = {},
    checks = {},
    jr = {},
    now = new Date();
  const allIds = DEFAULTS.map((d) => d.id);
  for (let i = 0; i < 365; i++) {
    const dt = new Date(now);
    dt.setDate(dt.getDate() - i);
    const k = dkey(dt);
    days[k] = true;
    if (i > 0) {
      const dayC = {};
      allIds.forEach((id) => {
        dayC[id] = true;
      });
      checks[k] = dayC;
    }
    if (i < 30)
      jr[k] =
        "Day " +
        (365 - i) +
        " of walking faithfully — every planet & town complete!";
  }
  const allNbXp = {},
    allNbSeen = {},
    allNbCel = {};
  [
    "meadow",
    "seaside",
    "snowy",
    "oasis",
    "autumn",
    "starlight",
    "crystal",
    "sky",
  ].forEach((k) => {
    allNbXp[k] = 3000;
    allNbSeen[k] = 12;
    allNbCel[k] = 1;
  });
  [
    "mars_meadow",
    "mars_seaside",
    "mars_snowy",
    "mars_oasis",
    "mars_autumn",
    "mars_starlight",
    "mars_crystal",
    "mars_sky",
  ].forEach((k) => {
    allNbXp[k] = 3000;
    allNbSeen[k] = 12;
    allNbCel[k] = 1;
  });
  [
    "jupiter_meadow",
    "jupiter_seaside",
    "jupiter_snowy",
    "jupiter_oasis",
    "jupiter_autumn",
    "jupiter_starlight",
    "jupiter_crystal",
    "jupiter_sky",
  ].forEach((k) => {
    allNbXp[k] = 3000;
    allNbSeen[k] = 12;
    allNbCel[k] = 1;
  });
  [
    "saturn_meadow",
    "saturn_seaside",
    "saturn_snowy",
    "saturn_oasis",
    "saturn_autumn",
    "saturn_starlight",
    "saturn_crystal",
    "saturn_sky",
  ].forEach((k) => {
    allNbXp[k] = 3000;
    allNbSeen[k] = 12;
    allNbCel[k] = 1;
  });
  [
    "uranus_meadow",
    "uranus_seaside",
    "uranus_snowy",
    "uranus_oasis",
    "uranus_autumn",
    "uranus_starlight",
    "uranus_crystal",
    "uranus_sky",
  ].forEach((k) => {
    allNbXp[k] = 3000;
    allNbSeen[k] = 12;
    allNbCel[k] = 1;
  });
  [
    "neptune_meadow",
    "neptune_seaside",
    "neptune_snowy",
    "neptune_oasis",
    "neptune_autumn",
    "neptune_starlight",
    "neptune_crystal",
    "neptune_sky",
  ].forEach((k) => {
    allNbXp[k] = 3000;
    allNbSeen[k] = 12;
    allNbCel[k] = 1;
  });
  const allPets = {
    firefly: 1,
    chick: 1,
    bunny: 1,
    lamb: 1,
    puppy: 1,
    dove: 1,
    kitten: 1,
    turtle: 1,
    hermitcrab: 1,
    owl: 1,
    lion: 1,
    astrobot: 1,
    stardust: 1,
    mooncat: 1,
    cloudwhale: 1,
    ringfox: 1,
    saturnowl: 1,
    iceaxolotl: 1,
    cometpup: 1,
    royalpig: 1,
  };
  const allSeenK = {
    square: 1,
    circle: 1,
    triangle: 1,
    rectangle: 1,
    clover: 1,
    shell: 1,
    snowflake: 1,
    sunburst: 1,
    acorn: 1,
    starshape: 1,
    gem: 1,
    cloudshape: 1,
    duck: 1,
    rocketbud: 1,
    craterbud: 1,
    frostorb: 1,
    solardome: 1,
    dustcore: 1,
    phobos: 1,
    marsgem: 1,
    aerowing: 1,
    stormeye: 1,
    tidepod: 1,
    cryocube: 1,
    ionflare: 1,
    amberorb: 1,
    galilean: 1,
    jovian: 1,
    stratos: 1,
    ringling: 1,
    titanwave: 1,
    enceladus: 1,
    goldhalo: 1,
    duskring: 1,
    cassini: 1,
    ringgem: 1,
    cloudring: 1,
    cyanmist: 1,
    miranda: 1,
    glacier: 1,
    auroradisk: 1,
    oberon: 1,
    arielstar: 1,
    iceprism: 1,
    breezepuff: 1,
    triton: 1,
    abyssfin: 1,
    cometice: 1,
    blueflare: 1,
    nebula: 1,
    pulsar: 1,
    sapphire: 1,
    cosmo: 1,
    earthplanet: 1,
    marsplanet: 1,
    jupiterplanet: 1,
    saturnplanet: 1,
    uranusplanet: 1,
    neptuneplanet: 1,
  };
  const gradList = [
    ["Square", "square", "orange", "tophat", "jacket", "blue"],
    ["Circle", "circle", "blue", "cap", "tee", "green"],
    ["Triangle", "triangle", "green", "cowboy", "stripes", "yellow"],
    ["Rectangle", "rectangle", "purple", "wizard", "jacket", "purple"],
    ["Clover", "clover", "green", "halo", "tee", "green"],
    ["Scallop", "shell", "blue", "phones", "stripes", "blue"],
    ["Crystal", "snowflake", "blue", "beanie", "jacket", "blue"],
    ["Sunburst", "sunburst", "yellow", "crown", "tee", "yellow"],
    ["Acorn", "acorn", "orange", "cowboy", "jacket", "red"],
    ["Starlight", "starshape", "purple", "wizard", "cape", "purple"],
    ["Gem", "gem", "blue", "tophat", "jacket", "blue"],
    ["Sky Puff", "cloudshape", "pink", "party", "tee", "pink"],
    ["Astro Rocket", "rocketbud", "orange", "wizard", "jacket", "red"],
    ["Storm Eye", "stormeye", "yellow", "crown", "jacket", "purple"],
    ["Ringlet", "ringling", "yellow", "halo", "tee", "yellow"],
    ["Cyan Mist", "cyanmist", "blue", "phones", "jacket", "blue"],
    ["Golden Duck", "duck", "yellow", "crown", "jacket", "purple"],
  ];
  const residents = gradList.map((g, idx) => ({
    n: g[0],
    l: {
      kind: g[1],
      hat: g[3],
      topStyle: g[4] === "cape" ? "tee" : g[4],
      topColor: g[5],
      pants: "black",
      shoes: "white",
      eyes: "happy",
      glasses: "shades",
      mouth: "smile",
      body: g[2],
      pet: "none",
      ex: g[4] === "cape" ? { cape: true } : { cheeks: true },
    },
    born: Date.now() - (365 - idx * 15) * 864e5,
    clicks: 80 + idx * 12,
    tasks: 220 + idx * 15,
    gradAt: Date.now() - (340 - idx * 15) * 864e5,
  }));
  return {
    v: 3,
    createdAt: Date.now() - 365 * 864e5,
    lastSaved: Date.now(),
    tasks: DEFAULTS.map((d) => ({ ...d })),
    checks,
    days,
    p: {
      name: userName || "Admin",
      buddy: "Cosmo Legend",
      hat: "crown",
      topStyle: "jacket",
      topColor: "purple",
      pants: "black",
      shoes: "white",
      pantsStyle: "classic",
      shoeStyle: "classic",
      eyes: "happy",
      glasses: "shades",
      mouth: "smile",
      body: "yellow",
      kind: "cosmo",
      pet: "royalpig",
      gender: "unspecified",
      skin: "medium",
      hair: "short",
      hairColor: "brown",
      eyeColor: "brown",
      ex: {
        scarf: true,
        bowtie: true,
        cape: true,
        backpack: true,
        cheeks: true,
      },
    },
    pets: allPets,
    water: { d: today(), n: 8 },
    waterHistory: {},
    jr,
    xp: 99999,
    life: 144000,
    aw: { d: today(), k: {} },
    res: residents,
    peopleMet: [],
    nb: {
      planet: "neptune",
      vplanet: "neptune",
      cur: "neptune_sky",
      view: "neptune_sky",
      xp: allNbXp,
      seen: allNbSeen,
      cel: allNbCel,
      pcel: { earth: 1, mars: 1, jupiter: 1, saturn: 1, uranus: 1, neptune: 1 },
    },
    seenK: allSeenK,
    bs: { born: Date.now() - 365 * 864e5, clicks: 999, tasks: 4368 },
    tseen: 12,
    splash: "",
    vday: "",
    tutorialDone: false,
  };
}

function hydrateState(raw) {
  const base = freshState("");
  const s = raw && typeof raw === "object" ? Object.assign(base, raw) : base;
  if (!Array.isArray(s.tasks) || !s.tasks.length)
    s.tasks = DEFAULTS.map((d) => ({ ...d }));
  DEFAULTS.forEach((d) => {
    const t = s.tasks.find((x) => x.id === d.id);
    if (t) {
      t.g = d.g;
      if (d.m) t.m = d.m;
    } else s.tasks.push({ ...d });
  });
  s.checks = s.checks && typeof s.checks === "object" ? s.checks : {};
  s.days = s.days && typeof s.days === "object" ? s.days : {};
  s.p = Object.assign(freshState("").p, s.p || {});
  delete s.p.genderLocked;
  if (s.p.topStyle === "none") s.p.topStyle = "tee";
  if (s.p.pants === "none") s.p.pants = "black";
  if (s.p.jacket && s.p.jacket !== "none") {
    s.p.topStyle = "jacket";
    s.p.topColor = s.p.jacket;
  }
  if (s.p.glasses === true) s.p.glasses = "square";
  if (s.p.glasses === false) s.p.glasses = "none";
  delete s.p.jacket;
  s.p.ex = s.p.ex && typeof s.p.ex === "object" ? s.p.ex : {};
  if (typeof s.p.pet !== "string") s.p.pet = "none";
  s.pets = s.pets && typeof s.pets === "object" ? s.pets : {};
  if (s.p.pet === "nebula") s.p.pet = "royalpig";
  if (s.pets.nebula) {
    s.pets.royalpig = 1;
    delete s.pets.nebula;
  }
  s.water = s.water && typeof s.water === "object" ? s.water : { d: "", n: 0 };
  s.waterHistory = s.waterHistory && typeof s.waterHistory === "object"
    ? s.waterHistory : {};
  s.jr = s.jr && typeof s.jr === "object" ? s.jr : {};
  s.xp = Number(s.xp) || 0;
  s.aw = s.aw && typeof s.aw === "object" ? s.aw : { d: "", k: {} };
  s.aw.k = s.aw.k && typeof s.aw.k === "object" ? s.aw.k : {};
  s.res = Array.isArray(s.res) ? s.res : [];
  s.peopleMet = Array.isArray(s.peopleMet) ? s.peopleMet : [];
  s.res.forEach((resident) => {
    if (resident?.l?.pet === "nebula") resident.l.pet = "royalpig";
  });
  s.life = Math.max(Number(s.life) || 0, s.xp);
  if (!s.nb || typeof s.nb !== "object") {
    s.nb = {
      cur: "meadow",
      view: "meadow",
      xp: { meadow: s.life },
      seen: {},
      cel: {},
    };
    if (!s.life) s.nb.seen.meadow = 0;
  }
  s.nb.xp =
    s.nb.xp && typeof s.nb.xp === "object" ? s.nb.xp : { meadow: s.life };
  s.nb.seen = s.nb.seen && typeof s.nb.seen === "object" ? s.nb.seen : {};
  s.nb.cel = s.nb.cel && typeof s.nb.cel === "object" ? s.nb.cel : {};
  s.nb.pcel = s.nb.pcel && typeof s.nb.pcel === "object" ? s.nb.pcel : {};
  if (!s.nb.planet) s.nb.planet = "earth";
  if (!s.nb.vplanet) s.nb.vplanet = s.nb.planet;
  s.seenK = s.seenK && typeof s.seenK === "object" ? s.seenK : {};
  if (!s.bs || typeof s.bs !== "object") {
    let tc = 0,
      mn = null;
    Object.keys(s.checks).forEach((d) => {
      const n = Object.values(s.checks[d]).filter(Boolean).length;
      if (n) {
        tc += n;
        if (!mn || d < mn) mn = d;
      }
    });
    s.bs = { born: mn ? Date.parse(mn) : Date.now(), clicks: 0, tasks: tc };
  }
  s.tseen = Number(s.tseen) || 0;
  s.tutorialDone = !!s.tutorialDone;
  s.lastSeen = Date.now();
  return s;
}

let USERS = [];
let CUR_UID = "";
let S;
let stateLoadError = null;
let startupPending = true;
let startupHasLegacy = false;
try {
  USERS = readStoredUsers();
  CUR_UID = localStorage.getItem(K_CUR) || "";
  if (!USERS.length) {
    if (CUR_UID) throw new Error("Saved profile index is missing or empty");
    CUR_UID = "u_" + Date.now();
    const legacy = readStoredJson(K_LEGACY);
    startupHasLegacy = legacy !== null;
    S = legacy === null ? newPlayerState("Player 1") : hydrateState(legacy);
    USERS = [
      {
        id: CUR_UID,
        label: S.p.name || "Player 1",
        updated: Date.now(),
        lv: 1,
        streak: 0,
      },
    ];
  } else {
    if (!USERS.some((u) => u.id === CUR_UID)) CUR_UID = USERS[0].id;
    S = hydrateState(readStoredProfile(CUR_UID));
  }
} catch (e) {
  stateLoadError = e;
  CUR_UID = "u_" + Date.now();
  S = newPlayerState("Player 1");
  USERS = [{ id: CUR_UID, label: S.p.name || "Player 1" }];
}
const G = [
  { id: "morning", n: "Morning", e: "sun", c: "#f5a623" },
  { id: "nutrition", n: "Nutrition", e: "salad", c: "#4cae6a" },
  { id: "exercise", n: "Exercise", e: "dumbbell", c: "#e5624a" },
  { id: "cleaning", n: "Cleaning", e: "broom", c: "#4a90d9" },
  { id: "faith", n: "Faith & Kindness", e: "pray", c: "#9a6bd6" },
  { id: "more", n: "My Habits", e: "star", c: "#b8863b" },
];
