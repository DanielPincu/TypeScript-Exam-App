import { Selector } from "testcafe";

fixture('Todo').page('http://localhost:5173/');

test('Add todo', async t => {
    
    await t
        // Arrange
        .typeText(Selector('#todo-input'), 'Change the world')
        
        // Act
        .click('#submit')
        .wait(1000)

        // Assert
        .expect(Selector('#todo-list li').nth(-1).innerText).contains('Change the world')
});

test ('Edit todo', async t => { 
    await t

        // Arrange
        .typeText(Selector('#todo-input'), 'Change the world')
        .click('#submit')
        .wait(1000)

        // Act
        .click('#edit-button')
        .typeText(Selector('#edit-input'), 'Do not change the world', { replace: true })
        .click('#save-button')
        .wait(1000)

        // Assert
        .expect(Selector('#todo-list li').nth(-1).innerText).contains('Do not change the world')
});
