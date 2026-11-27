const { test, expect } = require("@playwright/test");
const { continueLocally } = require("./helpers/onboarding");
const { pathToFileURL } = require("node:url");
const path = require("node:path");

test.beforeEach(async ({ page }) => {
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
  await continueLocally(page);
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
  await continueLocally(page);
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

test("progress summary reflects completion changes and consecutive-day streaks", async ({ page }) => {
  await page.evaluate(() => {
    S.tasks = [{ id: "one", g: "morning", t: "One" }, { id: "two", g: "morning", t: "Two" }];
    S.checks = {};
    S.checks[today()] = { one: true };
    S.days = { [today()]: false };
    for (let daysAgo = 1; daysAgo <= 2; daysAgo++) {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      S.days[dkey(date)] = true;
    }
    render();
  });
  await expect(page.locator("#count")).toHaveText("1 of 2 done");
  await expect(page.locator("#fill")).toHaveAttribute("style", "width: 50%;");
  await expect(page.locator("#streak")).toContainText("2-day streak");

  await page.locator('input[data-id="two"]').evaluate((input) => input.click());
  await expect(page.locator("#count")).toHaveText("2 of 2 done");
  await expect(page.locator("#fill")).toHaveAttribute("style", "width: 100%;");
  await expect(page.locator("#streak")).toContainText("3-day streak");

  await page.locator('input[data-id="one"]').evaluate((input) => input.click());
  await expect(page.locator("#count")).toHaveText("1 of 2 done");
  await expect(page.locator("#streak")).toContainText("2-day streak");
});

test("dashboard bridge prepares a consistent snapshot without changing saved state", async ({ page }) => {
  const result = await page.evaluate(() => {
    S.tasks = [{ id: "one", g: "morning", t: "One" }, { id: "two", g: "morning", t: "Two" }];
    S.checks[today()] = { one: true };
    S.days = { [today()]: false };
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    S.days[dkey(yesterday)] = true;
    const before = JSON.stringify(S);
    const oldStreak = curStreak;
    const snapshot = dashboardBridge.getSnapshot();
    const list = dashboardBridge.habitListProps(snapshot, {});
    const progress = dashboardBridge.progressProps(snapshot);
    const water = dashboardBridge.waterProps();
    return {
      stateUnchanged: JSON.stringify(S) === before,
      streakUnchanged: curStreak === oldStreak,
      day: snapshot.day,
      expectedDay: today(),
      checks: list.checks,
      completed: progress.completed,
      total: progress.total,
      percent: progress.percent,
      streak: progress.streak,
      cups: water.cups,
      expectedCups: S.water.n,
    };
  });
  expect(result).toEqual({
    stateUnchanged: true, streakUnchanged: true,
    day: result.expectedDay, expectedDay: result.expectedDay,
    checks: { one: true }, completed: 1, total: 2, percent: 50, streak: 1,
    cups: result.expectedCups, expectedCups: result.expectedCups,
  });
});

test("the React water card preserves its tutorial target and icon while updating", async ({ page }) => {
  const card = page.locator("#water-card");
  await expect(card).toHaveAttribute("data-react-root", "");
  await expect(card.locator(".xh b .ic svg")).toHaveCount(1);
  await page.evaluate(() => {
    window.waterTarget = document.getElementById("cups");
    window.waterTarget.classList.add("tour-highlight");
  });
  await page.locator('#cups button[aria-label="Cup 3"]').evaluate((button) => button.click());
  await expect(page.locator("#wn")).toHaveText("3 / 8 cups");
  await expect(page.locator("#cups")).toHaveClass(/tour-highlight/);
  expect(await page.evaluate(() => window.waterTarget === document.getElementById("cups"))).toBe(true);
  await page.evaluate(() => { hydrate(); iconize(document.body); });
  await expect(card.locator(".xh b .ic svg")).toHaveCount(1);
});

test("the water goal opens the group and checks the habit without clicking its checkbox", async ({ page }) => {
  const initial = await habitState(page);
  await page.evaluate(() => {
    const click = HTMLInputElement.prototype.click;
    HTMLInputElement.prototype.click = function () {
      if (this.dataset.id === "water") throw new Error("Water checkbox was clicked");
      return click.call(this);
    };
  });
  const nutrition = page.locator("#list .grp").filter({
    has: page.locator(".gn", { hasText: "Nutrition" }),
  });
  await nutrition.locator(".gh").evaluate((button) => button.click());
  await expect(page.locator('input[data-id="water"]')).toHaveCount(0);
  await page.locator('#cups button[aria-label="Cup 8"]').evaluate((button) => button.click());
  await expect(page.locator('input[data-id="water"]')).toBeChecked();
  await expect(page.locator("#wn")).toHaveText("8 / 8 cups");
  await expect(page.locator("#cups .full")).toHaveCount(8);
  await expect(page.locator('#cups button[aria-label="Cup 8"]')).toHaveClass(/pop/);
  await expect(page.locator("#count")).toHaveText("1 of 12 done");
  expect((await habitState(page)).xp).toBe(initial.xp + 10);
  await page.locator('#cups button[aria-label="Cup 8"]').evaluate((button) => button.click());
  await expect(page.locator("#wn")).toHaveText("7 / 8 cups");
  await expect(page.locator('input[data-id="water"]')).toBeChecked();
  await page.locator('#cups button[aria-label="Cup 8"]').evaluate((button) => button.click());
  expect((await habitState(page)).xp).toBe(initial.xp + 10);
  await page.reload();
  await continueLocally(page);
  await expect(page.locator('input[data-id="water"]')).toBeChecked();
  await expect(page.locator("#wn")).toHaveText("8 / 8 cups");
});

test("the water goal does not award XP again when the habit is already checked", async ({ page }) => {
  await clickHabit(page, "water");
  const checked = await habitState(page);
  await page.locator('#cups button[aria-label="Cup 8"]').evaluate((button) => button.click());
  await page.locator('#cups button[aria-label="Cup 8"]').evaluate((button) => button.click());
  expect(await habitState(page)).toEqual(checked);
});

test("water resets when the local date changes", async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 0, 1, 23, 59, 50) });
  await page.reload();
  await continueLocally(page);
  await page.locator('#cups button[aria-label="Cup 3"]').evaluate((button) => button.click());
  await expect(page.locator("#wn")).toHaveText("3 / 8 cups");
  await page.clock.fastForward(25000);
  await expect(page.locator("#wn")).toHaveText("0 / 8 cups");
  await expect(page.locator("#cups .full")).toHaveCount(0);
});

