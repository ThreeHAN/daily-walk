const { test, expect } = require("@playwright/test");
const { readFileSync } = require("node:fs");
const { pathToFileURL } = require("node:url");
const path = require("node:path");

test("all pet sprites are pixel art and load from a direct-file app", async ({ page }) => {
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
  const pets = await page.evaluate(() => PETS.map(({ id, art }) => ({ id, art })));
  const sprites = pets.map(({ id, art }) => ({
    id,
    xml: readFileSync(path.resolve(__dirname, "..", art), "utf8"),
  }));
  const results = await page.evaluate(async (sprites) => {
    return Promise.all(sprites.map(async ({ id, xml }) => {
      const svg = new DOMParser().parseFromString(xml, "image/svg+xml");
      const image = new Image();
      const loaded = await new Promise((resolve) => {
        image.onload = () => resolve(image.naturalWidth > 0 && image.naturalHeight > 0);
        image.onerror = () => resolve(false);
        image.src = petById(id).art + "?v=pixel-pets-1";
      });
      return {
        id,
        valid: !svg.querySelector("parsererror") && svg.documentElement.getAttribute("shape-rendering") === "crispEdges",
        loaded,
        usesSprite: petSvg(id).includes(petById(id).art + "?v=pixel-pets-1"),
      };
    }));
  }, sprites);
  expect(results).toEqual(pets.map(({ id }) => ({ id, valid: true, loaded: true, usesSprite: true })));
});

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
