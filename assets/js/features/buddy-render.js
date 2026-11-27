const PETS = [
  {
    id: "firefly",
    n: "Firefly",
    st: 1,
    d: "A glowing evening spark",
    art: "assets/svg/pets/firefly.svg",
    eco: "meadow-night",
  },
  {
    id: "chick",
    n: "Little Chick",
    st: 3,
    d: "Sunny chirping friend",
    art: "assets/svg/pets/chick.svg",
    eco: "farm",
  },
  {
    id: "bunny",
    n: "Meadow Bunny",
    st: 5,
    d: "Soft ears & gentle hops",
    art: "assets/svg/pets/bunny.svg",
    eco: "meadow",
  },
  {
    id: "lamb",
    n: "Woolly Lamb",
    st: 7,
    d: "Gentle shepherd’s companion",
    art: "assets/svg/pets/lamb.svg",
    eco: "pasture",
  },
  {
    id: "puppy",
    n: "Loyal Pup",
    st: 10,
    d: "Tail-wagging trail buddy",
    art: "assets/svg/pets/puppy.svg",
    eco: "trail",
  },
  {
    id: "dove",
    n: "Peace Dove",
    st: 14,
    d: "Messenger of calm & hope",
    art: "assets/svg/pets/dove.svg",
    eco: "sky",
  },
  {
    id: "kitten",
    n: "Cozy Kitten",
    st: 18,
    d: "Purring pocket friend",
    art: "assets/svg/pets/kitten.svg",
    eco: "cozy",
  },
  {
    id: "turtle",
    n: "Steady Turtle",
    st: 21,
    d: "Slow, faithful & persistent",
    art: "assets/svg/pets/turtle.svg",
    eco: "pond",
  },
  {
    id: "hermitcrab",
    n: "Hermit Crab",
    st: 24,
    d: "Curious shell-dwelling explorer",
    art: "assets/svg/pets/hermitcrab.svg",
    scale: 1.04,
    eco: "beach",
  },
  {
    id: "owl",
    n: "Wise Owl",
    st: 25,
    d: "Night-watch scripture reader",
    art: "assets/svg/pets/owl.svg",
    eco: "forest-night",
  },
  {
    id: "lion",
    n: "Lion Cub",
    st: 30,
    d: "Bold & courageous champion",
    art: "assets/svg/pets/lion.svg",
    eco: "savanna",
  },
  // Space Pets unlocked by settling space ecosystems
  {
    id: "astrobot",
    n: "Rover Bot",
    nb: "mars_meadow",
    pl: "mars",
    d: "Beep-boop Mars explorer",
    art: "assets/svg/pets/astrobot.svg",
    eco: "mars",
    scale: 1.3,
  },
  {
    id: "stardust",
    n: "Star Puff",
    nb: "mars_starlight",
    pl: "mars",
    d: "Twinkling cosmic sprite",
    art: "assets/svg/pets/stardust.svg",
    eco: "space",
  },
  {
    id: "mooncat",
    n: "Astro Kitty",
    nb: "jupiter_meadow",
    pl: "jupiter",
    d: "Space-helmet purring pal",
    art: "assets/svg/pets/mooncat.svg",
    eco: "jupiter",
  },
  {
    id: "cloudwhale",
    n: "Sky Whale",
    nb: "jupiter_sky",
    pl: "jupiter",
    d: "Gentle gas-giant glider",
    art: "assets/svg/pets/cloudwhale.svg",
    eco: "jupiter-sky",
  },
  {
    id: "ringfox",
    n: "Ring Fox",
    nb: "saturn_meadow",
    pl: "saturn",
    d: "Golden-tailed ring runner",
    art: "assets/svg/pets/ringfox.svg",
    eco: "saturn",
  },
  {
    id: "saturnowl",
    n: "Halo Owl",
    nb: "saturn_starlight",
    pl: "saturn",
    d: "Stargazer of Saturn’s rings",
    art: "assets/svg/pets/saturnowl.svg",
    eco: "saturn-rings",
  },
  {
    id: "iceaxolotl",
    n: "Frost Axolotl",
    nb: "uranus_meadow",
    pl: "uranus",
    d: "Smiling cyan crystal swimmer",
    art: "assets/svg/pets/iceaxolotl.svg",
    eco: "uranus",
  },
  {
    id: "cometpup",
    n: "Comet Pup",
    nb: "neptune_meadow",
    pl: "neptune",
    d: "Sapphire space-suit hound",
    art: "assets/svg/pets/cometpup.svg",
    eco: "neptune",
  },
  {
    id: "royalpig",
    n: "Pig",
    nb: "neptune_sky",
    pl: "neptune",
    d: "Friendly farm companion with a cheerful snort",
    art: "assets/svg/pets/royalpig.svg",
    scale: 1.05,
    eco: "pig-farm",
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
function personLayers(p) {
  const skin = SKIN[p.skin] || SKIN.medium,
    hair = HAIR_COLOR[p.hairColor] || HAIR_COLOR.brown,
    eye = EYE_COLOR[p.eyeColor] || EYE_COLOR.brown,
    top = p.topStyle === "none" ? skin : p.topStyle === "armor" ? "#a8bac4" : COL[p.topColor] || COL.blue,
    pants = PANTS[p.pants] || skin,
    shoes = SHOES[p.shoes] || skin,
    ex = p.ex || {};
  const hairStyle = p.hair || "short";
  const rect = (x, y, width, height, fill) =>
    '<rect x="' + x + '" y="' + y + '" width="' + width + '" height="' + height + '" fill="' + fill + '"/>';
  let o = '<g class="pixel-person"><g transform="translate(-4.4 1) scale(2.7)" shape-rendering="crispEdges">';
  if (ex.cape) o += rect(6, 13, 12, 7, "#7c4dbd") + rect(5, 16, 14, 4, "#5f3a96");
  if (ex.backpack) o += rect(16, 13, 3, 5, "#285190") + rect(17, 14, 2, 3, "#3b6fd4");
  if (hairStyle === "long" || hairStyle === "ponytail") {
    o += rect(6, 6, 12, 7, hair);
    if (hairStyle === "ponytail") o += rect(17, 8, 2, 6, hair) + rect(18, 9, 2, 4, hair);
  }
  const pantsDetails = {
    trail: rect(0, 18, 3, 1, "#e5d7a8"),
    cargo: rect(0, 18, 1, 1, "#584c3b"),
    winter: rect(0, 18, 3, 1, "#e1eff5"),
  };
  const boots = {
    desert: rect(0, 19, 3, 2, shoes) + rect(0, 19, 3, 0.5, "#d6b77c") + rect(-1, 20, 1, 1, shoes),
    woodland: rect(0, 17, 3, 4, shoes) + rect(1, 18, 1, 2, "#dbc8a4") + rect(-1, 20, 1, 1, shoes),
    crystal: rect(1, 16, 1, 1, "#8de0ef") + rect(0, 17, 3, 4, shoes) + rect(1, 18, 1, 2, "#8de0ef") + rect(-1, 20, 1, 1, shoes),
  };
  const leg = (x, cls) => {
    const pantsDetail = p.pants !== "none" ? pantsDetails[p.pantsStyle] || "" : "";
    const boot = p.shoes !== "none" && boots[p.shoeStyle];
    return '<g class="' + cls + '"><g transform="translate(' + x + ' 0)">' +
      rect(0, 18, 3, 3, pants) +
      pantsDetail +
      '<g class="shoe-art">' + (boot || rect(-1, 20, 4, 1, shoes)) + '</g>' +
      '</g></g>';
  };
  o +=
    leg(8, "leg-l") + leg(13, "leg-r") +
    '<g class="arm-l">' + rect(5, 13, 2, 5, dk(top, .18)) + rect(5, 18, 2, 1, dk(skin, .12)) + '</g>' +
    '<g class="arm-r">' + rect(17, 13, 2, 5, dk(top, .18)) + rect(17, 18, 2, 1, dk(skin, .12)) + '</g>';
  o += p.gender === "male"
    ? '<path class="person-body" d="M7 13 H17 V15 H16 V19 H8 V15 H7Z" fill="' + dk(top, .16) + '"/>'
    : '<rect class="person-body" x="7" y="13" width="10" height="6" fill="' + dk(top, .16) + '"/>';
  o += rect(8, 13, 8, 5, top);
  if (p.topStyle === "stripes")
    o += rect(8, 14, 8, 1, "#eee8d8") + rect(8, 16, 8, 1, "#eee8d8");
  if (p.topStyle === "jacket")
    o += rect(11.5, 13, 1, 5, dk(top, .4)) + rect(8, 16, 2, 1, dk(top, .2)) + rect(14, 16, 2, 1, dk(top, .2));
  if (p.topStyle === "tunic")
    o += rect(7, 17, 10, 1, "#2b1e19") + rect(11, 17, 2, 1, "#b59449");
  if (p.topStyle === "armor")
    o += rect(5, 13, 2, 2, "#525c68") + rect(17, 13, 2, 2, "#525c68") +
      rect(8, 13, 8, 2, "#d7e1e5") + rect(9, 15, 6, 1, "#708691") +
      rect(7, 17, 10, 1, COL[p.topColor] || COL.blue);
  if (ex.sword)
    o += '<g class="warrior-sword">' + rect(20, 9, 1, 7, "#e1e8eb") + rect(19, 16, 3, 1, "#b59449") + rect(20, 17, 1, 2, "#795439") + '</g>';
  if (ex.shield)
    o += '<g class="warrior-shield">' + rect(3, 14, 4, 5, "#d4e0e5") + rect(4, 15, 2, 3, "#476b92") + rect(4.5, 15, 1, 3, "#f2d078") + '</g>';
  o += rect(6, 9, 1, 2, dk(skin, .12)) + rect(17, 9, 1, 2, dk(skin, .12));
  o += p.gender === "male"
    ? '<path class="person-head" d="M7 8 H17 V12 H16 V13 H8 V12 H7Z" fill="' + skin + '"/>'
    : '<rect class="person-head" x="7" y="8" width="10" height="5" fill="' + skin + '"/>';
  if (hairStyle === "short")
    o += rect(7, 6, 10, 2, hair) + rect(7, 8, 3, 1, hair) + rect(14, 8, 3, 1, hair);
  if (hairStyle === "long" || hairStyle === "ponytail")
    o += rect(7, 6, 10, 2, hair) + rect(7, 8, 2, 1, hair) + rect(15, 8, 2, 1, hair);
  if (hairStyle === "curly")
    o += rect(7, 6, 10, 2, hair) + rect(8, 5, 2, 1, hair) + rect(11, 5, 2, 1, hair) + rect(14, 5, 2, 1, hair) + rect(7, 8, 2, 1, hair) + rect(15, 8, 2, 1, hair);
  o += '<g class="eyes">';
  o += rect(8, 9, 1, 2, "#f0ece6") + rect(9, 9, 2, 2, eye);
  o += p.eyes === "wink" ? rect(13, 9.5, 3, 1, eye) : rect(15, 9, 1, 2, "#f0ece6") + rect(13, 9, 2, 2, eye);
  if (p.eyes === "round") o += rect(9, 9, 1, 1, "#f0ece6") + rect(14, 9, 1, 1, "#f0ece6");
  o += "</g>";
  o += '<g class="gender-detail">';
  if (p.gender === "female") {
    o += rect(7, 9, 1, 1, dk(hair, .2)) + rect(16, 9, 1, 1, dk(hair, .2));
    if (p.eyes === "happy") o += rect(9, 8, 2, 1, dk(hair, .2)) + rect(13, 8, 2, 1, dk(hair, .2));
  } else {
    o += p.eyes === "happy"
      ? rect(9, 8, 2, 1, dk(hair, .2)) + rect(13, 8, 2, 1, dk(hair, .2))
      : rect(8, 8, 3, 1, dk(hair, .2)) + rect(13, 8, 3, 1, dk(hair, .2));
  }
  o += "</g>";
  if (p.mouth === "open")
    o += rect(11, 11, 2, 1.5, "#6e3b2c");
  else if (p.mouth !== "none")
    o += rect(11, 11, 2, 1, "#6e3b2c");
  if (p.glasses === "square" || p.glasses === "shades")
    o += '<g fill="' + (p.glasses === "shades" ? "#252934" : "none") + '" stroke="#252934" stroke-width=".5"><rect x="7.5" y="8.5" width="4" height="3"/><rect x="12.5" y="8.5" width="4" height="3"/><path d="M11.5 9.5 H12.5"/></g>';
  if (p.glasses === "round")
    o += '<g fill="none" stroke="#252934" stroke-width=".5"><path d="M8 9 H11 V11 H8Z M13 9 H16 V11 H13Z M11 10 H13"/></g>';
  if (ex.scarf)
    o += rect(7, 12, 10, 1, "#c94a4a") + rect(14, 13, 2, 3, "#c94a4a");
  if (ex.bowtie)
    o += rect(9, 13, 2, 2, "#c94a4a") + rect(13, 13, 2, 2, "#c94a4a") + rect(11, 13.5, 2, 1, "#8f2f2f");
  const hats = {
    knight: rect(7, 3, 10, 4, "#525c68") + rect(8, 2, 8, 1, "#6b7785") + rect(7, 4, 1, 3, "#3a424b") + rect(16, 4, 1, 3, "#3a424b") + rect(11, 2, 2, 5, "#8996a6") + rect(7, 6, 3, 1, "#3a424b") + rect(14, 6, 3, 1, "#3a424b"),
    cap: rect(7, 4, 10, 3, "#2f5fb3") + rect(12, 6, 7, 1, "#244a8c"),
    tophat: rect(9, 1, 6, 5, "#222222") + rect(9, 4, 6, 1, "#f0c14b") + rect(7, 6, 10, 1, "#222222"),
    crown: rect(7, 4, 10, 3, "#f0c14b") + rect(7, 2, 2, 2, "#f0c14b") + rect(11, 1, 2, 3, "#f0c14b") + rect(15, 2, 2, 2, "#f0c14b"),
    cowboy: rect(8, 2, 8, 4, "#8b5a2b") + rect(8, 5, 8, 1, "#5a3a1a") + rect(5, 6, 14, 1, "#8b5a2b"),
    wizard: rect(11, 0, 2, 2, "#3a2a8a") + rect(10, 2, 4, 2, "#3a2a8a") + rect(9, 4, 6, 2, "#3a2a8a") + rect(7, 6, 10, 1, "#3a2a8a") + rect(11, 4, 1, 1, "#f0c14b"),
    beanie: rect(8, 3, 8, 3, "#7c4dbd") + rect(7, 6, 10, 1, "#5f3a96") + rect(11, 2, 2, 1, "#f0c14b"),
    halo: rect(8, 2, 8, 1, "#f0c14b") + rect(7, 3, 2, 1, "#f0c14b") + rect(15, 3, 2, 1, "#f0c14b") + rect(9, 4, 6, 1, "#f0c14b"),
    party: rect(11, 1, 2, 2, "#e5509a") + rect(10, 3, 4, 2, "#e5509a") + rect(9, 5, 6, 2, "#e5509a") + rect(11, 4, 2, 1, "#ffffff"),
    phones: rect(7, 4, 10, 1, "#333333") + rect(6, 5, 1, 3, "#333333") + rect(17, 5, 1, 3, "#333333") + rect(5, 8, 2, 3, "#e5509a") + rect(17, 8, 2, 3, "#e5509a"),
  };
  if (hats[p.hat]) o += '<g class="person-hat">' + hats[p.hat] + "</g>";
  o += "</g>";
  o += headPetLayer(p, "square");
  return o + "</g>";
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
  const l = personLayers(S.p);
  const profileLook = personLayers({ ...S.p, pet: "none" });
  $("pal").innerHTML = profileLook;
  renderDashboardControls(profileLook);
  document.querySelectorAll(".pv:not(#lu .pv)").forEach((e) => {
    e.innerHTML = e.closest("#pm") ? profileLook : l;
  });
  DailyWalkReact.renderLevelUp({ portrait: l });
  DailyWalkReact.renderProfilePets(petById(S.p.pet));
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
