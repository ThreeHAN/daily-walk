const { test, expect } = require("@playwright/test");
const { continueLocally } = require("./helpers/onboarding");
const { pathToFileURL } = require("node:url");
const path = require("node:path");

const app = pathToFileURL(path.resolve(__dirname, "../index.html")).href;

async function playerState(page) {
  return page.evaluate(() => ({
    name: S.p.name,
    buddy: S.p.buddy,
    xp: S.xp,
    life: S.life,
    checks: S.checks,
    days: S.days,
    water: S.water.n,
    journal: S.jr,
    pets: S.pets,
    pet: S.p.pet,
    town: S.nb.cur,
    townXp: S.nb.xp,
    people: S.peopleMet,
    tutorialDone: S.tutorialDone,
    streak: curStreak,
  }));
}

test("a new browser and newly created profiles start fresh and stay fresh on reload", async ({ page }) => {
  await page.goto(app);
  await continueLocally(page);
  const expected = {
    name: "Player 1", buddy: "Buddy", xp: 0, life: 0,
    checks: {}, days: {}, water: 0, journal: {}, pets: {}, pet: "none",
    town: "meadow", townXp: {}, people: [], tutorialDone: false, streak: 0,
  };
  expect(await playerState(page)).toEqual(expected);
  await expect(page.locator("#lvb")).toHaveText("Lv 1");
  await page.reload();
  await continueLocally(page);
  expect(await playerState(page)).toEqual(expected);

  await page.locator("#uadd").evaluate((button) => button.click());
  expect(await playerState(page)).toEqual({ ...expected, name: "Player 2" });
  await page.reload();
  await continueLocally(page);
  expect(await playerState(page)).toEqual({ ...expected, name: "Player 2" });
});

test("existing progressed profiles are retained", async ({ page }) => {
  await page.goto(app);
  await continueLocally(page);
  const previous = await page.evaluate(() => {
    S = freshState("Admin");
    save();
    return { id: CUR_UID, xp: S.xp, town: S.nb.cur, pet: S.p.pet };
  });
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate(() => ({
    id: CUR_UID, xp: S.xp, town: S.nb.cur, pet: S.p.pet,
  }))).toEqual(previous);
  await expect(page.locator("#ubname")).toContainText("Admin");
});

test("legacy profiles are loaded instead of replaced with a new player", async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem("dailywalk_admin_max:users:v3")) {
      localStorage.setItem("dailywalk_admin_max:legacy", JSON.stringify({
        p: { name: "Legacy Walker" }, xp: 120, life: 120,
        days: {}, checks: {}, nb: { cur: "meadow", view: "meadow", xp: { meadow: 120 } },
      }));
    }
  });
  await page.goto(app);
  await continueLocally(page);
  expect(await page.evaluate(() => ({ name: S.p.name, xp: S.xp, townXp: S.nb.xp.meadow })))
    .toEqual({ name: "Legacy Walker", xp: 120, townXp: 120 });
  await page.reload();
  await continueLocally(page);
  await expect(page.locator("#ubname")).toContainText("Legacy Walker");
});

test("an incomplete day stays incomplete after reloading or unchecking everything", async ({ page }) => {
  await page.goto(app);
  await continueLocally(page);
  await page.locator('input[data-id="wake"]').evaluate((input) => input.click());
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate(() => ({ completed: S.days[today()], streak: curStreak })))
    .toEqual({ completed: false, streak: 0 });
  await page.locator("#reset").evaluate((button) => button.click());
  expect(await page.evaluate(() => ({ completed: S.days[today()], streak: curStreak })))
    .toEqual({ completed: false, streak: 0 });
});

test("a new day does not create a completed day or unlock a streak pet", async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 0, 1, 23, 59, 50) });
  await page.goto(app);
  await continueLocally(page);
  await page.clock.fastForward(25000);
  expect(await page.evaluate(() => ({
    days: S.days, streak: curStreak, pets: S.pets,
  }))).toEqual({ days: {}, streak: 0, pets: {} });
  expect(await page.evaluate(() => readStoredProfile(CUR_UID).water.d)).toBe("2026-01-02");
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate(() => ({
    days: S.days, streak: curStreak, pets: S.pets,
  }))).toEqual({ days: {}, streak: 0, pets: {} });
});

test("water history survives the next day and older saves without it load safely", async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 0, 1, 23, 59, 50) });
  await page.goto(app);
  await continueLocally(page);
  await page.evaluate(() => {
    delete S.waterHistory;
    S = hydrateState(S);
  });
  await page.locator('#cups button[aria-label="Cup 3"]').evaluate((button) => button.click());
  await page.clock.fastForward(25000);
  await page.locator('#cups button[aria-label="Cup 5"]').evaluate((button) => button.click());
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate(() => S.waterHistory)).toEqual({
    "2026-01-01": 3,
    "2026-01-02": 5,
  });
});
