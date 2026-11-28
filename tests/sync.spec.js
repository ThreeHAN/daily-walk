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
  let startupList = true;
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
      if (startupList) {
        startupList = false;
        return route.fulfill({ json: [], headers });
      }
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
      if (previous.profile.progress._dailyWalkSyncSnapshot) {
        previous.profile.progress._dailyWalkSyncSnapshot.p.name = "Concurrent cloud edit";
      }
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
  await page.getByRole("button", { name: "Create cloud profile" }).click();
  await expect(page.locator("#google-auth")).toContainText("Linked Player 1");
  await page.evaluate(() => {
    S.tutorialDone = true;
    save();
    document.getElementById("sp").classList.remove("show");
  });
  await page.locator("#prof").evaluate((element) => element.click());
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.locator("#google-auth")).toContainText(/Profile uploaded|Profile is up to date|Profile downloaded/);
  await expect.poll(() => page.evaluate(() => {
    const key = DailyWalkReact.linkKey("sync-user", CUR_UID);
    const link = JSON.parse(localStorage.getItem(key));
    return link.baseFingerprint === DailyWalkReact.profileFingerprint(S);
  })).toBe(true);
}

async function changeName(page, name, userInitiated = false) {
  await page.evaluate(({ value, fromUser }) => { S.p.name = value; save(fromUser); },
    { value: name, fromUser: userInitiated });
}

async function waitForSyncedProfile(page, cloud, id) {
  await expect.poll(async () => page.evaluate((revision) => {
    const key = DailyWalkReact.linkKey("sync-user", CUR_UID);
    const link = JSON.parse(localStorage.getItem(key));
    const pending = localStorage.getItem("dailywalk_admin_max:profile-sync-pending:v1:sync-user");
    return pending === null && link.baseRevision === revision
      && link.baseFingerprint === DailyWalkReact.profileFingerprint(S);
  }, cloud.get(id).profile.client_modified_at)).toBe(true);
}

test("two browsers sync in both directions and back up overlapping edits", async ({ browser }) => {
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
    await expect(second.locator("#google-auth")).toContainText("Profile is up to date.");
    expect(await second.evaluate(() => S.p.name)).toBe("Player 1");
    expect(await second.evaluate(() => USERS.some((user) => user.label === "Local backup (sync backup)"))).toBe(true);
    await second.locator("#go-info").evaluate((button) => button.click());
    await second.locator("#ulist .uitem").filter({ hasText: "Local backup (sync backup)" })
      .getByRole("button", { name: "Switch" }).evaluate((button) => button.click());
    expect(await second.evaluate(() => S.p.name)).toBe("Local backup");
    await second.locator("#ulist .uitem").filter({ hasText: "Player 1" })
      .getByRole("button", { name: "Switch" }).evaluate((button) => button.click());
    await second.locator("#profile-header button").evaluate((button) => button.click());

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
    await expect.poll(() => cloud.get(sharedId).profile.profile.name).toBe("Device B");
    expect(await second.evaluate(() => S.p.name)).toBe("Device B");
    expect(await second.evaluate(() => USERS.some((user) =>
      user.label === "Device A (cloud sync backup)" && readStoredProfile(user.id).p.name === "Device A"))).toBe(true);
  } finally {
    await Promise.all(contexts.map((context) => context.close()));
  }
});

test("two browsers merge independent edits after reconnecting", async ({ browser }) => {
  const cloud = new Map();
  const contexts = await Promise.all([browser.newContext(), browser.newContext()]);
  try {
    const [first, second] = await Promise.all(contexts.map((context) => context.newPage()));
    await setup(first, cloud);
    const id = Array.from(cloud.keys())[0];
    await setup(second, cloud);
    await second.getByRole("button", { name: "Choose cloud profile" }).click();
    await second.getByLabel("Cloud profile").selectOption(id);
    await second.getByRole("button", { name: "Connect profile" }).click();
    await expect(second.locator("#google-auth")).toContainText("Profile is up to date.");

    await contexts[1].setOffline(true);
    await second.evaluate(() => { S.p.hat = "cap"; save(true); });
    await changeName(first, "Other device", true);
    await expect.poll(() => cloud.get(id).profile.profile.name).toBe("Other device");
    await contexts[1].setOffline(false);
    await expect.poll(() => cloud.get(id).profile.profile.hat).toBe("cap");
    expect(await second.evaluate(() => [S.p.name, S.p.hat])).toEqual(["Other device", "cap"]);
    await expect(second.getByRole("button", { name: "Use cloud" })).toHaveCount(0);
    await first.getByRole("button", { name: "Sync now" }).click();
    await expect.poll(() => first.evaluate(() => S.p.hat)).toBe("cap");
  } finally {
    await Promise.all(contexts.map((context) => context.close()));
  }
});

