const petById = (id) => PETS.find((x) => x.id === id);
function petArt(pt) {
  if (!pt || !pt.art) return "";
  return (
    '<image href="' +
    pt.art +
    '" x="4" y="5" width="20" height="18" preserveAspectRatio="xMidYMid meet"/>'
  );
}
function petSvg(id, w, h) {
  const pt = petById(id);
  if (!pt) return "";
  return (
    '<svg viewBox="4 5 20 18" width="' +
    (w || 28) +
    '" height="' +
    (h || 26) +
    '" aria-hidden="true">' +
    petArt(pt) +
    "</svg>"
  );
}
function isPetUnlocked(pt, best) {
  if (!pt) return false;
  if (S.pets && S.pets[pt.id]) return true;
  if (pt.st && best >= pt.st) return true;
  if (pt.nb && S.nb && S.nb.xp && S.nb.xp[pt.nb] !== undefined) return true;
  return false;
}
function syncPetUnlocks(streak) {
  let newly = [];
  const best = Math.max(
    streak || 0,
    typeof streakBest === "function" ? streakBest() : 0,
  );
  PETS.forEach((pt) => {
    if (!S.pets[pt.id] && isPetUnlocked(pt, best)) {
      S.pets[pt.id] = 1;
      newly.push(pt);
    }
  });
  if (newly.length) {
    if (!S.p.pet || S.p.pet === "none") S.p.pet = newly[newly.length - 1].id;
    save();
    const last = newly[newly.length - 1];
    setTimeout(() => {
      toast("🐾 Unlocked pet: " + last.n + "! Check Wardrobe → Pets.");
      burst(innerWidth / 2, innerHeight / 3, 36, CONF);
    }, 1300);
  }
}
function headPetLayer(p, k) {
  const id = p && p.pet;
  const pt = petById(id);
  if (!pt) return "";
  // Position pet resting comfortably on top of the buddy's head/hat
  const hatOff = p.hat && p.hat !== "none" ? -5.5 : 0;
  const topY =
    (k === "rectangle" ? -6 : k === "triangle" ? -2 : k === "duck" ? -3 : -4) +
    hatOff;
  return (
    '<g class="head-pet" transform="translate(16 ' +
    topY +
    ') scale(.86)">' +
    petArt(pt) +
    "</g>"
  );
}
