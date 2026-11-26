const { test, expect } = require("@playwright/test");
const { pathToFileURL } = require("node:url");
const path = require("node:path");

test.beforeEach(async ({ page }) => {
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
});

async function click(page, selector) {
  await page.locator(selector).evaluate((element) => element.click());
}

test("profile changes and separate habit progress survive switching and reload", async ({
  page,
}) => {
  const firstId = await page.evaluate(() => CUR_UID);
  await click(page, 'input[data-id="wake"]');
  await click(page, "#ubar");
  await click(page, "#uadd");
  const secondId = await page.evaluate(() => CUR_UID);
  expect(secondId).not.toBe(firstId);
  await expect(page.locator('input[data-id="wake"]')).not.toBeChecked();
  await click(page, 'input[data-id="cold"]');

  await click(page, "#ubar");
  await page.locator("#ulist .uitem").filter({ hasText: "Admin" })
    .getByRole("button", { name: "Switch" })
    .evaluate((button) => button.click());
  expect(await page.evaluate(() => CUR_UID)).toBe(firstId);
  await expect(page.locator('input[data-id="wake"]')).toBeChecked();
  await expect(page.locator('input[data-id="cold"]')).not.toBeChecked();

  await page.reload();
  expect(await page.evaluate(() => CUR_UID)).toBe(firstId);
  await expect(page.locator('input[data-id="wake"]')).toBeChecked();
  await click(page, "#ubar");
  await page.locator("#ulist .uitem").filter({ hasText: "Player 2" })
    .getByRole("button", { name: "Switch" })
    .evaluate((button) => button.click());
  expect(await page.evaluate(() => CUR_UID)).toBe(secondId);
  await expect(page.locator('input[data-id="cold"]')).toBeChecked();
  await expect(page.locator('input[data-id="wake"]')).not.toBeChecked();
});

test("water progress stays separate when switching profiles", async ({ page }) => {
  await click(page, '#cups button[aria-label="Cup 3"]');
  await click(page, "#ubar");
  await click(page, "#uadd");
  await expect(page.locator("#wn")).toHaveText("8 / 8 cups");
  await click(page, '#cups button[aria-label="Cup 5"]');
  await click(page, "#ubar");
  await page.locator("#ulist .uitem").filter({ hasText: "Admin" })
    .getByRole("button", { name: "Switch" })
    .evaluate((button) => button.click());
  await expect(page.locator("#wn")).toHaveText("3 / 8 cups");
  await expect(page.locator("#cups .full")).toHaveCount(3);
  await page.reload();
  await expect(page.locator("#wn")).toHaveText("3 / 8 cups");
});

test("save failures remain visible, block profile creation, and recover", async ({
  page,
}) => {
  const firstId = await page.evaluate(() => {
    window.originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.includes(":u:")) throw new DOMException("Storage full", "QuotaExceededError");
      return window.originalSetItem.call(this, key, value);
    };
    return CUR_UID;
  });
  await click(page, 'input[data-id="wake"]');
  await expect(page.locator("#ubstat")).toContainText("not saved");
  await expect(page.locator("#syncst")).toContainText("not saved");
  await page.waitForTimeout(2000);
  await expect(page.locator("#ubstat")).toContainText("not saved");
  await click(page, "#uadd");
  expect(await page.evaluate(() => CUR_UID)).toBe(firstId);
  await expect(page.locator('input[data-id="wake"]')).toBeChecked();

  await page.evaluate(() => {
    Storage.prototype.setItem = window.originalSetItem;
  });
  await click(page, 'input[data-id="cold"]');
  await expect(page.locator("#ubstat")).toContainText("Saved");
  await page.reload();
  await expect(page.locator('input[data-id="wake"]')).toBeChecked();
  await expect(page.locator('input[data-id="cold"]')).toBeChecked();
});

test("a profile read failure does not replace or switch the current profile", async ({
  page,
}) => {
  const firstId = await page.evaluate(() => CUR_UID);
  await click(page, "#uadd");
  const secondId = await page.evaluate(() => CUR_UID);
  await click(page, 'input[data-id="cold"]');
  await page.evaluate((id) => {
    const original = Storage.prototype.getItem;
    Storage.prototype.getItem = function (key) {
      if (key.endsWith(":u:" + id)) throw new Error("Profile unavailable");
      return original.call(this, key);
    };
  }, firstId);
  await click(page, "#ubar");
  await page.locator("#ulist .uitem").filter({ hasText: "Admin" })
    .getByRole("button", { name: "Switch" })
    .evaluate((button) => button.click());
  expect(await page.evaluate(() => CUR_UID)).toBe(secondId);
  await expect(page.locator("#ubstat")).toContainText("Could not load");
  await expect(page.locator('input[data-id="cold"]')).toBeChecked();
  await page.reload();
  expect(await page.evaluate(() => CUR_UID)).toBe(secondId);
});