test("two browsers preserve separate habit unchecks and recompute the day", async ({ browser }) => {
  const cloud = new Map();
  const contexts = await Promise.all([browser.newContext(), browser.newContext()]);
  try {
    const [first, second] = await Promise.all(contexts.map((context) => context.newPage()));
    await setup(first, cloud);
    const id = Array.from(cloud.keys())[0];
    await first.locator("#pdone").evaluate((button) => button.click());
    await first.locator('input[data-id="wake"]').check();
    await first.locator('input[data-id="stretch"]').check();
    const day = await first.evaluate(() => today());
    await expect.poll(() => cloud.get(id).profile.progress._dailyWalkSyncSnapshot?.checks[day]?.stretch).toBe(true);

    await setup(second, cloud);
    await second.getByRole("button", { name: "Choose cloud profile" }).click();
    await second.getByLabel("Cloud profile").selectOption(id);
    await second.getByRole("button", { name: "Connect profile" }).click();
    await expect(second.locator("#google-auth")).toContainText("Profile is up to date.");
    await second.locator("#pdone").evaluate((button) => button.click());
    await contexts[1].setOffline(true);
    await first.locator('input[data-id="wake"]').uncheck();
    await expect.poll(() => cloud.get(id).profile.progress._dailyWalkSyncSnapshot?.checks[day]?.wake).toBe(false);
    await second.locator('input[data-id="stretch"]').uncheck();
    await contexts[1].setOffline(false);
    await expect.poll(() => cloud.get(id).profile.progress._dailyWalkSyncSnapshot?.checks[day]?.stretch).toBe(false);
    const saved = cloud.get(id).profile.progress._dailyWalkSyncSnapshot;
    expect(saved.checks[day]).toMatchObject({ wake: false, stretch: false });
    expect(saved.days[day]).toBe(false);
    expect(saved.checkUpdatedAt[day].wake.at).toBeGreaterThan(0);
    expect(saved.checkUpdatedAt[day].stretch.at).toBeGreaterThan(0);
    await expect(second.locator("#ubar")).toContainText("Synced");
    await second.locator("#prof").evaluate((button) => button.click());
    await expect(second.getByRole("button", { name: "Use cloud" })).toHaveCount(0);
    await first.locator("#prof").evaluate((button) => button.click());
    await first.getByRole("button", { name: "Sync now" }).click();
    await expect(first.locator('input[data-id="stretch"]')).not.toBeChecked();
  } finally {
    await Promise.all(contexts.map((context) => context.close()));
  }
});

test("the later habit edit wins even when it returns to the shared value", async ({ page }) => {
  const cloud = new Map();
  await page.clock.setFixedTime(new Date());
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.locator("#pdone").evaluate((button) => button.click());
  await page.locator('input[data-id="wake"]').check();
  const day = await page.evaluate(() => today());
  await expect.poll(() => cloud.get(id).profile.progress._dailyWalkSyncSnapshot?.checks[day]?.wake).toBe(true);
  await waitForSyncedProfile(page, cloud, id);
  await page.context().setOffline(true);
  const remote = cloud.get(id);
  const snapshot = remote.profile.progress._dailyWalkSyncSnapshot;
  const oldStamp = snapshot.checkUpdatedAt[day].wake.at;
  snapshot.checks[day].wake = false;
  snapshot.checkUpdatedAt[day].wake = { at: oldStamp + 1, value: false };
  remote.profile.client_modified_at++;
  await page.evaluate((stamp) => {
    window.originalDateNow = Date.now;
    Date.now = () => stamp + 1000;
  }, oldStamp);
  await page.locator('input[data-id="wake"]').uncheck();
  await page.locator('input[data-id="wake"]').check();
  await page.evaluate(() => { Date.now = window.originalDateNow; });
  await page.context().setOffline(false);
  await expect.poll(() => cloud.get(id).profile.progress._dailyWalkSyncSnapshot?.checks[day]?.wake).toBe(true);
  expect(cloud.get(id).profile.progress._dailyWalkSyncSnapshot.checkUpdatedAt[day].wake.at).toBeGreaterThan(oldStamp + 1);
  await expect(page.locator("#ubar")).toContainText("Synced");
  await page.locator("#prof").evaluate((button) => button.click());
  await expect(page.getByRole("button", { name: "Use cloud" })).toHaveCount(0);
});

