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

### A note for Declan

`npm run dev` is like starting your app's workshop. It opens a local web server
for Daily Walk and starts a helper that watches your files for changes. Keep the
terminal running while you work, then open <http://127.0.0.1:8123/> in your
browser.

Whenever you save an HTML, JavaScript, SVG, or Sass change, the helper notices
and refreshes the browser for you (or updates the CSS directly). That is called
**live refresh**. It means you can change one thing, save it, and immediately see
what happened instead of manually refreshing every time. Make small changes and
save often—it's one of the best ways to learn, experiment, and catch mistakes
quickly. To stop the workshop, press `Ctrl+C` in the terminal.

You can still open `index.html` directly or serve the folder with a normal
static server for a production-like run.

## Publish on GitHub Pages

In the repository's **Settings > Pages**, set **Build and deployment > Source**
to **GitHub Actions**. Push the workflow to `main` to deploy; subsequent pushes
to `main` deploy automatically. You can also run **Deploy to GitHub Pages**
manually from the Actions tab. The workflow rebuilds the CSS from Sass before
running the browser tests and publishing. A failed build or test prevents
deployment.

Once the deployment succeeds, the site should be available at
<https://threehan.github.io/daily-walk/>. Progress is stored in each browser,
not synchronized across devices; use Profile export and restore to move it.

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
        │   ├── town.js
        │   └── tutorial.js
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
- `assets/js/features/tutorial.js` implements the guided introduction.
- `assets/js/ui/` contains the shared SVG icon definitions and icon hydration.
- `assets/svg/pets/` contains pet SVG assets.
- `tests/` contains browser tests for habits, profiles, pets, and town progression.

The scripts in `index.html` are loaded in dependency order without a build step.

## Feature map and behavior

| Feature                                         | Main implementation                                                                                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Habit checklist, groups, water, and journal     | [`app.js`](assets/js/app.js), [`habits.js`](assets/js/features/habits.js)                                                                   |
| XP, levels, and wardrobe                        | [`profile.js`](assets/js/features/profile.js)                                                                                               |
| Towns, ecosystems, and planets                  | [`town.js`](assets/js/features/town.js), [`town-progress.js`](assets/js/features/town-progress.js)                                          |
| Buddy and pet definitions, unlocks, and index   | [`buddies.js`](assets/js/features/buddies.js), [`pets.js`](assets/js/features/pets.js), [`collection.js`](assets/js/features/collection.js) |
| Profiles, backup/restore, and leaderboard       | [`accounts.js`](assets/js/core/accounts.js), [`storage.js`](assets/js/core/storage.js)                                                      |
| Guided introduction                             | [`tutorial.js`](assets/js/features/tutorial.js)                                                                                             |
| Defaults, saved-state hydration, and migrations | [`state.js`](assets/js/core/state.js)                                                                                                       |

- Habit checks and awards use the browser's local date. Checking a habit awards
  XP; completing a group or the whole checklist awards bonuses. Each award key
  is granted at most once per day, even if a habit is unchecked and rechecked.
  XP also contributes to the active town's progress.
- Water and journal entries are daily. Reaching the water goal checks the water
  habit; the first journal save of the day awards XP. The app keeps up to 30
  journal entries.
- **Development default:** `freshState()` intentionally creates a highly
  progressed profile with completed towns, unlocked rewards, and historical
  activity. Keep this setup while the app is being established; it is not the
  intended new-player experience.
- Each profile is stored separately in browser local storage. Export creates a
  JSON backup; restoring a backup replaces the active profile's in-memory state
  and saves it. `hydrateState()` supplies missing fields and migrates older
  data. Preserve existing storage keys and backup compatibility when changing
  the state shape, and test migrations against older saves.
- The tutorial's completion is stored per profile. Users can also reopen the
  tour from their profile.

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
