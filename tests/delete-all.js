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
        .expect(noTasksMessage.visible).ok({timeout: 1000}) // "No tasks available." should be visible when there are no todos
        .wait(1000)  
        
  
        .typeText(todoInput, 'Learn TestCafé')
        .click(submitButton)
        .wait(1000)

   
        .expect(deleteAllButton.visible).ok({timeout: 1000})      // "Delete All" should be visible after adding a todo
        .expect(noTasksMessage.exists).notOk()    // "No tasks available." should be hidden after adding a todo

   
        .click(deleteAllButton)
        .wait(1000)

    
        .expect(deleteAllButton.visible).notOk()  // "Delete All" should be hidden again
        .expect(noTasksMessage.visible).ok()     // "No tasks available." should be visible again
        .wait(1000);
});
