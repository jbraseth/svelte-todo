export function getTodos(page) {
  return page
    .locator("ul.todo-list li")
    .filter({ has: page.getByRole("checkbox") });
}

export function getCheckboxes(page) {
  return page.locator("ul.todo-list li").getByRole("checkbox");
}

export async function countCompletedTodos(page) {
  const checkboxes = getCheckboxes(page);
  let checkedCount = 0;
  const totalCheckboxes = await checkboxes.count();

  for (let i = 0; i < totalCheckboxes; i++) {
    if (await checkboxes.nth(i).isChecked()) {
      checkedCount++;
    }
  }

  return checkedCount;
}
