const { test, expect } = require("@playwright/test");
const { pathToFileURL } = require("node:url");
const path = require("node:path");

test.beforeEach(async ({ page }) => {
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
  await page.evaluate(() => {
    S.nb.cur = "meadow";
    S.nb.view = "meadow";
    S.nb.planet = "earth";
    S.nb.vplanet = "earth";
    S.nb.xp = { meadow: MAXAT - 10, seaside: 123 };
    S.nb.seen = {};
    S.nb.cel = {};
    S.xp = 0;
    S.p.hat = "none";
    S.aw = { d: today(), k: {} };
    S.checks[today()] = {};
    save();
    render();
  });
});

test("habits help a town and unlock travel without losing existing progress", async ({ page }) => {
  await page.locator('button[data-p="t"]').evaluate((button) => button.click());
  await page.locator("#wbtn").evaluate((button) => button.click());
  await expect(page.locator("#wc-seaside .wbt")).toBeDisabled();
  await page.evaluate(() => settle("seaside"));
  expect(await page.evaluate(() => S.nb.cur)).toBe("meadow");
  await page.locator("#glx").evaluate((button) => button.click());
  await page.locator('button[data-p="h"]').evaluate((button) => button.click());
  await page.locator('input[data-id="wake"]').evaluate((input) => input.click());
  await page.locator('button[data-p="t"]').evaluate((button) => button.click());
  await expect(page.locator("#ncard")).toBeVisible();
  await expect(page.locator("#tnx")).toContainText("Trailblazer cap");
  await page.locator("#wbtn").evaluate((button) => button.click());
  await page.locator("#wc-seaside .wbt").evaluate((button) => button.click());
  expect(await page.evaluate(() => [S.nb.cur, S.nb.xp.meadow, S.nb.xp.seaside])).toEqual(["seaside", 3000, 123]);
  await page.reload();
  expect(await page.evaluate(() => [S.nb.cur, S.nb.xp.meadow, S.nb.xp.seaside])).toEqual(["seaside", 3000, 123]);
});

test("town gear unlocks from saved town progress and equips at any level", async ({ page }) => {
  await page.evaluate(() => { S.p.ex.scarf = false; });
  await page.locator("#prof").evaluate((button) => button.click());
  await page.locator("#go-wd").evaluate((button) => button.click());
  const cap = page.locator("#wbody button").filter({ hasText: "Trailblazer cap" });
  const scarf = page.locator("#wbody button").filter({ hasText: "Frostwind scarf" });
  await expect(cap).toBeEnabled();
  await expect(scarf).toBeDisabled();
  await page.evaluate(() => {
    S.nb.xp.meadow = MAXAT;
    S.nb.xp.mars_snowy = MAXAT;
    S.p.ex.scarf = false;
    save();
    buildWd();
  });
  await expect(cap).toBeEnabled();
  await cap.evaluate((button) => button.click());
  expect(await page.evaluate(() => S.p.hat)).toBe("cap");
  await expect(cap).toHaveAttribute("aria-pressed", "true");
  await cap.evaluate((button) => button.click());
  expect(await page.evaluate(() => S.p.hat)).toBe("none");
  await cap.evaluate((button) => button.click());
  await expect(scarf).toBeEnabled();
  await scarf.evaluate((button) => button.click());
  await page.reload();
  expect(
    await page.evaluate(() => [
      S.p.hat,
      S.p.ex.scarf,
      gearEarned(TOWN_GEAR.meadow),
      lockLv("ex", "scarf"),
    ]),
  ).toEqual(["cap", true, true, 0]);
});

test("wardrobe items fill rows within each clothing category", async ({ page }) => {
  await page.locator("#prof").evaluate((button) => button.click());
  await page.locator("#go-wd").evaluate((button) => button.click());

  async function expectFilledRows(grid) {
    const positions = await grid.locator(".pcard").evaluateAll((cards) =>
      cards.map((card) => {
        const { x, y } = card.getBoundingClientRect();
        return { x, y };
      }),
    );
    expect(positions.length).toBeGreaterThan(2);
    for (let i = 0; i + 1 < positions.length; i += 2) {
      expect(Math.abs(positions[i].y - positions[i + 1].y)).toBeLessThan(1);
      expect(positions[i + 1].x).toBeGreaterThan(positions[i].x);
    }
    expect(positions[2].y).toBeGreaterThan(positions[0].y);
  }

  for (const width of [320, 1000]) {
    await page.setViewportSize({ width, height: 720 });
    await page.locator("#wtabs button").filter({ hasText: "Town gear" }).evaluate((button) => button.click());
    for (const name of ["Hats", "Pants", "Shoes"]) {
      const group = page.locator(".wardrobe-gear-group").filter({ has: page.getByRole("heading", { name, exact: true }) });
      await expect(group.locator(".pgrid")).toHaveCount(1);
      await expectFilledRows(group.locator(".pgrid"));
    }

    await page.locator("#wtabs button").filter({ hasText: "Bottoms" }).evaluate((button) => button.click());
    await page.getByRole("button", { name: /Wayfarer pants/ }).evaluate((button) => button.click());
    await expect(page.locator('#wbody [data-k="Pants color"]')).toBeVisible();
    const grids = page.locator("#wbody > .pgrid");
    await expect(grids).toHaveCount(2);
    await expectFilledRows(grids.nth(0));
    await expectFilledRows(grids.nth(1));
  }
});