test("a later cloud habit edit updates the device", async ({ page }) => {
  const cloud = new Map();
  await page.clock.setFixedTime(new Date());
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.locator("#pdone").evaluate((button) => button.click());
  await page.locator('input[data-id="wake"]').check();
  const day = await page.evaluate(() => today());
  await expect.poll(() => cloud.get(id).profile.progress._dailyWalkSyncSnapshot?.checks[day]?.wake).toBe(true);
  await waitForSyncedProfile(page, cloud, id);
  await page.context().setOffline(true);
  const remote = cloud.get(id);
  const snapshot = remote.profile.progress._dailyWalkSyncSnapshot;
  const oldStamp = snapshot.checkUpdatedAt[day].wake.at;
  snapshot.checks[day].wake = false;
  snapshot.checkUpdatedAt[day].wake = { at: oldStamp + 3000, value: false };
  remote.profile.client_modified_at++;
  await page.evaluate((stamp) => {
    window.originalDateNow = Date.now;
    Date.now = () => stamp + 1000;
  }, oldStamp);
  await page.locator('input[data-id="wake"]').uncheck();
  await page.locator('input[data-id="wake"]').check();
  await page.evaluate(() => { Date.now = window.originalDateNow; });
  await page.context().setOffline(false);
  await expect(page.locator("#ubar")).toContainText("Synced");
  await expect(page.locator('input[data-id="wake"]')).not.toBeChecked();
  expect(cloud.get(id).profile.progress._dailyWalkSyncSnapshot.checks[day].wake).toBe(false);
});

test("equal habit timestamps with different values prefer the local edit", async ({ page }) => {
  const cloud = new Map();
  await page.clock.setFixedTime(new Date());
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.locator("#pdone").evaluate((button) => button.click());
  await page.locator('input[data-id="wake"]').check();
  const day = await page.evaluate(() => today());
  await expect.poll(() => cloud.get(id).profile.progress._dailyWalkSyncSnapshot?.checks[day]?.wake).toBe(true);
  await waitForSyncedProfile(page, cloud, id);
  await page.context().setOffline(true);
  const remote = cloud.get(id);
  const snapshot = remote.profile.progress._dailyWalkSyncSnapshot;
  const stamp = snapshot.checkUpdatedAt[day].wake.at + 1001;
  snapshot.checks[day].wake = false;
  snapshot.checkUpdatedAt[day].wake = { at: stamp, value: false };
  remote.profile.client_modified_at++;
  await page.evaluate((value) => {
    window.originalDateNow = Date.now;
    Date.now = () => value - 1;
  }, stamp);
  await page.locator('input[data-id="wake"]').uncheck();
  await page.locator('input[data-id="wake"]').check();
  await page.evaluate(() => { Date.now = window.originalDateNow; });
  await page.context().setOffline(false);
  await expect.poll(() => cloud.get(id).profile.progress._dailyWalkSyncSnapshot.checks[day].wake).toBe(true);
  await expect(page.locator("#ubar")).toContainText("Synced");
  expect(await page.evaluate(() => S.checks[today()].wake)).toBe(true);
});

test("an inconsistent habit timestamp prefers local and backs up the cloud", async ({ page }) => {
  const cloud = new Map();
  await page.clock.setFixedTime(new Date());
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.locator("#pdone").evaluate((button) => button.click());
  await page.locator('input[data-id="wake"]').check();
  const day = await page.evaluate(() => today());
  await expect.poll(() => cloud.get(id).profile.progress._dailyWalkSyncSnapshot?.checks[day]?.wake).toBe(true);
  await waitForSyncedProfile(page, cloud, id);
  await page.context().setOffline(true);
  const remote = cloud.get(id);
  const snapshot = remote.profile.progress._dailyWalkSyncSnapshot;
  const stamp = snapshot.checkUpdatedAt[day].wake.at + 1000;
  snapshot.checks[day].wake = false;
  snapshot.checkUpdatedAt[day].wake = { at: stamp, value: true };
  remote.profile.client_modified_at++;
  await page.evaluate((value) => {
    window.originalDateNow = Date.now;
    Date.now = () => value + 1000;
  }, stamp);
  await page.locator('input[data-id="wake"]').uncheck();
  await page.locator('input[data-id="wake"]').check();
  await page.evaluate(() => { Date.now = window.originalDateNow; });
  await page.context().setOffline(false);
  await expect.poll(() => cloud.get(id).profile.progress._dailyWalkSyncSnapshot.checks[day].wake).toBe(true);
  await expect(page.locator("#ubar")).toContainText("Synced");
  expect(await page.evaluate(() => S.checks[today()].wake)).toBe(true);
  expect(snapshot.checks[day].wake).toBe(false);
  expect(await page.evaluate(() => USERS.some((user) =>
    user.label.endsWith("(cloud sync backup)") && readStoredProfile(user.id).checks[today()].wake === false))).toBe(true);
});