test("a failed destination save leaves the current profile active", async ({ page }) => {
  const firstId = await page.evaluate(() => CUR_UID);
  await click(page, "#uadd");
  const secondId = await page.evaluate(() => CUR_UID);
  await click(page, 'input[data-id="cold"]');
  await page.evaluate((id) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.endsWith(":u:" + id)) throw new Error("Write blocked");
      return original.call(this, key, value);
    };
  }, firstId);
  await click(page, "#ubar");
  await page.locator("#ulist .uitem").filter({ hasText: "Admin" })
    .getByRole("button", { name: "Switch" })
    .evaluate((button) => button.click());
  expect(await page.evaluate(() => CUR_UID)).toBe(secondId);
  await expect(page.locator("#ubname")).toContainText("Player 2");
  await expect(page.locator("#ubstat")).toContainText("not saved");
  await expect(page.locator('input[data-id="cold"]')).toBeChecked();
  await page.reload();
  expect(await page.evaluate(() => CUR_UID)).toBe(secondId);
  await expect(page.locator('input[data-id="cold"]')).toBeChecked();
});

test("a failed new-profile save leaves the current profile active", async ({ page }) => {
  const firstId = await page.evaluate(() => CUR_UID);
  await page.evaluate((id) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.includes(":u:") && !key.endsWith(":u:" + id))
        throw new Error("Write blocked");
      return original.call(this, key, value);
    };
  }, firstId);
  await click(page, "#uadd");
  expect(await page.evaluate(() => CUR_UID)).toBe(firstId);
  await expect(page.locator("#ubname")).toContainText("Admin");
  await expect(page.locator("#ubstat")).toContainText("not saved");
});

test("startup read failures never overwrite existing profiles", async ({ page }) => {
  await click(page, 'input[data-id="wake"]');
  await page.addInitScript(() => {
    const originalGet = Storage.prototype.getItem;
    const current = originalGet.call(localStorage, "dailywalk_admin_max:cur:v3");
    window.savedBeforeLoad = {
      current,
      profile: originalGet.call(localStorage, "dailywalk_admin_max:u:" + current),
    };
    Storage.prototype.getItem = function (key) {
      if (key === "dailywalk_admin_max:users:v3")
        throw new Error("Profile index unavailable");
      return originalGet.call(this, key);
    };
  });
  await page.reload();
  await expect(page.locator("#ubstat")).toContainText("Could not load");
  await page.evaluate(() => save());
  const unchanged = await page.evaluate(() =>
    localStorage.getItem(K_CUR) === window.savedBeforeLoad.current &&
    localStorage.getItem(uKey(window.savedBeforeLoad.current)) ===
      window.savedBeforeLoad.profile,
  );
  expect(unchanged).toBe(true);
});

test("a corrupt profile index is not replaced on startup", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("dailywalk_admin_max:users:v3", "{invalid");
  });
  await page.reload();
  await expect(page.locator("#ubstat")).toContainText("Could not load");
  await page.evaluate(() => save());
  expect(
    await page.evaluate(() => localStorage.getItem("dailywalk_admin_max:users:v3")),
  ).toBe("{invalid");
});

for (const failingKey of ["dailywalk_admin_max:users:v3", "dailywalk_admin_max:cur:v3"]) {
  test(`a failed ${failingKey.includes(":users:") ? "profile index" : "current profile"} write reports failure`, async ({
    page,
  }) => {
    await page.evaluate((keyToFail) => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key === keyToFail) throw new Error("Write blocked");
        return original.call(this, key, value);
      };
    }, failingKey);
    await click(page, 'input[data-id="wake"]');
    await expect(page.locator("#ubstat")).toContainText("not saved");
    await expect(page.locator('input[data-id="wake"]')).toBeChecked();
  });
}

test("a failed profile deletion keeps its data and index", async ({ page }) => {
  const firstId = await page.evaluate(() => CUR_UID);
  await click(page, "#uadd");
  await page.evaluate((id) => {
    const original = Storage.prototype.removeItem;
    Storage.prototype.removeItem = function (key) {
      if (key.endsWith(":u:" + id)) throw new Error("Deletion blocked");
      return original.call(this, key);
    };
  }, firstId);
  await click(page, "#ubar");
  const remove = page
    .locator("#ulist .uitem")
    .filter({ hasText: "Admin" })
    .getByRole("button", { name: "Delete profile" });
  await remove.evaluate((button) => button.click());
  await remove.evaluate((button) => button.click());
  await expect(page.locator("#ubstat")).toContainText("Could not remove");
  const intact = await page.evaluate((id) => ({
    listed: JSON.parse(localStorage.getItem(K_USERS)).some((user) => user.id === id),
    exists: localStorage.getItem(uKey(id)) !== null,
  }), firstId);
  expect(intact).toEqual({ listed: true, exists: true });
  await page.reload();
  await click(page, "#ubar");
  await expect(page.locator("#ulist .uitem").filter({ hasText: "Admin" })).toHaveCount(1);
});
