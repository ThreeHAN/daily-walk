const { test, expect } = require("@playwright/test");
const { pathToFileURL } = require("node:url");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const site = "http://localhost:43999";
const supabase = "https://dnnpakvhiipflpvmkymf.supabase.co";

async function serveApp(page, prefix = "/") {
  await page.route(`${supabase}/rest/v1/walk_profiles**`, (route) =>
    route.fulfill({ json: [], headers: { "Access-Control-Allow-Origin": "*" } }));
  await page.route(`${site}/**`, async (route) => {
    const url = new URL(route.request().url());
    if (!url.pathname.startsWith(prefix)) throw new Error(`Unexpected path: ${url.pathname}`);
    const file = url.pathname === prefix ? "index.html" : url.pathname.slice(prefix.length);
    await route.fulfill({ path: path.join(root, file) });
  });
}

async function openAccounts(page) {
  await page.locator("#prof").evaluate((element) => element.click());
}

function snapshotFor(save, owner) {
  const { p, tasks, checks, days, jr, waterHistory, ...progress } = save.state;
  return {
    profile: {
      id: save.profile_id, owner_id: owner, profile: p, habits: tasks, progress,
      xp: save.state.xp, lifetime_xp: save.state.life, state_version: save.state.v,
      client_modified_at: save.modified_at,
    },
    activity: save.activity.map((item) => ({
      activity_date: item.date, habit_checks: item.checks, completed: item.completed,
      water_count: item.water, journal: item.journal,
    })),
  };
}

test("Google sign-in is on the main profile menu", async ({ page }) => {
  await serveApp(page);
  await page.goto(site);
  await page.getByRole("button", { name: "Continue locally" }).click();
  await openAccounts(page);
  await expect(page.locator("#v-menu #google-auth")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in with Google" })).toBeVisible();
  await page.locator("#go-info").evaluate((button) => button.click());
  await expect(page.locator("#google-auth")).toBeHidden();
  await expect(page.locator("#v-info #ulist")).toBeVisible();
  await page.locator("#v-info [data-back]").evaluate((button) => button.click());
  await expect(page.locator("#google-auth")).toBeVisible();
});

test("Google sign-in and sign-out preserve an existing local profile", async ({ page }) => {
  await serveApp(page);
  let authorization;
  const saves = [];
  await page.route(`${supabase}/rest/v1/rpc/**`, async (route) => {
    const request = route.request();
    if (request.url().endsWith("/save_walk_profile_checked")) {
      saves.push(request.postDataJSON());
      await route.fulfill({ json: true, headers: { "Access-Control-Allow-Origin": "*" } });
    } else {
      expect(request.postDataJSON().profile_id).toBe(saves[0].profile_id);
      await route.fulfill({ json: snapshotFor(saves.at(-1), "test-user"),
        headers: { "Access-Control-Allow-Origin": "*" } });
    }
  });
  await page.route(`${supabase}/auth/v1/**`, async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("/authorize")) {
      authorization = url;
      await route.fulfill({ body: "Google authorization" });
    } else if (url.pathname.endsWith("/token")) {
      expect(url.searchParams.get("grant_type")).toBe("pkce");
      await route.fulfill({ headers: { "Access-Control-Allow-Origin": "*" }, json: {
        access_token: "test-access-token",
        refresh_token: "test-refresh-token",
        token_type: "bearer",
        expires_in: 3600,
        user: { id: "test-user", email: "walker@example.com", app_metadata: {}, user_metadata: {}, aud: "authenticated", created_at: "2026-01-01T00:00:00Z" },
      } });
    } else if (url.pathname.endsWith("/logout")) {
      await route.fulfill({ status: 204, headers: { "Access-Control-Allow-Origin": "*" } });
    } else {
      throw new Error(`Unexpected Supabase request: ${url.pathname}`);
    }
  });

  await page.goto(site);
  await page.getByRole("button", { name: "Continue locally" }).click();
  await page.evaluate(() => {
    S.p.name = "Local Walker";
    S.xp = 123;
    S.life = 123;
    S.checks["2025-01-02"] = { wake: true };
    S.days["2025-01-02"] = true;
    S.waterHistory["2025-01-02"] = 4;
    S.jr["2025-01-02"] = "Journal";
    S.water = { d: today(), n: 6 };
    S.waterHistory[today()] = 2;
    save();
  });
  const profileId = await page.evaluate(() => CUR_UID);
  await openAccounts(page);
  const signIn = page.getByRole("button", { name: "Sign in with Google" });
  await expect(signIn).toBeEnabled();
  await signIn.evaluate((element) => element.click());
  await expect(page).toHaveURL(/\/auth\/v1\/authorize/);
  await page.goto(`${site}/?code=test-code`);
  await page.getByRole("button", { name: "Create cloud profile" }).click();
  await expect(page.locator("#google-auth")).toContainText("Signed in as walker@example.com");
  await expect(page.locator("#google-auth")).toContainText("Linked Player 1");
  expect(saves).toHaveLength(1);
  expect(saves[0]).toMatchObject({
    expected_modified_at: 0,
    state: { p: { name: "Player 1" }, xp: 0 },
  });
  expect(authorization.searchParams.get("provider")).toBe("google");
  expect(authorization.searchParams.get("redirect_to")).toBe(`${site}/`);
  expect(authorization.searchParams.get("code_challenge")).toBeTruthy();
  expect(await page.evaluate((id) => ({ name: readStoredProfile(id).p.name, xp: readStoredProfile(id).xp }), profileId))
    .toEqual({ name: "Local Walker", xp: 123 });
  await page.reload();
  await openAccounts(page);
  await expect(page.locator("#google-auth")).toContainText("Signed in as walker@example.com");
  await expect(page.locator("#google-auth")).toContainText("Linked Player 1");
  expect(saves).toHaveLength(1);
  await page.getByRole("button", { name: "Sign out" }).evaluate((element) => element.click());
  await expect(page.locator("#google-auth")).toContainText("Not signed in");
  expect(await page.evaluate((id) => ({ name: readStoredProfile(id).p.name, xp: readStoredProfile(id).xp }), profileId))
    .toEqual({ name: "Local Walker", xp: 123 });
});

