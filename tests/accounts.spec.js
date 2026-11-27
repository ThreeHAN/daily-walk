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

test("leaderboard cards sort, import friends, and persist hidden accounts", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.evaluate(() => {
    S.xp = 50;
    S.life = 50;
    S.checks = {};
    S.bs.tasks = 1;
    S.nb.xp = {};
    curStreak = 2;
    localStorage.setItem("dailywalk_universal:friends:v1", JSON.stringify([
      { id: "friend-a", name: "Amy 🌙 <b>", buddy: "Pal", xp: 500, lv: 3, streak: 0, towns: 1, tasks: 0 },
      { id: "friend-b", name: "Bea", buddy: "Pal", xp: 100, lv: 2, streak: 8, towns: 0, tasks: 10 },
    ]));
  });
  await click(page, '.nv[data-p="l"]');
  const cards = page.locator("#lblist .lb-card");
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0).locator(".lb-inf b")).toContainText("Amy");
  await expect(cards.nth(0).locator(".lb-inf b .ic svg")).toHaveCount(1);
  await expect(cards.nth(0).locator(".lb-inf b")).toContainText("<b>");
  await expect(cards.nth(0).locator(".lb-av svg")).toHaveCount(1);
  await expect(cards.nth(0).locator(".lb-rk")).toHaveText("🥇");
  await expect(cards.nth(0).locator(".lb-val")).toContainText("500");
  await expect(page.locator("#lbcnt")).toHaveText("3 Accounts");
  await expect(page.locator("#lbmyrk")).toHaveText("#3");
  await expect(page.locator('.lb-tab[data-lbt="xp"]')).toHaveAttribute("aria-pressed", "true");

  await click(page, '.lb-tab[data-lbt="streak"]');
  await expect(page.locator('.lb-tab[data-lbt="streak"]')).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('.lb-tab[data-lbt="xp"]')).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("#lbmyxp")).toContainText("2d");
  await expect(page.locator("#lbmyxp .ic svg")).toHaveCount(1);
  await expect(cards.nth(0).locator(".lb-inf b")).toHaveText("Bea");
  await expect(cards.nth(0).locator(".lb-val")).toContainText("8");
  await expect(cards.nth(0).locator(".lb-val .ic svg")).toHaveCount(1);
  await click(page, '.lb-tab[data-lbt="town"]');
  await expect(cards.nth(0).locator(".lb-inf b")).toContainText("Amy");
  await click(page, '.lb-tab[data-lbt="tasks"]');
  await expect(cards.nth(0).locator(".lb-inf b")).toHaveText("Bea");
  await expect(page.locator("#leaderboard-summary .lb-tab .ic svg")).toHaveCount(4);

  const friendCode = "DW1:" + Buffer.from(JSON.stringify({
    id: "friend-c", name: "Cara", buddy: "Pal", xp: 30, lv: 1, streak: 1, towns: 0, tasks: 3,
  })).toString("base64");
  page.once("dialog", (dialog) => dialog.accept(friendCode));
  await click(page, "#lbaddf");
  await expect(cards).toHaveCount(4);
  const cara = cards.filter({ hasText: "Cara" });
  await cara.locator("button").evaluate((button) => button.click());
  await expect(cara.locator("button")).toHaveText("Remove?");
  await cara.locator("button").evaluate((button) => button.click());
  await expect(cara).toHaveCount(0);
  await expect(page.locator("#lbcnt")).toHaveText("3 Accounts");
  await page.reload();
  await continueLocally(page);
  await click(page, '.nv[data-p="l"]');
  await expect(cards.filter({ hasText: "Cara" })).toHaveCount(0);
  await click(page, "#lbreset");
  await expect(cards.filter({ hasText: "Cara" })).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("leaderboard removal expires and reports storage failures", async ({ page }) => {
  await page.clock.install();
  await click(page, '.nv[data-p="l"]');
  const card = page.locator("#lblist .lb-card.me");
  const remove = card.locator("button");
  await remove.evaluate((button) => button.click());
  await expect(remove).toHaveText("Remove?");
  await page.clock.fastForward(2700);
  await expect(remove).toHaveText("✕");
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "dailywalk_admin:hidden_ids:v1") throw new Error("Write blocked");
      return original.call(this, key, value);
    };
  });
  await remove.evaluate((button) => button.click());
  await remove.evaluate((button) => button.click());
  await expect(page.locator("#toast")).toContainText("Could not hide account");
  await expect(card).toHaveCount(1);
  expect(await page.evaluate(() => localStorage.getItem("dailywalk_admin:hidden_ids:v1"))).toBeNull();
});

