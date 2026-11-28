const { test, expect } = require("@playwright/test");
const { continueLocally } = require("./helpers/onboarding");
const { pathToFileURL } = require("node:url");
const path = require("node:path");

test.beforeEach(async ({ page }) => {
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
  await continueLocally(page);
});

async function click(page, selector) {
  await page.locator(selector).evaluate((element) => element.click());
}

async function selectWardrobe(page, name) {
  await page.getByRole("group", { name: "Wardrobe categories" })
    .getByRole("button", { name, exact: true }).click();
}

async function openAppearance(page) {
  await click(page, "#go-wd");
  await selectWardrobe(page, "Appearance");
}

test("all People Index buttons show the book and open the index", async ({ page }) => {
  for (const selector of ["#ixh", "#ixbtn", "#go-ix"]) {
    await expect(page.locator(`${selector} [data-i="book"] svg`)).toHaveCount(1);
    await click(page, selector);
    await expect(page.locator("#ix")).toHaveClass(/show/);
    await click(page, "#ixdone");
    await expect(page.locator("#ix")).not.toHaveClass(/show/);
  }
});

test("icon hydration respects marked React roots without excluding legacy content", async ({ page }) => {
  const result = await page.evaluate(() => {
    const react = document.createElement("div");
    react.setAttribute("data-react-root", "");
    react.innerHTML = '<span>🔥</span><i data-i="star"></i>';
    const legacy = document.createElement("div");
    legacy.innerHTML = '<span>🔥</span><i data-i="star"></i>';
    document.body.append(react, legacy);
    iconize(react);
    iconize(legacy);
    hydrate();
    const result = {
      marked: document.querySelector("#profile-menu").hasAttribute("data-react-root"),
      reactText: react.querySelector("span").textContent,
      reactIcon: react.querySelector("i").children.length,
      legacyTextIcon: legacy.querySelector("span .ic svg") !== null,
      legacyIcon: legacy.querySelector("i svg") !== null,
    };
    react.remove();
    legacy.remove();
    return result;
  });
  expect(result).toEqual({ marked: true, reactText: "🔥", reactIcon: 0, legacyTextIcon: true, legacyIcon: true });
});

test("profile combines appearance and town gear in one wardrobe", async ({ page }) => {
  await click(page, "#prof");
  await expect(page.locator("#go-bud")).toHaveCount(0);
  await expect(page.locator("#go-wd")).toContainText("Wardrobe & traveler");
  await expect(page.locator('#go-wd [data-i="wardrobe"] svg')).toBeAttached();
  await expect(page.locator('#go-info [data-i="profile-card"] svg')).toBeAttached();
  await expect(page.locator('#go-info svg path[fill="#284c66"]')).toHaveCount(1);
  const iconStyles = await page.evaluate(() => ({
    color: getComputedStyle(document.querySelector("#go-lv .ci")).backgroundColor,
    star: document.querySelector("#go-lv .ic").getBoundingClientRect().width,
    wardrobe: document.querySelector("#go-wd .ic").getBoundingClientRect().width,
  }));
  expect(iconStyles.color).toBe("rgb(118, 80, 173)");
  expect(iconStyles.star).toBeGreaterThan(iconStyles.wardrobe);
  await click(page, "#go-wd");
  await expect(page.locator("#wbody")).toContainText("Hats");
  await selectWardrobe(page, "Appearance");
  await expect(page.locator('#wbody [data-k="Gender"]')).toBeVisible();
  await selectWardrobe(page, "Hats");
  await expect(page.locator("#wbody")).toContainText("Hats");
  await click(page, "#profile-header button");
  await click(page, "#go-lv");
  await expect(page.locator("#v-lv")).toBeVisible();
  await click(page, "#profile-header button");
  await click(page, "#go-info");
  await expect(page.locator("#v-info")).toBeVisible();
  await click(page, "#profile-header button");
  await expect(page.locator('#go-tour [data-i="tour-map"] svg path[fill="#f3dfaa"]')).toHaveCount(1);
  await click(page, "#go-tour");
  await expect(page.locator("#tour")).toBeVisible();
});

test("wardrobe shows available items before locked ones in each category", async ({ page }) => {
  await page.evaluate(() => {
    S.xp = LV_START(2);
    S.days = {};
    S.pets = { bunny: 1 };
    S.nb.xp = {};
    for (const eco of ["sky", "snowy", "crystal"]) {
      const id = NBK.find((town) => (NB[town].eco || town) === eco);
      S.nb.xp[id] = 3000;
    }
    S.p.hat = "none";
    S.p.topStyle = "tee";
    S.p.ex = {};
    S.p.pet = "none";
    curStreak = 0;
  });
  await click(page, "#prof");
  await click(page, "#go-wd");
  for (const [category, available, locked] of [
    ["Hats", "Skykeeper crown", "Midnight top hat"],
    ["Tops", "Vanguard tunic", "Ranger striped shirt"],
    ["Pants", "Frostguard trousers", "Trailblazer trousers"],
    ["Shoes", "Crystalstride boots", "Sunstride boots"],
    ["Accessories", "Frostwind scarf", "Harbor shades"],
    ["Warrior gear", "Vanguard tunic", "Apprentice sword"],
    ["Face", "Sage glasses", "Harbor shades"],
    ["Extras", "Crystalwind cape", "Dapper bow tie"],
    ["Pets", "Meadow Bunny", "Firefly"],
  ]) {
    await selectWardrobe(page, category);
    const cards = page.locator("#wbody .pcard:visible");
    const names = await cards.locator("b").allTextContents();
    expect(names.indexOf(available), category).toBeGreaterThanOrEqual(0);
    expect(names.indexOf(locked), category).toBeGreaterThan(names.indexOf(available));
    await expect(cards.filter({ hasText: available })).not.toHaveClass(/lk/);
    await expect(cards.filter({ hasText: locked })).toHaveClass(/lk/);
  }
  await page.evaluate(() => { S.pets.chick = 1; buildWd(); });
  const petNames = await page.locator("#wbody .pcard b").allTextContents();
  expect(petNames.indexOf("Little Chick")).toBeLessThan(petNames.indexOf("Firefly"));
  await page.locator("#wbody .pcard").filter({ hasText: "Little Chick" }).click();
  expect(await page.evaluate(() => S.p.pet)).toBe("chick");

  await selectWardrobe(page, "Pants");
  await page.evaluate(() => {
    const meadow = NBK.find((town) => (NB[town].eco || town) === "meadow");
    S.nb.xp[meadow] = 3000;
    buildWd();
  });
  const pantsNames = await page.locator("#wbody .pcard:visible b").allTextContents();
  expect(pantsNames.indexOf("Trailblazer trousers")).toBeLessThan(pantsNames.indexOf("Harbor cargo pants"));
  await page.locator("#wbody .pcard:visible").filter({ hasText: "Trailblazer trousers" }).click();
  expect(await page.evaluate(() => S.p.pantsStyle)).toBe("trail");

  await selectWardrobe(page, "Hats");
  await page.evaluate(() => { S.p.hat = "knight"; buildWd(); });
  const hats = page.locator("#wbody .pcard:visible");
  const hatNames = await hats.locator("b").allTextContents();
  expect(hatNames.indexOf("Sentinel helmet")).toBeLessThan(hatNames.indexOf("Midnight top hat"));
  await hats.filter({ hasText: "Sentinel helmet" }).click();
  await expect(hats.filter({ hasText: "Sentinel helmet" })).toBeDisabled();
});

