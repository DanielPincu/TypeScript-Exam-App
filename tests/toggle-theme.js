import { Selector } from 'testcafe';

fixture('Background Toggle Test').page('https://test.danielpincu.dk/todo/');

test('Toggle background color', async t => {
    await t
        // Arrange - Check the initial background color is white
        .expect(Selector('#container').hasClass('bg-white')).ok('Initial background should be white')
        .wait(500) 
        
        // Act - Click the toggle button
        .click('#toggle')
        .wait(500) 

        // Assert - Background should now be black
        .expect(Selector('#container').hasClass('bg-black')).ok('Background should be black after toggle')
        
        // Act - Click the toggle button again to revert to white
        .click('#toggle')
        .wait(500) 

        // Assert - Background should now be white again
        .expect(Selector('#container').hasClass('bg-white')).ok('Background should revert to white after second toggle');
});
