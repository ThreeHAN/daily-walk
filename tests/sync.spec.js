const { test, expect } = require("@playwright/test");
const path = require("node:path");

const site = "http://localhost:43999";
const supabase = "https://dnnpakvhiipflpvmkymf.supabase.co";
const root = path.resolve(__dirname, "..");

function reorder(value) {
  if (Array.isArray(value)) return value.map(reorder);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().reverse().map((key) => [key, reorder(value[key])]));
  }
  return value;
}

function session() {
  return {
    access_token: "sync-token", refresh_token: "refresh", token_type: "bearer",
    expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: { id: "sync-user", email: "sync@example.com", app_metadata: {},
      user_metadata: {}, aud: "authenticated", created_at: "2026-01-01T00:00:00Z" },
  };
}

async function setup(page, cloud) {
  await page.addInitScript((value) => {
    localStorage.setItem("sb-dnnpakvhiipflpvmkymf-auth-token", JSON.stringify(value));
  }, session());
  await page.route(`${site}/**`, async (route) => {
    const url = new URL(route.request().url());
    await route.fulfill({ path: path.join(root, url.pathname === "/" ? "index.html" : url.pathname.slice(1)) });
  });
  await page.route(`${supabase}/rest/v1/**`, async (route) => {
    const url = new URL(route.request().url());
    const headers = { "Access-Control-Allow-Origin": "*" };
    if (url.pathname.endsWith("/walk_profiles")) {
      return route.fulfill({ json: Array.from(cloud.values(), ({ profile }) => ({
        id: profile.id, display_name: profile.display_name,
      })), headers });
    }
    const request = route.request().postDataJSON();
    if (url.pathname.endsWith("/read_walk_profile")) {
      return route.fulfill({ body: JSON.stringify(reorder(cloud.get(request.profile_id) || null)),
        contentType: "application/json", headers });
    }
    if (!url.pathname.endsWith("/save_walk_profile_checked")) throw new Error("Unexpected RPC " + url.pathname);
    if (cloud.failNextSave) {
      cloud.failNextSave = false;
      return route.abort("failed");
    }
    if (cloud.pauseNextSave) {
      const pause = cloud.pauseNextSave;
      cloud.pauseNextSave = null;
      pause.started();
      await pause.wait;
    }
    const previous = cloud.get(request.profile_id);
    if (cloud.raceNextSave && previous) {
      cloud.raceNextSave = false;
      previous.profile.client_modified_at++;
      previous.profile.profile.name = "Concurrent cloud edit";
      previous.profile.progress._dailyWalkSyncSnapshot.p.name = "Concurrent cloud edit";
    }
    if ((previous?.profile.client_modified_at || 0) !== request.expected_modified_at) {
      return route.fulfill({ json: false, headers });
    }
    const { p, tasks, checks, days, jr, waterHistory, ...progress } = request.state;
    cloud.set(request.profile_id, {
      profile: { id: request.profile_id, owner_id: "sync-user", display_name: p.name, profile: p, habits: tasks, progress,
        xp: request.state.xp, lifetime_xp: request.state.life, state_version: request.state.v,
        client_modified_at: request.modified_at },
      activity: request.activity.map((item) => ({
        activity_date: item.date, habit_checks: item.checks, completed: item.completed,
        water_count: item.water, journal: item.journal,
      })),
    });
    if (cloud.failAfterSave) {
      cloud.failAfterSave = false;
      return route.abort("failed");
    }
    return route.fulfill({ json: true, headers });
  });
  await page.goto(site);
  await page.evaluate(() => {
    S.tutorialDone = true;
    save();
    document.getElementById("sp").classList.remove("show");
  });
  await page.locator("#prof").evaluate((element) => element.click());
  await expect(page.locator("#google-auth")).toContainText("Linked Player 1");
  await expect(page.locator("#google-auth")).toContainText("Profiles are synced.");
}

async function changeName(page, name) {
  await page.evaluate((value) => { S.p.name = value; save(); }, name);
}

