const { test, expect } = require("@playwright/test");
const { continueLocally, reachStartupChoice, completeAvatar } = require("./helpers/onboarding");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const site = "http://localhost:43999";
const supabase = "https://dnnpakvhiipflpvmkymf.supabase.co";
const headers = { "Access-Control-Allow-Origin": "*" };

async function setup(page, cloud, { skipOnboarding = false } = {}) {
  const writes = [];
  await page.route(`${site}/**`, async (route) => {
    const url = new URL(route.request().url());
    await route.fulfill({ path: path.join(root, url.pathname === "/" ? "index.html" : url.pathname.slice(1)) });
  });
  await page.route(`${supabase}/auth/v1/**`, async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("/authorize")) return route.fulfill({ body: "Google authorization" });
    if (url.pathname.endsWith("/logout")) return route.fulfill({ status: 204, headers });
    if (url.pathname.endsWith("/token")) return route.fulfill({ headers, json: {
      access_token: "startup-token", refresh_token: "startup-refresh", token_type: "bearer",
      expires_in: 3600, user: { id: "startup-user", email: "walker@example.com", app_metadata: {},
        user_metadata: {}, aud: "authenticated", created_at: "2026-01-01T00:00:00Z" },
    } });
    throw new Error(`Unexpected authentication request: ${url.pathname}`);
  });
  await page.route(`${supabase}/rest/v1/**`, async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("/walk_profiles")) {
      if (cloud.failList) return route.fulfill({ status: 403, headers, json: { message: "Cloud unavailable" } });
      return route.fulfill({ headers, json: Array.from(cloud.values(), ({ profile }) => ({
        id: profile.id, display_name: profile.profile.name,
      })) });
    }
    const request = route.request().postDataJSON();
    if (url.pathname.endsWith("/read_walk_profile")) {
      return route.fulfill({ headers, body: JSON.stringify(cloud.get(request.profile_id) || null),
        contentType: "application/json" });
    }
    if (!url.pathname.endsWith("/save_walk_profile_checked")) throw new Error(`Unexpected RPC: ${url.pathname}`);
    writes.push(request);
    const previous = cloud.get(request.profile_id);
    if ((previous?.profile.client_modified_at || 0) !== request.expected_modified_at) {
      return route.fulfill({ headers, json: false });
    }
    cloud.set(request.profile_id, snapshot(request.profile_id, request.state, request.modified_at));
    return route.fulfill({ headers, json: true });
  });
  await page.goto(site);
  if (!skipOnboarding) await reachStartupChoice(page);
  return writes;
}

function snapshot(id, state, revision = 100) {
  return {
    profile: {
      id, owner_id: "startup-user", profile: state.p, habits: state.tasks,
      progress: { _dailyWalkSyncSnapshot: state }, xp: state.xp, lifetime_xp: state.life,
      state_version: state.v, client_modified_at: revision,
    },
    activity: [],
  };
}

async function cloudState(page, name, xp) {
  return page.evaluate(({ name, xp }) => {
    const state = structuredClone(S);
    state.p.name = name;
    state.xp = xp;
    state.life = xp;
    state.tutorialDone = true;
    state.splash = today();
    return state;
  }, { name, xp });
}

async function signIn(page, button) {
  await button.click();
  await expect(page).toHaveURL(/\/auth\/v1\/authorize/);
  await page.goto(`${site}/?code=test-code`);
}

test("feature handlers are wired at bootstrap and work after startup", async ({ page }) => {
  let release;
  let bootstrapRequested;
  const requested = new Promise((resolve) => { bootstrapRequested = resolve; });
  const gate = new Promise((resolve) => { release = resolve; });
  await page.route(`${site}/**`, async (route) => {
    const url = new URL(route.request().url());
    await route.fulfill({ path: path.join(root, url.pathname === "/" ? "index.html" : url.pathname.slice(1)) });
  });
  await page.route(`${site}/assets/js/app.js*`, async (route) => {
    bootstrapRequested();
    await gate;
    await route.fulfill({ path: path.join(root, "assets/js/app.js") });
  });
  const navigation = page.goto(site);
  try {
    await requested;
    const handlers = await page.evaluate(() =>
      ["ubar"].map((id) => document.getElementById(id).onclick),
    );
    expect(handlers).toEqual([null]);
  } finally {
    release();
  }
  await navigation;
  await continueLocally(page);
  await page.locator("#prof").click();
  await expect(page.locator("#pm")).toHaveClass(/show/);
  await page.locator("#go-info").click();
  await expect(page.locator("#v-info")).toBeVisible();
});

