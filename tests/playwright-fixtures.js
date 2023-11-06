import { test as baseTest } from "@playwright/test";

import { PAGE_TIMEOUT, URI } from "../src/playwright/constants"

export const test = baseTest.extend({
  todosPage: async ({ page }, use) => {
    page.setDefaultTimeout(PAGE_TIMEOUT);
    await page.goto(URI);
    await use(page);
  },
});