test("profile fills the viewport and returns to the previous page", async ({ page }) => {
  for (const viewport of [{ width: 320, height: 720 }, { width: 1100, height: 800 }]) {
    await page.setViewportSize(viewport);
    await page.locator("#prof").click();
    const profile = page.locator("#pm");
    const bounds = await profile.boundingBox();
    expect(bounds.x).toBe(0);
    expect(bounds.y).toBe(0);
    expect(bounds.width).toBe(viewport.width);
    expect(bounds.height).toBe(viewport.height);
    await expect(page.getByRole("region", { name: "Profile" })).toBeVisible();
    await expect(profile.getByRole("dialog")).toHaveCount(0);
    await expect(page.locator("#go-wd")).toBeVisible();
    const back = profile.locator("#profile-header button");
    const menuPosition = await back.boundingBox();
    await profile.locator(".sheet").evaluate((sheet) => { sheet.scrollTop = sheet.scrollHeight; });
    expect((await back.boundingBox()).y).toBe(menuPosition.y);
    await page.locator("#go-wd").click();
    await expect(page.locator("#v-wd")).toBeVisible();
    await expect(back).toHaveAttribute("aria-label", "Back to profile menu");
    await expect(profile.locator("button.back:visible")).toHaveCount(1);
    const before = await back.boundingBox();
    const scrollTop = await profile.locator(".sheet").evaluate((sheet) => {
      sheet.scrollTop = sheet.scrollHeight;
      return sheet.scrollTop;
    });
    if (viewport.width === 320) expect(scrollTop).toBeGreaterThan(0);
    const after = await back.boundingBox();
    expect(after.x).toBe(before.x);
    expect(after.y).toBe(before.y);
    expect(after.x).toBeLessThan(20);
    await back.click();
    await expect(page.locator("#v-menu")).toBeVisible();
    await expect(back).toHaveAttribute("aria-label", "Back from profile");
    await back.click();
    await expect(profile).not.toBeVisible();
    await expect(page.locator("#pg-h")).toBeVisible();
  }
});

test("profile Back returns from each section and exits from the menu with the keyboard", async ({ page }) => {
  for (const selector of ["#go-wd", "#go-lv", "#go-info"]) {
    await page.locator("#prof").click();
    await page.locator(selector).click();
    await expect(page.locator("#pm button.back:visible")).toHaveCount(1);
    await page.getByRole("button", { name: "Back to profile menu" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#v-menu")).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("#pm")).not.toBeVisible();
    await expect(page.locator("#pg-h")).toBeVisible();
  }
});

test.describe("mobile profile", () => {
  test.use({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true });

  test("keeps the Back button visible and tappable after scrolling", async ({ page }) => {
    await page.locator("#prof").tap();
    const sheet = page.locator("#pm .sheet");
    const back = page.getByRole("button", { name: "Back from profile" });
    const before = await back.boundingBox();
    const scrollTop = await sheet.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
      return element.scrollTop;
    });
    expect(scrollTop).toBeGreaterThan(0);
    const after = await back.boundingBox();
    expect(after.x).toBe(before.x);
    expect(after.y).toBe(before.y);
    await back.tap();
    await expect(page.locator("#pm")).not.toBeVisible();
    await expect(page.locator("#pg-h")).toBeVisible();
  });

  test("edits appearance with touch-sized controls and a live preview", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.locator("#prof").tap();
    await page.locator("#go-wd").tap();
    await selectWardrobe(page, "Appearance");
    const group = page.getByRole("group", { name: "Skin color" });
    const choices = group.getByRole("button");
    const first = choices.first();
    const last = choices.last();
    expect((await first.boundingBox()).height).toBeGreaterThanOrEqual(44);
    await first.tap();
    const preview = page.locator(".wardrobe-preview .pv");
    const original = await preview.innerHTML();
    const label = await last.innerText();
    await last.tap();
    await expect(last).toHaveAttribute("aria-pressed", "true");
    await expect(group.locator(".wardrobe-choice-heading span")).toHaveText(label);
    await expect.poll(() => preview.innerHTML()).not.toBe(original);
    const skin = await page.evaluate(() => S.p.skin);
    expect(await page.locator("#pm .sheet").evaluate((sheet) => sheet.scrollWidth <= sheet.clientWidth)).toBe(true);
    await page.reload();
    await continueLocally(page);
    expect(await page.evaluate(() => S.p.skin)).toBe(skin);
  });

  test("centers the traveler above the items and hides mobile unlock details", async ({ page }) => {
    await page.evaluate(() => { S.p.pet = "none"; paint(); });
    await page.locator("#prof").tap();
    await page.locator("#go-wd").tap();
    await expect(page.getByRole("region", { name: "Wardrobe" })).toBeVisible();
    await expect(page.locator("#v-wd h3")).toHaveCount(0);
    await expect(page.getByText("Help towns to earn gear", { exact: false })).toHaveCount(0);
    await expect(page.getByText("Scroll categories to see more options")).toHaveCount(0);
    const locked = page.locator("#wbody .pcard.lk:not(.on) small").first();
    await expect(locked).toHaveCount(1);
    for (const { width, height } of [
      { width: 320, height: 568 }, { width: 320, height: 720 },
      { width: 375, height: 720 }, { width: 480, height: 720 }, { width: 900, height: 720 },
    ]) {
      await page.setViewportSize({ width, height });
      const { preview, stage, items, traveler } = await page.evaluate(() => {
        document.querySelector("#pm .sheet").scrollTop = 0;
        const bounds = (selector) => document.querySelector(selector).getBoundingClientRect().toJSON();
        return {
          preview: bounds(".wardrobe-preview"),
          stage: bounds(".wardrobe-preview .stage"),
          items: bounds("#wbody"),
          traveler: bounds(".wardrobe-preview .pixel-person"),
        };
      });
      expect(preview.x).toBe(0);
      expect(preview.width).toBe(width);
      expect(stage.height / height).toBeLessThanOrEqual(0.43);
      expect(Math.abs(traveler.x + traveler.width / 2 - width / 2)).toBeLessThan(3);
      expect(traveler.height / height).toBeGreaterThan(0.25);
      expect(traveler.height / height).toBeLessThan(0.30);
      expect(traveler.y).toBeGreaterThanOrEqual(stage.y);
      expect(traveler.y + traveler.height).toBeLessThanOrEqual(stage.y + stage.height + 1);
      expect(items.y).toBeCloseTo(preview.y + preview.height, 0);
      expect(await locked.evaluate((element) => getComputedStyle(element).clipPath))
        .toBe(width <= 600 ? "inset(50%)" : "none");
      expect(await page.locator("#pm .sheet").evaluate((sheet) => sheet.scrollWidth <= sheet.clientWidth)).toBe(true);
    }
  });

  test("filters town gear below the preview on a short mobile screen", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.locator("#prof").tap();
    await page.locator("#go-wd").tap();
    const categories = page.getByRole("group", { name: "Wardrobe categories" });
    const room = await page.evaluate(() => {
      const sheet = document.querySelector("#pm .sheet").getBoundingClientRect();
      const preview = document.querySelector(".wardrobe-preview").getBoundingClientRect();
      const firstCard = document.querySelector("#wbody .pcard").getBoundingClientRect();
      return { available: sheet.bottom - preview.bottom, firstCardBottom: firstCard.bottom, sheetBottom: sheet.bottom };
    });
    expect(room.available).toBeGreaterThanOrEqual(140);
    expect(room.firstCardBottom).toBeLessThanOrEqual(room.sheetBottom);
    await expect(categories.getByRole("button")).toHaveText([
      "Hats", "Tops", "Pants", "Shoes", "Accessories", "Appearance", "Warrior gear", "Pets", "Face", "Extras",
    ]);
    await expect(page.getByRole("combobox", { name: "Wardrobe category" })).toHaveCount(0);
    await expect(categories.getByRole("button", { name: "Hats" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: /Trailblazer cap/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /No shoes/ })).toHaveCount(0);
    await categories.getByRole("button", { name: "Shoes" }).tap();
    const noShoes = page.getByRole("button", { name: /No shoes/ });
    await noShoes.tap();
    await expect(noShoes).toHaveAttribute("aria-pressed", "true");
    await expect(categories.getByRole("button", { name: "Shoes" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: /Trailblazer cap/ })).toHaveCount(0);
    await categories.getByRole("button", { name: "Hats" }).tap();
    const pinned = await page.evaluate(() => {
      const sheet = document.querySelector("#pm .sheet");
      sheet.scrollTop = sheet.scrollHeight;
      const bounds = sheet.getBoundingClientRect();
      const sub = document.querySelector(".wardrobe-subcategories").getBoundingClientRect();
      return {
        scrolled: sheet.scrollTop > 0,
        subVisible: sub.top >= bounds.top && sub.bottom <= bounds.bottom,
      };
    });
    expect(pinned).toEqual({ scrolled: true, subVisible: true });
    await categories.getByRole("button", { name: "Hats" }).focus();
    await page.keyboard.press("Enter");
    await expect(categories.getByRole("button", { name: "Hats" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: /Trailblazer cap/ })).toBeVisible();
    expect(await page.locator("#pm .sheet").evaluate((sheet) => sheet.scrollWidth <= sheet.clientWidth)).toBe(true);
    await categories.getByRole("button", { name: "Appearance" }).tap();
    await expect(categories).toBeVisible();
    await expect(categories.getByRole("button", { name: "Appearance" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("group", { name: "Gender" })).toBeVisible();
  });

  test("uses readable item text while keeping category labels pixel-styled", async ({ page }) => {
    await page.locator("#prof").tap();
    await page.locator("#go-wd").tap();
    const categories = page.getByRole("group", { name: "Wardrobe categories" });
    const font = (locator) => locator.evaluate((element) => getComputedStyle(element).fontFamily);
    expect(await font(categories.getByRole("button", { name: "Hats" }))).toContain("Tiny5");
    expect(await font(page.locator("#wbody .wardrobe-gear-group:visible h4"))).toContain("Tiny5");
    const card = page.getByRole("button", { name: /No hat/ });
    expect(await font(card.locator("b"))).not.toContain("Tiny5");
    expect(await font(card.locator("small"))).not.toContain("Tiny5");
    await categories.getByRole("button", { name: "Appearance" }).tap();
    const gender = page.getByRole("group", { name: "Gender" });
    expect(await font(gender.locator(".wardrobe-choice-heading b"))).toContain("Tiny5");
    expect(await font(gender.getByRole("button", { name: "Female" }))).not.toContain("Tiny5");
  });

  test("keeps wardrobe section headings clear on small screens in both themes", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.locator("#prof").tap();
    await page.locator("#go-wd").tap();
    await selectWardrobe(page, "Appearance");
    for (const theme of ["light", "dark"]) {
      await page.evaluate((value) => { document.documentElement.dataset.theme = value; }, theme);
      const headings = await page.locator("#wbody .wardrobe-choice-heading b").evaluateAll((elements) =>
        elements.map((element) => {
          const style = getComputedStyle(element);
          const bounds = element.getBoundingClientRect();
          const container = element.parentElement.getBoundingClientRect();
          return {
            size: parseFloat(style.fontSize),
            font: style.fontFamily,
            color: style.color,
            ink: getComputedStyle(document.documentElement).getPropertyValue("--ink").trim(),
            fits: bounds.left >= container.left && bounds.right <= container.right + 1,
          };
        }),
      );
      expect(headings).toHaveLength(5);
      for (const heading of headings) {
        expect(heading.size).toBeGreaterThanOrEqual(18);
        expect(heading.font).toContain("Tiny5");
        expect(heading.color).toBe(await page.evaluate((color) => {
          const element = document.createElement("span");
          element.style.color = color;
          document.body.append(element);
          const resolved = getComputedStyle(element).color;
          element.remove();
          return resolved;
        }, heading.ink));
        expect(heading.fits).toBe(true);
      }
      expect(await page.locator("#pm .sheet").evaluate((sheet) => sheet.scrollWidth <= sheet.clientWidth)).toBe(true);
    }
    await selectWardrobe(page, "Hats");
    const gearHeading = page.locator("#wbody .wardrobe-gear-group:visible h4");
    expect(await gearHeading.evaluate((element) => parseFloat(getComputedStyle(element).fontSize)))
      .toBeGreaterThanOrEqual(18);
  });
});

