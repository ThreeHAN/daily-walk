const { test, expect } = require("@playwright/test");
const { continueLocally } = require("./helpers/onboarding");
const { pathToFileURL } = require("node:url");
const path = require("node:path");

test("town and planet unlocks follow completion progress", async ({ page }) => {
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
  await continueLocally(page);
  const progress = await page.evaluate(() => {
    S.nb.cur = "meadow";
    S.nb.view = "meadow";
    S.nb.planet = "earth";
    S.nb.pcel = {};
    S.nb.xp = { meadow: 55 };
    const before = {
      home: nbState("meadow"),
      nextTown: nbState("seaside"),
      marsUnlocked: planetUnlocked("mars"),
    };
    S.nb.xp.meadow = MAXAT;
    const afterTown = nbState("seaside");
    for (const id of planetNbs("earth")) S.nb.xp[id] = MAXAT;
    return {
      before,
      afterTown,
      marsUnlocked: planetUnlocked("mars"),
      nextPlanet: nextPlanet(),
    };
  });
  expect(progress).toEqual({
    before: { home: "cur", nextTown: "locked", marsUnlocked: false },
    afterTown: "avail",
    marsUnlocked: true,
    nextPlanet: "mars",
  });
  await page.locator('button[data-p="t"]').evaluate((button) => button.click());
  await expect(page.locator("#pg-t")).toBeVisible();
  await expect(page.locator("#tc3")).toHaveText("3000");
  await expect(page.locator("#ncard")).toBeVisible();
});

test("town walkers alternate their steps and respect reduced motion", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 0, 1, 12));
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
  await continueLocally(page);
  const steps = await page.evaluate(() => {
    go("t");
    townStop();
    const walker = TW.ws[0].el;
    walker.classList.add("mv");
    const parts = [".bod", ".leg-l", ".leg-r", ".arm-l", ".arm-r"].map(
      (selector) => walker.querySelector(selector),
    );
    const animations = parts.map((part) => part.getAnimations()[0]);
    animations.forEach((animation) => animation.pause());
    const pose = (time) => {
      animations.forEach((animation) => { animation.currentTime = time; });
      return parts.map((part) => getComputedStyle(part).transform);
    };
    const first = pose(0);
    const middle = pose(160);
    const opposite = pose(320);
    walker.classList.remove("mv");
    const stopped = getComputedStyle(parts[1]).animationName;
    walker.classList.add("mv");
    return { first, middle, opposite, stopped };
  });
  expect(steps.first[1]).toBe(steps.first[4]);
  expect(steps.first[2]).toBe(steps.first[3]);
  expect(steps.first[1]).toBe(steps.opposite[2]);
  expect(steps.first[2]).toBe(steps.opposite[1]);
  expect(steps.first[0]).not.toBe(steps.middle[0]);
  expect(steps.first[1]).not.toBe(steps.opposite[1]);
  expect(steps.stopped).toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.locator("#walkers .w").first().evaluate((walker) =>
    [".bod", ".leg-l", ".leg-r", ".arm-l", ".arm-r"].map(
      (selector) => getComputedStyle(walker.querySelector(selector)).animationName,
    ),
  )).toEqual(["none", "none", "none", "none", "none"]);
});

test("town birds fly and flap, while reduced motion keeps them still in the sky", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
  await continueLocally(page);
  await page.evaluate(() => go("t"));
  const birds = page.locator("#town-birds .fly");
  await expect(birds).toHaveCount(3);
  const colors = await birds.evaluateAll((elements) => elements.map((bird) => ({
    body: bird.querySelector(".bird-body").getAttribute("fill"),
    belly: bird.querySelector(".bird-belly").getAttribute("fill"),
  })));
  expect(new Set(colors.map((bird) => bird.body)).size).toBe(3);
  expect(new Set(colors.map((bird) => bird.belly)).size).toBe(1);
  const positions = await birds.evaluateAll((elements) => {
    const animations = elements.map((bird) => bird.getAnimations()[0]);
    animations.forEach((animation) => animation.pause());
    const at = (time) => {
      animations.forEach((animation) => { animation.currentTime = time; });
      return elements.map((bird) => new DOMMatrix(getComputedStyle(bird).transform).m41);
    };
    return { gap: at(20000), next: at(30000), later: at(60000) };
  });
  expect(positions.gap.every((x) => x >= 360)).toBe(true);
  expect(positions.next.filter((x) => x > -30 && x < 360)).toHaveLength(1);
  expect(positions.later.filter((x) => x > -30 && x < 360)).toHaveLength(1);
  const motion = await birds.first().evaluate((bird) => {
    const wing = bird.querySelector(".flap");
    const flight = bird.getAnimations()[0];
    const flap = wing.getAnimations()[0];
    flight.pause();
    flap.pause();
    flight.currentTime = 0;
    flap.currentTime = 0;
    const first = [getComputedStyle(bird).transform, getComputedStyle(wing).transform];
    flight.currentTime = 4000;
    flap.currentTime = 300;
    return { first, second: [getComputedStyle(bird).transform, getComputedStyle(wing).transform] };
  });
  expect(motion.first[0]).not.toBe(motion.second[0]);
  expect(motion.first[1]).not.toBe(motion.second[1]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const still = await birds.evaluateAll((elements) => elements.map((bird) => ({
    flight: getComputedStyle(bird).animationName,
    flap: getComputedStyle(bird.querySelector(".flap")).animationName,
    x: new DOMMatrix(getComputedStyle(bird).transform).m41,
    pointerEvents: getComputedStyle(bird).pointerEvents,
  })));
  expect(still).toHaveLength(3);
  for (const bird of still) {
    expect(bird.flight).toBe("none");
    expect(bird.flap).toBe("none");
    expect(bird.x).toBeGreaterThan(0);
    expect(bird.x).toBeLessThan(345);
    expect(bird.pointerEvents).toBe("none");
  }
  expect(errors).toEqual([]);
});

