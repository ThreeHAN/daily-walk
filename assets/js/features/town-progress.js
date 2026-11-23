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
  const pl = NB[id] ? NB[id].pl : "earth";
  if (!planetUnlocked(pl)) return "locked";
  if (id === S.nb.cur) return nbDone(id) ? "done" : "cur";
  if (S.nb.xp[id] !== undefined) return nbDone(id) ? "done" : "visited";
  const anyInPlanet = planetNbs(pl).some((k) => S.nb.xp[k] !== undefined);
  if (!anyInPlanet) return "avail";
  return nbDone(S.nb.cur) ? "avail" : "locked";
}
function checkNbWin() {
  const c = S.nb.cur,
    pl = NB[c] ? NB[c].pl : "earth";
  if (nbDone(c) && !S.nb.cel[c]) {
    S.nb.cel[c] = 1;
    save();
    const nxPl = nextPlanet();
    if (planetDone(pl) && nxPl) {
      setTimeout(() => {
        toast(
          "🚀 " +
            PLANETS[pl].n +
            " is 100% complete! " +
            PLANETS[nxPl].n +
            " is now unlocked on the Solar Map!",
        );
        burst(innerWidth / 2, innerHeight / 3, 65, CONF);
      }, 1800);
    } else {
      setTimeout(() => {
        toast(
          NB[c].n +
            " is complete! Open the Solar Map to choose your next ecosystem.",
        );
        burst(innerWidth / 2, innerHeight / 3, 50, CONF);
      }, 1800);
    }
  }
}