test("town gear groups clothing and unlocks distinct pants and boots alongside old rewards", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.evaluate(() => {
    S.tutorialDone = true;
    S.p.pants = "none";
    S.p.shoes = "none";
    save();
  });
  if (await page.locator("#sp").isVisible()) await page.locator("#spgo").click();
  await page.locator("#prof").click();
  await page.locator("#go-wd").click();
  await expect(page.locator("#wtabs button").filter({ hasText: /^🎩 Hats$/ })).toHaveCount(0);
  await expect(page.locator("#wbody .wardrobe-gear-group h4"))
    .toHaveText(["Hats", "Tops", "Pants", "Shoes", "Accessories"]);
  expect(await page.evaluate(() => {
    const sheet = document.querySelector("#pm .sheet");
    return sheet.scrollWidth <= sheet.clientWidth;
  })).toBe(true);
  const pants = page.locator("#wbody .wardrobe-gear-group").filter({ has: page.getByRole("heading", { name: "Pants", exact: true }) });
  const shoes = page.locator("#wbody .wardrobe-gear-group").filter({ has: page.getByRole("heading", { name: "Shoes", exact: true }) });
  const hats = page.locator("#wbody .wardrobe-gear-group").filter({ has: page.getByRole("heading", { name: "Hats", exact: true }) });
  const tops = page.locator("#wbody .wardrobe-gear-group").filter({ has: page.getByRole("heading", { name: "Tops", exact: true }) });
  await expect(hats.locator(".chip")).toHaveCount(0);
  await expect(hats.getByRole("button", { name: /Midnight top hat/ })).toHaveClass(/pcard/);
  for (const name of ["Trailblazer cap", "Dune Ranger hat", "Starweaver hat", "Skykeeper crown"]) {
    await expect(hats.getByRole("button", { name: new RegExp(name) })).toHaveCount(1);
  }
  for (const name of ["Halo", "Headphones", "Party", "Beanie"]) {
    await expect(hats.getByRole("button", { name: new RegExp(name, "i") })).toHaveCount(0);
  }
  await expect(tops.getByRole("button", { name: /T-shirt/ })).toHaveClass(/pcard/);
  await expect(tops.getByRole("button", { name: /^None/ })).toHaveCount(0);
  await expect(pants.getByRole("button", { name: /^(None|No pants)/ })).toHaveCount(0);
  await expect(pants.locator(".pcard")).toHaveCount(4);
  await expect(shoes.locator(".pcard")).toHaveCount(5);
  await expect(page.locator('#wbody [data-k="Color"], #wbody [data-k="Pants color"], #wbody [data-k="Shoe color"]')).toHaveCount(0);
  await tops.getByRole("button", { name: /T-shirt/ }).click();
  await expect(tops.locator('[data-k="Color"]')).toBeVisible();
  await tops.locator('[data-k="Color"]').getByRole("button", { name: "Red", exact: true }).click();
  expect(await page.evaluate(() => S.p.topColor)).toBe("red");
  const trail = pants.getByRole("button", { name: /Trailblazer trousers/ });
  await expect(trail).toBeDisabled();
  await expect(trail).toContainText("Meadow Valley");
  await page.evaluate(() => {
    for (const id of ["meadow", "seaside", "snowy", "oasis", "autumn", "crystal"]) S.nb.xp[id] = MAXAT;
    save();
    buildWd();
  });
  expect(await page.evaluate(() => townRewards("meadow").map((gear) => gear.name)))
    .toEqual(["Trailblazer cap", "Trailblazer trousers"]);
  const leg = page.locator(".wardrobe-preview .leg-l");
  const pantsArt = [];
  for (const name of ["Trailblazer trousers", "Harbor cargo pants", "Frostguard trousers"]) {
    await pants.getByRole("button", { name: new RegExp(name) }).click();
    await expect(pants.locator('[data-k="Pants color"]')).toBeVisible();
    pantsArt.push(await leg.innerHTML());
  }
  expect(new Set(pantsArt).size).toBe(3);
  const shoeArt = [];
  const shoeHeights = [];
  for (const name of ["Sunstride boots", "Woodland boots", "Crystalstride boots"]) {
    await shoes.getByRole("button", { name: new RegExp(name) }).click();
    await expect(shoes.locator('[data-k="Shoe color"]')).toBeVisible();
    shoeArt.push(await leg.innerHTML());
    shoeHeights.push(await leg.locator(".shoe-art").evaluate((element) => element.getBBox().height));
  }
  expect(new Set(shoeArt).size).toBe(3);
  expect(Math.max(...shoeHeights) - Math.min(...shoeHeights)).toBeGreaterThanOrEqual(3);
  expect(await page.evaluate(() => [S.p.pants, S.p.pantsStyle, S.p.shoes, S.p.shoeStyle]))
    .toEqual(["black", "winter", "black", "crystal"]);
  await page.reload();
  expect(await page.evaluate(() => [S.p.pantsStyle, S.p.shoeStyle])).toEqual(["winter", "crystal"]);
  await page.locator("#prof").click();
  await page.locator("#go-wd").click();
  await page.getByRole("button", { name: /Frostguard trousers/ }).click();
  await page.getByRole("button", { name: /Crystalstride boots/ }).click();
  expect(await page.evaluate(() => [S.p.pantsStyle, S.p.shoeStyle])).toEqual(["classic", "classic"]);
  await page.getByRole("button", { name: /Tops/, exact: false }).first().click();
  await expect(page.locator("#wbody .pcard").filter({ hasText: /^None/ })).toHaveCount(0);
  await expect(page.locator('#wbody [data-k="Color"]')).toHaveCount(0);
  await page.getByRole("button", { name: /Bottoms/ }).click();
  await expect(page.locator("#wbody .pcard").filter({ hasText: /No pants/ })).toHaveCount(0);
  await expect(page.locator('#wbody [data-k="Pants color"], #wbody [data-k="Shoe color"]')).toHaveCount(0);
  await page.getByRole("button", { name: /Extras/ }).click();
  await expect(page.locator("#wbody .pcard").filter({ hasText: /scarf/i })).toHaveCount(1);
});