test("dashboard heading updates greeting, clock, and date without a greeting icon", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.clock.install({ time: new Date(2026, 0, 1, 4, 59, 50) });
  await page.reload();
  await continueLocally(page);
  await expect(page.locator("#dashboard-heading h1")).toHaveText("Daily Walk");
  await expect(page.locator("#clock")).toContainText("Good night, Player 1");
  const expectedTime = await page.evaluate(() =>
    new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
  );
  await expect(page.locator("#clock")).toContainText(expectedTime);
  await expect(page.locator("#clock svg")).toHaveCount(0);
  const initialDate = await page.locator("#date").textContent();
  await page.clock.fastForward(25000);
  await expect(page.locator("#clock")).toContainText("Good morning, Player 1");
  await expect(page.locator("#clock svg")).toHaveCount(0);

  for (const [hour, greeting] of [[12, "Good afternoon"], [17, "Good evening"], [20, "Good evening"]]) {
    await page.clock.setFixedTime(new Date(2026, 0, 1, hour));
    await page.evaluate(() => tickClock());
    await expect(page.locator("#clock")).toContainText(greeting);
    await expect(page.locator("#clock svg")).toHaveCount(0);
  }
  await page.clock.setFixedTime(new Date(2026, 0, 2, 0, 1));
  await page.evaluate(() => tickClock());
  await expect(page.locator("#clock")).toContainText("Good night");
  expect(await page.locator("#date").textContent()).not.toBe(initialDate);
  expect(errors).toEqual([]);
});