test("legacy unchecks of different habits merge without invented timestamps", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  const day = await page.evaluate(() => today());
  await page.evaluate((date) => {
    S.checks[date] = { wake: true, stretch: true };
    S.days[date] = false;
    save();
  }, day);
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.locator("#google-auth")).toContainText("Profile uploaded.");
  await page.context().setOffline(true);
  await page.evaluate((date) => { S.checks[date].stretch = false; save(true); }, day);
  const remote = cloud.get(id);
  remote.profile.client_modified_at++;
  remote.profile.progress._dailyWalkSyncSnapshot.checks[day].wake = false;
  await page.context().setOffline(false);
  await expect.poll(() => cloud.get(id).profile.progress._dailyWalkSyncSnapshot.checks[day].stretch).toBe(false);
  const snapshot = cloud.get(id).profile.progress._dailyWalkSyncSnapshot;
  expect(snapshot.checks[day]).toMatchObject({ wake: false, stretch: false });
  expect(snapshot.checkUpdatedAt).toBeUndefined();
});

test("conflicting habit edits without timestamps prefer the local value", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  const day = await page.evaluate(() => today());
  await page.evaluate((date) => {
    S.checks[date] = { wake: true };
    S.days[date] = false;
    save();
  }, day);
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.locator("#google-auth")).toContainText("Profile uploaded.");
  await page.context().setOffline(true);
  await page.evaluate((date) => { S.checks[date].wake = false; save(true); }, day);
  const remote = cloud.get(id);
  remote.profile.client_modified_at++;
  delete remote.profile.progress._dailyWalkSyncSnapshot.checks[day].wake;
  await page.context().setOffline(false);
  await expect.poll(() => cloud.get(id).profile.progress._dailyWalkSyncSnapshot.checks[day].wake).toBe(false);
  await expect(page.locator("#ubar")).toContainText("Synced");
});

test("legacy numeric habit timestamps use the local fallback", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  const day = await page.evaluate(() => today());
  await page.evaluate((date) => {
    S.checks[date] = { wake: true };
    S.checkUpdatedAt = { [date]: { wake: 100 } };
    S.days[date] = false;
    save();
  }, day);
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.locator("#google-auth")).toContainText("Profile uploaded.");
  await page.context().setOffline(true);
  await page.evaluate((date) => {
    S.checks[date].wake = false;
    S.checkUpdatedAt[date].wake = 200;
    save(true);
  }, day);
  const remote = cloud.get(id);
  remote.profile.client_modified_at++;
  delete remote.profile.progress._dailyWalkSyncSnapshot.checks[day].wake;
  remote.profile.progress._dailyWalkSyncSnapshot.checkUpdatedAt[day].wake = 200;
  await page.context().setOffline(false);
  await expect.poll(() => cloud.get(id).profile.progress._dailyWalkSyncSnapshot.checks[day].wake).toBe(false);
  expect(cloud.get(id).profile.progress._dailyWalkSyncSnapshot.checkUpdatedAt[day].wake).toBe(200);
});

test("habit reset beats an earlier unseen check and keeps its earned XP", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  const day = await page.evaluate(() => today());
  await page.locator("#pdone").evaluate((button) => button.click());
  await page.context().setOffline(true);
  const remote = cloud.get(id);
  const snapshot = remote.profile.progress._dailyWalkSyncSnapshot;
  const stamp = Date.now() - 1000;
  snapshot.checks[day] = { wake: true };
  snapshot.checkUpdatedAt = { [day]: { wake: { at: stamp, value: true } } };
  snapshot.days[day] = false;
  snapshot.xp += 10;
  snapshot.life += 10;
  remote.profile.client_modified_at++;
  await page.locator("#reset").click();
  await page.context().setOffline(false);
  await expect.poll(() => cloud.get(id).profile.progress._dailyWalkSyncSnapshot?.checks[day]?.wake).toBe(false);
  expect(await page.evaluate(() => [S.checks[today()].wake, S.xp])).toEqual([false, snapshot.xp]);
});

test("older profiles gain habit timestamps only when a habit changes", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const before = await page.evaluate(() => ({
    checks: structuredClone(S.checks), stamps: S.checkUpdatedAt,
  }));
  expect(before.stamps).toBeUndefined();
  await page.reload();
  expect(await page.evaluate(() => S.checks)).toEqual(before.checks);
  await page.locator('input[data-id="wake"]').check();
  const stamp = await page.evaluate(() => S.checkUpdatedAt[today()].wake);
  expect(stamp.at).toBeGreaterThan(0);
  await page.reload();
  expect(await page.evaluate(() => S.checkUpdatedAt[today()].wake)).toEqual(stamp);
});

