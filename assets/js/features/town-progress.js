const builtN = () => BLD.filter((b) => nbXp(S.nb.cur) >= b.at).length;
const maxed = () => lvOf(S.xp) >= 10;

function nbXp(id) {
  return S.nb.xp[id] || 0;
}
const MAXAT = BLD[BLD.length - 1].at;
const nbDone = (id) => nbXp(id) >= MAXAT;
const nbBuilt = (id) => BLD.filter((b) => nbXp(id) >= b.at);
const planetDone = (pl) => planetNbs(pl).every((k) => nbDone(k));
const worldDone = () => planetDone(S.nb.planet || "earth");
const solarDone = () => PLANET_LIST.every((pl) => planetDone(pl));
function planetUnlocked(pl) {
  const idx = PLANET_LIST.indexOf(pl);
  if (idx <= 0) return true;
  if (S.nb.pcel && S.nb.pcel[pl]) return true;
  return planetDone(PLANET_LIST[idx - 1]);
}
function nextPlanet() {
  const curPl = S.nb.planet || "earth";
  const idx = PLANET_LIST.indexOf(curPl);
  return idx >= 0 && idx < PLANET_LIST.length - 1 ? PLANET_LIST[idx + 1] : null;
}
function nbState(id) {
  if (id === S.nb.cur) return nbDone(id) ? "done" : "cur";
  return nbDone(S.nb.cur) ? "avail" : "locked";
}
function checkNbWin() {
  const c = S.nb.cur;
  if (nbDone(c) && !S.nb.cel[c]) {
    S.nb.cel[c] = 1;
    save();
    setTimeout(() => {
      toast(NB[c].n + " is helped! Your town gear is ready in the wardrobe.");
      burst(innerWidth / 2, innerHeight / 3, 50, CONF);
    }, 1800);
  }
}