test("two browsers sync in both directions and preserve conflicts", async ({ browser }) => {
  const cloud = new Map();
  const contexts = await Promise.all([browser.newContext(), browser.newContext()]);
  try {
    const [first, second] = await Promise.all(contexts.map((context) => context.newPage()));
    await setup(first, cloud);
    const sharedId = Array.from(cloud.keys())[0];
    await setup(second, cloud);
    await changeName(second, "Local backup");
    await second.getByRole("button", { name: "Choose cloud profile" }).click();
    await second.getByLabel("Cloud profile").selectOption(sharedId);
    await second.getByRole("button", { name: "Connect profile" }).click();
    await expect(second.getByText("Local and cloud profiles may both have changed", { exact: false })).toBeVisible();
    await second.getByRole("button", { name: "Use cloud" }).click();
    await expect(second.locator("#google-auth")).toContainText("previous local profile was kept");
    expect(await second.evaluate(() => S.p.name)).toBe("Player 1");
    expect(await second.evaluate(() => USERS.some((user) => user.label === "Local backup (sync backup)"))).toBe(true);
    await second.locator("#go-info").evaluate((button) => button.click());
    await second.locator("#ulist .uitem").filter({ hasText: "Local backup (sync backup)" })
      .getByRole("button", { name: "Switch" }).evaluate((button) => button.click());
    expect(await second.evaluate(() => S.p.name)).toBe("Local backup");
    await second.locator("#ulist .uitem").filter({ hasText: "Player 1" })
      .getByRole("button", { name: "Switch" }).evaluate((button) => button.click());
    await second.locator("#v-info [data-back]").evaluate((button) => button.click());

    await first.evaluate(() => {
      S.p.name = "Cloud update";
      S.xp = 130;
      S.life = 130;
      S.checks["2024-01-02"] = { wake: true };
      S.days["2024-01-02"] = false;
      S.waterHistory["2024-01-02"] = 4;
      S.jr["2024-01-02"] = "A journal entry";
      save();
    });
    await first.getByRole("button", { name: "Sync now" }).click();
    await expect(first.locator("#google-auth")).toContainText("Profile uploaded.");
    await second.getByRole("button", { name: "Sync now" }).click();
    await expect(second.locator("#google-auth")).toContainText("Profile downloaded.");
    expect(await second.evaluate(() => S.p.name)).toBe("Cloud update");
    expect(await second.evaluate(() => ({
      xp: S.xp, checks: S.checks["2024-01-02"], day: S.days["2024-01-02"],
      water: S.waterHistory["2024-01-02"], journal: S.jr["2024-01-02"],
    }))).toEqual({ xp: 130, checks: { wake: true }, day: false, water: 4, journal: "A journal entry" });

    await changeName(first, "Device A");
    await changeName(second, "Device B");
    await first.getByRole("button", { name: "Sync now" }).click();
    await expect(first.locator("#google-auth")).toContainText("Profile uploaded.");
    await second.getByRole("button", { name: "Sync now" }).click();
    await expect(second.getByText("Local and cloud profiles may both have changed", { exact: false })).toBeVisible();
    expect(await second.evaluate(() => S.p.name)).toBe("Device B");
    await changeName(first, "Device A again");
    await first.getByRole("button", { name: "Sync now" }).click();
    await expect(first.locator("#google-auth")).toContainText("Profile uploaded.");
    await second.getByRole("button", { name: "Use this device" }).click();
    await expect(second.locator("#google-auth")).toContainText("The profile changed again");
    expect(cloud.get(sharedId).profile.profile.name).toBe("Device A again");
    await second.getByRole("button", { name: "Use this device" }).click();
    await expect(second.locator("#google-auth")).toContainText("Profile uploaded.");
    expect(cloud.get(sharedId).profile.profile.name).toBe("Device B");
  } finally {
    await Promise.all(contexts.map((context) => context.close()));
  }
});

test("a failed sync keeps local changes and succeeds on retry", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await changeName(page, "Offline edit");
  cloud.failNextSave = true;
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.locator("#google-auth")).toContainText("Could not sync this profile");
  expect(await page.evaluate(() => S.p.name)).toBe("Offline edit");
  expect(cloud.get(id).profile.profile.name).toBe("Player 1");
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.locator("#google-auth")).toContainText("Profile uploaded.");
  expect(cloud.get(id).profile.profile.name).toBe("Offline edit");
});

test("retrying a sync after a lost response recognizes the saved snapshot", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await changeName(page, "Uploaded before disconnect");
  cloud.failAfterSave = true;
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.locator("#google-auth")).toContainText("Could not sync this profile");
  const revision = cloud.get(id).profile.client_modified_at;
  expect(cloud.get(id).profile.profile.name).toBe("Uploaded before disconnect");
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.locator("#google-auth")).toContainText("Profile is up to date.");
  await expect(page.getByRole("button", { name: "Use cloud" })).toHaveCount(0);
  expect(cloud.get(id).profile.client_modified_at).toBe(revision);
});

