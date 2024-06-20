import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintPluginVitest from "eslint-plugin-vitest";
import { fixupPluginRules } from "@eslint/compat";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    plugins: {
      vitest: fixupPluginRules(eslintPluginVitest),
    },
    rules: {
      ...eslintPluginVitest.configs.recommended.rules,
    },
    files: ["test/**/*.ts"],
  },
  {
    plugins: {
      react: fixupPluginRules(eslintPluginReact),
      "react-hooks": fixupPluginRules(eslintPluginReactHooks),
    },
    rules: {
      ...eslintPluginReact.configs.recommended.rules,
      ...eslintPluginReactHooks.configs.recommended.rules,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    files: ["src/**/*.ts"],
    ignores: ["**/*.config.js", "!**/eslint.config.js", "node_modules", "coverage", "dist"],
  },
  eslintPluginPrettierRecommended,
);
