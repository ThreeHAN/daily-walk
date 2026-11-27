const { expect } = require("@playwright/test");

async function reachStartupChoice(page) {
  const ready = page.getByRole("button", { name: "Ready", exact: true });
  const local = page.getByRole("button", { name: "Continue locally", exact: true });
  await expect(ready.or(local)).toBeVisible();
  if (await ready.isVisible()) {
    await ready.click();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  }
}

async function continueLocally(page) {
  await reachStartupChoice(page);
  const firstTime = await page.evaluate(() => sessionStorage.getItem("dailywalk_admin_max:onboarding:v1") !== null);
  if (firstTime) {
    // Unrelated tests control the tour themselves without changing saved tutorial state.
    await page.evaluate(() => {
      window.testOriginalMaybeStartTour = maybeStartTour;
      maybeStartTour = () => {};
    });
  }
  await page.getByRole("button", { name: "Continue locally", exact: true }).click();
  if (firstTime) {
    await page.evaluate(() => {
      maybeStartTour = window.testOriginalMaybeStartTour;
      delete window.testOriginalMaybeStartTour;
    });
  }
}

module.exports = { reachStartupChoice, continueLocally };
