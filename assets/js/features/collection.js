let ixTab = "b",
  ixPl = "earth";
function fillIndex() {
  $("ixt-b").classList.toggle("on", ixTab === "b");
  $("ixt-p").classList.toggle("on", ixTab === "p");
  const all = [{ n: S.p.buddy || "Buddy", p: S.p }].concat(
      S.res.map((r) => ({ n: r.n, p: r.l })),
    ),
    allKinds = Object.keys(KINDS);
  const unl = unlockedKinds();
  const have = (k) => all.filter((b) => (b.p.kind || "square") === k);
  const unlockedB = allKinds.filter(
    (k) => have(k).length > 0 || (KINDS[k].nb && unl.has(k)),
  ).length;
  const best = Math.max(curStreak, streakBest());
  const unlockedP = PETS.filter((pt) => isPetUnlocked(pt, best)).length;
  $("ixsub").textContent =
    unlockedB +
    " of " +
    allKinds.length +
    " buddies · " +
    unlockedP +
    " of " +
    PETS.length +
    " pets";
  const L = $("ixl");
  L.innerHTML = "";
  if (ixTab === "b") {
    const pbar = el("div", "ixpbar");
    pbar.style.gridColumn = "1/-1";
    PLANET_LIST.forEach((pid) => {
      const pc = PLANETS[pid],
        b = el(
          "button",
          "ixpchip" + (ixPl === pid ? " on" : ""),
          pc.icon + " " + pc.n,
        );
      b.type = "button";
      b.onclick = () => {
        ixPl = pid;
        fillIndex();
      };
      pbar.appendChild(b);
    });
    L.appendChild(pbar);
    const kinds = allKinds.filter((k) => (KINDS[k].pl || "earth") === ixPl);
    const plUnlocked = kinds.filter(
      (k) => have(k).length > 0 || (KINDS[k].nb && unl.has(k)),
    ).length;
    $("ixs").textContent =
      PLANETS[ixPl].n +
      ": " +
      plUnlocked +
      " of " +
      kinds.length +
      " buddies unlocked · Total: " +
      unlockedB +
      "/" +
      allKinds.length;
    const bar = $("ixbar");
    bar.style.width = "0%";
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        bar.style.width = (plUnlocked / kinds.length) * 100 + "%";
      }),
    );
    const pool = chestPool(),
      totW = pool.reduce((a, b) => a + b[1], 0);
    kinds.forEach((k, i) => {
      const hv = have(k),
        own = hv.length > 0,
        isUnl = unl.has(k),
        kd = KINDS[k];
      const unlocked = own || (kd.nb && isUnl);
      const c = el(
        "div",
        "ixc " +
          (unlocked ? "own" : "unk") +
          ((k === "duck" || k === "cosmo" || k.endsWith("planet")) && own
            ? " gold"
            : "") +
          (i === kinds.length - 1 && kinds.length % 2 === 1 ? " span2" : ""),
      );
      c.style.setProperty("--i", i);
      const pv = el("div", "ixp");
      if (unlocked) {
        pv.appendChild(svgOf(own ? hv[hv.length - 1].p : freshLook(k), 64, 72));
      } else {
        pv.appendChild(el("span", "ixq", "?"));
      }
      c.appendChild(pv);
      if (own && hv.length > 1)
        c.appendChild(el("span", "ixn", "x" + hv.length));
      c.appendChild(el("b", "", unlocked ? kd.n : "???"));
      const tg = el("span", "stag", unlocked ? kd.r : "Locked");
      tg.style.background = unlocked ? kd.c : "#8a8f98";
      c.appendChild(tg);
      const wEntry = pool.find((r) => r[0] === k),
        pct = wEntry ? Math.round((wEntry[1] / totW) * 100) : 0;
      c.appendChild(
        el(
          "div",
          "ixo",
          own
            ? hv.map((b) => b.n).join(", ")
            : kd.nb
              ? isUnl
                ? "Unlocked via " + NB[kd.nb].n
                : "Settle " + NB[kd.nb].n + " on " + PLANETS[kd.pl || "earth"].n
              : k === "square"
                ? "Your starter buddy"
                : "Reach Level 10 & open chests",
        ),
      );
      if (k !== "square" && unlocked)
        c.appendChild(
          el("div", "ixo", pct + "% chance in a chest at level 10"),
        );
      if (unlocked) {
        const eq = S.p.kind === k;
        const eb = el(
          "button",
          "ubtn" + (eq ? " sec" : ""),
          eq ? "Equipped ✓" : "Equip Buddy",
        );
        eb.type = "button";
        eb.style.marginTop = "6px";
        eb.onclick = () => {
          S.p.kind = k;
          if (!BODY[S.p.body]) S.p.body = kd.body;
          save();
          paint();
          react();
          fillIndex();
          toast("Equipped " + kd.n + "!");
        };
        c.appendChild(eb);
      }
      L.appendChild(c);
    });
  } else {
    $("ixs").textContent =
      unlockedP +
      " of " +
      PETS.length +
      " pets unlocked · Streak & Solar System rewards";
    const bar = $("ixbar");
    bar.style.width = "0%";
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        bar.style.width = (unlockedP / PETS.length) * 100 + "%";
      }),
    );
    PETS.forEach((pt, i) => {
      const unlPt = isPetUnlocked(pt, best);
      const eq = S.p.pet === pt.id;
      const c = el(
        "div",
        "ixc " +
          (unlPt ? "own" : "unk") +
          (eq ? " gold" : "") +
          (i === PETS.length - 1 && PETS.length % 2 === 1 ? " span2" : ""),
      );
      c.style.setProperty("--i", i);
      const pv = el("div", "ixp");
      if (unlPt) {
        pv.innerHTML = petSvg(pt.id, 56, 52);
      } else {
        pv.appendChild(el("span", "ixq", "?"));
      }
      c.appendChild(pv);
      c.appendChild(el("b", "", unlPt ? pt.n : "???"));
      const badge = eq
        ? "Equipped ✓"
        : unlPt
          ? "Unlocked"
          : pt.nb
            ? PLANETS[pt.pl].icon + " " + PLANETS[pt.pl].n
            : pt.st + "-day streak";
      const tg = el("span", "stag", badge);
      tg.style.background = eq ? "#3f9d63" : unlPt ? "var(--acc)" : "#8a8f98";
      c.appendChild(tg);
      c.appendChild(
        el(
          "div",
          "ixo",
          unlPt
            ? pt.d
            : pt.nb
              ? "Settle " + NB[pt.nb].n + " on " + PLANETS[pt.pl].n
              : "Keep a " + pt.st + "-day streak to unlock",
        ),
      );
      L.appendChild(c);
    });
  }
}
$("ixt-b").onclick = () => {
  ixTab = "b";
  fillIndex();
};
$("ixt-p").onclick = () => {
  ixTab = "p";
  fillIndex();
};
function openIx(tab) {
  if (tab) ixTab = tab;
  fillIndex();
  $("ix").classList.add("show");
}
$("ixh").onclick = () => openIx("b");
$("ixbtn").onclick = () => openIx("b");
$("go-ix").onclick = () => {
  $("pm").classList.remove("show");
  openIx("b");
};
$("ixdone").onclick = () => $("ix").classList.remove("show");
$("ix").onclick = (e) => {
  if (e.target === $("ix")) $("ix").classList.remove("show");
};
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
    // Morph SVG flame paths organically so the fire dances and licks upward
    if (tier.rate > 0 && p1) {
      const s = tier.rate;
      const w1 = Math.sin(t * 2.1) * (3.5 + s * 1.3),
        w2 = Math.cos(t * 2.8) * (3 + s * 1.2),
        w3 = Math.sin(t * 3.6) * (2.5 + s);
      const tipY = 4 - Math.abs(Math.sin(t * 2.4)) * (2 + s * 1.5);
      p1.setAttribute(
        "d",
        `M${(40 + w1).toFixed(1)} ${tipY.toFixed(1)}C${(45 + w2).toFixed(1)} 24 ${(68 + w1 * 0.7).toFixed(1)} 34 68 60C68 81 55 94 40 94C25 94 12 81 12 60C12 47 ${(20 - w2 * 0.7).toFixed(1)} 40 25 32C28 42 32 45 35 45C32 30 ${(35 + w1 * 0.6).toFixed(1)} 16 ${(40 + w1).toFixed(1)} ${tipY.toFixed(1)}Z`,
      );
      p2.setAttribute(
        "d",
        `M${(40 - w2 * 0.9).toFixed(1)} 26C${(44 + w3).toFixed(1)} 40 58 47 58 64C58 80 50 90 40 90C30 90 22 80 22 64C22 52 30 46 34 38C36 44 38 44 ${(40 - w2 * 0.9).toFixed(1)} 26Z`,
      );
      p3.setAttribute(
        "d",
        `M${(40 + w3 * 0.8).toFixed(1)} 44C43 55 52 60 52 72C52 83 46 89 40 89C34 89 28 83 28 72C28 63 34 58 36 51C38 55 39 55 ${(40 + w3 * 0.8).toFixed(1)} 44Z`,
      );
      p4.setAttribute(
        "d",
        `M${(40 - w1 * 0.5).toFixed(1)} 62C42 68 47 71 47 77C47 83 43 87 40 87C37 87 33 83 33 77C33 72 37 69 ${(40 - w1 * 0.5).toFixed(1)} 62Z`,
      );
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
      ctx.shadowColor = pt.col;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.r * pt.life, 0, Math.PI * 2);
      ctx.fill();
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
  $("ftier").textContent = tier.name;
  $("spm").textContent = tier.msg;
  const w = $("spw");
  w.innerHTML = "";
  for (let k = 6; k >= 0; k--) {
    const dt = new Date();
    dt.setDate(dt.getDate() - k);
    const key = dkey(dt),
      ok = !!S.days[key];
    const d = document.createElement("div");
    d.className = "wd" + (ok ? " ok" : "") + (k === 0 ? " td" : "");
    d.style.setProperty("--i", 6 - k);
    const l = document.createElement("span");
    l.textContent = dt.toLocaleDateString(undefined, { weekday: "narrow" });
    const c = document.createElement("i");
    c.textContent = ok ? "✓" : "";
    d.append(l, c);
    w.appendChild(d);
  }
  const num = $("spn");
  num.textContent = "0";
  sp.classList.add("show");
  startFireAnim(tier);
  let v = 0;
  const step = Math.max(1, Math.ceil(n / 18));
  if (n > 0) {
    const iv = setInterval(() => {
      v = Math.min(n, v + step);
      num.textContent = v;
      if (v >= n) clearInterval(iv);
    }, 45);
  }
}
$("spgo").onclick = () => {
  $("sp").classList.remove("show");
  stopFireAnim();
};
$("sp").onclick = (e) => {
  if (e.target === $("sp")) {
    $("sp").classList.remove("show");
    stopFireAnim();
  }
};
$("sb").onclick = (e) => {
  e.stopPropagation();
  showSplash(true);
};
