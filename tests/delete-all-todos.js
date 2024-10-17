import { Selector } from "testcafe";

fixture('Delete All Todos').page('http://localhost:5173/todo/');

test('Delete all todos', async t => {

    await t
        // Arrange - Add a new todo
        .typeText(Selector('#todo-input'), 'Learn TestCafe')
        .click('#submit')
        .wait(1000)

        // Assert - Ensure the todo is added
        .expect(Selector('#todo-list li').innerText).contains('Learn TestCafe')

        // Act - Click the "Delete All" button
        .click('#delete-all')
        .wait(1000)

        // Assert - Ensure all todos are deleted and "No tasks available" message is visible
        .expect(Selector('#no-tasks-message').visible).ok();  // "No tasks available" message should appear
});