test("journal drafts survive other updates and saving awards XP only once", async ({ page }) => {
  const initial = await page.evaluate(() => {
    S.jr = {};
    for (let i = 1; i <= 31; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      S.jr[dkey(date)] = "Earlier entry " + i;
    }
    drawJr();
    return { xp: S.xp, entries: { ...S.jr } };
  });
  const journal = page.locator("#jt");
  await journal.fill("   ");
  await page.locator("#jsave").evaluate((button) => button.click());
  await expect(page.locator("#toast")).toContainText("Write a little something first");
  expect(await page.evaluate(() => ({ xp: S.xp, entries: { ...S.jr } }))).toEqual(initial);

  await journal.fill("  Thank you 🌙  ");
  await page.locator('#cups button[aria-label="Cup 3"]').evaluate((button) => button.click());
  await page.evaluate(() => render());
  await expect(journal).toHaveValue("  Thank you 🌙  ");
  await page.locator("#jsave").evaluate((button) => button.click());
  await expect(journal).toHaveValue("Thank you 🌙");
  await expect(page.locator("#jst")).toHaveText("Saved today ✓");
  expect(await page.evaluate(() => ({ xp: S.xp, count: Object.keys(S.jr).length })))
    .toEqual({ xp: initial.xp + 10, count: 32 });
  const expectedKeys = Object.keys(initial.entries).sort();
  expect(await page.evaluate(() => Object.keys(S.jr).filter((key) => key !== today()).sort()))
    .toEqual(expectedKeys);
  await expect(page.locator("#jl .jrow")).toHaveCount(3);

  await journal.fill("Updated entry");
  await page.locator("#jsave").evaluate((button) => button.click());
  expect(await page.evaluate(() => S.xp)).toBe(initial.xp + 10);
  await journal.fill("x".repeat(610));
  await expect(journal).toHaveValue("x".repeat(600));
  await page.locator("#jsave").evaluate((button) => button.click());
  await page.reload();
  await continueLocally(page);
  await expect(journal).toHaveValue("x".repeat(600));
});

test("the journal resets on the next day and renders saved history safely", async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 0, 1, 23, 59, 50) });
  await page.reload();
  await continueLocally(page);
  await page.evaluate(() => {
    S.jr = {};
    drawJr();
  });
  await page.locator("#jt").fill("Thankful 🌙 <b>today</b>");
  await page.locator("#jsave").evaluate((button) => button.click());
  await page.locator("#jt").fill("Unsaved draft");
  await page.clock.fastForward(25000);
  await expect(page.locator("#jt")).toHaveValue("");
  await expect(page.locator("#jst")).toHaveText("");
  const previous = page.locator("#jl .jrow").first();
  const text = previous.locator(":scope > span");
  await expect(text).toContainText("Thankful");
  await expect(text.locator(".ic svg")).toHaveCount(1);
  await expect(text).toContainText("<b>today</b>");
  await expect(text.locator("b")).toHaveCount(0);
});

test("weekly chart shows seven accurate daily totals and updates with habit changes", async ({ page }) => {
  await page.evaluate(() => {
    S.tasks = [{ id: "one" }, { id: "two" }];
    S.checks = {};
    const counts = [0, 1, 2, 1, 0, 1, 2];
    counts.forEach((count, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      S.checks[dkey(date)] = {
        one: count >= 1,
        two: count >= 2,
      };
    });
    render();
  });
  await expect(page.locator("#week .xh b")).toHaveText(" This week");
  await expect(page.locator("#week .wcol")).toHaveCount(7);
  await expect(page.locator("#week .wp")).toHaveText(["0", "1", "2", "1", "0", "1", "2"]);
  await expect(page.locator("#wavg")).toHaveText("avg 50% per day");
  await expect(page.locator("#week .wcol").last()).toHaveClass(/td/);
  await expect.poll(() =>
    page.locator("#week .wbar i").evaluateAll((bars) => bars.map((bar) => bar.style.height)),
  ).toEqual(["0%", "50%", "100%", "50%", "0%", "50%", "100%"]);

  await page.evaluate(() => {
    S.checks[today()] = { one: true, two: false };
    render();
  });
  await expect(page.locator("#week .wp").last()).toHaveText("1");
  await expect(page.locator("#wavg")).toHaveText("avg 43% per day");
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
    data.water = { d: today(), n: 3 };
    data.jr[today()] = "Restored journal";
    return JSON.stringify({ data });
  });
  await page.locator("#jt").fill("Unsaved draft");
  await page.locator("#ufile").setInputFiles({
    name: "backup.json",
    mimeType: "application/json",
    buffer: Buffer.from(backup),
  });
  const restored = page.locator("#list .item").filter({ hasText: "Restored habit" });
  await expect(restored.locator("input")).toBeChecked();
  await expect(page.locator("#wn")).toHaveText("3 / 8 cups");
  await expect(page.locator("#jt")).toHaveValue("Restored journal");
  await page.reload();
  await continueLocally(page);
  await expect(restored.locator("input")).toBeChecked();
  await expect(page.locator("#cups .full")).toHaveCount(3);
  await expect(page.locator("#jt")).toHaveValue("Restored journal");
});

