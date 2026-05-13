import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintProjectRulesPlugin from "./tools/dev/index.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    // Default ignores of eslint-config-next:
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/next-env.d.ts",
    "**/node_modules/**",
  ]),
  {
    plugins: {
      "front-end": {
        rules: eslintProjectRulesPlugin.customRules,
      },
    },
    rules: {
      "front-end/use-conventional-component": [
        "error",
        {
          forbidden: {
            Button: "Button",
          },
        },
      ],
      ...eslintProjectRulesPlugin.rules,
      "@next/next/no-html-link-for-pages": "off",
      "react-hooks/set-state-in-effect": "off",
      "no-console": [
        "error",
        {
          allow: ["error"],
        },
      ],
    },
  },
]);

export default eslintConfig;