test("profile menu buttons remain interactive through navigation and reopening", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.locator("#prof").click();
  await expect(page.locator("#go-grad")).toBeHidden();
  for (const [button, panel] of [["#go-wd", "#v-wd"], ["#go-lv", "#v-lv"], ["#go-info", "#v-info"]]) {
    await page.locator(button).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(panel)).toBeVisible();
    await page.locator("#profile-header button").click();
  }
  await page.locator("#go-ix").click();
  await expect(page.locator("#ix")).toHaveClass(/show/);
  await page.locator("#ixdone").click();
  await page.locator("#prof").click();
  await expect(page.locator('#go-wd [data-i="wardrobe"] svg')).toHaveCount(1);
  await page.locator("#go-tour").click();
  await expect(page.locator("#tour")).toBeVisible();
  await page.locator("#tour-skip").click();
  expect(errors).toEqual([]);
});

test("profile refresh batches view data and keeps preparation free of pet writes", async ({ page }) => {
  const result = await page.evaluate(() => {
    const updates = [];
    const original = DailyWalkReact;
    window.DailyWalkReact = {
      ...original,
      renderProfile(update) {
        updates.push(Object.keys(update).sort());
        original.renderProfile(update);
      },
    };
    try {
      for (const v of ["menu", "wd", "lv", "info"]) view(v);
      S.pets = {};
      S.p.pet = "none";
      curStreak = 7;
      wTab = "pets";
      const stored = localStorage.getItem(uKey(CUR_UID));
      profileBridge.getViewUpdate("wd");
      const preparationUnchanged = Object.keys(S.pets).length === 0 &&
        localStorage.getItem(uKey(CUR_UID)) === stored;
      buildWd();
      return {
        updates,
        preparationUnchanged,
        unlocked: PETS.filter((pt) => pt.st && pt.st <= 7).every((pt) => !!S.pets[pt.id]),
        equipped: S.p.pet,
      };
    } finally {
      window.DailyWalkReact = original;
    }
  });
  expect(result).toEqual({
    updates: [
      ["banner", "view"],
      ["panels", "tabs", "view"],
      ["levels", "view"],
      ["info", "view"],
      ["panels", "tabs"],
    ],
    preparationUnchanged: true,
    unlocked: true,
    equipped: "none",
  });
});

test("wardrobe categories retain selection across repeated updates", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.evaluate(() => { S.tutorialDone = true; S.splash = today(); save(); });
  await page.reload();
  await continueLocally(page);
  await click(page, "#prof");
  await click(page, "#go-wd");
  const categories = page.getByRole("group", { name: "Wardrobe categories" });
  const hats = categories.getByRole("button", { name: "Hats", exact: true });
  const appearance = categories.getByRole("button", { name: "Appearance", exact: true });
  await expect(categories.getByRole("button")).toHaveCount(10);
  await expect(hats).toHaveAttribute("aria-pressed", "true");
  await appearance.focus();
  await page.keyboard.press("Enter");
  await expect(appearance).toHaveAttribute("aria-pressed", "true");
  await expect(appearance).toBeFocused();
  await expect(page.locator('#wbody [data-k="Gender"]')).toBeVisible();
  await page.locator('#wbody [data-k="Gender"] button').first().click();
  await expect(appearance).toHaveAttribute("aria-pressed", "true");
  await hats.click();
  await expect(hats).toHaveAttribute("aria-pressed", "true");
  await click(page, "#profile-header button");
  await click(page, "#go-wd");
  await expect(hats).toHaveAttribute("aria-pressed", "true");
  expect(errors).toEqual([]);
});