test("buddy stats show totals and ties, refresh while open, and preserve data", async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 0, 1, 12) });
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
  await continueLocally(page);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.evaluate(() => {
    S.p.buddy = "Pal 🌙 <b>";
    S.bs = { born: Date.now() - 60000, clicks: 1, tasks: 2 };
    S.res = [
      { n: "Resident ⭐", l: npcLook(0), born: Date.now() - 120000, clicks: 4, tasks: 2 },
      { n: "Other", l: npcLook(1), born: Date.now() - 180000, clicks: 4, tasks: 0 },
    ];
  });
  await page.locator("#sbtn").evaluate((button) => button.click());
  const cards = page.locator("#slist .scard");
  await expect(page.locator("#sm")).toHaveClass(/show/);
  await expect(cards).toHaveCount(3);
  await expect(page.locator("#ssum")).toContainText("3 buddies");
  await expect(page.locator("#ssum")).toContainText("4 tasks");
  await expect(page.locator("#ssum")).toContainText("9 taps");
  await expect(cards.first().locator(".sinf > b")).toContainText("<b>");
  await expect(cards.first().locator(".sinf > b .ic svg")).toHaveCount(1);
  await expect(cards.locator(".spv svg")).toHaveCount(3);
  await expect(cards.first()).toContainText("Tapped 1 time");
  await expect(cards.first()).toContainText("Most tasks");
  await expect(cards.nth(1)).toContainText("Most tasks");
  await expect(cards.nth(1)).toContainText("Most clicked");
  await expect(cards.nth(2)).toContainText("Most clicked");
  await expect(cards.first()).toContainText("1 min");

  const saved = await page.evaluate(() => {
    S.bs.clicks = 7;
    return JSON.stringify({ stats: S.bs, residents: S.res });
  });
  await page.clock.fastForward(60000);
  await expect(page.locator("#ssum")).toContainText("15 taps");
  await expect(cards.first()).toContainText("Most clicked");
  await expect(cards.nth(1)).not.toContainText("Most clicked");
  await expect(cards.first()).toContainText("2 min");
  expect(await page.evaluate(() => JSON.stringify({ stats: S.bs, residents: S.res }))).toBe(saved);
  await page.locator("#sdone").evaluate((button) => button.click());
  await expect(page.locator("#sm")).not.toHaveClass(/show/);

  await page.evaluate(() => {
    S.res = [];
    S.bs.clicks = 0;
    S.bs.tasks = 0;
  });
  await page.locator("#sbtn").evaluate((button) => button.click());
  await expect(page.locator("#ssum")).toContainText("1 buddy");
  await expect(cards).toHaveCount(1);
  await expect(cards.first().locator(".hot")).toHaveCount(0);
  await page.locator("#sm").evaluate((modal) => modal.click());
  await expect(page.locator("#sm")).not.toHaveClass(/show/);
  expect(errors).toEqual([]);
});

test("buddy details switch between traveler and pet without changing their saved data", async ({ page }) => {
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
  await continueLocally(page);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const before = await page.evaluate(() => {
    const saved = JSON.stringify(S);
    openBuddyModal({
      k: "me", n: "Pal 🌙 <b>", p: { ...S.p, pet: "puppy" },
      ref: { born: Date.now() - 60000, clicks: 4, tasks: 3 },
    }, "b");
    return saved;
  });
  const body = page.locator("#bbody");
  await expect(page.locator("#bm")).toHaveClass(/show/);
  await expect(page.locator("#bslides")).toBeVisible();
  await expect(body.locator("h4")).toContainText("<b>");
  await expect(body.locator("h4 .ic svg")).toHaveCount(1);
  await expect(body.locator(".bstage svg")).toHaveCount(1);
  await expect(body.locator(".head-pet")).toHaveCount(0);
  await expect(body).toContainText("Traveler");
  await expect(body).toContainText("Times Tapped");
  await expect(body).toContainText("4");
  await expect(body).toContainText("Tasks Together");
  await page.locator("#bsl-p").evaluate((button) => button.click());
  await expect(page.locator("#bsl-p")).toHaveClass(/on/);
  await expect(body).toContainText("Unlock Streak");
  await expect(body).toContainText("Favorite Spot");
  await expect(body.locator(".bstage svg image")).toHaveCount(1);
  await page.locator("#bsl-b").evaluate((button) => button.click());
  await expect(body).toContainText("Traveler");
  await expect(body.locator("h4 .ic svg")).toHaveCount(1);
  expect(await page.evaluate(() => JSON.stringify(S))).toBe(before);
  await page.locator("#bdone").evaluate((button) => button.click());
  await expect(page.locator("#bm")).not.toHaveClass(/show/);

  await page.evaluate(() => openBuddyModal({
    k: "local", n: "Person", town: "meadow", p: { ...S.p, pet: "none" },
  }, "p"));
  await expect(page.locator("#bslides")).toBeHidden();
  await expect(body).toContainText("Person met");
  await expect(body).toContainText("Meadow Valley");
  await expect(body).toContainText("None");
  await page.locator("#bm").evaluate((modal) => modal.click());
  await expect(page.locator("#bm")).not.toHaveClass(/show/);
  expect(errors).toEqual([]);
});