test("overlapping profile edits sync using the local value and back up the cloud", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.context().setOffline(true);
  await changeName(page, "Local name", true);
  const remote = cloud.get(id);
  remote.profile.client_modified_at++;
  remote.profile.profile.name = "Cloud name";
  remote.profile.progress._dailyWalkSyncSnapshot.p.name = "Cloud name";
  await page.context().setOffline(false);
  await expect.poll(() => cloud.get(id).profile.profile.name).toBe("Local name");
  await expect(page.locator("#ubar")).toContainText("Synced");
  expect(await page.evaluate(() => USERS.some((user) =>
    user.label === "Cloud name (cloud sync backup)" && readStoredProfile(user.id).p.name === "Cloud name"))).toBe(true);
});

test("separate existing journal entries merge without losing either edit", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.evaluate(() => {
    S.jr["2024-01-01"] = "First";
    S.jr["2024-01-02"] = "Second";
    save();
  });
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.locator("#google-auth")).toContainText("Profile uploaded.");
  await page.context().setOffline(true);
  await page.evaluate(() => { S.jr["2024-01-01"] = "First edit"; save(true); });
  const remote = cloud.get(id);
  remote.profile.client_modified_at++;
  remote.profile.progress._dailyWalkSyncSnapshot.jr["2024-01-02"] = "Second edit";
  await page.context().setOffline(false);
  await expect.poll(() => cloud.get(id).profile.progress._dailyWalkSyncSnapshot.jr["2024-01-01"]).toBe("First edit");
  expect(await page.evaluate(() => [S.jr["2024-01-01"], S.jr["2024-01-02"]]))
    .toEqual(["First edit", "Second edit"]);
});

test("a concurrent non-overlapping cloud save is merged on retry", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.evaluate(() => { S.p.hat = "cap"; save(); });
  cloud.raceNextSave = true;
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.locator("#google-auth")).toContainText("Profile changes merged and synced.");
  expect(cloud.get(id).profile.profile).toMatchObject({ name: "Concurrent cloud edit", hat: "cap" });
  expect(await page.evaluate(() => [S.p.name, S.p.hat])).toEqual(["Concurrent cloud edit", "cap"]);
});

test("a merge preserves an unsaved journal draft while uploading", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.locator("#pdone").evaluate((button) => button.click());
  await page.locator("#jt").fill("Unsaved draft");
  await page.evaluate(() => { S.p.hat = "cap"; save(); });
  const remote = cloud.get(id);
  remote.profile.client_modified_at++;
  remote.profile.profile.name = "Cloud name";
  remote.profile.progress._dailyWalkSyncSnapshot.p.name = "Cloud name";
  await page.locator("#prof").evaluate((button) => button.click());
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect(page.locator("#google-auth")).toContainText("Profile changes merged and synced.");
  expect(await page.locator("#jt").inputValue()).toBe("Unsaved draft");
  expect(await page.evaluate(() => [S.p.name, S.p.hat])).toEqual(["Cloud name", "cap"]);
  expect(cloud.get(id).profile.profile).toMatchObject({ name: "Cloud name", hat: "cap" });
});

test("a failed merged upload keeps both changes locally for retry", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.context().setOffline(true);
  await page.evaluate(() => { S.p.hat = "cap"; save(true); });
  const remote = cloud.get(id);
  remote.profile.client_modified_at++;
  remote.profile.profile.name = "Cloud name";
  remote.profile.progress._dailyWalkSyncSnapshot.p.name = "Cloud name";
  cloud.failNextSave = true;
  await page.context().setOffline(false);
  await expect(page.locator("#google-auth")).toContainText("use Sync now to retry");
  expect(await page.evaluate(() => [S.p.name, S.p.hat])).toEqual(["Cloud name", "cap"]);
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect.poll(() => cloud.get(id).profile.profile.hat).toBe("cap");
  expect(cloud.get(id).profile.profile.name).toBe("Cloud name");
});

