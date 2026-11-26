const { test, expect } = require("@playwright/test");
const { pathToFileURL } = require("node:url");
const path = require("node:path");

test("town and planet unlocks follow completion progress", async ({ page }) => {
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
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

test("buddy details switch between traveler and pet without changing their saved data", async ({ page }) => {
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
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
  await page.evaluate(() => {
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
