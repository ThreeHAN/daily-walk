const TOUR_STEPS = [
  {
    icon: "check",
    title: "Your daily checklist",
    before: "Tap the highlighted Habits button to see your daily checklist.",
    after: "Check a habit when you finish it. Open or close a category by tapping its heading; your checks are saved for today.",
    page: "h",
    target: '.nv[data-p="h"]',
    afterTarget: "#list",
  },
  {
    icon: "star",
    title: "XP, levels and streaks",
    before: "Tap the highlighted Profile button to see your progress.",
    after: "Habits earn XP; completing a category or the whole checklist earns a bonus. Each award is earned once per day. Complete your day to grow your streak.",
    page: "h",
    target: "#prof",
    afterTarget: "#v-menu .banner",
  },
  {
    icon: "drop",
    title: "Water and journal",
    before: "Tap Habits to find your water tracker and journal.",
    after: "Tap cups to track water; reaching your goal checks the water habit. Save a journal entry for XP once a day. Water resets daily; past entries stay in your journal.",
    page: "h",
    target: '.nv[data-p="h"]',
    afterTarget: "#water-journal",
  },
  {
    icon: "town",
    title: "Helping your town",
    before: "Tap World to visit your traveler's current town.",
    after: "Habit XP helps your current town and unlocks buildings. Help it reach 3,000 XP to earn town gear and unlock travel to another town.",
    page: "h",
    target: '.nv[data-p="t"]',
    afterTarget: "#scene",
  },
  {
    icon: "globe",
    title: "Explore the world",
    before: "Tap the World map button to see all the towns.",
    after: "Drag the globe side to side or choose a town below it. Once your current town is helped, use Travel here; returning towns keep their progress.",
    page: "t",
    target: "#wbtn",
    afterTarget: "#gl .glb",
  },
  {
    icon: "book",
    title: "People you meet",
    before: "Tap People index to see the people you have met.",
    after: "Tap a person in town to meet them. Find them here by name or town. At night, people and their pets sleep in their homes.",
    page: "t",
    target: "#ixbtn",
    afterTarget: "#ix .sheet",
  },
  {
    icon: "wardrobe",
    title: "Your traveler and gear",
    before: "Tap Wardrobe & traveler to open your wardrobe.",
    after: "Open Wardrobe & traveler to change your appearance, clothes and pet. Town gear and level rewards appear there as you unlock them.",
    page: "h",
    prepare: "profile",
    target: "#go-wd",
    afterTarget: "#v-wd",
  },
  {
    icon: "star",
    title: "Levels and rewards",
    before: "Tap Levels & rewards to see what your traveler can earn.",
    after: "Levels & rewards shows your progress and unlocks. Warrior gear unlocks at certain levels; town rewards come from helping towns.",
    page: "h",
    prepare: "profile",
    target: "#go-lv",
    afterTarget: "#v-lv",
  },
  {
    icon: "trophy",
    title: "Ranks and friend codes",
    before: "Tap Ranks to see the leaderboard.",
    after: "Switch between XP, streak, towns helped and check-offs. Copy a friend code or add one to include a friend in your local leaderboard.",
    page: "h",
    target: '.nv[data-p="l"]',
    afterTarget: ".lb-tabs",
  },
  {
    icon: "profile-card",
    title: "Profiles and backups",
    before: "Tap My info to find your profiles and backups.",
    after: "In My info, create or switch profiles and export a save file. Restoring a backup replaces the active profile. Google sign-in and automatic sync are in the profile menu.",
    page: "h",
    prepare: "profile",
    target: "#go-info",
    afterTarget: "#v-info .acct-box",
  },
];

let tourIndex = 0;
let tourPending = false;
let tourTarget = null;
let tourStepReady = false;
let tourFrame = 0;
let tourPositionKey = "";

function closeTourPanels() {
  $("pm").classList.remove("show");
  $("ix").classList.remove("show");
  $("hm").classList.remove("show");
  if ($("gl").classList.contains("show")) {
    $("gl").classList.remove("show");
    stopGlobe();
  }
}

function clearTourTarget() {
  if (tourTarget) tourTarget.classList.remove("tour-highlight", "tour-interactive", "tour-scrollable");
  tourTarget = null;
}

function tourVisibleBottom() {
  if (!tourTarget.closest("main")) return innerHeight;
  const nav = $("nav");
  const bounds = nav.getBoundingClientRect();
  return bounds.height && getComputedStyle(nav).visibility === "visible"
    ? Math.max(0, Math.min(innerHeight, bounds.top)) : innerHeight;
}

function tourTargetNeedsScroll() {
  const bounds = tourTarget.getBoundingClientRect();
  let availableHeight = tourVisibleBottom();
  if (tourTarget.closest("main")) {
    const card = document.querySelector("#tour .tour-card");
    if (card && bounds.height + card.offsetHeight + 24 > availableHeight) return true;
  }
  for (let element = tourTarget; element && element !== document.body; element = element.parentElement) {
    const overflow = getComputedStyle(element).overflowY;
    if (overflow === "auto" || overflow === "scroll") {
      if (element === tourTarget && element.scrollHeight > element.clientHeight + 1) return true;
      availableHeight = Math.min(availableHeight, element.clientHeight);
    }
  }
  return bounds.height > availableHeight + 1;
}

