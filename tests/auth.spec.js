const { test, expect } = require("@playwright/test");
const { pathToFileURL } = require("node:url");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const site = "http://localhost:43999";
const supabase = "https://dnnpakvhiipflpvmkymf.supabase.co";

async function serveApp(page, prefix = "/") {
  await page.route(`${site}/**`, async (route) => {
    const url = new URL(route.request().url());
    if (!url.pathname.startsWith(prefix)) throw new Error(`Unexpected path: ${url.pathname}`);
    const file = url.pathname === prefix ? "index.html" : url.pathname.slice(prefix.length);
    await route.fulfill({ path: path.join(root, file) });
  });
}

async function openAccounts(page) {
  await page.locator("#ubar").evaluate((element) => element.click());
}

test("Google sign-in and sign-out preserve local progress", async ({ page }) => {
  await serveApp(page);
  let authorization;
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
  await page.evaluate(() => {
    S.p.name = "Local Walker";
    S.xp = 123;
    save();
  });
  const profileId = await page.evaluate(() => CUR_UID);
  await openAccounts(page);
  const signIn = page.getByRole("button", { name: "Sign in with Google" });
  await expect(signIn).toBeEnabled();
  await signIn.evaluate((element) => element.click());
  await expect(page).toHaveURL(/\/auth\/v1\/authorize/);
  await page.goto(`${site}/?code=test-code`);
  await expect(page.locator("#google-auth")).toContainText("Signed in as walker@example.com");
  expect(authorization.searchParams.get("provider")).toBe("google");
  expect(authorization.searchParams.get("redirect_to")).toBe(`${site}/`);
  expect(authorization.searchParams.get("code_challenge")).toBeTruthy();
  expect(await page.evaluate(() => ({ id: CUR_UID, name: S.p.name, xp: S.xp })))
    .toEqual({ id: profileId, name: "Local Walker", xp: 123 });
  await page.reload();
  await openAccounts(page);
  await expect(page.locator("#google-auth")).toContainText("Signed in as walker@example.com");
  await page.getByRole("button", { name: "Sign out" }).evaluate((element) => element.click());
  await expect(page.locator("#google-auth")).toContainText("Not signed in");
  expect(await page.evaluate(() => ({ id: CUR_UID, name: S.p.name, xp: S.xp })))
    .toEqual({ id: profileId, name: "Local Walker", xp: 123 });
});

test("Google sign-in redirects back to the GitHub Pages app path", async ({ page }) => {
  await serveApp(page, "/daily-walk/");
  let redirectTo;
  await page.route(`${supabase}/auth/v1/authorize**`, async (route) => {
    redirectTo = new URL(route.request().url()).searchParams.get("redirect_to");
    await route.fulfill({ body: "Google authorization" });
  });
  await page.goto(`${site}/daily-walk/`);
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
  await openAccounts(page);
  await expect(page.locator("#google-auth [role=alert]")).toContainText("Could not initialize sign-in");
  await expect(page.getByRole("button", { name: "Sign in with Google" })).toBeEnabled();
  expect(await page.evaluate(() => USERS.length)).toBeGreaterThan(0);
});

test("direct file usage keeps profiles available without offering sign-in", async ({ page }) => {
  await page.goto(pathToFileURL(path.join(root, "index.html")).href);
  await openAccounts(page);
  await expect(page.locator("#google-auth")).toContainText("Sign-in requires the hosted site or local development server");
  await expect(page.locator("#ulist .uitem")).toHaveCount(1);
});