test("React wardrobe panels preserve focus and refresh after switching tabs", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await click(page, "#prof");
  await openAppearance(page);
  const male = page.locator('#wbody [data-k="Gender"]').getByRole("button", { name: "Male", exact: true });
  await male.evaluate((button) => button.click());
  await expect(male).toBeFocused();
  await selectWardrobe(page, "Hats");
  await expect(page.locator("#wbody .wardrobe-gear-group")).toHaveCount(5);
  await selectWardrobe(page, "Face");
  const eyes = page.locator('#wbody [data-k="Eyes"]').getByRole("button", { name: "Wink", exact: true });
  await eyes.evaluate((button) => button.click());
  await expect(eyes).toBeFocused();
  await expect(eyes).toHaveAttribute("aria-pressed", "true");
  await selectWardrobe(page, "Appearance");
  await expect(male).toHaveAttribute("aria-pressed", "true");
  expect(errors).toEqual([]);
});

test("profile banner refreshes names and level progress on reopen", async ({ page }) => {
  await page.evaluate(() => {
    S.xp = 40;
    S.p.buddy = "<b>Buddy</b> ⭐";
    S.p.name = "Walker 🔥";
  });
  await click(page, "#prof");
  await expect(page.locator("#mt")).toContainText("<b>Buddy</b>");
  await expect(page.locator("#mt b")).toHaveCount(0);
  await expect(page.locator("#mt .ic svg")).toHaveCount(1);
  await expect(page.locator("#mp3")).toContainText("Walker");
  await expect(page.locator("#mp3 .ic svg")).toHaveCount(2);
  await expect(page.locator("#mxt")).toHaveText("40 / 80 XP to level 2");
  await expect.poll(() => page.locator("#mxf").evaluate((el) => el.style.width)).toBe("50%");
  await page.evaluate(() => { S.xp = LV_START(10); S.p.buddy = "New buddy"; view("menu"); });
  await expect(page.locator("#mt")).toHaveText("New buddy");
  await expect(page.locator("#mxt")).toContainText("Max level reached!");
  await expect(page.locator("#mxt .ic svg")).toHaveCount(1);
  await expect.poll(() => page.locator("#mxf").evaluate((el) => el.style.width)).toBe("100%");
});

test("streak celebration updates its seven days when reopened", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 0, 7, 12));
  await page.evaluate(() => {
    S.days = { "2026-01-01": true, "2026-01-07": true };
    showSplash(true);
  });
  const days = page.locator("#spw .wd");
  await expect(days).toHaveCount(7);
  await expect(days.nth(0)).toHaveClass(/ok/);
  await expect(days.nth(1)).not.toHaveClass(/ok/);
  await expect(days.nth(6)).toHaveClass(/ok/);
  await expect(days.nth(6)).toHaveClass(/td/);
  await expect(days.nth(6).locator("i")).toHaveText("✓");
  await page.evaluate(() => {
    S.days["2026-01-07"] = false;
    S.days["2026-01-02"] = true;
    showSplash(true);
  });
  await expect(days).toHaveCount(7);
  await expect(days.nth(1)).toHaveClass(/ok/);
  await expect(days.nth(6)).not.toHaveClass(/ok/);
  await expect(days.nth(6)).toHaveClass(/td/);
  await click(page, "#spgo");
});

test("streak overlay keeps its tutorial button and restarts the counter", async ({ page }) => {
  await page.evaluate(() => {
    window.streakButton = document.getElementById("spgo");
    curStreak = 40;
    showSplash(true);
    curStreak = 2;
    showSplash(true);
  });
  await expect(page.locator("#sp")).toHaveAttribute("data-react-root", "");
  await expect(page.locator("#spn")).toHaveText("2");
  await page.waitForTimeout(900);
  await expect(page.locator("#spn")).toHaveText("2");
  expect(await page.evaluate(() => window.streakButton === document.getElementById("spgo"))).toBe(true);
  await page.locator("#sp").evaluate((element) => element.click());
  await expect(page.locator("#sp")).not.toHaveClass(/show/);
  expect(await page.evaluate(() => FIRE_ANIM.raf)).toBe(0);
});

test("levels and rewards reflect XP thresholds when reopened and after reload", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.evaluate(() => { S.xp = 79; save(); });
  await click(page, "#prof");
  await click(page, "#go-lv");
  const rows = page.locator("#lvlist .lvrow");
  await expect(rows).toHaveCount(10);
  await expect(rows.nth(0)).toHaveClass(/cur/);
  await expect(rows.nth(0)).toContainText("Noob");
  await expect(rows.nth(0)).toContainText("Start here");
  await expect(rows.nth(1)).toContainText("80 XP");
  await expect(rows.nth(1)).toContainText("Vanguard tunic");
  await expect(rows.nth(1).locator("span:last-child .ic svg")).toHaveCount(1);

  await page.evaluate(() => { S.xp = 80; save(); });
  await click(page, "#profile-header button");
  await click(page, "#go-lv");
  await expect(rows.nth(0)).toHaveClass(/past/);
  await expect(rows.nth(1)).toHaveClass(/cur/);
  await expect(rows.nth(1).locator("span:last-child .ic svg")).toHaveCount(1);
  await expect(rows.nth(2)).not.toHaveClass(/cur|past/);
  await page.evaluate(() => { S.xp = 3600; save(); });
  await page.reload();
  await continueLocally(page);
  await click(page, "#prof");
  await click(page, "#go-lv");
  await expect(rows).toHaveCount(10);
  await expect(rows.nth(9)).toHaveClass(/cur/);
  await expect(rows.filter({ hasText: "Legendary Grandmaster" })).toHaveCount(1);
  await expect(page.locator("#lvlist .lvrow.past")).toHaveCount(9);
  expect(errors).toEqual([]);
});

test("profile level overlays the progress bar without showing gender", async ({ page }) => {
  for (const [width, gender] of [[320, "male"], [1000, "female"]]) {
    await page.setViewportSize({ width, height: 720 });
    await page.evaluate((value) => { S.p.gender = value; S.xp = LV_START(10); }, gender);
    await click(page, "#prof");
    const title = page.locator("#mst .level-title");
    const level = page.locator("#profile-banner .profile-level-number");
    await expect(title).toBeVisible();
    await expect(level).toHaveText("Level 10");
    await expect(page.locator("#mst")).not.toContainText(/male/i);
    const layout = await page.evaluate(() => ({
      bannerTop: document.querySelector("#v-menu .banner").getBoundingClientRect().top,
      stageTop: document.querySelector("#v-menu .stage").getBoundingClientRect().top,
      title: document.querySelector("#mst .level-title").getBoundingClientRect().toJSON(),
      level: document.querySelector(".profile-level-number").getBoundingClientRect().toJSON(),
      bar: document.querySelector("#profile-banner .xbar").getBoundingClientRect().toJSON(),
      nameSize: parseFloat(getComputedStyle(document.querySelector("#mt")).fontSize),
      levelSize: parseFloat(getComputedStyle(document.querySelector(".profile-level-number")).fontSize),
    }));
    expect(layout.level.y).toBeGreaterThanOrEqual(layout.title.bottom);
    expect(layout.stageTop - layout.bannerTop).toBeGreaterThanOrEqual(30);
    expect(layout.level.y).toBe(layout.bar.y);
    expect(layout.level.height).toBe(layout.bar.height);
    expect(layout.levelSize).toBeLessThan(layout.nameSize);
    expect(await page.evaluate(() => S.p.gender)).toBe(gender);
    await click(page, "#pdone");
  }
});

