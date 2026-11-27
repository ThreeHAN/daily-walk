function fillIndex(reset = false) {
  const people = S.peopleMet.filter(
    (person) => person && person.name && person.look && NB[person.town],
  );
  renderWorldActions(people.length);
  DailyWalkReact.renderPeopleIndex({
    people: people.map((person, index) => ({
      index,
      name: person.name,
      town: person.town,
      townName: NB[person.town].n,
      portrait: svgOf(person.look, 64, 72).outerHTML,
    })),
    towns: NBK.map((id) => ({ id, name: NB[id].n })),
    icon: icoSvg,
    iconTextParts,
    onClose: () => $("ix").classList.remove("show"),
  }, reset);
}
function openIx() {
  fillIndex(true);
  $("ix").classList.add("show");
}
function openIndexFromProfile() {
  $("pm").classList.remove("show");
  openIx();
}
const FIRE_TIERS = [
  {
    min: 30,
    cls: "t5",
    name: "Blue Supernova Flame",
    cols: ["#1b76ff", "#45b6ff", "#9be8ff", "#ffffff"],
    sparks: ["#7be0ff", "#ffffff", "#3ba8ff", "#ffe885"],
    rate: 4,
    scale: 1.18,
    msg: "30+ days! Your dedication burns with an unstoppable celestial flame!",
  },
  {
    min: 14,
    cls: "t4",
    name: "Royal Phoenix Fire",
    cols: ["#9b38ff", "#ff7a1a", "#ffd23f", "#fff7c2"],
    sparks: ["#ffd23f", "#ff9d2e", "#e08aff", "#ffffff"],
    rate: 3,
    scale: 1.12,
    msg: "2+ weeks strong! A golden phoenix blaze lights your path!",
  },
  {
    min: 7,
    cls: "t3",
    name: "Roaring Blaze",
    cols: ["#e63917", "#ff7b1c", "#ffd23f", "#fff5b8"],
    sparks: ["#ff8a1f", "#ffd23f", "#ff4d1a", "#fff"],
    rate: 2,
    scale: 1.06,
    msg: "A full week+ on fire! Keep feeding the flame every day!",
  },
  {
    min: 3,
    cls: "t2",
    name: "Rising Campfire",
    cols: ["#ff5a14", "#ff9922", "#ffd644", "#fff5bd"],
    sparks: ["#ff9e22", "#ffd23f", "#fff3b0"],
    rate: 1,
    scale: 1.0,
    msg: "Your flame is growing brighter! Stay consistent today.",
  },
  {
    min: 1,
    cls: "t1",
    name: "Warm Spark",
    cols: ["#ff6a1a", "#ffa52b", "#ffd954", "#fff6c4"],
    sparks: ["#ffb23e", "#ffd97d"],
    rate: 1,
    scale: 0.92,
    msg: "The fire is lit! Show up each day to make it blaze bigger.",
  },
  {
    min: 0,
    cls: "cold",
    name: "Unlit Ember",
    cols: ["#666", "#888", "#aaa", "#ccc"],
    sparks: [],
    rate: 0,
    scale: 0.85,
    msg: "Finish a habit today to ignite your streak flame!",
  },
];
const FIRE_ANIM = { raf: 0, pts: [], t: 0 };
function stopFireAnim() {
  if (FIRE_ANIM.raf) {
    cancelAnimationFrame(FIRE_ANIM.raf);
    FIRE_ANIM.raf = 0;
  }
}
function startFireAnim(tier) {
  stopFireAnim();
  const cv = $("fcan");
  if (!cv) return;
  const ctx = cv.getContext("2d"),
    W = cv.width,
    H = cv.height;
  FIRE_ANIM.pts = [];
  FIRE_ANIM.t = 0;
  const p1 = $("fp1"),
    p2 = $("fp2"),
    p3 = $("fp3"),
    p4 = $("fp4");
  if (p1) {
    p1.setAttribute("fill", tier.cols[0]);
    p2.setAttribute("fill", tier.cols[1]);
    p3.setAttribute("fill", tier.cols[2]);
    p4.setAttribute("fill", tier.cols[3]);
  }
  $("fsvg").style.width = Math.round(146 * tier.scale) + "px";
  $("fsvg").style.height = Math.round(175 * tier.scale) + "px";
  function frame() {
    if (!$("sp").classList.contains("show")) {
      FIRE_ANIM.raf = 0;
      return;
    }
    FIRE_ANIM.t += 0.055;
    const t = FIRE_ANIM.t;
    if (tier.rate > 0 && p1) {
      p2.setAttribute("transform", "translate(" + (Math.sin(t * 2) > 0 ? 2 : -2) + " 0)");
      p3.setAttribute("transform", "translate(" + (Math.sin(t * 3) > 0 ? -2 : 2) + " 0)");
    }
    ctx.clearRect(0, 0, W, H);
    // Spawn rising sparks & glowing embers proportional to streak tier
    for (let i = 0; i < tier.rate; i++) {
      if (Math.random() < 0.65) {
        FIRE_ANIM.pts.push({
          x: W / 2 + (Math.random() - 0.5) * (46 + tier.rate * 12),
          y: H - 36 - Math.random() * 26,
          vx: (Math.random() - 0.5) * (0.8 + tier.rate * 0.28),
          vy: -(1.1 + Math.random() * (1.2 + tier.rate * 0.45)),
          r: 1.4 + Math.random() * (1.6 + tier.rate * 0.4),
          life: 1,
          dec: 0.014 + Math.random() * 0.014,
          col:
            tier.sparks[Math.floor(Math.random() * tier.sparks.length)] ||
            "#ffd23f",
        });
      }
    }
    for (let i = FIRE_ANIM.pts.length - 1; i >= 0; i--) {
      const pt = FIRE_ANIM.pts[i];
      pt.x += pt.vx + Math.sin(t * 2 + i) * 0.35;
      pt.y += pt.vy;
      pt.life -= pt.dec;
      if (pt.life <= 0) {
        FIRE_ANIM.pts.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, pt.life);
      ctx.fillStyle = pt.col;
      const size = Math.max(2, Math.round(pt.r * pt.life * 2));
      ctx.fillRect(Math.round(pt.x), Math.round(pt.y), size, size);
      ctx.restore();
    }
    FIRE_ANIM.raf = requestAnimationFrame(frame);
  }
  FIRE_ANIM.raf = requestAnimationFrame(frame);
}
function showSplash(force) {
  if (!force && S.splash === today()) return;
  S.splash = today();
  save();
  const n = curStreak,
    sp = $("sp");
  const tier =
    FIRE_TIERS.find((t) => n >= t.min) || FIRE_TIERS[FIRE_TIERS.length - 1];
  sp.className = "splash " + tier.cls;
  const days = [];
  for (let k = 6; k >= 0; k--) {
    const dt = new Date();
    dt.setDate(dt.getDate() - k);
    const key = dkey(dt);
    days.push({
      key,
      completed: !!S.days[key],
      today: k === 0,
      label: dt.toLocaleDateString(undefined, { weekday: "narrow" }),
    });
  }
  DailyWalkReact.renderStreakOverlay({ tier, days, count: n, onDone: closeSplash });
  sp.classList.add("show");
  startFireAnim(tier);
}
function closeSplash() {
  $("sp").classList.remove("show");
  stopFireAnim();
}
function initCollection() {
  renderWorldActions();
  DailyWalkReact.renderStreakOverlay({ tier: FIRE_TIERS[FIRE_TIERS.length - 1], days: [], count: 0, onDone: closeSplash });
  $("ix").onclick = (e) => {
    if (e.target === $("ix")) $("ix").classList.remove("show");
  };
  $("sp").onclick = (e) => {
    if (e.target === $("sp")) closeSplash();
  };
  $("sb").onclick = (e) => {
    e.stopPropagation();
    showSplash(true);
  };
}
