# Daily Walk

A static habit tracker with profiles, a customizable pixel-art traveler, town-help
progression, a people index, leaderboard, and world exploration.

## Run locally

For development with automatic browser refresh:

```sh
npm install
npm run dev
```

Open <http://127.0.0.1:8123/>.

The development command watches Sass, the React source, and the app files.
Saving HTML, CSS, JavaScript, JSX, or SVG changes rebuilds as needed and reloads
the browser. React hot component state is not used.

### A note for Declan

`npm run dev` is like starting your app's workshop. It opens a local web server
for Daily Walk and starts a helper that watches your files for changes. Keep the
terminal running while you work, then open <http://127.0.0.1:8123/> in your
browser.

Whenever you save an HTML, JavaScript, JSX, SVG, or Sass change, the helper notices
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
manually from the Actions tab. The workflow rebuilds the CSS and React bundle
before running the browser tests and publishing. A failed build or test prevents
deployment.

Once the deployment succeeds, the site should be available at
<https://threehan.github.io/daily-walk/>. Profiles are stored locally; optional
Google sign-in enables automatic synchronization between devices.

## Project structure

```text
.
├── index.html
├── package.json
├── vite.react.config.mjs
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
    │       ├── _pixel.scss
    │       ├── _planets.scss
    │       └── _town.scss
    ├── react
    │   ├── app.jsx
    │   ├── auth              # Onboarding, sign-in, and profile sync
    │   ├── habits            # Dashboard, habits, water, and journal
    │   ├── leaderboard
    │   ├── profile           # Profile and wardrobe
    │   ├── progress          # Levels and streak celebration
    │   ├── shared            # Shared React helpers
    │   ├── tutorial
    │   └── world             # Town, people, and travel
    └── js
        ├── app.js
        ├── generated
        │   └── react-ui.js
        ├── core
        │   ├── accounts.js
        │   ├── runtime.js
        │   ├── state.js
        │   └── storage.js
        ├── features
        │   ├── buddies.js
        │   ├── buddy-art.js
        │   ├── buddy-render.js
        │   ├── collection.js
        │   ├── habits.js
        │   ├── pets.js
        │   ├── profile.js
        │   ├── town-data.js
        │   ├── town-progress.js
        │   ├── town-scene.js
        │   ├── town.js
        │   ├── tutorial.js
        │   └── world-map.js
        └── ui
            ├── icon-art.js
            └── icons.js
```

- `index.html` contains the page structure and screen templates.
- `assets/scss/` contains the editable Sass source, split into ordered feature
  partials.
- `assets/css/styles.css` is generated from Sass and remains the stylesheet
  loaded by Chrome and other browsers.
- `assets/react/` groups React components and their supporting modules by feature.
  `app.jsx` exports their render bridges to the classic scripts.
  Their generated classic script,
  `assets/js/generated/react-ui.js`, is checked in so the site also works
  directly from `index.html`. The bundle includes the MIT license for React,
  React DOM, and Scheduler.
- `assets/js/app.js` is the final bootstrap and bridges existing state and
  actions to the React habit list. The legacy app remains the state owner.
- `assets/js/core/` contains application state, shared UI helpers, profile
  storage, account UI, and leaderboard logic.
- `assets/js/features/` contains the habits, profile, buddy, collection,
  streak, town, globe, and graduation feature code.
- `assets/js/features/habits.js` handles habit completion, rewards, group
  progress, and the habit editor.
- `assets/js/features/town-data.js` defines towns, dialogue, and rewards.
- `assets/js/features/town-scene.js` draws the town and creates its cast.
- `assets/js/features/town.js` handles walkers, companions, sleep, and interactions.
- `assets/js/features/world-map.js` handles the globe and travel.
- `assets/js/features/town-progress.js` handles town and planet progression.
- `assets/js/features/buddies.js` defines appearance options and legacy kinds;
  `buddy-art.js` contains legacy artwork, and `buddy-render.js` renders people
  and defines pets.