test("profile status updates after a save and the bar still opens profile settings", async ({ page }) => {
  await page.clock.install();
  await page.evaluate(() => {
    S.p.name = "Walker 🌙";
    S.p.buddy = "Friend ⭐";
    save();
  });
  await expect(page.locator("#ubname")).toContainText("Walker");
  await expect(page.locator("#ubname")).toContainText("Friend");
  await expect(page.locator("#ubname .ic svg")).toHaveCount(2);
  await expect(page.locator("#ubstat")).toHaveText("Saved just now ✓");
  await page.clock.fastForward(1800);
  await expect(page.locator("#ubstat")).toHaveText("All data saved ✓");
  await expect(page.locator("#ubstat")).toHaveAttribute("aria-live", "polite");
  await click(page, "#ubar");
  await expect(page.locator("#pm")).toHaveClass(/show/);
  await expect(page.locator("#v-info")).toBeVisible();
});

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
  await page.locator("#ulist .uitem").filter({ hasText: "Player 1" })
    .getByRole("button", { name: "Switch" })
    .evaluate((button) => button.click());
  expect(await page.evaluate(() => CUR_UID)).toBe(firstId);
  await expect(page.locator('input[data-id="wake"]')).toBeChecked();
  await expect(page.locator('input[data-id="cold"]')).not.toBeChecked();

  await page.reload();
  await continueLocally(page);
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

test("profile info updates names and stats without losing focus or profile data", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.evaluate(() => {
    curStreak = 2;
    S.days = { "2026-01-01": true, "2026-01-02": true, "2026-01-03": true };
    S.checks = { "2026-01-01": { wake: true, cold: false }, "2026-01-02": { wake: true } };
  });
  await click(page, "#ubar");
  await expect(page.locator("#s1")).toHaveText("2");
  await expect(page.locator("#s2")).toHaveText("3");
  await expect(page.locator("#s3")).toHaveText("2");
  const name = page.locator("#pn");
  const buddy = page.locator("#bn");
  await name.fill("Walker ");
  await expect(name).toHaveValue("Walker ");
  await expect(name).toBeFocused();
  expect(await page.evaluate(() => S.p.name)).toBe("Walker");
  await buddy.fill("Pal ⭐");
  await expect(buddy).toBeFocused();
  await expect(name).toHaveValue("Walker");
  await expect(page.locator("#pst")).toContainText("Pal");
  await expect(page.locator("#pst .ic svg")).toHaveCount(1);
  await expect(page.locator("#profile-info .stats .ic svg")).toHaveCount(3);
  await click(page, "#uadd");
  await expect(page.locator("#pn")).toHaveValue("Player 2");
  await page.locator("#ulist .uitem").filter({ hasText: "Walker" })
    .locator(".uinf").evaluate((element) => element.click());
  await expect(name).toHaveValue("Walker");
  await expect(buddy).toHaveValue("Pal ⭐");
  await click(page, "#v-info [data-back]");
  await expect(page.locator("#mt")).toContainText("Pal");
  await expect(page.locator("#mp3")).toContainText("Walker");
  await click(page, "#go-info");
  await expect(name).toHaveValue("Walker");
  await expect(buddy).toHaveValue("Pal ⭐");
  expect(errors).toEqual([]);
});

