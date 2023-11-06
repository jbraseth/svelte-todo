import { defineConfig } from "@playwright/test";

import { HEADLESS } from "./src/playwright/constants"

export default defineConfig({
  use: {
    headless: HEADLESS,
    viewport: { width: 1280, height: 720 },
  },
});
