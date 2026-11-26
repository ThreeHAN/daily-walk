const { test, expect } = require("@playwright/test");
const { pathToFileURL } = require("node:url");
const path = require("node:path");

test.beforeEach(async ({ page }) => {
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
});

async function clickHabit(page, id) {
  await page.locator(`input[data-id="${id}"]`).evaluate((input) => input.click());
}

async function habitState(page) {
  return page.evaluate(() => ({
    xp: S.xp,
    taskAwards: S.bs.tasks || 0,
    awards: { ...S.aw.k },
    checks: { ...S.checks[today()] },
    dayComplete: S.days[today()],
    tasks: S.tasks.map(({ id, g }) => ({ id, group: g || "more" })),
  }));
}

test("task and group rewards are awarded only once", async ({ page }) => {
  const initial = await habitState(page);

  await clickHabit(page, "wake");
  let state = await habitState(page);
  expect(state.xp).toBe(initial.xp + 10);
  expect(state.dayComplete).toBe(false);
  await expect(page.locator("#count")).toHaveText("1 of 12 done");
  await expect(page.locator(".fxp")).toHaveText("+10 XP");

  await clickHabit(page, "cold");
  state = await habitState(page);
  expect(state.xp).toBe(initial.xp + 35);
  expect(state.awards["g:morning"]).toBeTruthy();

  await clickHabit(page, "wake");
  state = await habitState(page);
  expect(state.checks.wake).toBe(false);
  expect(state.xp).toBe(initial.xp + 35);

  await clickHabit(page, "wake");
  state = await habitState(page);
  expect(state.xp).toBe(initial.xp + 35);
  expect(state.taskAwards).toBe(initial.taskAwards + 2);
});

test("finishing all habits persists progress and rewards across reloads", async ({
  page,
}) => {
  const initial = await habitState(page);
  for (const task of initial.tasks) await clickHabit(page, task.id);

  const completed = await habitState(page);
  const groupCount = new Set(initial.tasks.map((task) => task.group)).size;
  expect(completed.xp).toBe(
    initial.xp + initial.tasks.length * 10 + groupCount * 15 + 30,
  );
  expect(completed.dayComplete).toBe(true);
  expect(completed.awards.all).toBeTruthy();
  await expect(page.locator("#count")).toHaveText(
    `${initial.tasks.length} of ${initial.tasks.length} done`,
  );

  await page.reload();
  expect(await habitState(page)).toEqual(completed);
  await expect(page.locator('input[data-id="wake"]')).toBeChecked();
});

test("group progress and collapse preserve the checked habit", async ({ page }) => {
  await clickHabit(page, "wake");
  const morning = page
    .locator("#list .grp")
    .filter({ has: page.locator(".gn", { hasText: "Morning" }) });
  await expect(morning.locator(".gc")).toHaveText("1/2");
  await morning.locator(".gh").evaluate((button) => button.click());
  await expect(page.locator('input[data-id="wake"]')).toHaveCount(0);
  await morning.locator(".gh").evaluate((button) => button.click());
  await expect(page.locator('input[data-id="wake"]')).toBeChecked();
  await expect(morning.locator(".gb")).toHaveClass(/fx/);
});

test("the legacy water goal opens the React group and checks the habit", async ({ page }) => {
  const nutrition = page.locator("#list .grp").filter({
    has: page.locator(".gn", { hasText: "Nutrition" }),
  });
  await nutrition.locator(".gh").evaluate((button) => button.click());
  await expect(page.locator('input[data-id="water"]')).toHaveCount(0);
  await page.locator('#cups button[aria-label="Cup 8"]').evaluate((button) => button.click());
  await page.locator('#cups button[aria-label="Cup 8"]').evaluate((button) => button.click());
  await expect(page.locator('input[data-id="water"]')).toBeChecked();
  await expect(page.locator("#count")).toHaveText("1 of 12 done");
  await page.reload();
  await expect(page.locator('input[data-id="water"]')).toBeChecked();
});

