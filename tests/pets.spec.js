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
      visible: document.querySelector("#profile-avatar-pet img") !== null,
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
    visible: document.querySelector("#profile-avatar-pet img") !== null,
  }))).toEqual({ firefly: true, chick: true, equipped: "chick", visible: true });
});

test("equipped pets sit beside the traveler in profile previews and update when changed", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
  await page.evaluate(() => {
    S.pets.royalpig = 1;
    S.p.pet = "royalpig";
    save();
    paint();
  });
  await page.reload();
  await page.locator("#prof").evaluate((button) => button.click());

  async function checkPlacement(container, pet) {
    const result = await page.locator(container).evaluate((element) => {
      const person = element.querySelector(".pixel-person").getBoundingClientRect();
      const image = element.querySelector(".profile-pet img");
      const bounds = image.getBoundingClientRect();
      const parent = element.getBoundingClientRect();
      return {
        loaded: image.complete && image.naturalWidth > 0,
        src: image.getAttribute("src"),
        beside: bounds.left >= person.right - 2,
        onGround: Math.abs(bounds.bottom - person.bottom) < 8,
        within: bounds.left >= parent.left && bounds.right <= parent.right,
        noHeadPet: !element.querySelector(".head-pet"),
      };
    });
    expect(result).toEqual({
      loaded: true,
      src: `assets/svg/pets/${pet}.svg?v=pixel-pets-1`,
      beside: true,
      onGround: true,
      within: true,
      noHeadPet: true,
    });
  }

  await checkPlacement("#prof", "royalpig");
  await checkPlacement("#v-menu .stage", "royalpig");
  await page.locator("#go-wd").evaluate((button) => button.click());
  await checkPlacement("#v-wd .stage", "royalpig");
  await page.locator("#wtabs button").filter({ hasText: "Pets" }).evaluate((button) => button.click());
  await page.locator("#wbody .pcard").filter({ hasText: "No Pet" }).evaluate((button) => button.click());
  await expect(page.locator("#pm .profile-pet img, #prof .profile-pet img")).toHaveCount(0);
  await page.locator("#wbody .pcard").filter({ hasText: "Little Chick" }).evaluate((button) => button.click());
  await checkPlacement("#v-wd .stage", "chick");
  await page.locator("#v-wd [data-back]").evaluate((button) => button.click());
  await page.locator("#go-info").evaluate((button) => button.click());
  await checkPlacement("#v-info .stage", "chick");
  await page.reload();
  await page.locator("#prof").evaluate((button) => button.click());
  await checkPlacement("#v-menu .stage", "chick");
  await expect(page.locator("#pal .head-pet")).toHaveCount(0);
  await expect(page.locator("#profile-avatar-pet img")).toHaveAttribute("src", "assets/svg/pets/chick.svg?v=pixel-pets-1");
});

test("the dashboard streak traveler has no pet when a pet is equipped", async ({ page }) => {
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
  await page.evaluate(() => { S.p.pet = "royalpig"; save(); paint(); });
  await expect(page.locator("#av .head-pet, #av .profile-pet")).toHaveCount(0);
  await expect(page.locator("#profile-avatar-pet img")).toHaveAttribute("src", "assets/svg/pets/royalpig.svg?v=pixel-pets-1");
  await page.reload();
  await expect(page.locator("#av .head-pet, #av .profile-pet")).toHaveCount(0);
  await expect(page.locator("#profile-avatar-pet img")).toHaveAttribute("src", "assets/svg/pets/royalpig.svg?v=pixel-pets-1");
});