test("concurrent gameplay changes keep local rewards and back up cloud progress", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.context().setOffline(true);
  await page.evaluate(() => {
    S.checks["2024-01-01"] = { wake: true };
    S.xp += 10;
    S.life += 10;
    save(true);
  });
  const remote = cloud.get(id);
  const snapshot = remote.profile.progress._dailyWalkSyncSnapshot;
  snapshot.checks["2024-01-02"] = { wake: true };
  snapshot.xp += 10;
  snapshot.life += 10;
  remote.profile.client_modified_at++;
  await page.context().setOffline(false);
  await expect.poll(() => cloud.get(id).profile.progress._dailyWalkSyncSnapshot.checks["2024-01-01"]).toEqual({ wake: true });
  expect(await page.evaluate(() => S.checks["2024-01-01"])).toEqual({ wake: true });
  expect(snapshot.checks["2024-01-02"]).toEqual({ wake: true });
  expect(await page.evaluate(() => USERS.some((user) => user.label.endsWith("(cloud sync backup)") &&
    readStoredProfile(user.id).checks["2024-01-02"]?.wake))).toBe(true);
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

test("older links without a sync baseline upload and preserve the cloud copy", async ({ page }) => {
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
  await expect.poll(() => cloud.get(id).profile.profile.name).toBe("Legacy local edit");
  expect(cloud.get(id).profile.client_modified_at).toBeGreaterThan(initialRevision);
  expect(cloud.get(id).profile.profile.name).toBe("Legacy local edit");
  expect(await page.evaluate(() => USERS.some((user) =>
    user.label === "Player 1 (cloud sync backup)" && readStoredProfile(user.id).p.name === "Player 1"))).toBe(true);
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
  await expect.poll(() => cloud.get(id).profile.profile.name).toBe("Legacy version");
  expect(cloud.get(id).profile.client_modified_at).toBeGreaterThan(0);
  expect(cloud.get(id).profile.profile.name).toBe("Legacy version");
});

test("a failed cloud backup prevents an unsafe upload", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.context().setOffline(true);
  await changeName(page, "Local edit", true);
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
  await expect(page.locator("#google-auth")).toContainText("Could not sync a profile");
  expect(await page.evaluate(() => S.p.name)).toBe("Local edit");
  expect(await page.evaluate(() => readStoredProfile(CUR_UID).p.name)).toBe("Local edit");
  expect(cloud.get(id).profile.profile.name).toBe("Remote edit");
  await page.evaluate(() => { Storage.prototype.setItem = window.originalStorageSetItem; });
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect.poll(() => cloud.get(id).profile.profile.name).toBe("Local edit");
  expect(await page.evaluate(() => USERS.some((user) => user.label === "Remote edit (cloud sync backup)"))).toBe(true);
});

test("a concurrent cloud save is backed up and automatically retried", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await changeName(page, "Device edit");
  cloud.raceNextSave = true;
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect.poll(() => cloud.get(id).profile.profile.name).toBe("Device edit");
  expect(await page.evaluate(() => S.p.name)).toBe("Device edit");
  expect(await page.evaluate(() => USERS.some((user) =>
    user.label === "Concurrent cloud edit (cloud sync backup)" && readStoredProfile(user.id).p.name === "Concurrent cloud edit"))).toBe(true);
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

test("offline edits sync after reconnecting, including inactive linked profiles", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.context().setOffline(true);
  await changeName(page, "Offline first profile", true);
  await expect(page.locator("#ubar")).toContainText("Offline");
  expect(cloud.get(id).profile.profile.name).toBe("Player 1");
  await page.locator("#go-info").evaluate((button) => button.click());
  await page.locator("#uadd").evaluate((button) => button.click());
  await changeName(page, "Second profile", true);
  await page.context().setOffline(false);
  await expect.poll(() => cloud.get(id).profile.profile.name).toBe("Offline first profile");
  await expect.poll(() => Array.from(cloud.values()).some(({ profile }) => profile.profile.name === "Second profile")).toBe(true);
  expect(await page.evaluate(() => S.p.name)).toBe("Second profile");
});

test("offline edits remain queued across reload and sync on reconnect", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.context().setOffline(true);
  await changeName(page, "Offline across reload", true);
  await expect(page.locator("#ubar")).toContainText("Offline");
  await page.reload();
  await page.locator("#prof").evaluate((button) => button.click());
  await expect(page.locator("#google-auth")).toContainText("Linked Offline across reload");
  expect(cloud.get(id).profile.profile.name).toBe("Player 1");
  await page.context().setOffline(false);
  await expect.poll(() => cloud.get(id).profile.profile.name).toBe("Offline across reload");
});

test("pending sync storage failures remain visible while local edits are retained", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.context().setOffline(true);
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.startsWith("dailywalk_admin_max:profile-sync-pending:")) throw new Error("Storage blocked");
      return original.call(this, key, value);
    };
  });
  await changeName(page, "Saved locally", true);
  await expect(page.locator("#google-auth")).toContainText("sync retry information could not be stored");
  expect(await page.evaluate(() => readStoredProfile(CUR_UID).p.name)).toBe("Saved locally");
  await page.context().setOffline(false);
  await expect.poll(() => cloud.get(id).profile.profile.name).toBe("Saved locally");
});