test("React renders habit text and emoji icons through repeated updates", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.evaluate(() => {
    S.tasks.push({ id: "c999", g: "morning", t: "Walk 🌙", s: "Give thanks 🙏" });
    render();
  });
  const row = page.locator("#list .item").filter({ hasText: "Walk" });
  await expect(row.locator(".t .ic svg")).toHaveCount(2);
  await row.locator("input").evaluate((input) => input.click());
  await expect(row.locator("input")).toBeChecked();
  await expect(row.locator(".t .ic svg")).toHaveCount(2);
  await page.locator("#reset").evaluate((button) => button.click());
  await expect(row.locator("input")).not.toBeChecked();
  expect(errors).toEqual([]);
});

test("restoring a backup refreshes the React habit list", async ({ page }) => {
  const backup = await page.evaluate(() => {
    const data = structuredClone(S);
    data.tasks.push({ id: "c999", g: "morning", t: "Restored habit" });
    data.checks[today()] = { c999: true };
    return JSON.stringify({ data });
  });
  await page.locator("#ufile").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(backup),
  });
  const restored = page.locator("#list .item").filter({ hasText: "Restored habit" });
  await expect(restored.locator("input")).toBeChecked();
  await page.reload();
  await expect(restored.locator("input")).toBeChecked();
});

test("category and navigation icons stay pixel art after rerender and navigation", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.reload();
  await page.evaluate(() => {
    S.tasks.push({ id: "c999", g: "more", t: "My habit" });
    render();
  });
  const groups = await page.evaluate(() => Array.from(
    document.querySelectorAll("#list .grp"),
    (group) => {
      const name = group.querySelector(".gn").textContent;
      const definition = G.find((item) => item.n === name);
      const expected = document.createElement("span");
      expected.innerHTML = icoSvg(definition.e);
      return group.querySelector(".ge").innerHTML === expected.innerHTML;
    },
  ));
  expect(groups).toEqual([true, true, true, true, true, true]);
  for (const [pageId, icon] of [["h", "check"], ["t", "globe"], ["l", "trophy"]]) {
    const button = page.locator(`.nv[data-p="${pageId}"]`);
    const artwork = button.locator(`i[data-i="${icon}"] svg`);
    await expect(artwork).toBeVisible();
    const size = await artwork.boundingBox();
    expect(size.width).toBeGreaterThanOrEqual(20);
    expect(size.height).toBeGreaterThanOrEqual(20);
    await button.evaluate((element) => element.click());
    await expect(page.locator(`#pg-${pageId}`)).toBeVisible();
  }
  await page.locator('.nv[data-p="h"]').evaluate((button) => button.click());
  await expect(page.locator("#list .ge svg")).toHaveCount(6);
  expect(errors).toEqual([]);
});

test("a new habit is highlighted and can still be removed", async ({ page }) => {
  await page.locator("#fab").evaluate((button) => button.click());
  await page.locator("#hn").fill("Take a walk");
  await page.locator("#hadd").evaluate((button) => button.click());

  const row = page.locator("#list .item").filter({ hasText: "Take a walk" });
  await expect(row).toHaveClass(/newrow/);
  const remove = row.getByRole("button", { name: "Remove habit" });
  await remove.evaluate((button) => button.click());
  await remove.evaluate((button) => button.click());
  await expect(row).toHaveCount(0);
});

test("crossing a level threshold shows the level-up effect", async ({ page }) => {
  await page.evaluate(() => {
    S.xp = 79;
  });
  await clickHabit(page, "wake");
  await expect(page.locator("#lun")).toHaveText("2");
  await expect(page.locator("#lu")).toHaveClass(/show/);
});

test("crossing a town building threshold announces the new building", async ({
  page,
}) => {
  await page.evaluate(() => {
    S.nb.xp[S.nb.cur] = 55;
  });
  await clickHabit(page, "wake");
  await expect(page.locator("#toast")).toContainText("Your help brought Garden to town");
});