test("resident companions follow their owners without changing player or resident saves", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 0, 1, 12));
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
  await continueLocally(page);
  const before = await page.evaluate(() => {
    S.nb.cur = "meadow";
    S.p.pet = "puppy";
    S.pets = {};
    S.res = Array.from({ length: NBK.length + 1 }, (_, i) => ({
      n: "Resident " + i,
      l: { ...npcLook(i), pet: i === 0 ? "kitten" : "none" },
    }));
    S.vday = today();
    const saved = JSON.stringify({ player: S.p, pets: S.pets, residents: S.res });
    go("t");
    return {
      saved,
      companions: TW.pets.map((pet) => [pet.owner.id || "traveler", pet.id]),
      residents: TW.ws.filter((w) => w.k !== "me").length,
      headPets: document.querySelectorAll("#walkers .head-pet").length,
    };
  });
  expect(before.residents).toBe(5);
  expect(before.companions).toHaveLength(3);
  expect(before.companions).toContainEqual(["traveler", "puppy"]);
  expect(before.companions).toContainEqual(["resident:0", "kitten"]);
  expect(before.headPets).toBe(0);
  const resident = before.companions.find(([id]) => id.startsWith("town:"));
  const initialDistance = await page.evaluate((id) => {
    const pet = TW.pets.find((item) => item.owner.id === id);
    pet.owner.pause = 10;
    pet.x = pet.owner.x - 80;
    pet.y = pet.owner.y;
    return Math.abs(pet.x - pet.owner.x);
  }, resident[0]);
  await expect.poll(() => page.evaluate((id) => {
    const pet = TW.pets.find((item) => item.owner.id === id);
    return Math.abs(pet.x - pet.owner.x);
  }, resident[0])).toBeLessThan(initialDistance - 5);
  await page.locator(`.tpet[data-owner="${resident[0]}"]`).evaluate((pet) => pet.click());
  await expect(page.locator("#bbody")).toContainText("Town companion");
  await expect(page.locator("#bbody")).not.toContainText("Unlock Streak");
  await page.locator("#bsl-b").evaluate((button) => button.click());
  await expect(page.locator("#bbody")).toContainText("Person met");
  await expect(page.locator("#bbody")).toContainText("Companion");
  await page.locator("#bsl-p").evaluate((button) => button.click());
  await expect(page.locator("#bbody")).toContainText("Town companion");
  const after = await page.evaluate(() => {
    townInit();
    return {
      saved: JSON.stringify({ player: S.p, pets: S.pets, residents: S.res }),
      companions: TW.pets.map((pet) => [pet.owner.id || "traveler", pet.id]),
    };
  });
  expect(after).toEqual({ saved: before.saved, companions: before.companions });
});

test("people sleep in built homes overnight and wake in every town", async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 0, 1, 19, 59) });
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
  await continueLocally(page);
  await page.evaluate(() => {
    S.res = freshState("").res;
    S.nb.cur = "meadow";
    S.nb.xp.meadow = 0;
    S.vday = today();
    go("t");
  });
  await expect(page.locator("#walkers")).toBeVisible();
  await expect(page.locator(".sleep-z")).toHaveCount(1);
  await expect(page.locator(".sleep-z")).toBeHidden();
  await page.clock.fastForward(60_000);
  await expect(page.locator("#walkers")).toBeHidden();
  await expect(page.locator(".sleep-z")).toBeVisible();
  await page.evaluate(() => townInit());
  await expect(page.locator("#walkers")).toBeHidden();
  await page.evaluate(() => {
    S.nb.cur = "mars_meadow";
    S.nb.xp.mars_meadow = 270;
    townOpen();
  });
  await expect(page.locator("#walkers")).toBeHidden();
  await expect(page.locator(".sleep-z")).toHaveCount(2);
  await expect(page.locator(".sleep-z").first()).toBeVisible();
  await page.clock.fastForward(11 * 60 * 60 * 1000);
  await expect(page.locator("#walkers")).toBeVisible();
  await expect(page.locator(".sleep-z").first()).toBeHidden();
  await expect(page.locator("#walkers .w")).toHaveCount(5);
});
