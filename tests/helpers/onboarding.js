const { expect } = require("@playwright/test");

async function completeAvatar(page) {
  const avatar = page.getByRole("main", { name: "Edit your avatar" });
  if (!(await avatar.getByLabel("Your name").inputValue()).trim()) {
    await avatar.getByLabel("Your name").fill("Player 1");
  }
  await avatar.getByRole("button", { name: "Continue", exact: true }).click();
}

async function reachStartupChoice(page) {
  const ready = page.getByRole("button", { name: "Ready", exact: true });
  const local = page.getByRole("button", { name: "Continue locally", exact: true });
  const avatar = page.getByRole("main", { name: "Edit your avatar" });
  const habits = page.getByRole("main", { name: "Your habits" });
  await expect(ready.or(avatar).or(habits).or(local)).toBeVisible();
  if (await ready.isVisible()) {
    await ready.click();
  }
  if (await avatar.isVisible()) await completeAvatar(page);
  if (await habits.isVisible()) await habits.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(local).toBeVisible();
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

module.exports = { reachStartupChoice, continueLocally, completeAvatar };