test("edits made during an upload remain pending", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await changeName(page, "First edit");
  let release;
  let started;
  const inFlight = new Promise((resolve) => { started = resolve; });
  cloud.pauseNextSave = { started, wait: new Promise((resolve) => { release = resolve; }) };
  await page.getByRole("button", { name: "Sync now" }).click();
  await inFlight;
  await changeName(page, "Newer edit");
  release();
  await expect(page.locator("#google-auth")).toContainText("newer local changes still need syncing");
  expect(cloud.get(id).profile.profile.name).toBe("First edit");
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.locator("#google-auth")).toContainText("Profile uploaded.");
  expect(cloud.get(id).profile.profile.name).toBe("Newer edit");
});

test("reselecting the current cloud profile retains its sync baseline", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.getByRole("button", { name: "Choose cloud profile" }).click();
  await page.getByLabel("Cloud profile").selectOption(id);
  await page.getByRole("button", { name: "Connect profile" }).click();
  await expect(page.locator("#google-auth")).toContainText(/Profile uploaded|Profile is up to date/);
  await expect(page.getByRole("button", { name: "Use cloud" })).toHaveCount(0);
});

test("sync refuses to overwrite a profile changed in another tab", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.evaluate(() => {
    const stored = JSON.parse(localStorage.getItem(uKey(CUR_UID)));
    stored.p.name = "Other tab";
    localStorage.setItem(uKey(CUR_UID), JSON.stringify(stored));
  });
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.locator("#google-auth")).toContainText("Reload before syncing");
  expect(await page.evaluate(() => readStoredProfile(CUR_UID).p.name)).toBe("Other tab");
  expect(cloud.get(id).profile.profile.name).toBe("Player 1");
});

test("older links without a sync baseline require an explicit choice", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  const initialRevision = cloud.get(id).profile.client_modified_at;
  await page.evaluate(() => {
    const key = "dailywalk_admin_max:profile-link:v1:sync-user:" + encodeURIComponent(CUR_UID);
    const link = JSON.parse(localStorage.getItem(key));
    delete link.baseRevision;
    delete link.baseFingerprint;
    localStorage.setItem(key, JSON.stringify(link));
  });
  await changeName(page, "Legacy local edit");
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.getByText("Local and cloud profiles may both have changed", { exact: false })).toBeVisible();
  expect(cloud.get(id).profile.client_modified_at).toBe(initialRevision);
  expect(await page.evaluate(() => S.p.name)).toBe("Legacy local edit");
  await page.getByRole("button", { name: "Use this device" }).click();
  await expect(page.locator("#google-auth")).toContainText("Profile uploaded.");
  expect(cloud.get(id).profile.profile.name).toBe("Legacy local edit");
});

test("legacy cloud profiles with revision zero can be synced", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  cloud.get(id).profile.client_modified_at = 0;
  await page.evaluate(() => {
    const key = "dailywalk_admin_max:profile-link:v1:sync-user:" + encodeURIComponent(CUR_UID);
    const link = JSON.parse(localStorage.getItem(key));
    delete link.baseRevision;
    delete link.baseFingerprint;
    localStorage.setItem(key, JSON.stringify(link));
  });
  await changeName(page, "Legacy version");
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.getByText("Local and cloud profiles may both have changed", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Use this device" }).click();
  await expect(page.locator("#google-auth")).toContainText("Profile uploaded.");
  expect(cloud.get(id).profile.client_modified_at).toBeGreaterThan(0);
  expect(cloud.get(id).profile.profile.name).toBe("Legacy version");
});

test("a failed backup prevents a cloud download from replacing local data", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.context().setOffline(true);
  await changeName(page, "Local edit");
  const snapshot = await page.evaluate(() => JSON.parse(JSON.stringify(S)));
  snapshot.p.name = "Remote edit";
  const remote = cloud.get(id);
  remote.profile.client_modified_at++;
  remote.profile.profile = snapshot.p;
  remote.profile.progress._dailyWalkSyncSnapshot = snapshot;
  await page.evaluate(() => {
    window.originalStorageSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.startsWith("dailywalk_admin_max:u:u_backup_")) throw new Error("Backup blocked");
      return window.originalStorageSetItem.call(this, key, value);
    };
  });
  await page.context().setOffline(false);
  await expect(page.getByText("Local and cloud profiles may both have changed", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Use cloud" }).click();
  await expect(page.locator("#google-auth")).toContainText("Could not sync this profile");
  expect(await page.evaluate(() => S.p.name)).toBe("Local edit");
  expect(await page.evaluate(() => readStoredProfile(CUR_UID).p.name)).toBe("Local edit");
  await page.evaluate(() => { Storage.prototype.setItem = window.originalStorageSetItem; });
  await page.getByRole("button", { name: "Use cloud" }).click();
  await expect(page.locator("#google-auth")).toContainText("Profile downloaded.");
  expect(await page.evaluate(() => S.p.name)).toBe("Remote edit");
});

