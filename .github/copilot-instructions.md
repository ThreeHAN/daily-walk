# Daily Walk

- Read the feature map and behavior notes in [README.md](../README.md) before
  changing a feature; update them when behavior or ownership changes.
- Preserve the deliberately progressed `freshState` during development. Do not
  replace it with a new-player state unless explicitly requested.
- Preserve existing local-storage keys, profiles, and backup compatibility.
  Changes to persisted state need compatible hydration or migration and tests;
  do not clear user data to fix a problem.
- This is a static app using ordered classic scripts and shared globals. Keep
  script dependencies in the correct order in `index.html`, and preserve direct
  file and GitHub Pages usage.
- Edit Sass in `assets/scss/`, not the generated CSS directly. Run
  `npm run build:css` after style changes.
- Run relevant Playwright tests with `npm test` (or
  `npx playwright test tests/<file>.spec.js`); add focused tests for behavior
  changes and storage migrations. Tests use isolated browser contexts.