test("supplied level titles load and fit throughout the traveler journey", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  const names = [
    "Noob", "Castle Page", "Squire-At-Arms", "Armored Squire", "Vanguard Shield-Bearer",
    "Realm Defender", "Sworn Knight", "Realm Champion", "Royal Paladin", "Legendary Grandmaster",
  ];
  for (const [index, name] of names.entries()) {
    const level = index + 1;
    await page.evaluate((n) => { S.xp = LV_START(n); drawHero(); }, level);
    const title = page.locator("#lvt");
    const image = title.locator("img");
    await expect(title).toHaveText(name);
    await expect(title).toHaveAttribute("data-level", String(level));
    await expect(image).toHaveAttribute("src", `assets/svg/level-titles/level-${level}.svg`);
    await expect.poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
    const fits = await image.evaluate((img) => {
      const bounds = img.getBoundingClientRect();
      const hero = document.querySelector("#hero").getBoundingClientRect();
      return bounds.left >= hero.left && bounds.right <= hero.right && bounds.width >= Math.min(img.naturalWidth, 200);
    });
    expect(fits).toBe(true);
  }
  await page.evaluate(() => save());
  await page.reload();
  await continueLocally(page);
  await expect(page.locator("#lvt")).toHaveText("Legendary Grandmaster");
  await expect(page.locator("#lvt")).toHaveAttribute("data-level", "10");
  await click(page, "#prof");
  await expect(page.locator("#mst .level-title")).toHaveAttribute("data-level", "10");
  await expect(page.locator('#mst .level-title img')).toHaveAttribute("src", "assets/svg/level-titles/level-10.svg");
  await click(page, "#go-lv");
  await expect(page.locator("#lvlist .level-title")).toHaveCount(10);
  await expect(page.locator('#lvlist .level-title[data-level="7"] img')).toHaveAttribute("src", "assets/svg/level-titles/level-7.svg");
  await click(page, "#profile-header button");
  await page.evaluate(() => { S.xp = LV_START(7); save(); drawHero(); });
  await expect(page.locator('#lvt img')).toHaveAttribute("src", "assets/svg/level-titles/level-7.svg");
  await click(page, "#pdone");
  await click(page, "#prof");
  await expect(page.locator('#mst .level-title img')).toHaveAttribute("src", "assets/svg/level-titles/level-7.svg");
  await click(page, "#go-wd");
  await expect(page.locator("#v-wd .level-title")).toHaveCount(0);
  await expect(page.locator("#v-wd").getByText("Lv 7", { exact: true })).toHaveCount(0);
  await page.evaluate(() => levelUp(7));
  await expect(page.locator("#lut .level-title")).toHaveAttribute("data-level", "7");
  await expect(page.locator('#lut img')).toHaveAttribute("src", "assets/svg/level-titles/level-7.svg");
});

test("traveler and streak align in the corner and remain usable", async ({ page }) => {
  for (const width of [320, 1000]) {
    await page.setViewportSize({ width, height: 720 });
    const positions = await page.evaluate(() => {
      const avatar = document.querySelector("#av").getBoundingClientRect();
      const badge = document.querySelector("#sb").getBoundingClientRect();
      const head = document.querySelector("#pal .person-head").getBoundingClientRect();
      return {
        left: avatar.left,
        avatar: avatar.x + avatar.width / 2,
        badge: badge.x + badge.width / 2,
        head: head.x + head.width / 2,
      };
    });
    expect(positions.left).toBe(8);
    expect(Math.abs(positions.badge - positions.avatar)).toBeLessThan(1);
    expect(Math.abs(positions.head - positions.badge)).toBeLessThan(1);
    await click(page, "#av");
    await expect(page.locator("#bubble")).toBeVisible();
    const bubble = await page.locator("#bubble").boundingBox();
    expect(bubble.x).toBeGreaterThanOrEqual(0);
    expect(bubble.x + bubble.width).toBeLessThanOrEqual(width);
    await click(page, "#bubble");
    await click(page, "#sb");
    await expect(page.locator("#sp")).toBeVisible();
    await click(page, "#spgo");
  }
});

test("customizes and persists a pixel traveler and their clothes", async ({ page }) => {
  await expect(page.locator('#ixh [data-i="book"] svg')).toBeAttached();
  await click(page, "#prof");
  await expect(page.locator('#go-wd [data-i="wardrobe"] svg')).toBeAttached();
  await openAppearance(page);
  await expect(page.locator("#buddy")).toBeHidden();
  const section = (name) => page.locator("#wbody .fl").filter({ hasText: new RegExp("^" + name) });
  const choose = async (sectionName, name) => {
    await section(sectionName).getByRole("button", { name, exact: true })
      .evaluate((button) => button.click());
  };
  await choose("Gender", "Female");
  await choose("Skin color", "Deep");
  await choose("Hair type", "Curly");
  await choose("Hair color", "Auburn");
  await choose("Eye color", "Green");
  await selectWardrobe(page, "Tops");
  await page.locator("#wbody .pcard").filter({ hasText: "T-shirt" })
    .evaluate((button) => button.click());
  await choose("Color", "Red");

  const before = await page.evaluate(() => ({
    person: [S.p.gender, S.p.skin, S.p.hair, S.p.hairColor, S.p.eyeColor, S.p.topStyle, S.p.topColor],
    avatar: document.querySelector("#pal").innerHTML,
  }));
  expect(before.person).toEqual(["female", "deep", "curly", "auburn", "green", "tee", "red"]);
  expect(before.avatar).toContain('class="pixel-person"');
  expect(before.avatar).toContain("#603c30");
  expect(before.avatar).toContain("#a65030");
  expect(before.avatar).toContain("#5c8c68");
  expect(before.avatar).toContain("#c94a4a");
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate(() => document.querySelector("#pal").innerHTML)).toBe(before.avatar);
  expect(await page.evaluate(() => [S.p.gender, S.p.skin, S.p.hair, S.p.hairColor, S.p.eyeColor, S.p.topStyle, S.p.topColor])).toEqual(before.person);
  await click(page, 'button[data-p="t"]');
  expect(await page.evaluate(() => document.querySelector("#walkers .pixel-person") !== null)).toBe(true);
});

test("saved blush is preserved without rendering or offering it", async ({ page }) => {
  await page.evaluate(() => {
    S.p.ex.cheeks = true;
    save();
  });
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate(() => ({
    saved: S.p.ex.cheeks,
    matchesWithoutBlush: personLayers(S.p) === personLayers({ ...S.p, ex: { ...S.p.ex, cheeks: false } }),
    announced: LOCKS.some((item) => item[1] === "cheeks"),
  }))).toEqual({ saved: true, matchesWithoutBlush: true, announced: false });
  await click(page, "#prof");
  await click(page, "#go-wd");
  await selectWardrobe(page, "Extras");
  await expect(page.locator("#wbody")).not.toContainText(/blush/i);
});

test("pixel artwork responds to appearance and gear choices throughout the app", async ({ page }) => {
  await page.evaluate(() => {
    S.xp = 99999;
    S.nb.xp = freshState("").nb.xp;
    S.p.hat = "none";
    S.p.pet = "none";
    S.p.eyeColor = "brown";
    S.p.ex = {};
    save();
    paint();
  });
  await click(page, "#prof");
  await openAppearance(page);
  const preview = page.locator(".wardrobe-preview .pv");
  const select = async (group, name) =>
    page.locator(`#wbody [data-k="${group}"]`).getByRole("button", { name, exact: true })
      .evaluate((button) => button.click());
  const images = [];
  for (const style of ["Bald", "Short", "Long", "Curly", "Ponytail"]) {
    await select("Hair type", style);
    images.push(await preview.innerHTML());
  }
  expect(new Set(images).size).toBe(5);

  await selectWardrobe(page, "Face");
  const eyes = [];
  for (const style of ["Normal", "Round", "Happy", "Wink"]) {
    await select("Eyes", style);
    eyes.push(await preview.innerHTML());
    if (style === "Normal" || style === "Happy") {
      expect(await preview.locator(".eyes rect").evaluateAll((rects) =>
        rects.map((rect) => ["x", "y", "width", "height", "fill"].map((attribute) => rect.getAttribute(attribute))),
      )).toEqual([
        ["8", "9", "1", "2", "#f0ece6"],
        ["9", "9", "2", "2", "#2b1810"],
        ["15", "9", "1", "2", "#f0ece6"],
        ["13", "9", "2", "2", "#2b1810"],
      ]);
      await expect(preview.locator('.pixel-person rect[x="8"][y="12"][width="8"][height="1"]')).toHaveCount(0);
    }
  }
  expect(new Set(eyes).size).toBe(4);

  await selectWardrobe(page, "Appearance");
  await select("Eye color", "Green");
  await expect(preview.locator('.eyes rect[x="9"][width="2"]')).toHaveAttribute("fill", "#5c8c68");

  await selectWardrobe(page, "Hats");
  await page.getByRole("button", { name: /Sentinel helmet/ }).evaluate((button) => button.click());
  await page.getByRole("group", { name: "Wardrobe categories" }).getByRole("button", { name: "Tops" }).click();
  await page.getByRole("button", { name: /Vanguard tunic/ }).evaluate((button) => button.click());
  await expect(preview.locator('.person-hat rect[x="11"][y="2"][width="2"][height="5"]')).toHaveAttribute("fill", "#8996a6");
  const artwork = await preview.innerHTML();
  expect(await page.locator("#pal").innerHTML()).toBe(artwork);
  expect(await page.locator("#profile-buddy").innerHTML()).toBe(artwork);
  await click(page, "#pdone");
  await click(page, 'button[data-p="t"]');
  expect(await page.locator('#walkers .w[aria-label="Your traveler"] .bod').innerHTML()).toBe(artwork);
});