test("a concurrent cloud save is never silently overwritten", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await changeName(page, "Device edit");
  cloud.raceNextSave = true;
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.locator("#google-auth")).toContainText("The profile changed again");
  expect(cloud.get(id).profile.profile.name).toBe("Concurrent cloud edit");
  expect(await page.evaluate(() => S.p.name)).toBe("Device edit");
  await page.getByRole("button", { name: "Use cloud" }).click();
  await expect(page.locator("#google-auth")).toContainText("Profile downloaded.");
  expect(await page.evaluate(() => S.p.name)).toBe("Concurrent cloud edit");
  expect(await page.evaluate(() => USERS.some((user) => user.label === "Device edit (sync backup)"))).toBe(true);
});

test("a malformed cloud snapshot is rejected without changing local progress", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.locator("#google-auth")).toContainText(/Profile uploaded|Profile is up to date/);
  cloud.get(id).profile.client_modified_at++;
  cloud.get(id).profile.progress._dailyWalkSyncSnapshot = null;
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.locator("#google-auth")).toContainText("Could not sync this profile");
  expect(await page.evaluate(() => S.p.name)).toBe("Player 1");
  expect(await page.evaluate(() => USERS.length)).toBe(1);
});

test("offline edits sync automatically after reconnecting, including inactive linked profiles", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.context().setOffline(true);
  await changeName(page, "Offline first profile");
  await expect(page.locator("#ubar")).toContainText("Offline");
  expect(cloud.get(id).profile.profile.name).toBe("Player 1");
  await page.locator("#go-info").evaluate((button) => button.click());
  await page.locator("#uadd").evaluate((button) => button.click());
  await changeName(page, "Second profile");
  await page.context().setOffline(false);
  await expect.poll(() => cloud.get(id).profile.profile.name).toBe("Offline first profile");
  await expect.poll(() => Array.from(cloud.values()).some(({ profile }) => profile.profile.name === "Second profile")).toBe(true);
  expect(await page.evaluate(() => S.p.name)).toBe("Second profile");
});

test("automatic sync retries a failed upload without another click", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  cloud.failNextSave = true;
  await changeName(page, "Retry automatically");
  await expect(page.locator("#google-auth")).toContainText("retrying");
  expect(await page.evaluate(() => S.p.name)).toBe("Retry automatically");
  await expect.poll(() => cloud.get(id).profile.profile.name, { timeout: 8000 }).toBe("Retry automatically");
  await expect(page.locator("#google-auth")).toContainText("Profiles are synced.");
});

test("an inactive profile conflict does not block syncing the active profile", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const firstCloudId = Array.from(cloud.keys())[0];
  const firstLocalId = await page.evaluate(() => CUR_UID);
  const firstSnapshot = await page.evaluate(() => structuredClone(S));
  await page.locator("#go-info").evaluate((button) => button.click());
  await page.locator("#uadd").evaluate((button) => button.click());
  await expect.poll(() => cloud.size).toBe(2);
  await expect.poll(() => page.evaluate(() => {
    const key = "dailywalk_admin_max:profile-link:v1:sync-user:" + encodeURIComponent(CUR_UID);
    return JSON.parse(localStorage.getItem(key) || "null")?.status;
  })).toBe("linked");
  await page.getByRole("button", { name: "Skip" }).click();
  await page.locator("#prof").evaluate((button) => button.click());
  await page.locator("#go-info").evaluate((button) => button.click());
  const secondCloudId = Array.from(cloud.keys()).find((id) => id !== firstCloudId);
  await page.context().setOffline(true);
  await changeName(page, "Second offline");
  await page.locator("#ulist .uitem").filter({ hasText: "Player 1" })
    .getByRole("button", { name: "Switch" }).evaluate((button) => button.click());
  await changeName(page, "First offline");
  await page.locator("#ulist .uitem").filter({ hasText: "Second offline" })
    .getByRole("button", { name: "Switch" }).evaluate((button) => button.click());
  const remote = cloud.get(firstCloudId);
  remote.profile.client_modified_at++;
  remote.profile.profile.name = "First remote";
  firstSnapshot.p.name = "First remote";
  remote.profile.progress._dailyWalkSyncSnapshot = firstSnapshot;
  await page.locator("#v-info [data-back]").evaluate((button) => button.click());
  await page.context().setOffline(false);
  await expect.poll(() => cloud.get(secondCloudId).profile.profile.name).toBe("Second offline");
  await expect(page.getByText("Local and cloud profiles may both have changed for First offline", { exact: false })).toBeVisible();
  expect(await page.evaluate((id) => readStoredProfile(id).p.name, firstLocalId)).toBe("First offline");
  await page.getByRole("button", { name: "Use cloud" }).click();
  await expect.poll(() => page.evaluate((id) => readStoredProfile(id).p.name, firstLocalId)).toBe("First remote");
  expect(await page.evaluate(() => S.p.name)).toBe("Second offline");
});