function renderTourCard() {
  tourPositionKey = "";
  DailyWalkReact.renderTutorial({
    step: TOUR_STEPS[tourIndex],
    index: tourIndex,
    total: TOUR_STEPS.length,
    ready: tourStepReady,
    icon: icoSvg,
    onBack: previousTourStep,
    onNext: nextTourStep,
    onSkip: finishTour,
  });
}

function positionTour() {
  const spotlight = $("tour-spotlight");
  const card = document.querySelector("#tour .tour-card");
  if (!tourTarget || !spotlight || !card) return;
  if (tourStepReady) {
    const scrollable = tourTargetNeedsScroll();
    tourTarget.classList.toggle("tour-scrollable", scrollable);
    document.body.classList.toggle("tour-review", scrollable);
  }
  const bounds = tourTarget.getBoundingClientRect();
  const visibleBottom = tourVisibleBottom();
  const key = [bounds.left, bounds.top, bounds.right, bounds.bottom, innerWidth, innerHeight,
    visibleBottom, card.scrollHeight].join(",");
  if (key === tourPositionKey) return;
  tourPositionKey = key;
  const left = Math.max(0, bounds.left);
  const top = Math.max(0, bounds.top);
  const right = Math.min(innerWidth, bounds.right);
  const bottom = Math.min(visibleBottom, bounds.bottom);
  spotlight.hidden = right <= left || bottom <= top;
  if (!spotlight.hidden) {
    Object.assign(spotlight.style, {
      left: left + "px", top: top + "px",
      width: (right - left) + "px", height: (bottom - top) + "px",
    });
  }
  card.style.maxHeight = "";
  const height = card.getBoundingClientRect().height;
  const above = Math.max(0, top - 24);
  const below = Math.max(0, visibleBottom - bottom - 24);
  const placeBelow = below >= height || (above < height && below > above);
  const available = placeBelow ? below : above;
  if (available < height && !tourStepReady) {
    card.style.maxHeight = Math.max(1, available) + "px";
  }
  const actualHeight = card.getBoundingClientRect().height;
  card.style.top = (placeBelow ? visibleBottom - actualHeight - 12 : 12) + "px";
}

function trackTourPosition() {
  positionTour();
  tourFrame = requestAnimationFrame(trackTourPosition);
}

function renderTourStep() {
  const step = TOUR_STEPS[tourIndex];
  tourStepReady = false;
  document.body.classList.remove("tour-review");
  clearTourTarget();
  closeTourPanels();
  if (PG !== step.page) go(step.page);
  if (step.prepare === "profile") {
    view("menu");
    $("pm").classList.add("show");
  }
  renderTourCard();
  tourTarget = document.querySelector(step.target);
  if (tourTarget) {
    tourTarget.classList.add("tour-highlight", "tour-interactive");
    tourTarget.scrollIntoView({ behavior: "instant", block: "center" });
    positionTour();
    tourTarget.focus({ preventScroll: true });
  }
}

function completeTourAction() {
  const step = TOUR_STEPS[tourIndex];
  tourStepReady = true;
  clearTourTarget();
  tourTarget = document.querySelector(step.afterTarget);
  renderTourCard();
  if (tourTarget) {
    tourTarget.classList.add("tour-highlight");
    tourTarget.scrollIntoView({ behavior: "instant", block: step.afterTarget === "#water-journal" ? "start" : "center" });
    positionTour();
  }
  $("tour-next").focus({ preventScroll: true });
}

function startTour() {
  tourPending = false;
  tourIndex = 0;
  tourStepReady = false;
  $("tour").hidden = false;
  document.body.classList.add("tour-open");
  renderTourStep();
  cancelAnimationFrame(tourFrame);
  tourFrame = requestAnimationFrame(trackTourPosition);
}

function finishTour() {
  cancelAnimationFrame(tourFrame);
  tourFrame = 0;
  clearTourTarget();
  closeTourPanels();
  $("tour").hidden = true;
  document.body.classList.remove("tour-open", "tour-review");
  S.tutorialDone = true;
  save();
}

function nextTourStep() {
  if (!tourStepReady) return;
  if (tourIndex < TOUR_STEPS.length - 1) {
    tourIndex += 1;
    renderTourStep();
  } else {
    finishTour();
    toast("You’re ready! Check off your first habit.");
  }
}

function previousTourStep() {
  if (tourIndex > 0) {
    tourIndex -= 1;
    renderTourStep();
  }
}

function maybeStartTour() {
  if (startupPending || S.tutorialDone || tourPending || !$("tour").hidden) return;
  if (!$("sp").classList.contains("show")) {
    tourPending = true;
    setTimeout(() => {
      tourPending = false;
      if (!startupPending && !S.tutorialDone && $("tour").hidden) startTour();
    }, 450);
  }
}

function startTourFromProfile() {
  $("pm").classList.remove("show");
  startTour();
}

function initTutorial() {
  document.addEventListener("click", (event) => {
    if ($("tour").hidden || $("tour").contains(event.target)) return;
    if (!tourStepReady && tourTarget && tourTarget.contains(event.target)) {
      const step = tourIndex;
      setTimeout(() => {
        if (!$("tour").hidden && !tourStepReady && tourIndex === step) completeTourAction();
      }, 0);
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
  $("spgo").addEventListener("click", () => setTimeout(maybeStartTour, 150));
  $("sp").addEventListener("click", (event) => {
    if (event.target === $("sp")) setTimeout(maybeStartTour, 150);
  });
  addEventListener("resize", positionTour);
  document.addEventListener("scroll", positionTour, true);
  maybeStartTour();
}