function storedSession(userId) {
  return {
    access_token: "token-" + userId,
    refresh_token: "refresh-" + userId,
    token_type: "bearer",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: { id: userId, email: `${userId}@example.com`, app_metadata: {}, user_metadata: {}, aud: "authenticated", created_at: "2026-01-01T00:00:00Z" },
  };
}

test("a lost link response is recovered automatically without overwriting local progress", async ({ page }) => {
  await serveApp(page);
  await page.addInitScript((session) => {
    localStorage.setItem("sb-dnnpakvhiipflpvmkymf-auth-token", JSON.stringify(session));
  }, storedSession("retry-user"));
  let uploaded;
  let writes = 0;
  await page.route(`${supabase}/rest/v1/rpc/**`, async (route) => {
    if (route.request().url().endsWith("/save_walk_profile_checked")) {
      writes++;
      uploaded = route.request().postDataJSON();
      await route.abort("failed");
    } else {
      expect(route.request().postDataJSON().profile_id).toBe(uploaded.profile_id);
      await route.fulfill({ json: snapshotFor(uploaded, "retry-user"),
        headers: { "Access-Control-Allow-Origin": "*" } });
    }
  });
  await page.goto(site);
  await page.getByRole("button", { name: "Create cloud profile" }).click();
  await openAccounts(page);
  const local = await page.evaluate(() => ({ id: CUR_UID, name: S.p.name, xp: S.xp }));
  await expect(page.locator("#google-auth")).toContainText("Linked Player 1");
  expect(writes).toBe(1);
  expect(await page.evaluate(() => ({ id: CUR_UID, name: S.p.name, xp: S.xp }))).toEqual(local);
});

test("a failed link retries the same cloud ID after reconnecting", async ({ page }) => {
  await serveApp(page);
  await page.addInitScript((session) => {
    localStorage.setItem("sb-dnnpakvhiipflpvmkymf-auth-token", JSON.stringify(session));
  }, storedSession("offline-user"));
  const writes = [];
  let allowed = false;
  let uploaded;
  await page.route(`${supabase}/rest/v1/rpc/**`, async (route) => {
    if (route.request().url().endsWith("/read_walk_profile")) {
      await route.fulfill({ body: JSON.stringify(uploaded ? snapshotFor(uploaded, "offline-user") : null), contentType: "application/json",
        headers: { "Access-Control-Allow-Origin": "*" } });
    } else {
      writes.push(route.request().postDataJSON());
      if (!allowed) await route.abort("failed");
      else {
        uploaded = writes.at(-1);
        await route.fulfill({ json: true, headers: { "Access-Control-Allow-Origin": "*" } });
      }
    }
  });
  await page.goto(site);
  await page.getByRole("button", { name: "Create cloud profile" }).click();
  await openAccounts(page);
  await expect(page.getByText("Could not link the current profile.", { exact: false })).toBeVisible();
  await page.evaluate(() => { S.p.name = "Still local"; save(); });
  allowed = true;
  await page.evaluate(() => window.dispatchEvent(new Event("online")));
  await expect(page.locator("#google-auth")).toContainText("Linked Still local");
  expect(writes.length).toBeGreaterThanOrEqual(2);
  expect(writes.at(-1).profile_id).toBe(writes[0].profile_id);
  expect(writes.at(-1).state.p.name).toBe("Still local");
});