test("first-time onboarding saves the name and avatar before choosing local mode", async ({ page }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  const welcome = page.getByRole("main", { name: "Ready to begin your journey with Steadfast Steps?" });
  await expect(welcome).toBeVisible();
  const font = (locator) => locator.evaluate((element) => getComputedStyle(element).fontFamily);
  expect(await font(welcome.getByRole("heading"))).toContain("Tiny5");
  expect(await font(welcome.getByRole("button", { name: "Ready" }))).toContain("Tiny5");
  expect(await page.evaluate(() => localStorage.getItem("dailywalk_admin_max:users:v3"))).toBeNull();
  await welcome.getByRole("button", { name: "Ready" }).click();
  const avatar = page.getByRole("main", { name: "Edit your avatar" });
  await avatar.getByLabel("Your name").fill("  River  ");
  expect(await font(avatar.locator("p"))).toContain("Tiny5");
  expect(await font(avatar.getByLabel("Skin color"))).toContain("Tiny5");
  const initialPreview = await avatar.getByRole("img", { name: "Traveler preview" }).innerHTML();
  await avatar.getByLabel("Gender").selectOption("female");
  await avatar.getByLabel("Skin color").selectOption("deep");
  await avatar.getByLabel("Hair type").selectOption("curly");
  await avatar.getByLabel("Hair color").selectOption("auburn");
  await avatar.getByLabel("Eye color").selectOption("green");
  expect(await avatar.getByRole("img", { name: "Traveler preview" }).innerHTML()).not.toBe(initialPreview);
  await page.reload();
  await expect(avatar.getByLabel("Skin color")).toHaveValue("deep");
  await expect(avatar.getByLabel("Your name")).toHaveValue("  River  ");
  await avatar.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("main", { name: "Your habits" }).getByRole("button", { name: "Continue", exact: true }).click();
  expect(await font(page.getByText("Sign in to use your cloud profile, or continue with a profile on this device.")))
    .toContain("Tiny5");
  expect(await page.evaluate(() => localStorage.getItem("dailywalk_admin_max:users:v3"))).toBeNull();
  await page.getByRole("button", { name: "Continue locally" }).click();
  expect(await page.evaluate(() => {
    const { name, gender, skin, hair, hairColor, eyeColor } = readStoredProfile(CUR_UID).p;
    return { name, gender, skin, hair, hairColor, eyeColor };
  })).toEqual({ name: "River", gender: "female", skin: "deep", hair: "curly", hairColor: "auburn", eyeColor: "green" });
  await expect(page.locator("#tour")).toBeVisible();
  await expect(page.locator("#tour-title")).toHaveText("Your daily checklist");
  await expect(page.locator("#sp")).not.toHaveClass(/show/);
  await page.getByRole("button", { name: "Skip" }).click();
  await page.reload();
  await continueLocally(page);
  await expect(page.locator("#sp")).not.toHaveClass(/show/);
});

test("avatar setup requires a non-blank name and preserves it when navigating back", async ({ page }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  await page.getByRole("button", { name: "Ready" }).click();
  const avatar = page.getByRole("main", { name: "Edit your avatar" });
  const name = avatar.getByLabel("Your name");
  await expect(name).toHaveAttribute("maxlength", "20");
  await avatar.getByRole("button", { name: "Continue" }).click();
  await expect(avatar.getByRole("alert")).toHaveText("Enter your name to continue.");
  await expect(name).toBeFocused();
  await name.fill("   ");
  await avatar.getByRole("button", { name: "Continue" }).click();
  await expect(avatar.getByRole("alert")).toHaveText("Enter your name to continue.");
  expect(await page.evaluate(() => localStorage.getItem("dailywalk_admin_max:users:v3"))).toBeNull();
  await name.fill("  Walker  ");
  await avatar.getByRole("button", { name: "Continue" }).click();
  const habits = page.getByRole("main", { name: "Your habits" });
  await habits.getByRole("button", { name: "Back" }).click();
  await expect(name).toHaveValue("Walker");
  await page.reload();
  await expect(name).toHaveValue("Walker");
});

test("older drafts past avatar setup return for a name without losing habits", async ({ page }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  await page.getByRole("button", { name: "Ready" }).click();
  await completeAvatar(page);
  const habits = page.getByRole("main", { name: "Your habits" });
  await habits.getByRole("button", { name: "Add a habit" }).click();
  await habits.getByLabel("Habit name").fill("Read a book");
  await habits.getByRole("button", { name: "Add habit", exact: true }).click();
  await habits.getByRole("button", { name: "Continue", exact: true }).click();
  await page.evaluate(() => {
    const key = "dailywalk_admin_max:onboarding:v1";
    const draft = JSON.parse(sessionStorage.getItem(key));
    delete draft.name;
    sessionStorage.setItem(key, JSON.stringify(draft));
  });
  await page.reload();
  const avatar = page.getByRole("main", { name: "Edit your avatar" });
  await expect(avatar.getByLabel("Your name")).toHaveValue("");
  await avatar.getByLabel("Your name").fill("Walker");
  await avatar.getByRole("button", { name: "Continue" }).click();
  await expect(habits.getByRole("button", { name: "Edit Read a book" })).toBeVisible();
});

