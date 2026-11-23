# Daily Walk

A static habit tracker with profiles, buddy and town progression, a buddy index,
leaderboard, and solar-system exploration.

## Run locally

For development with automatic browser refresh:

```sh
npm install
npm run dev
```

Open <http://127.0.0.1:8123/>.

The development command watches both Sass and the app files. Saving HTML, CSS,
JavaScript, or SVG changes automatically reloads the browser. React-style hot
component state is not used; this is a fast full-page refresh suitable for the
current static app.

You can still open `index.html` directly or serve the folder with a normal
static server for a production-like run.

## Project structure

```text
.
├── index.html
├── package.json
└── assets
    ├── css
    │   └── styles.css
    ├── scss
    │   ├── main.scss
    │   └── partials
    │       ├── _accounts.scss
    │       ├── _collection.scss
    │       ├── _dashboard.scss
    │       ├── _foundation.scss
    │       ├── _habits.scss
    │       ├── _leaderboard.scss
    │       ├── _navigation.scss
    │       ├── _planets.scss
    │       └── _town.scss
    └── js
        ├── app.js
        ├── core
        │   ├── accounts.js
        │   ├── runtime.js
        │   ├── state.js
        │   └── storage.js
        ├── features
        │   ├── buddies.js
        │   ├── collection.js
        │   ├── habits.js
        │   ├── pets.js
        │   ├── profile.js
        │   ├── town-progress.js
        │   └── town.js
        └── ui
            └── icons.js
```

- `index.html` contains the page structure and screen templates.
- `assets/scss/` contains the editable Sass source, split into ordered feature
  partials.
- `assets/css/styles.css` is generated from Sass and remains the stylesheet
  loaded by Chrome and other browsers.
- `assets/js/app.js` is the final bootstrap and main habit renderer.
- `assets/js/core/` contains application state, shared UI helpers, profile
  storage, account UI, and leaderboard logic.
- `assets/js/features/` contains the habits, profile, buddy, collection,
  streak, town, globe, and graduation feature code.
- `assets/js/features/habits.js` handles habit completion, rewards, group
  progress, and the habit editor.
- `assets/js/features/town-progress.js` handles town and planet progression.
- `assets/js/features/pets.js` handles pet unlocks and rendering.
- `assets/js/ui/` contains the shared SVG icon definitions and icon hydration.
- `tests/` contains browser tests for habits, profiles, pets, and town progression.

The scripts in `index.html` are loaded in dependency order without a build step.

## Test

Install dependencies and the Playwright browser once:

```sh
npm install
npx playwright install chromium
```

Run the browser regression tests with:

```sh
npm test
```

Each test uses an isolated browser context and does not change your saved
profiles.

## Build styles

Chrome loads the compiled CSS, not Sass directly. After editing an `.scss` file,
rebuild the browser stylesheet:

```sh
npm install
npm run build:css
```

For automatic rebuilding while you work:

```sh
npm run watch:css
```

All user data remains in the browser's local storage. Use the export and restore
controls in the Profile screen to move a save to another browser.
If saving fails, the profile status shows a warning; changes remain in memory
until storage is available and a save succeeds. If saved profiles cannot be
read on startup, saving is disabled to avoid overwriting them. Resolve the
storage issue and reload to try again.
