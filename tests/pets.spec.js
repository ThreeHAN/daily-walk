const { test, expect } = require("@playwright/test");
const { pathToFileURL } = require("node:url");
const path = require("node:path");

test("streak pet unlocks are equipped and persist", async ({ page }) => {
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
  const unlocked = await page.evaluate(() => {
    S.days = {};
    S.pets = {};
    S.nb.xp = {};
    S.p.pet = "none";
    syncPetUnlocks(3);
    paint();
    return {
      firefly: !!S.pets.firefly,
      chick: !!S.pets.chick,
      bunny: !!S.pets.bunny,
      equipped: S.p.pet,
      visible: document.querySelector("#pal .head-pet") !== null,
    };
  });
  expect(unlocked).toEqual({
    firefly: true,
    chick: true,
    bunny: false,
    equipped: "chick",
    visible: true,
  });
  await page.reload();
  expect(await page.evaluate(() => ({
    firefly: !!S.pets.firefly,
    chick: !!S.pets.chick,
    equipped: S.p.pet,
    visible: document.querySelector("#pal .head-pet") !== null,
  }))).toEqual({ firefly: true, chick: true, equipped: "chick", visible: true });
});