test("edits during an automatic upload are uploaded in a following pass", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  let release;
  let started;
  const inFlight = new Promise((resolve) => { started = resolve; });
  cloud.pauseNextSave = { started, wait: new Promise((resolve) => { release = resolve; }) };
  await changeName(page, "First automatic edit");
  await Promise.race([inFlight, new Promise((_, reject) => setTimeout(() => reject(new Error("Upload did not start")), 5000))]);
  await changeName(page, "Newer automatic edit");
  release();
  await expect.poll(() => cloud.get(id).profile.profile.name).toBe("Newer automatic edit");
  await expect(page.locator("#google-auth")).toContainText("Profiles are synced.");
});

test("automatic downloads wait for an unsaved journal draft", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.locator("#pdone").evaluate((button) => button.click());
  await page.locator("#jt").fill("Unsaved draft");
  const remote = cloud.get(id);
  remote.profile.client_modified_at++;
  remote.profile.profile.name = "Remote change";
  remote.profile.progress._dailyWalkSyncSnapshot.p.name = "Remote change";
  await page.evaluate(() => window.dispatchEvent(new Event("online")));
  await expect(page.locator("#ubar")).toContainText("Sync error");
  expect(await page.locator("#jt").inputValue()).toBe("Unsaved draft");
  expect(await page.evaluate(() => S.p.name)).toBe("Player 1");
  await page.locator("#prof").evaluate((button) => button.click());
  await expect(page.locator("#google-auth")).toContainText("Save or discard the journal draft");
});

test("two browsers automatically exchange changes and stop on offline conflicts", async ({ browser }) => {
  test.setTimeout(30000);
  const cloud = new Map();
  const contexts = await Promise.all([browser.newContext(), browser.newContext()]);
  try {
    const [first, second] = await Promise.all(contexts.map((context) => context.newPage()));
    await setup(first, cloud);
    const sharedId = Array.from(cloud.keys())[0];
    await setup(second, cloud);
    await changeName(second, "Original second device");
    await second.getByRole("button", { name: "Choose cloud profile" }).click();
    await second.getByLabel("Cloud profile").selectOption(sharedId);
    await second.getByRole("button", { name: "Connect profile" }).click();
    await expect(second.getByText("Local and cloud profiles may both have changed", { exact: false })).toBeVisible();
    await second.getByRole("button", { name: "Use cloud" }).click();
    await expect(second.locator("#google-auth")).toContainText("Profiles are synced.");
    const backupCount = await second.evaluate(() => USERS.length);

    await changeName(first, "Automatic cloud update");
    await expect.poll(() => cloud.get(sharedId).profile.profile.name).toBe("Automatic cloud update");
    await expect.poll(() => second.evaluate(() => S.p.name), { timeout: 12000 }).toBe("Automatic cloud update");
    expect(await second.evaluate(() => USERS.length)).toBe(backupCount);

    await contexts[1].setOffline(true);
    await changeName(second, "Offline device edit");
    await changeName(first, "Online device edit");
    await expect.poll(() => cloud.get(sharedId).profile.profile.name).toBe("Online device edit");
    await contexts[1].setOffline(false);
    await expect(second.getByText("Local and cloud profiles may both have changed", { exact: false })).toBeVisible();
    expect(await second.evaluate(() => S.p.name)).toBe("Offline device edit");
    expect(cloud.get(sharedId).profile.profile.name).toBe("Online device edit");
    await second.getByRole("button", { name: "Use this device" }).click();
    await expect.poll(() => cloud.get(sharedId).profile.profile.name).toBe("Offline device edit");
  } finally {
    await Promise.all(contexts.map((context) => context.close()));
  }
});