test("a failed upload waits for an explicit retry", async ({ page }) => {
  const cloud = new Map();
  await page.clock.install();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  cloud.failNextSave = true;
  await changeName(page, "Retry manually", true);
  await expect(page.locator("#google-auth")).toContainText("use Sync now to retry");
  expect(await page.evaluate(() => S.p.name)).toBe("Retry manually");
  await page.clock.fastForward(65000);
  expect(cloud.get(id).profile.profile.name).toBe("Player 1");
  await page.reload();
  await page.locator("#prof").evaluate((button) => button.click());
  await expect(page.locator("#google-auth")).toContainText("Use Sync now to retry");
  await page.clock.fastForward(65000);
  expect(cloud.get(id).profile.profile.name).toBe("Player 1");
  await page.getByRole("button", { name: "Sync now" }).click();
  await expect.poll(() => cloud.get(id).profile.profile.name).toBe("Retry manually");
  await expect(page.locator("#google-auth")).toContainText("Profile uploaded.");
  await expect(page.locator("#ubar")).toContainText("Synced");
  let requests = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("/read_walk_profile")) requests++;
  });
  await page.context().setOffline(true);
  await page.context().setOffline(false);
  await page.clock.fastForward(1000);
  expect(requests).toBe(0);
});

test("a failed upload retries after reconnecting while the page was closed", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  cloud.failNextSave = true;
  await changeName(page, "Reconnect after leaving", true);
  await expect(page.locator("#google-auth")).toContainText("use Sync now to retry");
  await page.context().setOffline(true);
  await page.goto("about:blank");
  await page.context().setOffline(false);
  await page.goto(site);
  await expect.poll(() => cloud.get(id).profile.profile.name).toBe("Reconnect after leaving");
});

test("reloading and background changes do not initiate cloud reads", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  let requests = 0;
  page.on("request", (request) => {
    if (request.url().endsWith("/read_walk_profile") || request.url().endsWith("/save_walk_profile_checked")) {
      requests++;
    }
  });
  await page.reload();
  await page.locator("#prof").evaluate((button) => button.click());
  await expect(page.locator("#google-auth")).toContainText("Linked Player 1");
  await page.evaluate(() => {
    S.p.name = "Background save";
    save();
    window.dispatchEvent(new Event("storage"));
    document.dispatchEvent(new Event("visibilitychange"));
    window.dispatchEvent(new Event("online"));
  });
  await page.waitForTimeout(1000);
  expect(requests).toBe(0);
  expect(cloud.values().next().value.profile.profile.name).toBe("Player 1");
});

test("inactive overlapping edits do not block syncing the active profile", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const firstCloudId = Array.from(cloud.keys())[0];
  const firstLocalId = await page.evaluate(() => CUR_UID);
  const firstSnapshot = await page.evaluate(() => structuredClone(S));
  await page.locator("#go-info").evaluate((button) => button.click());
  await page.locator("#uadd").click();
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
  await changeName(page, "Second offline", true);
  await page.locator("#ulist .uitem").filter({ hasText: "Player 1" })
    .getByRole("button", { name: "Switch" }).evaluate((button) => button.click());
  await changeName(page, "First offline", true);
  await page.locator("#ulist .uitem").filter({ hasText: "Second offline" })
    .getByRole("button", { name: "Switch" }).evaluate((button) => button.click());
  const remote = cloud.get(firstCloudId);
  remote.profile.client_modified_at++;
  remote.profile.profile.name = "First remote";
  firstSnapshot.p.name = "First remote";
  remote.profile.progress._dailyWalkSyncSnapshot = firstSnapshot;
  await page.locator("#profile-header button").evaluate((button) => button.click());
  await page.context().setOffline(false);
  await expect.poll(() => cloud.get(secondCloudId).profile.profile.name).toBe("Second offline");
  await expect.poll(() => cloud.get(firstCloudId).profile.profile.name).toBe("First offline");
  expect(await page.evaluate((id) => readStoredProfile(id).p.name, firstLocalId)).toBe("First offline");
  expect(await page.evaluate(() => USERS.some((user) => user.label === "First remote (cloud sync backup)"))).toBe(true);
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
  await changeName(page, "First automatic edit", true);
  await Promise.race([inFlight, new Promise((_, reject) => setTimeout(() => reject(new Error("Upload did not start")), 5000))]);
  await changeName(page, "Newer automatic edit", true);
  release();
  await expect.poll(() => cloud.get(id).profile.profile.name).toBe("Newer automatic edit");
  await expect(page.locator("#google-auth")).toContainText("Profiles are synced.");
});