- `assets/js/features/pets.js` handles pet unlocks and rendering.
- `assets/js/features/tutorial.js` implements the guided introduction.
- `assets/js/ui/icon-art.js` contains shared SVG icon artwork;
  `icons.js` handles icon lookup and hydration.
- `assets/svg/pets/` contains pet SVG assets.
- `assets/svg/level-titles/` contains the supplied artwork for the ten level titles.
- `assets/fonts/tiny5/` contains the Tiny5 pixel font and its SIL Open Font
  License. Tiny5 is copyright 2022–2024 The Tiny5 Project Authors
  ([project](https://github.com/Gissio/font_tiny5)).
- `tests/` contains browser tests for habits, profiles, pets, and town progression.

The scripts in `index.html` are classic scripts loaded in dependency order.
Keep that order when moving code, and update the version in a changed script's
URL so browsers do not use a stale cached copy. React roots use the shared
`createRoot` helper in `assets/react/shared/react-root.js`, which marks their
containers with `data-react-root`. Portal targets use the same marker. Legacy
icon hydration and text replacement skip marked subtrees; legacy code must not
mutate their contents except for the guided tour's temporary highlight on
`#ix .sheet`.

The profile shell renders its banner, menu, info, wardrobe tabs, wardrobe
panels, level list, and wardrobe level title through one root and portals into
the existing screen containers. Profile pets, account list, and sign-in remain
independent roots. The shell controls which existing profile view is
visible; avatar artwork and account controls remain owned by legacy code.
`profileBridge` supplies current profile snapshots and actions to the profile
UI on explicit refreshes. The existing state owner, save logic, and sync remain
authoritative. Profile logic supplies level-up rewards and controls the
celebration's timing and dismissal. The wardrobe panels receive their choices and
actions from the legacy state owner. The water tracker and habit list call the same
habit-check action. The journal keeps an editable React draft and reloads the
saved entry when the profile, backup, or local date changes. The weekly chart
receives current tasks and per-day checks from the legacy state owner.

## Feature map and behavior

| Feature                                         | Main implementation                                                                                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Dashboard heading and clock                     | [`dashboard-heading.jsx`](assets/react/habits/dashboard-heading.jsx), [`habits.js`](assets/js/features/habits.js)                                  |
| Profile status bar                              | [`profile-status.jsx`](assets/react/profile/profile-status.jsx), [`accounts.js`](assets/js/core/accounts.js)                                       |
| Profile banner, menu, pets, and wardrobe        | [`profile-shell.jsx`](assets/react/profile/profile-shell.jsx), [`profile-banner.jsx`](assets/react/profile/profile-banner.jsx), [`profile-menu.jsx`](assets/react/profile/profile-menu.jsx), [`profile-pets.jsx`](assets/react/profile/profile-pets.jsx), [`wardrobe-tabs.jsx`](assets/react/profile/wardrobe-tabs.jsx), [`wardrobe-panels.jsx`](assets/react/profile/wardrobe-panels.jsx), [`profile.js`](assets/js/features/profile.js) |
| XP, levels, and rewards                         | [`level-hero.jsx`](assets/react/progress/level-hero.jsx), [`level-list.jsx`](assets/react/progress/level-list.jsx), [`level-title.jsx`](assets/react/progress/level-title.jsx), [`level-up.jsx`](assets/react/progress/level-up.jsx), [`profile.js`](assets/js/features/profile.js) |
| New habit editor                                | [`habit-editor.jsx`](assets/react/habits/habit-editor.jsx), [`habits.js`](assets/js/features/habits.js)                                            |
| Habit checklist, progress, water, journal, and weekly activity | [`habit-list.jsx`](assets/react/habits/habit-list.jsx), [`progress-summary.jsx`](assets/react/habits/progress-summary.jsx), [`water-tracker.jsx`](assets/react/habits/water-tracker.jsx), [`journal.jsx`](assets/react/habits/journal.jsx), [`weekly-chart.jsx`](assets/react/habits/weekly-chart.jsx), [`app.js`](assets/js/app.js), [`habits.js`](assets/js/features/habits.js) |
| Pixel traveler and appearance                   | [`buddy-render.js`](assets/js/features/buddy-render.js), [`buddies.js`](assets/js/features/buddies.js), [`profile.js`](assets/js/features/profile.js) |
| Town data, rewards, and progression            | [`town-data.js`](assets/js/features/town-data.js), [`town-progress.js`](assets/js/features/town-progress.js)                               |
| Town buildings, scenery, and cast               | [`town-scene.js`](assets/js/features/town-scene.js), [`town-birds.jsx`](assets/react/world/town-birds.jsx)                                        |
| Town walkers, pets, sleep, and interactions    | [`town.js`](assets/js/features/town.js), [`buddy-details.jsx`](assets/react/world/buddy-details.jsx), [`buddy-stats.jsx`](assets/react/world/buddy-stats.jsx) |
| World map and travel                            | [`world-town-list.jsx`](assets/react/world/world-town-list.jsx), [`travel-landscape.jsx`](assets/react/world/travel-landscape.jsx), [`world-map.js`](assets/js/features/world-map.js) |
| People met, pet definitions, and unlocks        | [`people-index.jsx`](assets/react/world/people-index.jsx), [`town.js`](assets/js/features/town.js), [`buddy-render.js`](assets/js/features/buddy-render.js), [`pets.js`](assets/js/features/pets.js), [`collection.js`](assets/js/features/collection.js) |
| Shared icon artwork and rendering               | [`icon-art.js`](assets/js/ui/icon-art.js), [`icons.js`](assets/js/ui/icons.js)                                                             |
| Streak celebration                              | [`streak-week.jsx`](assets/react/progress/streak-week.jsx), [`collection.js`](assets/js/features/collection.js)                                    |
| Profiles, backup/restore, and leaderboard       | [`accounts.js`](assets/js/core/accounts.js), [`storage.js`](assets/js/core/storage.js), [`profile-info.jsx`](assets/react/profile/profile-info.jsx), [`profile-list.jsx`](assets/react/profile/profile-list.jsx), [`leaderboard-list.jsx`](assets/react/leaderboard/leaderboard-list.jsx), [`leaderboard-summary.jsx`](assets/react/leaderboard/leaderboard-summary.jsx) |
| Onboarding, Google sign-in, and profile sync    | [`onboarding.jsx`](assets/react/auth/onboarding.jsx), [`google-auth.jsx`](assets/react/auth/google-auth.jsx), [`profile-link.js`](assets/react/auth/profile-link.js), [`profile-sync.js`](assets/react/auth/profile-sync.js) |
| Guided introduction                             | [`tutorial.jsx`](assets/react/tutorial/tutorial.jsx), [`tutorial.js`](assets/js/features/tutorial.js)                                                |
| Defaults, saved-state hydration, and migrations | [`state.js`](assets/js/core/state.js)                                                                                                       |

- Habit checks and awards use the browser's local date. Checking a habit awards
  XP; completing a group or the whole checklist awards bonuses. Each award key
  is granted at most once per day, even if a habit is unchecked and rechecked.
  XP also contributes to the active town's progress. Habit check changes carry
  per-day, per-habit timestamps; resetting the checklist records an uncheck for
  each habit.
- Your traveler is a pixel-art person, based on the supplied knight sprite.
  The same customizable artwork appears in the wardrobe, profile, and towns.
  The profile's **Wardrobe & traveler** includes an **Appearance** tab for
  gender (Male or Female), skin color, hairstyle, hair color, and eye color
  independently. Gender can be changed at any time and changes the face and
  body without changing the other appearance choices. Saves and backups with
  the old gender lock are unlocked when loaded.
  Clothing, pets, and earned gear are available in the same wardrobe.
- The interface, shared icons, town scenery, world map, and streak flame use a
  pixel-art visual style, including habit category and bottom navigation icons.
  Bottom navigation buttons keep their appearance when switching tabs; the
  current page is identified for assistive technology.
  The world map has pixel land and spins horizontally; drag side to side and
  select a town to travel.
- Every town journey shows a moving natural landscape in the destination's
  colors without buildings; reduced motion keeps it still.
- Town characters walk with alternating pixel-style steps; reduced-motion
  settings disable the walking animation.
- Different pixel birds occasionally fly and flap across town skies, or remain still with reduced motion.
- All pets use pixel-art sprites; an equipped pet sits beside the traveler in
  profile previews and follows them in town. The dashboard streak traveler
  appears without a pet. Pet unlocks and saved selections are unchanged.
  Roughly one-third of town residents have their own stable companions; saved
  residents with a pet keep theirs, independently of the traveler's unlocks.
- From 8 p.m. until 7 a.m. local time, the traveler, residents, and their pets
  sleep indoors and ZZZZ appears above built homes. They return automatically
  in the morning, even if the town stays open overnight.
- Habit XP also builds a warrior's journey. Level 1 starts as a newcomer;
  levels 2, 3, 5, 7, and 9 unlock an optional tunic, training sword, shield,
  armor, and helmet in **Warrior gear**. Level titles use the supplied themed
  artwork, progressing from Noob to Legendary Grandmaster. Equipping gear is a cosmetic choice;
  tap an equipped item again to remove it. Removing a tunic or armor puts on a
  T-shirt; removing a helmet leaves the head uncovered. This does not change
  habit XP or replace town rewards.
- Tap or keyboard-activate a person in a town to meet them. The People Index
  remembers each person and the town where you first met them, per profile;
  arriving in a town alone does not add anyone. The index groups people by
  town and can be searched by name or town. Previously saved residents are
  preserved and distributed among towns, rather than following the traveler.
- Help the current town with 3,000 XP, then choose
  any other town on the world map. You cannot leave before helping it. Returning
  to a town keeps its previous progress; excess XP is not transferred.
- Helping a town unlocks cosmetic gear in **Wardrobe & traveler**, grouped by
  hats, tops, pants, shoes, and accessories. Tap equipped town gear again to
  remove it. Six landscapes also award three pants styles and three boot styles
  alongside their existing rewards; towns with the same landscape share these
  rewards. Previous town progress unlocks them automatically. Older saves and
  backups keep their clothing colors and use classic pants and shoes by default.
  Shirts and pants are always worn; older saves without them receive a T-shirt
  and black pants. Select a shirt, pants, or shoes to reveal its color choices.
  Duplicate hat styles share one wardrobe card and keep their original level or
  town unlocks. Halo, headphones, party hat, and beanie are no longer offered;
  previously saved versions remain visible until replaced or removed.
  Blush is no longer offered or shown; legacy saved values are preserved.
- The world map shows all towns on one globe. Legacy planet and town progress
  and unlocked collectibles are preserved, including a traveler's current
  location. Graduation is unavailable during the traveler journey.
- Water and journal entries are daily. Reaching the water goal checks the water
  habit; the first journal save of the day awards XP. New water totals and
  journal entries are retained in the local profile; earlier entries already
  removed by the former 30-entry limit cannot be recovered.
- A new browser or newly created profile starts at level 1 in Meadow Valley,
  with no progress, journal history, pets, or rewards. Existing local profiles
  and legacy saves are preserved. `freshState()` remains a highly progressed
  development fixture with completed towns, rewards, and historical activity.
- Each profile is stored separately in browser local storage. Export creates a
  JSON backup; restoring a backup replaces the active profile's in-memory state
  and saves it. `hydrateState()` supplies missing fields and migrates older
  data. Preserve existing storage keys and backup compatibility when changing
  the state shape, and test migrations against older saves.
- A new browser starts with a welcome screen and avatar editor, followed by
  Google sign-in or local mode and the guided tour. Avatar choices are kept
  temporarily in the browser tab until a new profile is created; signing into
  an existing cloud profile opens it unchanged. Existing local profiles skip
  these new-user steps.
- Google sign-in is optional and available in the main profile menu on the
  hosted site or local HTTP server. At launch, signed-out users choose Google
  sign-in or a local profile. Sign-in opens the account's existing cloud profile
  (or lets the user choose when there are several) without uploading an
  unrelated local profile. If the account has no cloud profiles, users can
  create one or continue locally. Existing local profiles are preserved, and a
  cloud profile is cached locally for offline use. User actions that change a
  profile trigger sync, including queued changes to linked inactive profiles;
  there is no timed cloud polling or retry. Offline changes stay local across
  reloads and retry once when the connection returns. Other sync
  failures remain visible until another profile change or **Sync now**.
  **Sync now** requests an immediate check. **Choose cloud profile** connects
  an existing cloud profile to the current local profile on another device.
  Profile, journal, and habit-check edits are merged using the last shared
  snapshot. For the same habit, the later timestamp wins; equal or unavailable
  timestamps prefer the device copy. Device clocks must be accurate. Other
  overlapping changes prefer the device copy, with the cloud version preserved
  as a separate sync backup in **My info** before upload. Concurrent gameplay
  progress is kept together rather than combining potentially duplicate
  rewards. Connecting another cloud profile first backs up the device copy and
  opens the chosen cloud copy. Unsaved journal drafts remain in the editor while
  sync continues. Direct
  `file://` usage remains available without sign-in. The Supabase project URL
  and publishable key in `google-auth.jsx` are public; never add secret or
  service-role keys to the browser bundle.
- The guided tour scrolls to each highlighted button and waits for the user to
  activate it before continuing. Completion is stored per profile; users can
  skip or reopen it from their profile.

## Supabase database foundation

The migration in `supabase/migrations/` defines an initial Supabase schema:
`walk_profiles` holds each account's profiles, habits, appearance, and overall
progress; `walk_daily_activity` holds one row per profile and local calendar
date, including habit checks, water, and journal entries. A null water count
means the value is unknown, rather than zero. Row-level security restricts both
tables to the owning authenticated user; project administrators can still access
the data. The profile foreign key also prevents activity from being assigned to
another user's profile. Deleting a profile removes its daily rows, and deleting
an Auth user removes their profiles.

The sync migrations are deployed to the hosted project. The original save
operation uses a client-supplied timestamp, which alone cannot detect all
concurrent edits and does not remove omitted activity rows. The checked save
operation instead requires the expected cloud version and atomically replaces
the activity snapshot; the read operation returns the profile and activity
together. The app uses these operations for automatic sync and conflict detection.
New sync saves retain a complete state snapshot in the profile progress so that
local state can round-trip without losing daily-history details. Earlier cloud
saves remain readable through the profile and activity fields.

To validate the migration against a local Supabase database:

```sh
supabase db start
supabase migration up
docker exec -i supabase_db_daily-walk psql -U postgres -d postgres -v ON_ERROR_STOP=1 < supabase/tests/cloud_profiles.sql
docker exec -i supabase_db_daily-walk psql -U postgres -d postgres -v ON_ERROR_STOP=1 < supabase/tests/sync_profiles.sql
docker exec -i supabase_db_daily-walk psql -U postgres -d postgres -v ON_ERROR_STOP=1 < supabase/tests/checked_profile_sync.sql
```

The test uses synthetic accounts inside a rolled-back transaction. It does not
connect to the hosted project. The Docker container name is based on the
`project_id` in the local Supabase configuration.

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

## Build React

After editing `assets/react/` or the React build configuration, run
`npm run build:react` and include the updated generated bundle. The bundle is
a classic script so direct-file usage does not depend on a module server.
`npm run dev` also rebuilds it automatically while developing.

All user data remains in the browser's local storage. Use the export and restore
controls in the Profile screen to move a save to another browser.
If saving fails, the profile status shows a warning; changes remain in memory
until storage is available and a save succeeds. If saved profiles cannot be
read on startup, saving is disabled to avoid overwriting them. Resolve the
storage issue and reload to try again.
