const { test, expect } = require("@playwright/test");
const { continueLocally, reachStartupChoice } = require("./helpers/onboarding");
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

test("first-time onboarding edits an avatar before choosing local mode and starts the tour", async ({ page }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  const welcome = page.getByRole("dialog", { name: "Ready to begin your journey with Steadfast Steps?" });
  await expect(welcome).toBeVisible();
  const font = (locator) => locator.evaluate((element) => getComputedStyle(element).fontFamily);
  expect(await font(welcome.getByRole("heading"))).toContain("Tiny5");
  expect(await font(welcome.getByRole("button", { name: "Ready" }))).toContain("Tiny5");
  expect(await page.evaluate(() => localStorage.getItem("dailywalk_admin_max:users:v3"))).toBeNull();
  await welcome.getByRole("button", { name: "Ready" }).click();
  const avatar = page.getByRole("dialog", { name: "Edit your avatar" });
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
  await avatar.getByRole("button", { name: "Continue", exact: true }).click();
  expect(await font(page.getByText("Sign in to use your cloud profile, or continue with a profile on this device.")))
    .toContain("Tiny5");
  expect(await page.evaluate(() => localStorage.getItem("dailywalk_admin_max:users:v3"))).toBeNull();
  await page.getByRole("button", { name: "Continue locally" }).click();
  expect(await page.evaluate(() => {
    const { gender, skin, hair, hairColor, eyeColor } = readStoredProfile(CUR_UID).p;
    return { gender, skin, hair, hairColor, eyeColor };
  })).toEqual({ gender: "female", skin: "deep", hair: "curly", hairColor: "auburn", eyeColor: "green" });
  await expect(page.locator("#tour")).toBeVisible();
  await expect(page.locator("#tour-title")).toHaveText("Your daily checklist");
  await expect(page.locator("#sp")).not.toHaveClass(/show/);
  await page.getByRole("button", { name: "Skip" }).click();
  await page.reload();
  await continueLocally(page);
  await expect(page.locator("#sp")).not.toHaveClass(/show/);
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
  await expect(page.getByRole("dialog", { name: "Edit your avatar" })).toBeVisible();
});

test("onboarding does not replace a profile created in another tab", async ({ page, context }) => {
  await setup(page, new Map(), { skipOnboarding: true });
  await page.getByRole("button", { name: "Ready" }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
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
  await page.getByLabel("Skin color").selectOption("deep");
  await page.getByLabel("Hair type").selectOption("long");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await signIn(page, page.getByRole("dialog").getByRole("button", { name: "Sign in with Google" }));
  expect(await page.evaluate(() => localStorage.getItem("dailywalk_admin_max:users:v3"))).toBeNull();
  await page.getByRole("button", { name: "Create cloud profile" }).click();
  await expect.poll(() => writes.length).toBe(1);
  expect(writes[0].state.p).toMatchObject({ skin: "deep", hair: "long" });
  await expect(page.locator("#tour-title")).toHaveText("Your daily checklist");
});

test("opening an existing cloud profile does not apply the onboarding avatar", async ({ page }) => {
  const cloud = new Map();
  const writes = await setup(page, cloud, { skipOnboarding: true });
  const remote = await cloudState(page, "Cloud Walker", 245);
  remote.p.skin = "light";
  cloud.set("cloud-one", snapshot("cloud-one", remote));
  await page.getByRole("button", { name: "Ready" }).click();
  await page.getByLabel("Skin color").selectOption("deep");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await signIn(page, page.getByRole("dialog").getByRole("button", { name: "Sign in with Google" }));
  await expect.poll(() => page.evaluate(() => S.p.name)).toBe("Cloud Walker");
  expect(await page.evaluate(() => readStoredProfile(CUR_UID).p.skin)).toBe("light");
  expect(writes).toHaveLength(0);
});

test("startup offers local mode without creating a profile before the choice", async ({ page }) => {
  await setup(page, new Map());
  const dialog = page.getByRole("dialog", { name: "Welcome to Daily Walk" });
  await expect(dialog).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("dailywalk_admin_max:users:v3"))).toBeNull();
  await dialog.getByRole("button", { name: "Continue locally" }).click();
  await expect(dialog).toHaveCount(0);
  expect(await page.evaluate(() => readStoredProfile(CUR_UID).p.name)).toBe("Player 1");
  await page.reload();
  await expect(dialog).toBeVisible();
});