test("reconnection during an in-flight failed upload retries once", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  let release;
  let started;
  const inFlight = new Promise((resolve) => { started = resolve; });
  cloud.pauseNextSave = { started, wait: new Promise((resolve) => { release = resolve; }) };
  cloud.failAfterSave = true;
  await changeName(page, "Reconnect during upload", true);
  await Promise.race([inFlight, new Promise((_, reject) => setTimeout(() => reject(new Error("Upload did not start")), 5000))]);
  await page.context().setOffline(true);
  await page.context().setOffline(false);
  release();
  await expect.poll(() => cloud.get(id).profile.profile.name).toBe("Reconnect during upload");
  await expect(page.locator("#google-auth")).toContainText("Profiles are synced.");
  await expect(page.getByRole("button", { name: "Use cloud" })).toHaveCount(0);
});

test("downloads preserve an unsaved journal draft", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.locator("#pdone").evaluate((button) => button.click());
  await page.locator("#jt").fill("Unsaved draft");
  const remote = cloud.get(id);
  remote.profile.client_modified_at++;
  remote.profile.profile.name = "Remote change";
  if (remote.profile.progress._dailyWalkSyncSnapshot) {
    remote.profile.progress._dailyWalkSyncSnapshot.p.name = "Remote change";
  }
  await page.locator("#prof").evaluate((button) => button.click());
  await page.getByRole("button", { name: "Sync now" }).click();
  expect(await page.locator("#jt").inputValue()).toBe("Unsaved draft");
  await expect(page.locator("#google-auth")).toContainText("Profile downloaded.");
  expect(await page.evaluate(() => S.p.name)).toBe("Remote change");
});

test("two browsers sync offline edits without conflict prompts or polling", async ({ browser }) => {
  test.setTimeout(35000);
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
    await expect(second.locator("#google-auth")).toContainText("Profile is up to date.");
    const backupCount = await second.evaluate(() => USERS.length);

    let remoteReads = 0;
    second.on("request", (request) => {
      if (request.url().endsWith("/read_walk_profile")) remoteReads++;
    });
    await changeName(first, "Automatic cloud update", true);
    await expect.poll(() => cloud.get(sharedId).profile.profile.name).toBe("Automatic cloud update");
    await second.waitForTimeout(11000);
    expect(remoteReads).toBe(0);
    expect(await second.evaluate(() => S.p.name)).toBe("Player 1");
    await second.getByRole("button", { name: "Sync now" }).click();
    await expect.poll(() => second.evaluate(() => S.p.name)).toBe("Automatic cloud update");
    expect(await second.evaluate(() => USERS.length)).toBe(backupCount);

    await contexts[1].setOffline(true);
    await changeName(second, "Offline device edit", true);
    await changeName(first, "Online device edit", true);
    await expect.poll(() => cloud.get(sharedId).profile.profile.name).toBe("Online device edit");
    await contexts[1].setOffline(false);
    await expect.poll(() => cloud.get(sharedId).profile.profile.name).toBe("Offline device edit");
    expect(await second.evaluate(() => S.p.name)).toBe("Offline device edit");
    expect(await second.evaluate(() => USERS.some((user) => user.label === "Online device edit (cloud sync backup)"))).toBe(true);
  } finally {
    await Promise.all(contexts.map((context) => context.close()));
  }
});

test("editing a field and completing a habit trigger sync without polling", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  await page.locator("#go-info").click();
  await page.locator("#pn").fill("Field edit");
  await expect.poll(() => cloud.get(id).profile.profile.name).toBe("Field edit");
  await page.locator("#pdone").evaluate((button) => button.click());
  await page.locator('input[data-id="wake"]').check();
  const date = await page.evaluate(() => today());
  await expect.poll(() => cloud.get(id).activity.find((entry) => entry.activity_date === date)?.habit_checks.wake).toBe(true);
});

test("restoring a profile syncs the asynchronously read backup", async ({ page }) => {
  const cloud = new Map();
  await setup(page, cloud);
  const id = Array.from(cloud.keys())[0];
  const backup = await page.evaluate(() => {
    const state = structuredClone(S);
    state.p.name = "Restored profile";
    return JSON.stringify({ data: state });
  });
  await page.locator("#go-info").click();
  await page.locator("#ufile").setInputFiles({
    name: "backup.json", mimeType: "application/json", buffer: Buffer.from(backup),
  });
  await expect.poll(() => cloud.get(id).profile.profile.name).toBe("Restored profile");
});