test("onboarding pages are accessible and full-screen", async ({ page }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  const welcome = page.getByRole("main", { name: "Ready to begin your journey with Steadfast Steps?" });
  const avatar = page.getByRole("main", { name: "Edit your avatar" });
  for (const viewport of [
    { width: 320, height: 568 }, { width: 375, height: 812 }, { width: 1100, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    for (const screen of [welcome, avatar]) {
      await expect(screen).toBeVisible();
      await expect(screen).toBeFocused();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.locator("#pg-h")).toBeHidden();
      const bounds = await screen.boundingBox();
      expect(bounds).toMatchObject({ x: 0, y: 0, width: viewport.width, height: viewport.height });
      expect(await screen.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
      if (screen === welcome) {
        await screen.getByRole("button", { name: "Ready" }).click();
      } else {
        await page.keyboard.press("Tab");
        await expect(screen.getByLabel("Your name")).toBeFocused();
        expect((await screen.getByLabel("Your name").boundingBox()).height).toBeGreaterThanOrEqual(44);
        expect((await screen.getByLabel("Skin color").boundingBox()).height).toBeGreaterThanOrEqual(44);
        await screen.getByLabel("Skin color").selectOption("deep");
        await screen.getByRole("button", { name: "Back" }).click();
      }
    }
  }
  await welcome.getByRole("button", { name: "Ready" }).click();
  await expect(avatar.getByLabel("Skin color")).toHaveValue("deep");
  await completeAvatar(page);
  const habits = page.getByRole("main", { name: "Your habits" });
  await expect(habits).toBeFocused();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  for (const viewport of [
    { width: 320, height: 568 }, { width: 375, height: 812 }, { width: 1100, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    expect(await habits.boundingBox()).toMatchObject({ x: 0, y: 0, ...viewport });
    expect(await habits.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect((await habits.getByRole("button", { name: "Edit Wake up on time" }).boundingBox()).height)
      .toBeGreaterThanOrEqual(44);
  }
  await habits.getByRole("button", { name: "Continue", exact: true }).click();
  const choice = page.getByRole("main", { name: "Welcome to Daily Walk" });
  await expect(choice).toBeVisible();
  await expect(choice).toBeFocused();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  for (const viewport of [
    { width: 320, height: 568 }, { width: 375, height: 812 }, { width: 1100, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    expect(await choice.boundingBox()).toMatchObject({ x: 0, y: 0, ...viewport });
    expect(await choice.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect((await choice.getByRole("button", { name: "Sign in with Google" }).boundingBox()).height)
      .toBeGreaterThanOrEqual(44);
    expect((await choice.getByRole("button", { name: "Continue locally" }).boundingBox()).height)
      .toBeGreaterThanOrEqual(44);
  }
  await page.keyboard.press("Tab");
  await expect(choice.getByRole("button", { name: "Sign in with Google" })).toBeFocused();
});

test("habit setup edits and adds habits, survives navigation and reload, and saves locally", async ({ page }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  await page.getByRole("button", { name: "Ready" }).click();
  await completeAvatar(page);
  const screen = page.getByRole("main", { name: "Your habits" });
  const presets = await page.evaluate(() => DEFAULTS.map(({ t }) => t));
  for (const name of presets) await expect(screen.getByRole("button", { name: `Edit ${name}`, exact: true })).toBeVisible();
  await screen.getByRole("button", { name: "Edit Breakfast" }).click();
  await screen.getByLabel("Habit name").fill("Morning prayer");
  await screen.getByLabel("Why it matters (optional)").fill("Start with gratitude");
  await screen.getByRole("button", { name: "Faith & Kindness", exact: true }).click();
  await screen.getByRole("button", { name: "Save habit" }).click();
  await screen.getByRole("button", { name: "Edit Drink water" }).click();
  await screen.getByLabel("Habit name").fill("Drink tea");
  await screen.getByRole("button", { name: "Save habit" }).click();
  await screen.getByRole("button", { name: "Add a habit" }).click();
  await screen.getByRole("button", { name: "Add habit", exact: true }).click();
  await expect(screen.getByRole("alert")).toHaveText("Enter a habit name.");
  await screen.getByLabel("Habit name").fill("Read a book");
  await screen.getByRole("button", { name: "Faith & Kindness", exact: true }).click();
  await screen.getByRole("button", { name: "Add habit", exact: true }).click();
  await screen.getByRole("button", { name: "Back" }).click();
  await completeAvatar(page);
  await page.reload();
  await expect(screen.getByRole("button", { name: "Edit Read a book" })).toBeVisible();
  await expect(screen.getByRole("button", { name: "Edit Morning prayer" })).toBeVisible();
  await screen.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue locally" }).click();
  await expect(page.locator("#tour")).toBeVisible();
  await page.reload();
  const result = await page.evaluate(() => {
    const state = hydrateState(readStoredProfile(CUR_UID));
    S = state;
    waterGoal();
    return {
      meal: state.tasks.find((task) => task.id === "bfast"),
      water: state.tasks.find((task) => task.id === "water"),
      custom: state.tasks.find((task) => task.t === "Read a book"),
      waterChecked: !!(state.checks[today()] || {}).water,
    };
  });
  expect(result.meal).toMatchObject({ t: "Morning prayer", s: "Start with gratitude", g: "faith" });
  expect(result.meal).not.toHaveProperty("m");
  expect(result.meal).not.toHaveProperty("tip");
  expect(result.water.t).toBe("Drink tea");
  expect(result.waterChecked).toBe(false);
  expect(result.custom).toMatchObject({ t: "Read a book", g: "faith" });
  expect(result.custom.id).toMatch(/^c\d+$/);
});

test("habit setup previews the same groups, icons and text styling as the checklist", async ({ page }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  await page.getByRole("button", { name: "Ready" }).click();
  await completeAvatar(page);
  const screen = page.getByRole("main", { name: "Your habits" });
  await expect(screen.getByText("You can check them off after setup.", { exact: false })).toBeVisible();
  await expect(screen.getByRole("checkbox")).toHaveCount(0);
  await screen.getByRole("button", { name: "Edit Wake up on time" }).click();
  await screen.getByRole("button", { name: "book", exact: true }).click();
  await screen.getByRole("button", { name: "Save habit" }).click();
  const preview = await screen.evaluate((element) => {
    const group = element.querySelector('section[aria-label="Morning"]');
    const row = group.querySelector(".item");
    const style = (selector, property) => getComputedStyle(row.querySelector(selector))[property];
    return {
      groupIcon: group.querySelector(".ge").innerHTML,
      color: getComputedStyle(group).getPropertyValue("--gc").trim(),
      icon: row.querySelector(".hi").innerHTML,
      checkboxWidth: style(".onboarding-habit-checkbox", "width"),
      titleFont: style(".t", "fontFamily"),
      descriptionFont: style("small", "fontFamily"),
    };
  });
  await screen.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue locally" }).click();
  const checklist = await page.evaluate(() => {
    const row = document.querySelector('#list input[data-id="wake"]').closest(".item");
    const group = row.closest(".grp");
    const style = (selector, property) => getComputedStyle(row.querySelector(selector))[property];
    return {
      groupIcon: group.querySelector(".ge").innerHTML,
      color: getComputedStyle(group).getPropertyValue("--gc").trim(),
      icon: row.querySelector(".hi").innerHTML,
      checkboxWidth: style("input", "width"),
      titleFont: style(".t", "fontFamily"),
      descriptionFont: style("small", "fontFamily"),
    };
  });
  expect(preview).toEqual(checklist);
  expect(preview.icon).toContain("<svg");
});

test("setup deletes presets and creates a group with visual icon choices that persist", async ({ page }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  await page.getByRole("button", { name: "Ready" }).click();
  await completeAvatar(page);
  const screen = page.getByRole("main", { name: "Your habits" });
  await screen.getByRole("button", { name: "Edit Drink water" }).click();
  await screen.getByRole("button", { name: "Delete habit" }).click();
  await screen.getByRole("button", { name: "Keep habit" }).click();
  await screen.getByRole("button", { name: "Delete habit" }).click();
  await screen.getByRole("button", { name: "Confirm delete" }).click();
  await expect(screen.getByRole("button", { name: "Edit Drink water" })).toHaveCount(0);
  await screen.getByRole("button", { name: "Edit Wake up on time" }).click();
  const iconButtons = screen.locator("fieldset").filter({ hasText: "Pick an icon" }).getByRole("button");
  expect(await iconButtons.count()).toBeGreaterThan(15);
  await expect(iconButtons.getByRole("img")).toHaveCount(0);
  expect(await iconButtons.locator("svg").count()).toBe(await iconButtons.count());
  await page.setViewportSize({ width: 320, height: 568 });
  expect((await iconButtons.first().boundingBox()).width).toBeGreaterThanOrEqual(44);
  expect(await screen.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await screen.getByRole("button", { name: "book", exact: true }).click();
  await expect(screen.getByRole("button", { name: "book", exact: true })).toHaveAttribute("aria-pressed", "true");
  await screen.getByRole("button", { name: "New group" }).click();
  await screen.getByRole("button", { name: "Create group" }).click();
  await expect(screen.getByRole("alert")).toHaveText("Enter a group name.");
  await screen.getByLabel("Group name").fill("Morning");
  await screen.getByRole("button", { name: "Create group" }).click();
  await expect(screen.getByRole("alert")).toHaveText("A group with that name already exists.");
  await screen.getByLabel("Group name").fill("Family");
  await screen.getByLabel("Group name").press("Enter");
  await expect(screen.getByRole("button", { name: "Family", exact: true })).toHaveAttribute("aria-pressed", "true");
  await screen.getByRole("button", { name: "New group" }).click();
  await screen.getByLabel("Group name").fill("A".repeat(40));
  await screen.getByRole("button", { name: "Create group" }).click();
  expect(await screen.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await screen.getByRole("button", { name: "Family", exact: true }).click();
  await screen.getByRole("button", { name: "Save habit" }).click();
  await page.reload();
  await expect(screen.getByRole("region", { name: "Family" }).getByRole("button", { name: "Edit Wake up on time" })).toBeVisible();
  await expect(screen.getByRole("button", { name: "Edit Drink water" })).toHaveCount(0);
  await screen.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue locally" }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await page.reload();
  const state = await page.evaluate(() => hydrateState(readStoredProfile(CUR_UID)));
  expect(state.removedDefaultHabits).toContain("water");
  expect(state.tasks.some((task) => task.id === "water")).toBe(false);
  expect(state.customHabitGroups).toHaveLength(2);
  expect(state.tasks.find((task) => task.id === "wake")).toMatchObject({
    g: state.customHabitGroups[0].id, ic: "book",
  });
  await continueLocally(page);
  await expect(page.locator("#list .grp").filter({ hasText: "Family" })).toContainText("Wake up on time");
  await page.locator("#fab").click();
  await expect(page.locator("#hg").getByRole("button", { name: "Family" })).toBeVisible();
  expect(await page.locator("#hm").evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await page.locator("#hg").getByRole("button", { name: "Family" }).click();
  await page.locator("#hn").fill("Family time");
  await page.locator("#hadd").click();
  await expect(page.locator("#list .grp").filter({ hasText: "Family" })).toContainText("Family time");
});

test("deleting every preset remains empty after hydration", async ({ page }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  await page.getByRole("button", { name: "Ready" }).click();
  await completeAvatar(page);
  const screen = page.getByRole("main", { name: "Your habits" });
  while (await screen.getByRole("button", { name: /^Edit / }).count()) {
    await screen.getByRole("button", { name: /^Edit / }).first().click();
    await screen.getByRole("button", { name: "Delete habit" }).click();
    await screen.getByRole("button", { name: "Confirm delete" }).click();
  }
  await page.reload();
  await screen.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue locally" }).click();
  expect(await page.evaluate(() => hydrateState(readStoredProfile(CUR_UID)).tasks)).toEqual([]);
});

test("habit draft storage failures leave the form open for retry", async ({ page }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  await page.getByRole("button", { name: "Ready" }).click();
  await completeAvatar(page);
  const screen = page.getByRole("main", { name: "Your habits" });
  await screen.getByRole("button", { name: "Add a habit" }).click();
  await screen.getByLabel("Habit name").fill("Read a book");
  await page.evaluate(() => {
    window.originalStorageSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (this === sessionStorage && key === "dailywalk_admin_max:onboarding:v1") throw new Error("Storage blocked");
      return window.originalStorageSetItem.call(this, key, value);
    };
  });
  await screen.getByRole("button", { name: "New group" }).click();
  await screen.getByLabel("Group name").fill("Family");
  await screen.getByRole("button", { name: "Create group" }).click();
  await expect(screen.getByRole("alert")).toContainText("Could not save your setup");
  await expect(screen.getByLabel("Group name")).toHaveValue("Family");
  await page.evaluate(() => { Storage.prototype.setItem = window.originalStorageSetItem; });
  await screen.getByRole("button", { name: "Create group" }).click();
  await page.evaluate(() => {
    Storage.prototype.setItem = function (key, value) {
      if (this === sessionStorage && key === "dailywalk_admin_max:onboarding:v1") throw new Error("Storage blocked");
      return window.originalStorageSetItem.call(this, key, value);
    };
  });
  await screen.getByRole("button", { name: "Add habit", exact: true }).click();
  await expect(screen.getByRole("alert")).toContainText("Could not save your setup");
  await expect(screen.getByLabel("Habit name")).toHaveValue("Read a book");
  await page.evaluate(() => { Storage.prototype.setItem = window.originalStorageSetItem; });
  await screen.getByRole("button", { name: "Add habit", exact: true }).click();
  await expect(screen.getByRole("button", { name: "Edit Read a book" })).toBeVisible();
});

test("deletion confirmations stay centered and group changes survive reload and profile creation", async ({ page }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole("button", { name: "Ready" }).click();
  await completeAvatar(page);
  const screen = page.getByRole("main", { name: "Your habits" });
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 812 });
    const addHabit = await screen.getByRole("button", { name: "Add a habit" }).boundingBox();
    const addGroup = await screen.getByRole("button", { name: "Add new group" }).boundingBox();
    expect(addGroup.x).toBeGreaterThan(addHabit.x);
    expect(addGroup.y).toBe(addHabit.y);
  }
  await screen.getByRole("button", { name: "Add new group" }).click();
  await screen.getByLabel("Group name").fill("Family");
  await screen.getByRole("button", { name: "Create group" }).click();
  await expect(screen.getByRole("region", { name: "Family" })).toBeVisible();
  await screen.getByRole("button", { name: "Edit Breakfast" }).click();
  await screen.getByRole("button", { name: "Delete habit" }).click();
  const dialog = page.getByRole("dialog", { name: "Are you sure?" });
  await expect(dialog).toContainText("Delete Breakfast?");
  await expect(dialog.getByRole("button", { name: "Keep habit" })).toBeFocused();
  let box = await dialog.boundingBox();
  expect(Math.abs(box.x + box.width / 2 - 375 / 2)).toBeLessThan(2);
  expect(Math.abs(box.y + box.height / 2 - 812 / 2)).toBeLessThan(2);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(screen.getByRole("button", { name: "Delete habit" })).toBeFocused();
  await screen.getByRole("button", { name: "Cancel", exact: true }).click();
  await screen.getByRole("button", { name: "Delete group Morning" }).click();
  await expect(dialog).toContainText("Delete Morning and all habits in this group?");
  box = await dialog.boundingBox();
  expect(Math.abs(box.y + box.height / 2 - 812 / 2)).toBeLessThan(2);
  await dialog.getByRole("button", { name: "Keep group" }).click();
  await expect(screen.getByRole("button", { name: "Edit Wake up on time" })).toBeVisible();
  await screen.getByRole("button", { name: "Delete group Morning" }).click();
  await dialog.getByRole("button", { name: "Confirm delete" }).click();
  await screen.getByRole("button", { name: "Delete group Family" }).click();
  await dialog.getByRole("button", { name: "Confirm delete" }).click();
  await screen.getByRole("button", { name: "Delete group My Habits" }).click();
  await dialog.getByRole("button", { name: "Confirm delete" }).click();
  await page.reload();
  await expect(screen.getByRole("region", { name: "Morning" })).toHaveCount(0);
  await expect(screen.getByRole("region", { name: "Family" })).toHaveCount(0);
  await expect(screen.getByRole("button", { name: "Edit Wake up on time" })).toHaveCount(0);
  await screen.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue locally" }).click();
  await page.getByRole("button", { name: "Skip" }).click();
  await page.reload();
  const state = await page.evaluate(() => hydrateState(readStoredProfile(CUR_UID)));
  expect(state.removedDefaultHabitGroups).toEqual(["morning", "more"]);
  expect(state.tasks.some((task) => task.id === "wake")).toBe(false);
  expect(state.customHabitGroups).toEqual([]);
  await continueLocally(page);
  await page.locator("#fab").click();
  await expect(page.locator("#hg").getByRole("button", { name: "My Habits" })).toHaveCount(0);
  await expect(page.locator("#hg .gt.on")).toHaveCount(1);
});

test("failed group deletion keeps confirmation open and can be retried", async ({ page }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  await page.getByRole("button", { name: "Ready" }).click();
  await completeAvatar(page);
  const screen = page.getByRole("main", { name: "Your habits" });
  await screen.getByRole("button", { name: "Delete group Morning" }).click();
  const dialog = page.getByRole("dialog", { name: "Are you sure?" });
  await page.evaluate(() => {
    window.originalStorageSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (this === sessionStorage && key === "dailywalk_admin_max:onboarding:v1") throw new Error("Storage blocked");
      return window.originalStorageSetItem.call(this, key, value);
    };
  });
  await dialog.getByRole("button", { name: "Confirm delete" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Could not save your setup");
  await page.evaluate(() => { Storage.prototype.setItem = window.originalStorageSetItem; });
  await dialog.getByRole("button", { name: "Confirm delete" }).click();
  await expect(screen.getByRole("region", { name: "Morning" })).toHaveCount(0);
});

test("setup keeps one group so new habits can still be created", async ({ page }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  await page.getByRole("button", { name: "Ready" }).click();
  await completeAvatar(page);
  const screen = page.getByRole("main", { name: "Your habits" });
  for (const name of ["Morning", "Nutrition", "Exercise", "Cleaning", "My Habits"]) {
    await screen.getByRole("button", { name: `Delete group ${name}`, exact: true }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Confirm delete" }).click();
  }
  await expect(screen.getByRole("button", { name: "Delete group Faith & Kindness" })).toBeDisabled();
  await page.reload();
  await screen.getByRole("button", { name: "Add a habit" }).click();
  await expect(screen.getByRole("button", { name: "Faith & Kindness" })).toHaveAttribute("aria-pressed", "true");
});

test("older onboarding drafts without habits use the presets", async ({ page }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  await page.getByRole("button", { name: "Ready" }).click();
  await page.evaluate(() => {
    const key = "dailywalk_admin_max:onboarding:v1";
    const draft = JSON.parse(sessionStorage.getItem(key));
    delete draft.habits;
    delete draft.customHabitGroups;
    delete draft.removedDefaultHabitGroups;
    sessionStorage.setItem(key, JSON.stringify(draft));
  });
  await page.reload();
  await completeAvatar(page);
  await expect(page.getByRole("button", { name: "Edit Wake up on time" })).toBeVisible();
});

test("onboarding storage failures are visible and can be retried", async ({ page }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  await page.evaluate(() => {
    window.originalStorageSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (this === sessionStorage && key === "dailywalk_admin_max:onboarding:v1") throw new Error("Storage blocked");
      return window.originalStorageSetItem.call(this, key, value);
    };
  });
  await page.getByRole("button", { name: "Ready" }).click();
  await expect(page.getByRole("alert")).toContainText("Could not save your setup");
  expect(await page.evaluate(() => localStorage.getItem("dailywalk_admin_max:users:v3"))).toBeNull();
  await page.evaluate(() => { Storage.prototype.setItem = window.originalStorageSetItem; });
  await page.getByRole("button", { name: "Ready" }).click();
  await expect(page.getByRole("main", { name: "Edit your avatar" })).toBeVisible();
});

test("name setup stays on the avatar page when saving fails and can be retried", async ({ page }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  await page.getByRole("button", { name: "Ready" }).click();
  const avatar = page.getByRole("main", { name: "Edit your avatar" });
  await avatar.getByLabel("Your name").fill("  Walker  ");
  await page.evaluate(() => {
    window.originalStorageSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (this === sessionStorage && key === "dailywalk_admin_max:onboarding:v1") throw new Error("Storage blocked");
      return window.originalStorageSetItem.call(this, key, value);
    };
  });
  await avatar.getByRole("button", { name: "Continue" }).click();
  await expect(avatar.getByRole("alert")).toContainText("Could not save your setup");
  await expect(avatar.getByLabel("Your name")).toHaveValue("  Walker  ");
  await page.evaluate(() => { Storage.prototype.setItem = window.originalStorageSetItem; });
  await avatar.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("main", { name: "Your habits" })).toBeVisible();
});

test("onboarding does not replace a profile created in another tab", async ({ page, context }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  await page.getByRole("button", { name: "Ready" }).click();
  await completeAvatar(page);
  await page.getByRole("main", { name: "Your habits" }).getByRole("button", { name: "Continue", exact: true }).click();
  const other = await context.newPage();
  await setup(other, new Map());
  await continueLocally(other);
  const existing = await other.evaluate(() => ({
    id: CUR_UID, users: localStorage.getItem(K_USERS), profile: localStorage.getItem(uKey(CUR_UID)),
  }));
  await page.getByRole("button", { name: "Continue locally" }).click();
  await expect(page.getByRole("alert")).toContainText("Local profiles changed. Reload before continuing.");
  expect(await page.evaluate((id) => ({
    users: localStorage.getItem(K_USERS), profile: localStorage.getItem(uKey(id)),
  }), existing.id)).toEqual({ users: existing.users, profile: existing.profile });
});

test("avatar choices survive Google sign-in and are used for a new cloud profile", async ({ page }) => {
  const cloud = new Map();
  const writes = await setup(page, cloud, { skipOnboarding: true });
  await page.getByRole("button", { name: "Ready" }).click();
  await page.getByLabel("Your name").fill("Cloud Walker");
  await page.getByLabel("Skin color").selectOption("deep");
  await page.getByLabel("Hair type").selectOption("long");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  const habits = page.getByRole("main", { name: "Your habits" });
  await habits.getByRole("button", { name: "Edit Drink water" }).click();
  await habits.getByRole("button", { name: "Delete habit" }).click();
  await habits.getByRole("button", { name: "Confirm delete" }).click();
  await habits.getByRole("button", { name: "Delete group Morning" }).click();
  await habits.getByRole("button", { name: "Confirm delete" }).click();
  await habits.getByRole("button", { name: "Add a habit" }).click();
  await habits.getByLabel("Habit name").fill("Cloud habit");
  await habits.getByRole("button", { name: "New group" }).click();
  await habits.getByLabel("Group name").fill("Cloud group");
  await habits.getByRole("button", { name: "Create group" }).click();
  await habits.getByRole("button", { name: "Add habit", exact: true }).click();
  await habits.getByRole("button", { name: "Continue", exact: true }).click();
  await signIn(page, page.getByRole("main", { name: "Welcome to Daily Walk" }).getByRole("button", { name: "Sign in with Google" }));
  expect(await page.evaluate(() => localStorage.getItem("dailywalk_admin_max:users:v3"))).toBeNull();
  await page.getByRole("button", { name: "Create cloud profile" }).click();
  await expect.poll(() => writes.length).toBe(1);
  expect(writes[0].state.p).toMatchObject({ name: "Cloud Walker", skin: "deep", hair: "long" });
  expect(writes[0].state.customHabitGroups[0].n).toBe("Cloud group");
  expect(writes[0].state.tasks.find((task) => task.t === "Cloud habit").g)
    .toBe(writes[0].state.customHabitGroups[0].id);
  expect(writes[0].state.removedDefaultHabits).toContain("water");
  expect(writes[0].state.removedDefaultHabitGroups).toContain("morning");
  expect(await page.evaluate(() => hydrateState(readStoredProfile(CUR_UID)).tasks.some((task) => task.id === "water"))).toBe(false);
  await expect(page.locator("#tour-title")).toHaveText("Your daily checklist");
});

test("an older draft returning from Google sign-in asks for a name before creating a profile", async ({ page }) => {
  const writes = await setup(page, new Map());
  await page.evaluate(() => {
    const key = "dailywalk_admin_max:onboarding:v1";
    const draft = JSON.parse(sessionStorage.getItem(key));
    delete draft.name;
    sessionStorage.setItem(key, JSON.stringify(draft));
  });
  await signIn(page, page.getByRole("button", { name: "Sign in with Google" }));
  const avatar = page.getByRole("main", { name: "Edit your avatar" });
  await expect(avatar.getByLabel("Your name")).toHaveValue("");
  await avatar.getByLabel("Your name").fill("Returning Walker");
  await avatar.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("main", { name: "Your habits" }).getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Create cloud profile" }).click();
  await expect.poll(() => writes.length).toBe(1);
  expect(writes[0].state.p.name).toBe("Returning Walker");
});

test("opening an existing cloud profile does not apply the onboarding avatar", async ({ page }) => {
  const cloud = new Map();
  const writes = await setup(page, cloud, { skipOnboarding: true });
  const remote = await cloudState(page, "Cloud Walker", 245);
  remote.p.skin = "light";
  cloud.set("cloud-one", snapshot("cloud-one", remote));
  await page.getByRole("button", { name: "Ready" }).click();
  await page.getByLabel("Your name").fill("Draft Name");
  await page.getByLabel("Skin color").selectOption("deep");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  const habits = page.getByRole("main", { name: "Your habits" });
  await habits.getByRole("button", { name: "Edit Drink water" }).click();
  await habits.getByRole("button", { name: "Delete habit" }).click();
  await habits.getByRole("button", { name: "Confirm delete" }).click();
  await habits.getByRole("button", { name: "Delete group Morning" }).click();
  await habits.getByRole("button", { name: "Confirm delete" }).click();
  await habits.getByRole("button", { name: "Add a habit" }).click();
  await habits.getByLabel("Habit name").fill("Local draft habit");
  await habits.getByRole("button", { name: "New group" }).click();
  await habits.getByLabel("Group name").fill("Local draft group");
  await habits.getByRole("button", { name: "Create group" }).click();
  await habits.getByRole("button", { name: "Add habit", exact: true }).click();
  await habits.getByRole("button", { name: "Continue", exact: true }).click();
  await signIn(page, page.getByRole("main", { name: "Welcome to Daily Walk" }).getByRole("button", { name: "Sign in with Google" }));
  await expect.poll(() => page.evaluate(() => S.p.name)).toBe("Cloud Walker");
  expect(await page.evaluate(() => readStoredProfile(CUR_UID).p.skin)).toBe("light");
  expect(await page.evaluate(() => readStoredProfile(CUR_UID).tasks.some((task) => task.t === "Local draft habit"))).toBe(false);
  expect(await page.evaluate(() => readStoredProfile(CUR_UID).tasks.some((task) => task.id === "water"))).toBe(true);
  expect(await page.evaluate(() => readStoredProfile(CUR_UID).customHabitGroups)).toBeUndefined();
  expect(await page.evaluate(() => readStoredProfile(CUR_UID).removedDefaultHabitGroups)).toBeUndefined();
  expect(writes).toHaveLength(0);
});

test("startup offers local mode without creating a profile before the choice", async ({ page }) => {
  await setup(page, new Map());
  const screen = page.getByRole("main", { name: "Welcome to Daily Walk" });
  await expect(screen).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("dailywalk_admin_max:users:v3"))).toBeNull();
  await screen.getByRole("button", { name: "Continue locally" }).click();
  await expect(screen).toHaveCount(0);
  expect(await page.evaluate(() => readStoredProfile(CUR_UID).p.name)).toBe("Player 1");
  await page.reload();
  await expect(screen).toBeVisible();
});

test("sign-in opens the only cloud profile without creating or uploading a local starter", async ({ page }) => {
  const cloud = new Map();
  const writes = await setup(page, cloud);
  cloud.set("cloud-one", snapshot("cloud-one", await cloudState(page, "Cloud Walker", 245)));
  await signIn(page, page.getByRole("main", { name: "Welcome to Daily Walk" }).getByRole("button", { name: "Sign in with Google" }));
  await expect.poll(() => page.evaluate(() => S.p.name)).toBe("Cloud Walker");
  await expect(page.getByRole("main", { name: "Welcome to Daily Walk" })).toHaveCount(0);
  expect(await page.evaluate(() => ({ xp: S.xp, count: USERS.length, stored: readStoredProfile(CUR_UID).p.name })))
    .toEqual({ xp: 245, count: 1, stored: "Cloud Walker" });
  await page.waitForTimeout(800);
  expect(writes).toHaveLength(0);
  await page.reload();
  await expect(page.getByRole("main", { name: "Welcome to Daily Walk" })).toHaveCount(0);
  expect(await page.evaluate(() => S.p.name)).toBe("Cloud Walker");
});

test("sign-in lets users select a cloud profile and preserves existing local profiles", async ({ page }) => {
  const cloud = new Map();
  const writes = await setup(page, cloud);
  await continueLocally(page);
  await page.evaluate(() => {
    S.p.name = "Local Walker";
    S.xp = 61;
    S.life = 61;
    save();
    document.getElementById("sp").classList.remove("show");
  });
  const localId = await page.evaluate(() => CUR_UID);
  cloud.set("cloud-one", snapshot("cloud-one", await cloudState(page, "Cloud One", 100)));
  cloud.set("cloud-two", snapshot("cloud-two", await cloudState(page, "Cloud Two", 200)));
  await page.locator("#prof").evaluate((button) => button.click());
  await signIn(page, page.locator("#google-auth").getByRole("button", { name: "Sign in with Google" }));
  const screen = page.getByRole("main", { name: "Welcome to Daily Walk" });
  await expect(screen.getByText("Choose the cloud profile you want to open.")).toBeVisible();
  expect(writes).toHaveLength(0);
  await screen.getByLabel("Cloud profile").selectOption("cloud-two");
  await screen.getByRole("button", { name: "Open profile" }).click();
  await expect.poll(() => page.evaluate(() => S.p.name)).toBe("Cloud Two");
  expect(await page.evaluate((id) => ({ name: readStoredProfile(id).p.name, xp: readStoredProfile(id).xp }), localId))
    .toEqual({ name: "Local Walker", xp: 61 });
  expect(await page.evaluate(() => USERS.length)).toBe(2);
  await page.waitForTimeout(800);
  expect(writes).toHaveLength(0);
});

test("an empty cloud account offers creation or local mode without uploading automatically", async ({ page }) => {
  const cloud = new Map();
  const writes = await setup(page, cloud);
  await signIn(page, page.getByRole("main", { name: "Welcome to Daily Walk" }).getByRole("button", { name: "Sign in with Google" }));
  const screen = page.getByRole("main", { name: "Welcome to Daily Walk" });
  await expect(screen.getByText("This Google account has no cloud profiles yet.")).toBeVisible();
  expect(writes).toHaveLength(0);
  expect(await page.evaluate(() => localStorage.getItem("dailywalk_admin_max:users:v3"))).toBeNull();
  await screen.getByRole("button", { name: "Create cloud profile" }).click();
  await expect.poll(() => writes.length).toBe(1);
  expect(writes[0].state.p.name).toBe("Player 1");
});

test("an empty cloud account can continue locally without creating a cloud profile", async ({ page }) => {
  const cloud = new Map();
  const writes = await setup(page, cloud);
  await signIn(page, page.getByRole("main", { name: "Welcome to Daily Walk" }).getByRole("button", { name: "Sign in with Google" }));
  const screen = page.getByRole("main", { name: "Welcome to Daily Walk" });
  await expect(screen.getByText("This Google account has no cloud profiles yet.")).toBeVisible();
  await screen.getByRole("button", { name: "Continue locally" }).click();
  await expect(screen).toHaveCount(0);
  expect(writes).toHaveLength(0);
  expect(await page.evaluate(() => readStoredProfile(CUR_UID).p.name)).toBe("Player 1");
  await page.locator("#prof").evaluate((button) => button.click());
  await expect(page.locator("#google-auth")).toContainText("Not signed in");
});

test("cloud listing failures preserve local data and can be retried", async ({ page }) => {
  const cloud = new Map();
  const writes = await setup(page, cloud);
  cloud.set("cloud-one", snapshot("cloud-one", await cloudState(page, "Cloud Walker", 33)));
  cloud.failList = true;
  await signIn(page, page.getByRole("main", { name: "Welcome to Daily Walk" }).getByRole("button", { name: "Sign in with Google" }));
  const screen = page.getByRole("main", { name: "Welcome to Daily Walk" });
  await expect(screen.getByRole("alert")).toContainText("Could not load your cloud profiles");
  expect(writes).toHaveLength(0);
  cloud.failList = false;
  await screen.getByRole("button", { name: "Retry" }).click();
  await expect.poll(() => page.evaluate(() => S.p.name)).toBe("Cloud Walker");
});

test("a failed cloud cache write rolls back and can be retried", async ({ page }) => {
  const cloud = new Map();
  const writes = await setup(page, cloud);
  cloud.set("cloud-one", snapshot("cloud-one", await cloudState(page, "Cloud Walker", 33)));
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "dailywalk_admin_max:users:v3" && !sessionStorage.getItem("allow-cache")) {
        throw new Error("Storage blocked");
      }
      return original.call(this, key, value);
    };
  });
  await signIn(page, page.getByRole("main", { name: "Welcome to Daily Walk" }).getByRole("button", { name: "Sign in with Google" }));
  const screen = page.getByRole("main", { name: "Welcome to Daily Walk" });
  await expect(screen.getByRole("alert")).toContainText("Could not load your cloud profiles");
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) =>
    key.startsWith("dailywalk_admin_max:u:") || key.startsWith("dailywalk_admin_max:profile-link:")))).toEqual([]);
  expect(writes).toHaveLength(0);
  await page.evaluate(() => sessionStorage.setItem("allow-cache", "yes"));
  await screen.getByRole("button", { name: "Retry" }).click();
  await expect.poll(() => page.evaluate(() => S.p.name)).toBe("Cloud Walker");
});
