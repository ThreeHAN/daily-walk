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
    title: "Traveler's World",
    before: "Open World to see the town your traveler is helping.",
    after:
      "Habit XP helps your current town. Once it is helped, earn gear and choose another town on the world map.",
    open: "Open World",
    page: "t",
    target: "#scene",
  },
  {
    icon: "🧑‍🤝‍🧑",
    title: "Your traveler profile",
    before: "Open your profile to customize your traveler and equipped pet.",
    after:
      "Edit your pixel traveler's appearance, equip town gear, and manage pets, names, profiles, and rewards here.",
    open: "Open Profile",
    page: "h",
    target: "#prof",
    profile: true,
  },
  {
    icon: "👋",
    title: "People you meet",
    before: "Open the People Index to see the people you have met.",
    after:
      "Tap a person in a town to meet them. They will be remembered here with the town where you met.",
    open: "Open People Index",
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
  if (step.index) openIx();
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