test("link metadata storage failure is visible and does not upload", async ({ page }) => {
  await serveApp(page);
  await page.addInitScript((session) => {
    localStorage.setItem("sb-dnnpakvhiipflpvmkymf-auth-token", JSON.stringify(session));
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.startsWith("dailywalk_admin_max:profile-link:v1:")) throw new Error("Storage blocked");
      return original.call(this, key, value);
    };
  }, storedSession("storage-user"));
  let writes = 0;
  await page.route(`${supabase}/rest/v1/rpc/**`, async (route) => {
    writes++;
    await route.fulfill({ json: true, headers: { "Access-Control-Allow-Origin": "*" } });
  });
  await page.goto(site);
  await page.getByRole("button", { name: "Create cloud profile" }).click();
  await openAccounts(page);
  await expect(page.getByText("Could not link the current profile.", { exact: false })).toBeVisible();
  expect(writes).toBe(0);
  expect(await page.evaluate(() => S.p.name)).toBe("Player 1");
});

test("retrying a link does not overwrite profile changes from another tab", async ({ page }) => {
  await serveApp(page);
  await page.addInitScript((session) => {
    localStorage.setItem("sb-dnnpakvhiipflpvmkymf-auth-token", JSON.stringify(session));
  }, storedSession("link-retry-user"));
  let requests = 0;
  await page.route(`${supabase}/rest/v1/rpc/**`, async (route) => {
    requests++;
    await route.abort("failed");
  });
  await page.goto(site);
  await page.getByRole("button", { name: "Create cloud profile" }).click();
  await openAccounts(page);
  await expect(page.getByText("Could not link the current profile.", { exact: false })).toBeVisible();
  await page.context().setOffline(true);
  await page.evaluate(() => {
    const stored = readStoredProfile(CUR_UID);
    stored.p.name = "Other tab";
    localStorage.setItem(uKey(CUR_UID), JSON.stringify(stored));
  });
  const requestsBeforeRetry = requests;
  const failure = page.waitForEvent("console", {
    predicate: (message) => message.type() === "error" && message.text().includes("Could not link profile"),
  });
  await page.getByRole("button", { name: "Retry linking" }).evaluate((button) => button.click());
  await failure;
  await expect(page.getByText("Local profiles changed. Reload before linking.")).toBeVisible();
  expect(await page.evaluate(() => readStoredProfile(CUR_UID).p.name)).toBe("Other tab");
  expect(requests).toBe(requestsBeforeRetry);
});

test("isolated browsers link separate local profiles to the signed-in account", async ({ browser }) => {
  const contexts = await Promise.all([browser.newContext(), browser.newContext()]);
  const saves = [];
  try {
    for (const [index, context] of contexts.entries()) {
      const page = await context.newPage();
      await serveApp(page);
      await page.addInitScript((session) => {
        localStorage.setItem("sb-dnnpakvhiipflpvmkymf-auth-token", JSON.stringify(session));
      }, storedSession("same-user"));
      await page.route(`${supabase}/rest/v1/rpc/**`, async (route) => {
        const request = route.request();
        expect(request.headers().authorization).toBe("Bearer token-same-user");
        if (request.url().endsWith("/save_walk_profile_checked")) {
          saves.push(request.postDataJSON());
          await route.fulfill({ json: true, headers: { "Access-Control-Allow-Origin": "*" } });
        } else {
          const save = saves.find((item) => item.profile_id === request.postDataJSON().profile_id);
          await route.fulfill({ json: snapshotFor(save, "same-user"), headers: { "Access-Control-Allow-Origin": "*" } });
        }
      });
      await page.goto(site);
      await page.getByRole("button", { name: "Create cloud profile" }).click();
      await openAccounts(page);
      await expect(page.locator("#google-auth")).toContainText("Linked Player 1");
      expect(await page.evaluate(() => S.p.name)).toBe("Player 1");
      expect(saves).toHaveLength(index + 1);
    }
    expect(saves[0].profile_id).not.toBe(saves[1].profile_id);
  } finally {
    await Promise.all(contexts.map((context) => context.close()));
  }
});

