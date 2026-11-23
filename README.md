# Daily Walk

A static habit tracker with profiles, buddy and town progression, a buddy index,
leaderboard, and solar-system exploration.

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static web
server.

For example:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Project structure

```text
.
├── index.html
└── assets
    ├── css
    │   └── styles.css
    └── js
        ├── app.js
        ├── core
        │   ├── accounts.js
        │   ├── runtime.js
        │   └── state.js
        ├── features
        │   ├── buddies.js
        │   ├── collection.js
        │   ├── habits.js
        │   ├── profile.js
        │   └── town.js
        └── ui
            └── icons.js
```

- `index.html` contains the page structure and screen templates.
- `assets/css/styles.css` contains all layout, theme, animation, and responsive
  styles.
- `assets/js/app.js` is the final bootstrap and main habit renderer.
- `assets/js/core/` contains application state, shared UI helpers, account
  persistence, and leaderboard logic.
- `assets/js/features/` contains the habits, profile, buddy, collection,
  streak, town, globe, and graduation feature code.
- `assets/js/ui/` contains the shared SVG icon definitions and icon hydration.

The scripts in `index.html` are loaded in dependency order without a build step.

All user data remains in the browser's local storage. Use the export and restore
controls in the Profile screen to move a save to another browser.