test("sign-in opens the only cloud profile without creating or uploading a local starter", async ({ page }) => {
  const cloud = new Map();
  const writes = await setup(page, cloud);
  cloud.set("cloud-one", snapshot("cloud-one", await cloudState(page, "Cloud Walker", 245)));
  await signIn(page, page.getByRole("dialog").getByRole("button", { name: "Sign in with Google" }));
  await expect.poll(() => page.evaluate(() => S.p.name)).toBe("Cloud Walker");
  await expect(page.getByRole("dialog", { name: "Welcome to Daily Walk" })).toHaveCount(0);
  expect(await page.evaluate(() => ({ xp: S.xp, count: USERS.length, stored: readStoredProfile(CUR_UID).p.name })))
    .toEqual({ xp: 245, count: 1, stored: "Cloud Walker" });
  await page.waitForTimeout(800);
  expect(writes).toHaveLength(0);
  await page.reload();
  await expect(page.getByRole("dialog", { name: "Welcome to Daily Walk" })).toHaveCount(0);
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
  const dialog = page.getByRole("dialog", { name: "Welcome to Daily Walk" });
  await expect(dialog.getByText("Choose the cloud profile you want to open.")).toBeVisible();
  expect(writes).toHaveLength(0);
  await dialog.getByLabel("Cloud profile").selectOption("cloud-two");
  await dialog.getByRole("button", { name: "Open profile" }).click();
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
  await signIn(page, page.getByRole("dialog").getByRole("button", { name: "Sign in with Google" }));
  const dialog = page.getByRole("dialog", { name: "Welcome to Daily Walk" });
  await expect(dialog.getByText("This Google account has no cloud profiles yet.")).toBeVisible();
  expect(writes).toHaveLength(0);
  expect(await page.evaluate(() => localStorage.getItem("dailywalk_admin_max:users:v3"))).toBeNull();
  await dialog.getByRole("button", { name: "Create cloud profile" }).click();
  await expect.poll(() => writes.length).toBe(1);
  expect(writes[0].state.p.name).toBe("Player 1");
});

test("an empty cloud account can continue locally without creating a cloud profile", async ({ page }) => {
  const cloud = new Map();
  const writes = await setup(page, cloud);
  await signIn(page, page.getByRole("dialog").getByRole("button", { name: "Sign in with Google" }));
  const dialog = page.getByRole("dialog", { name: "Welcome to Daily Walk" });
  await expect(dialog.getByText("This Google account has no cloud profiles yet.")).toBeVisible();
  await dialog.getByRole("button", { name: "Continue locally" }).click();
  await expect(dialog).toHaveCount(0);
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
  await signIn(page, page.getByRole("dialog").getByRole("button", { name: "Sign in with Google" }));
  const dialog = page.getByRole("dialog", { name: "Welcome to Daily Walk" });
  await expect(dialog.getByRole("alert")).toContainText("Could not load your cloud profiles");
  expect(writes).toHaveLength(0);
  cloud.failList = false;
  await dialog.getByRole("button", { name: "Retry" }).click();
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
  await signIn(page, page.getByRole("dialog").getByRole("button", { name: "Sign in with Google" }));
  const dialog = page.getByRole("dialog", { name: "Welcome to Daily Walk" });
  await expect(dialog.getByRole("alert")).toContainText("Could not load your cloud profiles");
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) =>
    key.startsWith("dailywalk_admin_max:u:") || key.startsWith("dailywalk_admin_max:profile-link:")))).toEqual([]);
  expect(writes).toHaveLength(0);
  await page.evaluate(() => sessionStorage.setItem("allow-cache", "yes"));
  await dialog.getByRole("button", { name: "Retry" }).click();
  await expect.poll(() => page.evaluate(() => S.p.name)).toBe("Cloud Walker");
});
