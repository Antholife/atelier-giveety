import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";
import useConventionalComponent from "./eslint/use-conventional-component.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/next-env.d.ts",
    "**/node_modules/**",
  ]),
  {
    plugins: {
      "design-kit": {
        rules: {
          "use-conventional-component": useConventionalComponent,
        },
      },
    },
    rules: {
      "design-kit/use-conventional-component": [
        "error",
        {
          forbidden: {
            Button: "Button",
          },
        },
      ],
      "object-curly-spacing": ["error", "always"],
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
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
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