test("category and navigation icons stay pixel art after rerender and navigation", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.reload();
  await continueLocally(page);
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

test("exercise uses dumbbells and the cold shower has straight snowflake lines", async ({ page }) => {
  await page.evaluate(() => {
    S.tasks.push({ id: "c98765", g: "exercise", t: "Custom run", ic: "runner" });
    save();
  });
  await page.reload();
  await continueLocally(page);
  const icons = await page.evaluate(() => {
    const iconFor = (id) => document.querySelector(`input[data-id="${id}"]`).closest("label").querySelector(".hi").innerHTML;
    const artwork = (name) => {
      const element = document.createElement("span");
      element.innerHTML = icoSvg(name);
      return element.innerHTML;
    };
    const group = Array.from(document.querySelectorAll("#list .grp"))
      .find((element) => element.querySelector(".gn").textContent === "Exercise");
    const snow = document.querySelector('input[data-id="cold"]').closest("label").querySelector(".hi svg");
    const dumbbell = group.querySelector(".ge svg");
    const bounds = dumbbell.getBBox();
    return {
      group: group.querySelector(".ge").innerHTML,
      run: iconFor("run"),
      custom: iconFor("c98765"),
      dumbbell: artwork("dumbbell"),
      runner: artwork("runner"),
      size: { width: bounds.width, height: bounds.height },
      fills: Array.from(dumbbell.querySelectorAll("path"), (path) => getComputedStyle(path).fill),
      lines: snow.querySelectorAll("line").length,
      branches: snow.querySelector("path").getAttribute("d"),
    };
  });
  expect(icons.group).toBe(icons.dumbbell);
  expect(icons.run).toBe(icons.dumbbell);
  expect(icons.custom).toBe(icons.runner);
  expect(icons.size.width).toBeGreaterThanOrEqual(20);
  expect(icons.size.height).toBeGreaterThanOrEqual(16);
  for (const fill of icons.fills) {
    const [red, green, blue] = fill.match(/\d+/g).map(Number);
    expect(red).toBe(green);
    expect(green).toBe(blue);
  }
  expect(new Set(icons.fills).size).toBeGreaterThan(1);
  expect(icons.lines).toBe(4);
  expect(icons.branches).not.toMatch(/[cqst]/i);
});

test("tab buttons keep their appearance while identifying the current page", async ({ page }) => {
  const buttons = page.locator("#nav .nv");
  const appearance = () => buttons.evaluateAll((elements) => elements.map((button) => {
    const style = getComputedStyle(button);
    const icon = getComputedStyle(button.querySelector("i"));
    return { color: style.color, background: style.backgroundColor, transform: icon.transform };
  }));
  const initial = await appearance();
  await expect(page.locator('.nv[data-p="h"]')).toHaveAttribute("aria-current", "page");
  for (const pageId of ["t", "l", "h"]) {
    await page.locator(`.nv[data-p="${pageId}"]`).evaluate((button) => button.click());
    await expect(page.locator(`#pg-${pageId}`)).toBeVisible();
    await expect(page.locator(`.nv[data-p="${pageId}"]`)).toHaveAttribute("aria-current", "page");
    await expect(page.locator('#nav .nv[aria-current="page"]')).toHaveCount(1);
    expect(await appearance()).toEqual(initial);
  }
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

test("the habit editor validates, previews choices, and saves them across reloads", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.locator("#fab").evaluate((button) => button.click());
  await expect(page.locator("#hprev b")).toHaveText("Your new habit");
  await page.locator("#hadd").evaluate((button) => button.click());
  await expect(page.locator("#hn")).toBeFocused();
  await expect(page.locator("#hn")).toHaveClass(/bad/);
  await expect(page.locator("#hm")).toHaveClass(/show/);
  await page.locator("#hn").fill("   ");
  await page.locator("#hadd").evaluate((button) => button.click());
  await expect(page.locator("#hn")).toBeFocused();
  await expect(page.locator("#hm")).toHaveClass(/show/);

  await page.locator("#hn").fill(" Walk 🌙 ");
  await page.locator("#hw").fill(" Enjoy outside ");
  await page.locator("#hg .gt").filter({ hasText: "Exercise" }).evaluate((button) => button.click());
  await page.locator('#hi button[aria-label="runner"]').evaluate((button) => button.click());
  await expect(page.locator("#hprev b")).toContainText("Walk");
  await expect(page.locator("#hprev b .ic svg")).toHaveCount(1);
  await expect(page.locator("#hprev small")).toHaveText("Enjoy outside");
  await expect(page.locator("#hg .gt.on")).toContainText("Exercise");
  await expect(page.locator("#hi .it.on")).toHaveAttribute("aria-label", "runner");
  await page.locator("#hadd").evaluate((button) => button.click());
  await expect(page.locator("#hm")).not.toHaveClass(/show/);
  const saved = await page.evaluate(() => S.tasks.find((task) => task.t === "Walk 🌙"));
  expect(saved).toMatchObject({ g: "exercise", ic: "runner", s: "Enjoy outside" });
  await page.reload();
  await continueLocally(page);
  expect(await page.evaluate((id) => S.tasks.find((task) => task.id === id), saved.id)).toEqual(saved);

  await page.locator("#fab").evaluate((button) => button.click());
  await expect(page.locator("#hn")).toHaveValue("");
  await expect(page.locator("#hw")).toHaveValue("");
  await expect(page.locator("#hg .gt.on")).toContainText("My Habits");
  await expect(page.locator("#hi .it.on")).toHaveAttribute("aria-label", "star");
  await page.locator("#hn").fill("Discard this draft");
  await page.locator("#hw").fill("Discard this description");
  await page.locator("#hg .gt").filter({ hasText: "Exercise" }).evaluate((button) => button.click());
  await page.locator('#hi button[aria-label="runner"]').evaluate((button) => button.click());
  await page.locator("#hm").evaluate((modal) => modal.click());
  await expect(page.locator("#hm")).not.toHaveClass(/show/);
  await page.locator("#fab").evaluate((button) => button.click());
  await expect(page.locator("#hn")).toHaveValue("");
  await expect(page.locator("#hw")).toHaveValue("");
  await expect(page.locator("#hg .gt.on")).toContainText("My Habits");
  await expect(page.locator("#hi .it.on")).toHaveAttribute("aria-label", "star");
  expect(errors).toEqual([]);
});

test("the habit editor reports a save failure without losing the new habit", async ({ page }) => {
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.includes(":u:")) throw new Error("Write blocked");
      return original.call(this, key, value);
    };
  });
  await page.locator("#fab").evaluate((button) => button.click());
  await page.locator("#hn").fill("Unsaved walk");
  await page.locator("#hadd").evaluate((button) => button.click());
  await expect(page.locator("#ubstat")).toContainText("not saved");
  await expect(page.locator("#list .item").filter({ hasText: "Unsaved walk" })).toHaveCount(1);
});

