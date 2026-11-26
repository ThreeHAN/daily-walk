const { test, expect } = require("@playwright/test");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const site = "http://localhost:43999";
const supabase = "https://dnnpakvhiipflpvmkymf.supabase.co";
const headers = { "Access-Control-Allow-Origin": "*" };

async function setup(page, cloud) {
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
  await page.getByRole("button", { name: "Continue locally" }).click();
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
