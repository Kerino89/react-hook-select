/// <reference types="vitest" />

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    coverage: { include: ["src/**/*.{tsx,ts}"] },
    alias: {
      "@hooks": new URL("./src/hooks/", import.meta.url).pathname,
      "@helpers": new URL("./src/helpers/", import.meta.url).pathname,
    },
  },
});
