import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

export default defineConfig({
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  esbuild: {
    jsx: "automatic",
  },
  build: {
    outDir: "assets/js/generated",
    emptyOutDir: false,
    rolldownOptions: {
      output: {
        banner: `/*! React, React DOM, and Scheduler\n${readFileSync("node_modules/react/LICENSE", "utf8")} */`,
        comments: { legal: true },
      },
    },
    lib: {
      entry: "assets/react/habit-list.jsx",
      name: "DailyWalkHabitList",
      formats: ["iife"],
      fileName: () => "habit-list.js",
    },
  },
});