test("merged hat cards retain level and town unlocks and preserve retired saved hats", async ({ page }) => {
  await page.evaluate(() => {
    S.p.hat = "beanie";
    save();
  });
  await page.reload();
  expect(await page.evaluate(() => [S.p.hat, personLayers(S.p).includes('class="person-hat"')]))
    .toEqual(["beanie", true]);
  const preserved = await page.evaluate(() => ["halo", "phones", "party", "beanie"].map((hat) => {
    const saved = structuredClone(S);
    saved.p.hat = hat;
    const loaded = hydrateState(saved);
    return loaded.p.hat === hat && personLayers(loaded.p).includes('class="person-hat"') &&
      personLayers(loaded.p) !== personLayers({ ...loaded.p, hat: "none" });
  }));
  expect(preserved).toEqual([true, true, true, true]);
  await page.locator("#prof").evaluate((button) => button.click());
  await page.locator("#go-wd").evaluate((button) => button.click());
  const dune = page.getByRole("button", { name: /Dune Ranger hat/ });
  await expect(dune).toBeDisabled();
  await page.evaluate(() => { S.xp = LV_START(2); buildWd(); });
  await expect(dune).toBeEnabled();
  await page.evaluate(() => { S.xp = 0; S.nb.xp.oasis = MAXAT; save(); buildWd(); });
  await expect(dune).toBeEnabled();
  await dune.evaluate((button) => button.click());
  expect(await page.evaluate(() => S.p.hat)).toBe("cowboy");
  await dune.evaluate((button) => button.click());
  expect(await page.evaluate(() => S.p.hat)).toBe("none");
});

