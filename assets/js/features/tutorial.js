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
    icon: "plus",
    title: "Add your own habits",
    before: "Tap the highlighted New habit button to open the habit editor.",
    after: "Use New habit to add a name, category, icon and optional reason. To remove a custom habit, tap its trash button twice.",
    page: "h",
    target: "#fab",
    afterTarget: "#hm .sheet",
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
    afterTarget: "#cups",
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
    after: "In My info, create or switch profiles and export a save file. Restoring a backup replaces the active profile; saves stay on this browser unless exported.",
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
let tourCardTop = false;

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
  if (tourTarget) tourTarget.classList.remove("tour-highlight", "tour-interactive");
  tourTarget = null;
}

function renderTourCard() {
  DailyWalkReact.renderTutorial({
    step: TOUR_STEPS[tourIndex],
    index: tourIndex,
    total: TOUR_STEPS.length,
    ready: tourStepReady,
    cardTop: tourCardTop,
    icon: icoSvg,
    onBack: previousTourStep,
    onNext: nextTourStep,
    onSkip: finishTour,
  });
}

function positionTour() {
  if (!tourTarget) return;
  const bounds = tourTarget.getBoundingClientRect();
  const top = bounds.top + bounds.height / 2 >= innerHeight / 2;
  if (top !== tourCardTop) {
    tourCardTop = top;
    renderTourCard();
  }
}

function renderTourStep() {
  const step = TOUR_STEPS[tourIndex];
  tourStepReady = false;
  tourCardTop = false;
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
    tourTarget.scrollIntoView({ behavior: "instant", block: "center" });
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
}

function finishTour() {
  clearTourTarget();
  closeTourPanels();
  $("tour").hidden = true;
  document.body.classList.remove("tour-open");
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
  if (S.tutorialDone || tourPending || !$("tour").hidden) return;
  if (!$("sp").classList.contains("show")) {
    tourPending = true;
    setTimeout(() => {
      tourPending = false;
      if (!S.tutorialDone && $("tour").hidden) startTour();
    }, 450);
  }
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
  $("go-tour").onclick = () => {
    $("pm").classList.remove("show");
    startTour();
  };
  $("spgo").addEventListener("click", () => setTimeout(maybeStartTour, 150));
  $("sp").addEventListener("click", (event) => {
    if (event.target === $("sp")) setTimeout(maybeStartTour, 150);
  });
  addEventListener("resize", positionTour);
  maybeStartTour();
}
