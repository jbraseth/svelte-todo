import { expect } from "@playwright/test";

import { test } from "./playwright-fixtures";
import {
  getTodos,
  getCheckboxes,
  countCompletedTodos,
} from "../src/playwright/todos-locators";
import {
  deleteTodos,
  addTodos,
  checkTodos,
  uncheckAllTodos,
} from "../src/playwright/todos-helpers";

// Setup each test with 2/3 completed To-Dos
test.beforeAll(async ({ todosPage }) => {
  await deleteTodos(todosPage);
  await addTodos(todosPage);
  await checkTodos(todosPage, 2);
});

test("smoke test", async ({ todosPage }) => {
  const title = await todosPage.title();
  expect(title).toBe("Svelte to-do list");
});

test.describe("todos features", () => {
  test("delete", async ({ todosPage }) => {
    await deleteTodos(todosPage);
    expect(await todosPage.getByText("Nothing to do here!").isVisible());
  });

  test("add", async ({ todosPage }) => {
    await addTodos(todosPage);
    expect(await todosPage.locator("ul.todo-list li").count()).toBe(5);
  });

  test("check", async ({ todosPage }) => {
    await checkTodos(todosPage, 1);
    expect(await countCompletedTodos(todosPage)).toBe(1);
  });

  test("status", async ({ todosPage }) => {
    const checkboxes = getCheckboxes(todosPage);
    const total = await checkboxes.count();

    await uncheckAllTodos(checkboxes);

    // Verify status feature reports accurate count with each iteration
    for (let i = 0; i <= total; i++) {
      // Using poll and toBe rather than toHaveText due to racey DOM flakiness
      await expect
        .poll(() => todosPage.locator("#list-heading").textContent())
        .toBe(`${i} out of ${total} items completed`);

      if (i < total) await checkboxes.nth(i).check();
    }
  });

  // Depends on working status feature
  // Assume 2 out of 3 items completed
  test("filter", async ({ todosPage }) => {
    const filters = await todosPage.locator("div.filters");

    // Filter by all
    await filters.getByRole("button", { name: "All" }).click();
    expect(await getTodos(todosPage).count()).toBe(2);

    // Filter by active
    await filters.getByRole("button", { name: "Active" }).click();
    expect(await getTodos(todosPage).count()).toBe(1);

    // Filter by completed
    await filters.getByRole("button", { name: "Completed" }).click();
    expect(await getTodos(todosPage).count()).toBe(1);
  });
});

test.describe("more actions", async () => {
  test("remove completed", async ({ todosPage }) => {
    await todosPage.getByRole("button", { name: "Remove completed" }).click();
    expect(await getTodos(todosPage).count()).toBe(1);
  });

  test("check all/uncheck all", async ({ todosPage }) => {
    await todosPage.getByRole("button", { name: "Check all" }).click();
    expect(await countCompletedTodos(todosPage)).toBe(2);
    await todosPage.getByRole("button", { name: "Uncheck all" }).click();
    expect(await countCompletedTodos(todosPage)).toBe(0);
  });
});