test("the level hero updates for habit and journal rewards and keeps its profile shortcut", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.evaluate(() => {
    S.xp = 0;
    S.aw = { d: today(), k: {} };
    drawHero();
  });
  await expect(page.locator("#lvb")).toHaveText("Lv 1");
  await expect(page.locator("#lvt")).toHaveText("Noob");
  await expect(page.locator("#xpn")).toHaveText("0 / 80 XP");
  await expect(page.locator("#xfill")).toHaveAttribute("style", "width: 0%;");

  await clickHabit(page, "wake");
  await expect(page.locator("#xpn")).toHaveText("10 / 80 XP");
  await expect(page.locator("#xfill")).toHaveAttribute("style", "width: 12.5%;");
  await page.locator("#jt").fill("Thankful");
  await page.locator("#jsave").evaluate((button) => button.click());
  await expect(page.locator("#xpn")).toHaveText("20 / 80 XP");
  await expect(page.locator("#xfill")).toHaveAttribute("style", "width: 25%;");
  await page.reload();
  await continueLocally(page);
  await expect(page.locator("#xpn")).toHaveText("20 / 80 XP");
  await page.locator("#hero").evaluate((element) => element.click());
  await expect(page.locator("#pm")).toHaveClass(/show/);
  expect(errors).toEqual([]);
});

test("crossing a level threshold updates the hero and shows the level-up effect", async ({ page }) => {
  await page.evaluate(() => {
    S.xp = 79;
  });
  await clickHabit(page, "wake");
  await expect(page.locator("#lvb")).toHaveText("Lv 2");
  await expect(page.locator("#lvt")).toHaveText("Castle Page");
  await expect(page.locator("#xpn")).toHaveText("9 / 160 XP");
  await expect(page.locator("#xfill")).toHaveAttribute("style", "width: 5.625%;");
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
