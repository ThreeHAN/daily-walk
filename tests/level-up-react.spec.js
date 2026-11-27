const { test, expect } = require("@playwright/test");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

test("level-up content updates for unlocks, empty rewards, and max level", async ({ page }) => {
  await page.goto(pathToFileURL(path.resolve(__dirname, "../index.html")).href);
  await page.getByRole("button", { name: "Ready", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue locally" }).click();
  await page.getByRole("button", { name: "Skip", exact: true }).click();
  await expect(page.locator("#lu")).toHaveAttribute("data-react-root", "");
  const portrait = page.locator("#lu .pv");
  const originalPortrait = await portrait.innerHTML();
  await page.evaluate(() => {
    S.p.skin = Object.keys(SKIN).find((skin) => skin !== S.p.skin);
    paint();
  });
  await expect.poll(() => portrait.innerHTML()).not.toBe(originalPortrait);
  await page.evaluate(() => levelUp(2));
  await expect(page.locator("#lu")).toHaveClass(/show/);
  await expect(page.locator("#lun")).toHaveText("2");
  await expect(page.locator("#lut .level-title")).toHaveAttribute("data-level", "2");
  await expect(page.locator("#luu")).toContainText("Unlocked:");
  await page.locator("#lugo").click();
  await expect(page.locator("#lu")).not.toHaveClass(/show/);

  await page.evaluate(() => levelUp(8));
  await expect(page.locator("#lu")).toHaveClass(/show/);
  await expect(page.locator("#lun")).toHaveText("8");
  await expect(page.locator("#lut .level-title")).toHaveAttribute("data-level", "8");
  await expect(page.locator("#luu")).toHaveText("Keep going, more rewards are ahead!");
  await page.locator("#lugo").click();
  await expect(page.locator("#lu")).not.toHaveClass(/show/);

  await page.evaluate(() => levelUp(10));
  await expect(page.locator("#lu")).toHaveClass(/show/);
  await expect(page.locator("#lun")).toHaveText("10");
  await expect(page.locator("#lut .level-title")).toHaveAttribute("data-level", "10");
  await expect(page.locator("#luu")).toHaveText("Max level! Keep helping towns and exploring the world.");
  await page.locator("#lugo").click();
  await expect(page.locator("#lu")).not.toHaveClass(/show/);
});
