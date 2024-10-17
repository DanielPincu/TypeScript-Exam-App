import { Selector } from 'testcafe';

fixture('Todo')
    .page('http://localhost:5173/todo/');

test('Delete all function', async t => {
    const todoInput = Selector('#todo-input');
    const submitButton = Selector('#submit');
    const deleteAllButton = Selector('#delete-all');
    const noTasksMessage = Selector('#no-tasks-message');

    
    // Arrange Ensure "Delete All" button is hidden and "No tasks available." message is visible
    await t
        .expect(deleteAllButton.visible).notOk()  // "Delete All" should not be visible when no todos are present
        .expect(noTasksMessage.visible).ok() // "No tasks available." should be visible when there are no todos
        .wait(1000);    
        
    await t
        .typeText(todoInput, 'Learn TestCafé')
        .click(submitButton)
        .wait(1000);

    await t
        .expect(deleteAllButton.visible).ok()      // "Delete All" should be visible after adding a todo
        .expect(noTasksMessage.exists).notOk();    // "No tasks available." should be hidden after adding a todo

    // Act - Click the Delete All button
    await t
        .click(deleteAllButton)
        .wait(1000);

    // Assert - After deleting the todo, check that "Delete All" is hidden and "No tasks available" is visible again
    await t
        .expect(deleteAllButton.visible).notOk()  // "Delete All" should be hidden again
        .expect(noTasksMessage.visible).ok()     // "No tasks available." should be visible again
        .wait(1000);
});