test("profile list renders names safely, switches from the row, and deletes after confirmation", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const firstId = await page.evaluate(() => CUR_UID);
  await click(page, "#ubar");
  await page.locator("#pn").fill("Walker 🌙 <b>");
  await page.locator("#bn").fill("Buddy ⭐");
  await click(page, "#uadd");
  const secondId = await page.evaluate(() => CUR_UID);
  const rows = page.locator("#ulist .uitem");
  const first = rows.filter({ hasText: "Walker" });
  await expect(first.locator("b")).toContainText("<b>");
  await expect(first.locator("b .ic svg")).toHaveCount(1);
  await expect(first.locator("small .ic svg")).toHaveCount(1);
  await expect(rows.filter({ hasText: "Player 2" })).toHaveClass(/cur/);
  await expect(rows.filter({ hasText: "Player 2" }).locator("button")).toHaveCount(0);
  await first.locator(".uinf").evaluate((element) => element.click());
  expect(await page.evaluate(() => CUR_UID)).toBe(firstId);
  await expect(rows.filter({ hasText: "Walker" })).toHaveClass(/cur/);

  await page.clock.install();
  const second = rows.filter({ hasText: "Player 2" });
  const remove = second.getByRole("button", { name: "Delete profile" });
  await remove.evaluate((button) => button.click());
  await expect(remove).toHaveText("Delete?");
  await page.clock.fastForward(2700);
  await expect(remove).toHaveText("✕");
  await remove.evaluate((button) => button.click());
  await remove.evaluate((button) => button.click());
  await expect(second).toHaveCount(0);
  expect(await page.evaluate((id) => ({
    listed: JSON.parse(localStorage.getItem(K_USERS)).some((user) => user.id === id),
    exists: localStorage.getItem(uKey(id)) !== null,
  }), secondId)).toEqual({ listed: false, exists: false });
  await page.reload();
  await continueLocally(page);
  await click(page, "#ubar");
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toHaveClass(/cur/);
  expect(errors).toEqual([]);
});

test("the level hero refreshes when switching and restoring profiles", async ({ page }) => {
  await page.evaluate(() => {
    S.xp = 40;
    save();
    drawHero();
  });
  await expect(page.locator("#xpn")).toHaveText("40 / 80 XP");
  await click(page, "#ubar");
  await click(page, "#uadd");
  await expect(page.locator("#lvb")).toHaveText("Lv 1");
  await expect(page.locator("#xpn")).toHaveText("0 / 80 XP");
  await expect(page.locator("#xfill")).toHaveAttribute("style", "width: 0%;");

  await click(page, "#ubar");
  await page.locator("#ulist .uitem").filter({ hasText: "Player 1" })
    .getByRole("button", { name: "Switch" })
    .evaluate((button) => button.click());
  await expect(page.locator("#xpn")).toHaveText("40 / 80 XP");
  const backup = await page.evaluate(() => {
    const data = structuredClone(S);
    data.xp = 100;
    return JSON.stringify({ data });
  });
  await page.locator("#ufile").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(backup),
  });
  await expect(page.locator("#lvb")).toHaveText("Lv 2");
  await expect(page.locator("#xpn")).toHaveText("20 / 160 XP");
  await page.reload();
  await continueLocally(page);
  await expect(page.locator("#xpn")).toHaveText("20 / 160 XP");
});

test("the dashboard greeting follows the active profile and restored name", async ({ page }) => {
  await expect(page.locator("#clock")).toContainText("Player 1");
  await click(page, "#ubar");
  await click(page, "#uadd");
  await expect(page.locator("#clock")).toContainText("Player 2");
  await click(page, "#ubar");
  await page.locator("#ulist .uitem").filter({ hasText: "Player 1" })
    .getByRole("button", { name: "Switch" })
    .evaluate((button) => button.click());
  await expect(page.locator("#clock")).toContainText("Player 1");
  const backup = await page.evaluate(() => {
    const data = structuredClone(S);
    data.p.name = "Restored 🌙";
    return JSON.stringify({ data });
  });
  await page.locator("#ufile").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(backup),
  });
  await expect(page.locator("#clock")).toContainText("Restored");
  await expect(page.locator("#clock .ic svg")).toHaveCount(1);
  await page.reload();
  await continueLocally(page);
  await expect(page.locator("#clock")).toContainText("Restored");
});

