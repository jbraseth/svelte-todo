import { getTodos, getCheckboxes } from "./todos-locators";

export async function deleteTodos(page) {
  const todos = getTodos(page);
  const todosCount = await todos.count();
  for (let i = 0; i < todosCount; i++) {
    // Delete list in place
    await todos.first().getByRole("button", { name: "Delete" }).click();
  }
}

export async function addTodos(page) {
  const todos = [
    "Create a Svelte starter app",
    "Create your first component",
    "Complete the rest of the tutorial",
  ];
  for (const todo of todos) {
    await page
      .getByRole("textbox", { name: "What needs to be done?" })
      .fill(todo);
    await page.getByRole("button", { name: "Add" }).click();
  }
}

export async function uncheckAllTodos(checkboxes) {
  const total = await checkboxes.count();
  for (let i = 0; i < total; i++) await checkboxes.nth(i).uncheck();
}

export async function checkTodos(page, n) {
  const checkboxes = getCheckboxes(page);
  await uncheckAllTodos(checkboxes);

  // Check a certain number of to-dos
  for (let i = 0; i < n; i++) await checkboxes.nth(i).check();
}
