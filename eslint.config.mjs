import nextConfig from "eslint-config-next/core-web-vitals";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...nextConfig,

  // Ignores (replaces .eslintignore)
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      ".next/",
      "coverage/",
      "**/*.min.js",
    ],
  },

  // TypeScript rules (scoped to TS files where the plugin is loaded)
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // React rules (all JS/TS files)
  {
    rules: {
      "react/no-unescaped-entities": "off",
    },
  },

  // Prettier compat (must be last to disable conflicting rules)
  prettierConfig,
];