test("different Google accounts keep separate cloud profile caches", async ({ page }) => {
  await serveApp(page);
  const uploads = [];
  await page.addInitScript((session) => {
    if (!localStorage.getItem("sb-dnnpakvhiipflpvmkymf-auth-token")) {
      localStorage.setItem("sb-dnnpakvhiipflpvmkymf-auth-token", JSON.stringify(session));
    }
  }, storedSession("first-user"));
  await page.route(`${supabase}/rest/v1/rpc/**`, async (route) => {
    const request = route.request();
    if (request.url().endsWith("/save_walk_profile_checked")) {
      uploads.push({ token: request.headers().authorization, body: request.postDataJSON() });
      await route.fulfill({ json: true, headers: { "Access-Control-Allow-Origin": "*" } });
    } else {
      const upload = uploads.find((item) => item.body.profile_id === request.postDataJSON().profile_id);
      const owner = upload.token === "Bearer token-first-user" ? "first-user" : "second-user";
      await route.fulfill({ json: snapshotFor(upload.body, owner), headers: { "Access-Control-Allow-Origin": "*" } });
    }
  });
  await page.goto(site);
  await page.getByRole("button", { name: "Create cloud profile" }).click();
  await openAccounts(page);
  await expect(page.locator("#google-auth")).toContainText("Linked Player 1");
  const id = await page.evaluate(() => CUR_UID);
  await page.evaluate((session) => {
    localStorage.setItem("sb-dnnpakvhiipflpvmkymf-auth-token", JSON.stringify(session));
  }, storedSession("second-user"));
  await page.reload();
  await page.getByRole("button", { name: "Create cloud profile" }).click();
  await openAccounts(page);
  await expect(page.locator("#google-auth")).toContainText("Signed in as second-user@example.com");
  await expect(page.locator("#google-auth")).toContainText("Linked Player 1");
  expect(uploads.map((upload) => upload.token)).toEqual(["Bearer token-first-user", "Bearer token-second-user"]);
  expect(uploads[0].body.profile_id).not.toBe(uploads[1].body.profile_id);
  expect(await page.evaluate(() => CUR_UID)).not.toBe(id);
  expect(await page.evaluate((localId) => readStoredProfile(localId).p.name, id)).toBe("Player 1");
});

test("a missing linked cloud profile is reported without replacing local progress", async ({ page }) => {
  await serveApp(page);
  await page.addInitScript((session) => {
    localStorage.setItem("sb-dnnpakvhiipflpvmkymf-auth-token", JSON.stringify(session));
  }, storedSession("missing-user"));
  let writes = 0;
  await page.route(`${supabase}/rest/v1/rpc/**`, async (route) => {
    if (route.request().url().endsWith("/save_walk_profile_checked")) {
      writes++;
      await route.fulfill({ json: true, headers: { "Access-Control-Allow-Origin": "*" } });
    } else {
      await route.fulfill({ body: "null", contentType: "application/json",
        headers: { "Access-Control-Allow-Origin": "*" } });
    }
  });
  await page.goto(site);
  await page.getByRole("button", { name: "Create cloud profile" }).click();
  await openAccounts(page);
  await expect(page.locator("#google-auth")).toContainText("Linked Player 1");
  await page.reload();
  await openAccounts(page);
  await expect(page.getByText("The linked cloud profile is missing.", { exact: false })).toBeVisible();
  expect(writes).toBe(1);
  expect(await page.evaluate(() => S.p.name)).toBe("Player 1");
});

test("Google sign-in redirects back to the GitHub Pages app path", async ({ page }) => {
  await serveApp(page, "/daily-walk/");
  let redirectTo;
  await page.route(`${supabase}/auth/v1/authorize**`, async (route) => {
    redirectTo = new URL(route.request().url()).searchParams.get("redirect_to");
    await route.fulfill({ body: "Google authorization" });
  });
  await page.goto(`${site}/daily-walk/`);
  await page.getByRole("button", { name: "Continue locally" }).click();
  await openAccounts(page);
  const signIn = page.getByRole("button", { name: "Sign in with Google" });
  await expect(signIn).toBeEnabled();
  await signIn.evaluate((element) => element.click());
  await expect(page).toHaveURL(/\/auth\/v1\/authorize/);
  expect(redirectTo).toBe(`${site}/daily-walk/`);
});

test("OAuth callback errors are visible without changing local profiles", async ({ page }) => {
  await serveApp(page);
  await page.goto(`${site}/#error=access_denied&error_description=Denied`);
  await page.getByRole("button", { name: "Continue locally" }).click();
  await openAccounts(page);
  await expect(page.locator("#google-auth [role=alert]")).toContainText("Could not initialize sign-in");
  await expect(page.getByRole("button", { name: "Sign in with Google" })).toBeEnabled();
  expect(await page.evaluate(() => USERS.length)).toBeGreaterThan(0);
});

test("direct file usage keeps profiles available without offering sign-in", async ({ page }) => {
  await page.goto(pathToFileURL(path.join(root, "index.html")).href);
  await page.getByRole("button", { name: "Continue locally" }).click();
  await openAccounts(page);
  await expect(page.locator("#google-auth")).toContainText("Sign-in requires the hosted site or local development server");
  await page.locator("#go-info").evaluate((button) => button.click());
  await expect(page.locator("#ulist .uitem")).toHaveCount(1);
});