test("keeps the preview above the options and preserves old gender values until changed", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.evaluate(() => {
    S.p.gender = "nonbinary";
    S.tutorialDone = true;
    save();
  });
  await click(page, "#prof");
  await openAppearance(page);
  const choices = page.locator('#wbody [data-k="Gender"] button');
  await expect(choices).toHaveText(["Female", "Male"]);
  const preview = await page.locator(".wardrobe-preview").boundingBox();
  const options = await page.locator("#wbody").boundingBox();
  expect(preview.y + preview.height).toBeLessThanOrEqual(options.y);
  expect(await page.evaluate(() => {
    const sheet = document.querySelector("#pm .sheet");
    return sheet.scrollWidth <= sheet.clientWidth;
  })).toBe(true);
  const pinned = await page.evaluate(() => {
    const sheet = document.querySelector("#pm .sheet");
    sheet.scrollTop = 350;
    const preview = document.querySelector(".wardrobe-preview").getBoundingClientRect();
    const bounds = sheet.getBoundingClientRect();
    return preview.top >= bounds.top && preview.bottom <= bounds.bottom;
  });
  expect(pinned).toBe(true);
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate(() => S.p.gender)).toBe("nonbinary");
  await expect(page.locator("#buddy")).toBeVisible();
  await click(page, "#prof");
  await openAppearance(page);
  const male = page.getByRole("button", { name: "Male", exact: true });
  await male.click();
  await expect(male).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate(() => S.p.gender)).toBe("male");
});

test("gender can be changed repeatedly with distinct appearance and without changing hair or clothes", async ({ page }) => {
  await page.evaluate(() => {
    S.p.hat = "none";
    S.p.glasses = "none";
    S.p.pet = "none";
    S.p.gender = "female";
    S.p.genderLocked = true;
    S.p.hair = "long";
    S.p.topStyle = "jacket";
    S.p.topColor = "red";
    S.tutorialDone = true;
    save();
  });
  await page.reload();
  await continueLocally(page);
  if (await page.locator("#sp").isVisible()) await page.locator("#spgo").click();
  if (await page.locator("#tour").isVisible()) await page.locator("#tour-skip").click();
  await page.locator("#prof").click();
  await openAppearance(page);
  const gender = page.locator('#wbody [data-k="Gender"]');
  const preview = page.locator(".wardrobe-preview .pv");
  const female = gender.getByRole("button", { name: "Female", exact: true });
  const male = gender.getByRole("button", { name: "Male", exact: true });
  const femaleHead = await preview.locator(".person-head").evaluate((head) => head.tagName);
  const femaleBody = await preview.locator(".person-body").evaluate((body) => body.tagName);
  await expect(female).toBeEnabled();
  await expect(male).toBeEnabled();
  await male.click();
  await expect(male).toHaveAttribute("aria-pressed", "true");
  await expect(female).toHaveAttribute("aria-pressed", "false");
  expect(await preview.locator(".person-head").evaluate((head) => head.tagName)).not.toBe(femaleHead);
  expect(await preview.locator(".person-body").evaluate((body) => body.tagName)).not.toBe(femaleBody);
  expect(await page.evaluate(() => [S.p.hair, S.p.topStyle, S.p.topColor])).toEqual(["long", "jacket", "red"]);
  await female.click();
  await expect(female).toHaveAttribute("aria-pressed", "true");
  await male.click();
  const first = await preview.boundingBox();
  await page.waitForTimeout(800);
  const second = await preview.boundingBox();
  expect(second).toEqual(first);
  expect(await preview.evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
  expect(await preview.evaluate((e) => getComputedStyle(e).animationName)).toBe("none");
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate(() => S.p.gender)).toBe("male");
  await page.locator("#prof").click();
  await openAppearance(page);
  await page.getByRole("button", { name: "Female", exact: true }).click();
  expect(await page.evaluate(() => S.p.gender)).toBe("female");
  await click(page, "#profile-header button");
  await click(page, "#pdone");
  await click(page, "#ubar");
  await click(page, "#uadd");
  expect(await page.evaluate(() => S.p.gender)).toBe("unspecified");
  await click(page, "#ubar");
  await page.locator("#ulist .uitem").filter({ hasText: "Player 1" })
    .getByRole("button", { name: "Switch" })
    .evaluate((button) => button.click());
  expect(await page.evaluate(() => S.p.gender)).toBe("female");
});

test("a failed gender save reports the error and keeps choices available", async ({ page }) => {
  await click(page, "#prof");
  await openAppearance(page);
  await page.evaluate(() => {
    window.originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.includes(":u:")) throw new DOMException("Storage full", "QuotaExceededError");
      return window.originalSetItem.call(this, key, value);
    };
  });
  await page.getByRole("button", { name: "Female", exact: true })
    .evaluate((button) => button.click());
  expect(await page.evaluate(() => S.p.gender)).toBe("female");
  await expect(page.locator("#ubstat")).toContainText("not saved");
  await expect(page.getByRole("button", { name: "Male", exact: true })).toBeEnabled();
});

test("habit levels unlock optional warrior gear and keep equipped gear on reload", async ({ page }) => {
  await page.evaluate(() => {
    S.xp = 70;
    S.aw = { d: today(), k: {} };
    S.checks[today()] = {};
    S.p.topStyle = "tee";
    S.p.hat = "none";
    S.p.ex = {};
    save();
    render();
  });
  await click(page, "#prof");
  await click(page, "#go-wd");
  await selectWardrobe(page, "Warrior gear");
  await expect(page.locator("#wbody button").filter({ hasText: "Vanguard tunic" })).toBeDisabled();
  await expect(page.locator("#wbody button").filter({ hasText: "Apprentice sword" })).toBeDisabled();
  await click(page, "#pdone");
  await click(page, 'input[data-id="wake"]');
  expect(await page.evaluate(() => [lvOf(S.xp), S.p.topStyle])).toEqual([2, "tee"]);
  await click(page, "#prof");
  await click(page, "#go-wd");
  await selectWardrobe(page, "Warrior gear");
  await page.locator("#wbody button").filter({ hasText: "Vanguard tunic" }).evaluate((button) => button.click());
  expect(await page.evaluate(() => S.p.topStyle)).toBe("tunic");
  const levels = await page.evaluate(() => WARRIOR_GEAR.map(([slot, value, , level]) => {
    S.xp = LV_START(level) - 1;
    const before = lockLv(slot, value) <= lvOf(S.xp);
    S.xp = LV_START(level);
    return [before, lockLv(slot, value) <= lvOf(S.xp)];
  }));
  expect(levels).toEqual([[false, true], [false, true], [false, true], [false, true], [false, true]]);
  await page.evaluate(() => { S.xp = LV_START(9); save(); buildWd(); });
  for (const name of ["Apprentice sword", "Guardian shield", "Sentinel armor", "Sentinel helmet"]) {
    await page.locator("#wbody button").filter({ hasText: name }).evaluate((button) => button.click());
  }
  const gear = await page.evaluate(() => ({
    top: S.p.topStyle,
    hat: S.p.hat,
    sword: S.p.ex.sword,
    shield: S.p.ex.shield,
    avatar: document.querySelector("#pal").innerHTML,
  }));
  expect([gear.top, gear.hat, gear.sword, gear.shield]).toEqual(["armor", "knight", true, true]);
  expect(gear.avatar).toContain("warrior-sword");
  expect(gear.avatar).toContain("warrior-shield");
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate(() => [S.p.topStyle, S.p.hat, S.p.ex.sword, S.p.ex.shield])).toEqual(["armor", "knight", true, true]);
});