test("legacy off-world progress remains accessible on the single world map", async ({ page }) => {
  await page.evaluate(() => {
    S.nb.cur = "neptune_sky";
    S.nb.view = "meadow";
    S.nb.planet = "neptune";
    S.nb.xp.neptune_sky = MAXAT;
    S.nb.xp.mars_snowy = 900;
    save();
  });
  await page.reload();
  await page.locator('button[data-p="t"]').evaluate((button) => button.click());
  await expect(page.locator("#tnb")).toHaveText("Pigpatch Sky Farm");
  await page.locator("#wbtn").evaluate((button) => button.click());
  await expect(page.locator("#glt")).toContainText("Your world");
  await expect(page.locator("#glist .wc")).toHaveCount(48);
  await expect(page.locator("#wc-meadow")).toBeAttached();
  await expect(page.locator("#wc-mars_snowy")).toBeAttached();
  await expect(page.locator("#wc-neptune_sky")).toBeAttached();
  await expect(page.locator("#glist .wc").first()).toHaveId("wc-neptune_sky");
  await expect(page.locator("#glh")).toContainText("of 48 towns helped");
  expect(await page.evaluate(() => new Set(Object.values(GP).map((g) => g.join(","))).size)).toBe(48);
  expect(await page.evaluate(() => {
    const g = GP.mars_snowy;
    GLB.lon = -g[0];
    GLB.lat = g[1];
    renderGlobeFrame();
    const pin = document.querySelector('#gpins [data-id="mars_snowy"]');
    if (!pin) return false;
    GLB.moved = false;
    pin.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    return true;
  })).toBe(true);
  await expect(page.locator("#wc-mars_snowy")).toHaveClass(/sel/);
  await page.locator("#wc-mars_snowy .wbt").evaluate((button) => button.click());
  expect(await page.evaluate(() => [S.nb.cur, S.nb.xp.mars_snowy, S.nb.xp.neptune_sky])).toEqual(["mars_snowy", 900, 3000]);
});

test("pixel scenery keeps biome artwork, buildings, and the world map interactive", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.evaluate(() => {
    S.nb.xp.meadow = MAXAT;
    for (const id of ["seaside", "snowy", "oasis", "autumn", "starlight", "crystal", "sky", "neptune_sky"]) {
      S.nb.xp[id] = MAXAT;
    }
  });
  const scenes = await page.evaluate(() => {
    const ids = ["meadow", "seaside", "snowy", "oasis", "autumn", "starlight", "crystal", "sky", "neptune_sky"];
    return ids.map((id) => {
      S.nb.cur = id;
      drawScene(false);
      return {
        id: document.querySelector("#scene").dataset.nb,
        art: document.querySelector("#decB").innerHTML,
        buildings: document.querySelectorAll("#bld .bd").length,
        rounded: document.querySelectorAll("#decB circle, #decB ellipse, #decF circle, #decF ellipse, #bld circle, #bld ellipse").length,
      };
    });
  });
  expect(scenes.map((scene) => scene.id)).toEqual(["meadow", "seaside", "snowy", "oasis", "autumn", "starlight", "crystal", "sky", "neptune_sky"]);
  expect(new Set(scenes.map((scene) => scene.art)).size).toBe(9);
  expect(scenes.every((scene) => scene.buildings === 12 && scene.rounded === 0)).toBe(true);

  await page.evaluate(() => { S.nb.cur = "meadow"; drawScene(false); });
  await page.locator('button[data-p="t"]').evaluate((button) => button.click());
  await page.locator("#bld .bd").first().locator("rect").first().dispatchEvent("click");
  await expect(page.locator("#toast")).toContainText("First Home");
  await page.locator("#wbtn").evaluate((button) => button.click());
  await expect(page.locator("#gpins .pin")).not.toHaveCount(0);
  expect(await page.locator("#gisl ellipse, #gpins circle, #gcld ellipse").count()).toBe(0);
  await expect(page.locator("#ggrid, #gcld")).toHaveCount(0);
  await expect(page.locator("#gland path")).toHaveAttribute("fill", "#64b96b");
  const spinningFrom = await page.evaluate(() => GLB.lon);
  await page.waitForFunction((initial) => Math.abs(GLB.lon - initial) > 0.3, spinningFrom);
  expect(await page.evaluate(() => GLB.lat)).toBe(0);
  await page.evaluate(() => stopGlobe());
  const box = await page.locator("#gsv").boundingBox();
  const before = await page.evaluate(() => ({
    lon: GLB.lon,
    lat: GLB.lat,
    land: document.querySelector("#gland path").getAttribute("d"),
  }));
  expect(before.land.length).toBeGreaterThan(100);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 40, { steps: 4 });
  await page.mouse.up();
  expect(await page.evaluate(() => [GLB.lon, GLB.lat])).toEqual([before.lon, before.lat]);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 40, box.y + box.height / 2, { steps: 4 });
  await page.mouse.up();
  expect(await page.evaluate((initial) => Math.abs(GLB.lon - initial), before.lon)).toBeGreaterThan(10);
  expect(await page.evaluate(() => GLB.lat)).toBe(before.lat);
  expect(await page.locator("#gland path").getAttribute("d")).not.toBe(before.land);
  expect(errors).toEqual([]);
});