test("water progress stays separate when switching profiles", async ({ page }) => {
  await click(page, '#cups button[aria-label="Cup 3"]');
  await click(page, "#ubar");
  await click(page, "#uadd");
  await expect(page.locator("#wn")).toHaveText("0 / 8 cups");
  await click(page, '#cups button[aria-label="Cup 5"]');
  await click(page, "#ubar");
  await page.locator("#ulist .uitem").filter({ hasText: "Player 1" })
    .getByRole("button", { name: "Switch" })
    .evaluate((button) => button.click());
  await expect(page.locator("#wn")).toHaveText("3 / 8 cups");
  await expect(page.locator("#cups .full")).toHaveCount(3);
  await page.reload();
  await continueLocally(page);
  await expect(page.locator("#wn")).toHaveText("3 / 8 cups");
});

test("journal drafts are replaced with the selected profile's saved entry", async ({ page }) => {
  await page.locator("#jt").fill("Admin journal");
  await click(page, "#jsave");
  await click(page, "#ubar");
  await click(page, "#uadd");
  const playerEntry = await page.locator("#jt").inputValue();
  await page.locator("#jt").fill("Unsaved player draft");
  await click(page, "#ubar");
  await page.locator("#ulist .uitem").filter({ hasText: "Player 1" })
    .getByRole("button", { name: "Switch" })
    .evaluate((button) => button.click());
  await expect(page.locator("#jt")).toHaveValue("Admin journal");
  await click(page, "#ubar");
  await page.locator("#ulist .uitem").filter({ hasText: "Player 2" })
    .getByRole("button", { name: "Switch" })
    .evaluate((button) => button.click());
  await expect(page.locator("#jt")).toHaveValue(playerEntry);
});

test("journal save failures remain visible and can be retried", async ({ page }) => {
  await page.evaluate(() => {
    window.originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.includes(":u:")) throw new DOMException("Storage full", "QuotaExceededError");
      return window.originalSetItem.call(this, key, value);
    };
  });
  await page.locator("#jt").fill("Journal while offline");
  await click(page, "#jsave");
  await expect(page.locator("#ubstat")).toContainText("not saved");
  await expect(page.locator("#jt")).toHaveValue("Journal while offline");
  await page.evaluate(() => {
    Storage.prototype.setItem = window.originalSetItem;
  });
  await click(page, "#jsave");
  await expect(page.locator("#ubstat")).toContainText("Saved");
  await page.reload();
  await continueLocally(page);
  await expect(page.locator("#jt")).toHaveValue("Journal while offline");
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
  await continueLocally(page);
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
  await page.locator("#ulist .uitem").filter({ hasText: "Player 1" })
    .getByRole("button", { name: "Switch" })
    .evaluate((button) => button.click());
  expect(await page.evaluate(() => CUR_UID)).toBe(secondId);
  await expect(page.locator("#ubstat")).toContainText("Could not load");
  await expect(page.locator('input[data-id="cold"]')).toBeChecked();
  await page.reload();
  await continueLocally(page);
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
  await page.locator("#ulist .uitem").filter({ hasText: "Player 1" })
    .getByRole("button", { name: "Switch" })
    .evaluate((button) => button.click());
  expect(await page.evaluate(() => CUR_UID)).toBe(secondId);
  await expect(page.locator("#ubname")).toContainText("Player 2");
  await expect(page.locator("#ubstat")).toContainText("not saved");
  await expect(page.locator('input[data-id="cold"]')).toBeChecked();
  await page.reload();
  await continueLocally(page);
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
  await expect(page.locator("#ubname")).toContainText("Player 1");
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
  await continueLocally(page);
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
  await continueLocally(page);
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
    .filter({ hasText: "Player 1" })
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
  await continueLocally(page);
  await click(page, "#ubar");
  await expect(page.locator("#ulist .uitem").filter({ hasText: "Player 1" })).toHaveCount(1);
});
