// Spread all towns across one globe, with stable coordinates for saved town IDs.
const GP = Object.fromEntries(
  NBK.map((id, i) => [
    id,
    [
      ((i * 137.507764 + 180) % 360) - 180,
      (Math.asin(1 - (2 * (i + 0.5)) / NBK.length) * 180) / Math.PI,
    ],
  ]),
);
const GLB = {
  lon: 15,
  lat: 0,
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
const LAND_SHAPES = [
  [[-170, 35], [-160, 55], [-140, 68], [-110, 63], [-95, 48], [-105, 25], [-85, 10], [-100, 2], [-120, 15], [-150, 20]],
  [[-92, 8], [-75, 12], [-52, 0], [-45, -18], [-58, -50], [-72, -55], [-80, -28]],
  [[-25, 35], [-8, 60], [28, 62], [50, 50], [78, 60], [125, 50], [160, 32], [150, 5], [118, -4], [95, 15], [70, 5], [42, 25], [20, 35], [-2, 33]],
  [[-18, 30], [10, 37], [38, 24], [50, 5], [32, -35], [15, -37], [-2, -20], [-15, 0], [-25, 16]],
  [[110, -10], [140, -10], [155, -25], [145, -42], [120, -42], [108, -30]],
];
function landContains(shape, lon, lat) {
  let inside = false;
  for (let i = 0, j = shape.length - 1; i < shape.length; j = i++) {
    const [xi, yi] = shape[i],
      [xj, yj] = shape[j];
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}
const LAND_MAP = Array.from({ length: 60 }, (_, y) =>
  Array.from({ length: 120 }, (_, x) =>
    LAND_SHAPES.some((shape) => landContains(shape, x * 3 - 178.5, y * 3 - 88.5)),
  ),
);
function gLandSvg() {
  const tilt = GLB.lat * Math.PI / 180,
    ct = Math.cos(tilt),
    st = Math.sin(tilt),
    step = 4;
  let d = "";
  for (let y = 12; y < 228; y += step) {
    let start = -1;
    for (let x = 12; x <= 228; x += step) {
      const sx = (x + step / 2 - 120) / 108,
        sy = (120 - y - step / 2) / 108,
        radius = sx * sx + sy * sy;
      let land = false;
      if (x < 228 && radius < 1) {
        const z = Math.sqrt(1 - radius),
          lat = Math.asin(sy * ct + z * st) * 180 / Math.PI,
          lon = Math.atan2(sx, z * ct - sy * st) * 180 / Math.PI - GLB.lon,
          col = Math.floor((((lon + 180) % 360 + 360) % 360) / 3),
          row = Math.min(59, Math.max(0, Math.floor((lat + 90) / 3)));
        land = LAND_MAP[row][col];
      }
      if (land && start < 0) start = x;
      if (!land && start >= 0) {
        const width = x - start;
        d += "M" + start + " " + y + "h" + width + "v" + step + "h-" + width + "z";
        start = -1;
      }
    }
  }
  return '<path d="' + d + '" fill="#64b96b"/>';
}
function renderGlobeFrame() {
  const plCfg = PLANETS.earth;
  $("gs0").setAttribute("stop-color", plCfg.sea[0]);
  $("gs1").setAttribute("stop-color", plCfg.sea[1]);
  $("gs2").setAttribute("stop-color", plCfg.sea[2]);
  $("ghalo").setAttribute("fill", plCfg.halo);
  $("gringb").setAttribute("opacity", plCfg.ring ? "1" : "0");
  $("gringf").setAttribute("opacity", plCfg.ring ? "1" : "0");
  $("gland").innerHTML = gLandSvg();
  const vis = NBK
    .map((id) => {
      const g = GP[id],
        p = gProj(g[0], g[1]);
      return { id, p };
    })
    .sort((a, b) => a.p.z - b.p.z);
  let isl = "",
    pins = "";
  vis.forEach(({ id, p }) => {
    if (p.z <= 0.02) return;
    const sc = 0.55 + 0.45 * p.z,
      fo = Math.min(1, p.z * 3.2).toFixed(2);
    const rx = (8 * sc).toFixed(1),
      ry = (5 * sc * (0.65 + 0.35 * Math.abs(p.z))).toFixed(1);
    const c = NB[id],
      st = nbState(id);
    isl +=
      '<g class="isl' +
      (st === "locked" ? " lk" : "") +
      '" data-id="' +
      id +
      '" opacity="' +
      fo +
      '">' +
      R(Math.round(p.x - rx), Math.round(p.y - ry), Math.round(rx * 2), Math.round(ry * 2), c.gr[1]) +
      R(Math.round(p.x - rx * 0.75), Math.round(p.y - ry - 2 * sc), Math.round(rx * 1.5), Math.round(ry), c.gr[0]);
    isl += "</g>";
    if (p.z > 0.12) {
      const ic =
        id === S.nb.cur
          ? "house"
          : nbDone(id)
            ? "check"
            : st === "locked"
              ? "lock"
              : "sparkle";
      const ps = (0.42 + 0.12 * p.z).toFixed(2),
        po = Math.min(1, (p.z - 0.12) * 4).toFixed(2);
      pins +=
        '<g class="pin' +
        (st === "avail" ? " av" : "") +
        (id === S.nb.cur ? " me" : "") +
        '" data-id="' +
        id +
        '" opacity="' +
        po +
        '" transform="translate(' +
        p.x.toFixed(1) +
        " " +
        (p.y - +ry - 4 * sc).toFixed(1) +
        ") scale(" +
        ps +
        ')"><g class="pinb">' + R(-10, -10, 20, 20, c.ac) + R(-7, -7, 14, 14, "#fff") +
        '<g transform="translate(-6 -6) scale(.5)">' +
        ICONS[ic] +
        "</g></g></g>";
    }
  });
  $("gisl").innerHTML = isl;
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
function drawWorld() {
  $("glt").textContent = "🌍 Your world";
  renderGlobeFrame();
  const doneCnt = NBK.filter((k) => nbDone(k)).length;
  $("glh").textContent =
    "Drag side to side to spin · " +
    doneCnt +
    " of " + NBK.length + " towns helped";
  DailyWalkReact.renderWorldTownList({
    towns: [S.nb.cur, ...NBK.filter((id) => id !== S.nb.cur)].map((id) => {
      const town = NB[id];
      const current = id === S.nb.cur;
      const done = nbDone(id);
      const canTravel = !current && nbState(id) === "avail";
      return {
        id,
        current,
        selected: gsel === id,
        canTravel,
        name: town.n,
        description: town.d,
        color: town.ac,
        percent: Math.min(100, (nbXp(id) / MAXAT) * 100),
        background: "linear-gradient(180deg," + town.sky[0] + "," +
          town.sky[1] + " 50%," + town.sky[1] + " 50%," +
          town.gr[0] + " 50%," + town.gr[0] + " 75%," +
          town.gr[1] + " 75%," + town.gr[1] + ")",
        status: current ? (done ? "Current town · helped" : "Current town")
          : canTravel ? (done ? "Helped · travel here" : "Ready to help")
            : "Help " + NB[S.nb.cur].n + " before leaving",
        reward: (done ? "Earned: " : "Town reward: ") + townRewardNames(id),
      };
    }),
    onTravel: settle,
    icon: icoSvg,
    iconTextParts,
  });
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
  const g = GP[V()] || GP.meadow;
  GLB.lon = -g[0];
  GLB.lat = 0;
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
  if (!NB[id]) {
    toast("That town is not on the world map.");
    return;
  }
  if (id === S.nb.cur) return;
  if (!nbDone(S.nb.cur)) {
    toast("Help " + NB[S.nb.cur].n + " before traveling.");
    return;
  }
  const newPl = (NB[id] && NB[id].pl) || "earth";
  if (S.nb.xp[id] === undefined) S.nb.xp[id] = 0;
  S.nb.cur = id;
  S.nb.view = id;
  S.nb.planet = newPl;
  S.nb.vplanet = newPl;
  if (S.nb.seen[id] === undefined) S.nb.seen[id] = 0;
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
    "linear-gradient(180deg," + c.sky[0] + " 50%," + c.sky[1] + " 50%)";
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
