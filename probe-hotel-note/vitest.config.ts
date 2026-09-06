import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Separate from vite.config.ts on purpose: the Module Federation plugin rewrites
// imports so the Host can load this app as a remote, which has no business
// running inside a unit test.
//
// `globals: true` is here because of what a measured run had to do without it.
// On 06/09/2026 stage 6 wrote its tests with bare `describe`/`it`/`expect` and
// `tsc -b` answered TS2593 "Cannot find name 'describe'. ... Try `npm i
// --save-dev @types/jest`" - a hint pointing at the wrong test runner entirely.
// The run recovered by editing vitest.config.ts and tsconfig.json to exactly
// what is committed here, adding no dependency, at the cost of build rounds.
// Reproduced offline against the pristine scaffold before changing anything.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    // Both styles then work: the explicit `import { test } from "vitest"` that
    // App.test.tsx uses, and the bare `describe`/`it`/`expect` a generated test
    // is just as likely to be written with. Paired with "vitest/globals" in
    // tsconfig `types`, without which the bare form does not type-check.
    globals: true,
  },
});
