const TOUR_STEPS = [
  {
    icon: "✅",
    title: "Your daily checklist",
    before:
      "Open Habits to see today’s checklist. Each check-off earns XP for your progress.",
    after:
      "This is your daily page. Check habits as you finish them, track water and gratitude, and watch your streak grow.",
    open: "Open Habits",
    page: "h",
    target: "#list",
  },
  {
    icon: "🏘️",
    title: "Faith Town",
    before: "Open Town to visit the community your progress is building.",
    after:
      "This is Faith Town. Habit XP builds houses, unlocks ecosystems and planets, and fills the town with your buddies and pets.",
    open: "Open Town",
    page: "t",
    target: "#scene",
  },
  {
    icon: "🧑‍🤝‍🧑",
    title: "Your buddy profile",
    before: "Open your profile to meet your active buddy and equipped pet.",
    after:
      "This page controls your buddy, wardrobe, pets, name, profile saves, and rewards. Your buddy and pet also appear in the header button.",
    open: "Open Profile",
    page: "h",
    target: "#prof",
    profile: true,
  },
  {
    icon: "🐾",
    title: "Buddies, pets, and ecosystems",
    before: "Open the Buddy Index to browse everything you can collect.",
    after:
      "Each card shows the buddy or pet and its ecosystem. Use the tabs and planet filters to explore or equip unlocked rewards.",
    open: "Open Buddy Index",
    page: "h",
    target: "#ixh",
    index: true,
  },
];

let tourIndex = 0;
let tourPending = false;
let tourTarget = null;
let tourStepReady = false;

function closeTourPanels() {
  $("pm").classList.remove("show");
  $("ix").classList.remove("show");
}

function clearTourTarget() {
  if (tourTarget) tourTarget.classList.remove("tour-highlight");
  tourTarget = null;
}

function positionTour() {
  if (!tourTarget) return;
  const card = document.querySelector(".tour-card");
  if (!card) return;
  const r = tourTarget.getBoundingClientRect();
  card.classList.toggle("tour-card-top", r.top > innerHeight * 0.55);
}

function updateTourButtons() {
  $("tour-back").hidden = tourIndex === 0;
  $("tour-open").hidden = tourStepReady;
  $("tour-next").hidden = !tourStepReady;
  $("tour-next").textContent =
    tourIndex === TOUR_STEPS.length - 1 ? "OK" : "OK, next";
}

function renderTourStep() {
  const step = TOUR_STEPS[tourIndex];
  tourStepReady = false;
  clearTourTarget();
  closeTourPanels();
  if (PG !== step.page) go(step.page);
  $("tour-step").textContent = `${tourIndex + 1} of ${TOUR_STEPS.length}`;
  $("tour-icon").textContent = step.icon;
  $("tour-title").textContent = step.title;
  $("tour-text").textContent = step.before;
  $("tour-open").textContent = step.open;
  updateTourButtons();
  tourTarget = document.querySelector(step.target);
  if (tourTarget) tourTarget.classList.add("tour-highlight");
}

function openTourPage() {
  const step = TOUR_STEPS[tourIndex];
  if (step.page && PG !== step.page) go(step.page);
  if (step.profile) {
    view("menu");
    $("pm").classList.add("show");
  }
  if (step.index) openIx("b");
  tourStepReady = true;
  $("tour-text").textContent = step.after;
  updateTourButtons();
  clearTourTarget();
  tourTarget = document.querySelector(
    step.profile ? "#v-menu .banner" : step.index ? "#ix .sheet" : step.target,
  );
  if (tourTarget) {
    tourTarget.classList.add("tour-highlight");
    tourTarget.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  setTimeout(positionTour, 250);
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

function maybeStartTour() {
  if (S.tutorialDone || tourPending || !$("tour").hidden) return;
  if (!$("sp").classList.contains("show")) {
    tourPending = true;
    setTimeout(startTour, 450);
  }
}

function initTutorial() {
  $("tour-open").onclick = openTourPage;
  $("tour-next").onclick = () => {
    if (!tourStepReady) return;
    if (tourIndex < TOUR_STEPS.length - 1) {
      tourIndex += 1;
      renderTourStep();
    } else {
      finishTour();
      toast("You’re ready! Check off your first habit.");
    }
  };
  $("tour-back").onclick = () => {
    if (tourIndex > 0) {
      tourIndex -= 1;
      renderTourStep();
    }
  };
  $("tour-skip").onclick = finishTour;
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
