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
