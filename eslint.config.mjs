import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // New in react-hooks v7 (Next 16). Existing code loads localStorage
      // after hydration this way; warn until it's moved to useSyncExternalStore.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // `next lint` used to skip these; the ESLint CLI needs them listed.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "database.types.ts",
    "generateHash.js",
  ]),
]);

export default eslintConfig;