test("equipped warrior armor and helmet can be removed and re-equipped", async ({ page }) => {
  await page.evaluate(() => {
    S.tutorialDone = true;
    S.xp = LV_START(9);
    S.p.topStyle = "armor";
    S.p.hat = "knight";
    S.p.ex.sword = true;
    save();
  });
  if (await page.locator("#sp").isVisible()) await page.locator("#spgo").click();
  await page.locator("#prof").click();
  await page.locator("#go-wd").click();
  await selectWardrobe(page, "Warrior gear");
  const armor = page.locator("#wbody button").filter({ hasText: "Sentinel armor" });
  const helmet = page.locator("#wbody button").filter({ hasText: "Sentinel helmet" });
  await expect(armor).toHaveAttribute("aria-pressed", "true");
  await expect(helmet).toContainText("Tap to remove");
  await armor.click();
  await helmet.click();
  expect(await page.evaluate(() => [S.p.topStyle, S.p.hat, S.p.ex.sword])).toEqual(["tee", "none", true]);
  await expect(armor).toHaveAttribute("aria-pressed", "false");
  await expect(helmet).toHaveAttribute("aria-pressed", "false");
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate(() => [S.p.topStyle, S.p.hat])).toEqual(["tee", "none"]);
  await page.locator("#prof").click();
  await page.locator("#go-wd").click();
  await selectWardrobe(page, "Warrior gear");
  await armor.click();
  await helmet.click();
  expect(await page.evaluate(() => [S.p.topStyle, S.p.hat])).toEqual(["armor", "knight"]);
  await page.evaluate(() => { S.xp = 0; buildWd(); });
  await expect(armor).toBeEnabled();
  await expect(helmet).toBeEnabled();
  await armor.click();
  await helmet.click();
  await expect(armor).toBeDisabled();
  await expect(helmet).toBeDisabled();
});

test("the people index preserves search during updates and resets it when reopened", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.evaluate(() => {
    S.peopleMet = [
      { id: "a", name: "Amy 🌙 <b>", town: "meadow", look: structuredClone(S.p) },
      { id: "b", name: "Bea", town: "seaside", look: structuredClone(S.p) },
      { id: "invalid", name: "Ignored", town: "unknown", look: structuredClone(S.p) },
    ];
    save();
  });
  await click(page, "#ixh");
  await expect(page.locator("#ixs")).toHaveText("2 people met in 2 towns");
  await expect(page.locator("#ixsub")).toHaveText("2 people met");
  await expect(page.locator("#ixl .ixp svg")).toHaveCount(2);
  await expect(page.locator("#ixl .ixc").first().locator("b")).toContainText("<b>");
  await expect(page.locator("#ixl .ixc").first().locator("b .ic svg")).toHaveCount(1);
  await page.locator("#ixsearch").fill("  MEADOW ");
  await expect(page.locator("#ixl .ixc")).toHaveCount(1);
  await page.evaluate(() => {
    S.peopleMet.push({ id: "c", name: "Cal", town: "meadow", look: structuredClone(S.p) });
    fillIndex();
  });
  await expect(page.locator("#ixsearch")).toHaveValue("  MEADOW ");
  await expect(page.locator("#ixl .ixc")).toHaveCount(2);
  await expect(page.locator("#ixs")).toHaveText("3 people met in 2 towns");
  await page.locator("#ixsearch").fill("no matches");
  await expect(page.locator("#ixempty")).toBeVisible();
  await click(page, "#ixdone");
  await click(page, "#ixh");
  await expect(page.locator("#ixsearch")).toHaveValue("");
  await expect(page.locator("#ixl .ixc")).toHaveCount(3);
  await page.locator("#ix").evaluate((modal) => modal.click());
  await expect(page.locator("#ix")).not.toHaveClass(/show/);
  expect(errors).toEqual([]);
});

test("the guided tour can still open and highlight the people index", async ({ page }) => {
  await page.evaluate(() => startTour());
  for (let step = 0; step < 6; step++) {
    await page.locator(".tour-interactive").click();
    await expect(page.locator("#tour-next")).toBeEnabled();
    await page.locator("#tour-next").click();
  }
  await expect(page.locator("#tour-title")).toHaveText("People you meet");
  await page.locator(".tour-interactive").click();
  await expect(page.locator("#tour-next")).toBeEnabled();
  await expect(page.locator("#ix")).toHaveClass(/show/);
  await expect(page.locator("#ix .sheet")).toHaveClass(/tour-highlight/);
  await click(page, "#tour-skip");
  await expect(page.locator("#ix")).not.toHaveClass(/show/);
});

test("the expanded tour guides every feature, preserves progress, and can be replayed", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const before = await page.evaluate(() => {
    S.tutorialDone = false;
    S.splash = today();
    save();
    const progress = JSON.stringify({ tasks: S.tasks, checks: S.checks, xp: S.xp, town: S.nb.cur, player: S.p });
    startTour();
    return progress;
  });
  const titles = [
    "Your daily checklist", "Add your own habits", "XP, levels and streaks",
    "Water and journal", "Helping your town", "Explore the world",
    "People you meet", "Your traveler and gear", "Levels and rewards",
    "Ranks and friend codes", "Profiles and backups",
  ];
  for (const [index, title] of titles.entries()) {
    await expect(page.locator("#tour-title")).toHaveText(title);
    await expect(page.locator("#tour-step")).toHaveText(`${index + 1} of ${titles.length}`);
    await expect(page.locator("#tour-icon svg")).toHaveCount(1);
    await expect(page.locator("#tour-next")).toBeDisabled();
    const target = page.locator(".tour-interactive");
    const bounds = await target.boundingBox();
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.y).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(568);
    await target.click();
    await expect(page.locator("#tour-next")).toBeEnabled();
    await expect(page.locator(".tour-highlight")).toBeVisible();
    await expect(page.locator("#tour-text")).not.toBeEmpty();
    if (index === 1) {
      await page.locator("#tour-back").click();
      await expect(page.locator("#tour-title")).toHaveText(titles[0]);
      await page.locator(".tour-interactive").click();
      await expect(page.locator("#tour-next")).toBeEnabled();
      await page.locator("#tour-next").click();
      await page.locator(".tour-interactive").click();
      await expect(page.locator("#tour-next")).toBeEnabled();
    }
    await page.locator("#tour-next").click();
  }
  await expect(page.locator("#tour")).toBeHidden();
  for (const selector of ["#gl", "#pm", "#ix"]) {
    await expect(page.locator(selector)).not.toHaveClass(/show/);
  }
  expect(await page.evaluate(() => JSON.stringify({ tasks: S.tasks, checks: S.checks, xp: S.xp, town: S.nb.cur, player: S.p }))).toBe(before);
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate(() => S.tutorialDone)).toBe(true);
  await expect(page.locator("#tour")).toBeHidden();
  await click(page, "#prof");
  await click(page, "#go-tour");
  await expect(page.locator("#tour-title")).toHaveText(titles[0]);
  await page.locator("#tour-skip").click();
  await expect(page.locator("#tour")).toBeHidden();
  expect(errors).toEqual([]);
});

