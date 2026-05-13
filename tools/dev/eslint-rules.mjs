/**
 * Shared ESLint rules for Front-end frontend
 * Imported by root eslint.config.mjs
 */

export const frontEndRules = {
  // Code style
  "object-curly-spacing": ["error", "always"],

  // TypeScript strict
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    },
  ],

  "max-depth": ["warn", { max: 3 }],
  "max-nested-callbacks": ["warn", { max: 3 }],

  // React best practices
  "react-hooks/rules-of-hooks": "error",
  "react-hooks/exhaustive-deps": "warn",
};