test("the tour starts for an unfinished profile and skipping remains saved", async ({ page }) => {
  await page.evaluate(() => {
    S.tutorialDone = false;
    S.splash = today();
    save();
  });
  await page.reload();
  await continueLocally(page);
  await expect(page.locator("#tour")).toBeVisible();
  await page.locator("#tour-skip").click();
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate(() => S.tutorialDone)).toBe(true);
  await page.waitForTimeout(600);
  await expect(page.locator("#tour")).toBeHidden();
});

test("the tour accepts keyboard activation and blocks unrelated buttons", async ({ page }) => {
  await page.evaluate(() => startTour());
  await expect(page.locator('.nv[data-p="h"]')).toBeFocused();
  await page.evaluate(() => document.querySelector('.nv[data-p="t"]').click());
  await expect(page.locator("#pg-h")).toBeVisible();
  await expect(page.locator("#tour-next")).toBeDisabled();
  await page.keyboard.press("Enter");
  await expect(page.locator("#tour-next")).toBeEnabled();
  await page.locator("#tour-next").click();
  await expect(page.locator("#fab")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#hm")).toHaveClass(/show/);
  await expect(page.locator("#tour-next")).toBeEnabled();
  await page.locator("#tour-skip").click();
  await expect(page.locator("#hm")).not.toHaveClass(/show/);
});

test("the people index records only people tapped and keeps encounters across towns", async ({ page }) => {
  const noon = new Date();
  noon.setHours(12, 0, 0, 0);
  await page.clock.setFixedTime(noon);
  await page.evaluate(() => {
    S.res = freshState("").res;
    S.peopleMet = [];
    S.nb.cur = "meadow";
    S.nb.xp.meadow = MAXAT;
    save();
  });
  await click(page, 'button[data-p="t"]');
  expect(await page.evaluate(() => townCast().filter((person) => person.k === "res").map((person) => person.id))).toEqual(["resident:0"]);
  await click(page, "#ixbtn");
  await expect(page.locator("#ixs")).toContainText("Tap a person");
  await expect(page.locator("#ixsearch")).toBeHidden();
  await expect(page.locator("#ixempty")).toBeHidden();
  await expect(page.locator("#ixl .ixc")).toHaveCount(0);
  await click(page, "#ixdone");
  await click(page, '#walkers [role="button"]:nth-child(2)');
  await click(page, "#bdone");
  await click(page, '#walkers [role="button"]:nth-child(2)');
  await click(page, "#bdone");
  expect(await page.evaluate(() => S.peopleMet.length)).toBe(1);
  await click(page, "#wbtn");
  await click(page, "#wc-seaside .wbt");
  await expect(page.locator("#tnb")).toHaveText("Seaside Harbor", { timeout: 5000 });
  expect(await page.evaluate(() => townCast().filter((person) => person.k === "res").map((person) => person.id))).toEqual(["resident:1"]);
  await click(page, '#walkers [role="button"]:nth-child(2)');
  await click(page, "#bdone");
  await click(page, "#ixbtn");
  await expect(page.locator("#ixl .ixc")).toHaveCount(2);
  await expect(page.locator("#ixl")).toContainText("Met in Meadow Valley");
  await expect(page.locator("#ixl")).toContainText("Met in Seaside Harbor");
  await expect(page.locator("#ixs")).toHaveText("2 people met in 2 towns");
  await expect(page.locator("#ixl .index-town h4")).toHaveText(["Meadow Valley", "Seaside Harbor"]);
  await page.locator("#ixsearch").fill("seaside");
  await expect(page.locator("#ixl .ixc")).toHaveCount(1);
  await expect(page.locator("#ixl")).toContainText("Met in Seaside Harbor");
  await page.locator("#ixsearch").fill("no matching person");
  await expect(page.locator("#ixempty")).toBeVisible();
  await page.locator("#ixsearch").fill("");
  await expect(page.locator("#ixl .ixc")).toHaveCount(2);
  await expect(page.locator("#ix")).not.toContainText("Equip Buddy");
  const met = await page.evaluate(() => S.peopleMet);
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate(() => S.peopleMet)).toEqual(met);
  await click(page, "#ixh");
  await expect(page.locator("#ixl .ixc")).toHaveCount(2);
  await click(page, "#ixdone");
  await click(page, "#ubar");
  await click(page, "#uadd");
  expect(await page.evaluate(() => S.peopleMet)).toEqual([]);
  await click(page, "#ubar");
  await page.locator("#ulist .uitem").filter({ hasText: "Player 1" })
    .getByRole("button", { name: "Switch" })
    .evaluate((button) => button.click());
  expect(await page.evaluate(() => S.peopleMet)).toEqual(met);
});

test("old saves hydrate without losing existing progress and backups restore new fields", async ({ page }) => {
  const old = await page.evaluate(() => {
    const raw = structuredClone(S);
    delete raw.peopleMet;
    for (const key of ["gender", "genderLocked", "skin", "hair", "hairColor", "eyeColor", "pantsStyle", "shoeStyle"]) delete raw.p[key];
    return raw;
  });
  const migrated = await page.evaluate((raw) => {
    const state = hydrateState(raw);
    return {
      people: state.peopleMet,
      appearance: [state.p.gender, state.p.skin, state.p.hair, state.p.hairColor, state.p.eyeColor],
      clothing: [state.p.pants, state.p.shoes, state.p.pantsStyle, state.p.shoeStyle],
      kind: state.p.kind,
      pet: state.p.pet,
      xp: state.nb.xp,
      residents: state.res,
    };
  }, old);
  expect(migrated.people).toEqual([]);
  expect(migrated.appearance).toEqual(["unspecified", "medium", "short", "brown", "brown"]);
  expect(migrated.clothing).toEqual([old.p.pants, old.p.shoes, "classic", "classic"]);
  expect(migrated.kind).toBe(old.p.kind);
  expect(migrated.pet).toBe(old.p.pet);
  expect(migrated.xp).toEqual(old.nb.xp);
  expect(migrated.residents).toEqual(old.res);
  expect(await page.evaluate((raw) => {
    const saved = structuredClone(raw);
    saved.p.topStyle = "none";
    saved.p.pants = "none";
    const hydrated = hydrateState(saved);
    return [hydrated.p.topStyle, hydrated.p.pants, hydrated.p.shoes];
  }, old)).toEqual(["tee", "black", old.p.shoes]);

  const backup = await page.evaluate(() => {
    S.p.skin = "deep";
    S.p.gender = "female";
    S.p.genderLocked = true;
    S.p.pantsStyle = "cargo";
    S.p.shoeStyle = "desert";
    S.peopleMet = [{ id: "town:meadow:0", name: "Ruth", town: "meadow", look: npcLook(0) }];
    return structuredClone(S);
  });
  await page.locator("#ufile").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({ data: backup })),
  });
  await expect(page.locator("#toast")).toContainText("restored");
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate(() => [S.p.skin, S.p.gender, S.p.genderLocked, S.peopleMet]))
    .toEqual(["deep", "female", undefined, backup.peopleMet]);
  expect(await page.evaluate(() => [S.p.pantsStyle, S.p.shoeStyle])).toEqual(["cargo", "desert"]);
  await click(page, "#prof");
  await openAppearance(page);
  await page.getByRole("button", { name: "Male", exact: true })
    .evaluate((button) => button.click());
  expect(await page.evaluate(() => S.p.gender)).toBe("male");
  await page.locator("#ufile").setInputFiles({
    name: "older-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({ data: old })),
  });
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate(() => [S.p.gender, S.p.genderLocked])).toEqual(["unspecified", undefined]);
  const undressed = structuredClone(old);
  undressed.p.topStyle = "none";
  undressed.p.pants = "none";
  await page.locator("#ufile").setInputFiles({
    name: "older-clothing-backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify({ data: undressed })),
  });
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate(() => [S.p.topStyle, S.p.pants, S.p.shoes, S.xp]))
    .toEqual(["tee", "black", old.p.shoes, old.xp]);
});
