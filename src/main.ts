import './style.css';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  important: boolean;
}

let todos: Todo[] = loadTodosFromLocalStorage();
let editingTodoId: number | null = null;
let currentFilter: Filter = 'all';

const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const todoForm = document.querySelector('form') as HTMLFormElement;
const addButton = todoForm.querySelector('button[type="submit"]') as HTMLButtonElement;
const errorMessage = document.getElementById('error-message') as HTMLElement;
const filterButtons = document.getElementById('filter-buttons') as HTMLElement;
const deleteAllButton = document.getElementById('delete-all') as HTMLButtonElement;

type Filter = 'all' | 'completed' | 'incomplete' | 'important';

// Load todos from localStorage
function loadTodosFromLocalStorage(): Todo[] {
  return JSON.parse(localStorage.getItem('todos') || '[]');
}

// Save todos to localStorage
function saveTodosToLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// Filter todos based on the current filter
function filterTodos(todos: Todo[]): Todo[] {
  switch (currentFilter) {
    case 'completed': return todos.filter(todo => todo.completed);
    case 'incomplete': return todos.filter(todo => !todo.completed);
    case 'important': return todos.filter(todo => todo.important);
    default: return todos;
  }
}

// Create a button element
function createButton(text: string, className: string, onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.textContent = text;
  button.className = className;
  button.onclick = onClick;
  return button;
}

// Update the todo list based on the current filter
function updateTodoList() {
  todoList.innerHTML = '';
  const filteredTodos = filterTodos(todos);

  // Toggle visibility of the "Delete All Todos" button based on todos length
  if (todos.length === 0) {
    deleteAllButton.classList.add('hidden');  // Hide the button if there are no todos
  } else {
    deleteAllButton.classList.remove('hidden');  // Show the button if there are todos
  }

  // If no todos exist, show the "No tasks available" message
  if (filteredTodos.length === 0) {
    const message = document.createElement('li');
    message.id = 'no-tasks-message';  // Add ID for TestCafé
    message.className = 'p-4 border-gray-300 border-2 rounded-lg shadow-sm bg-gray-200 text-center text-gray-500';
    message.textContent =
      currentFilter === 'completed'
        ? 'No completed tasks.'
        : currentFilter === 'incomplete'
        ? 'No incomplete tasks.'
        : currentFilter === 'important'
        ? 'Nothing important at the moment.'
        : 'No tasks available.';
    todoList.appendChild(message);
    return;
  }

  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `p-4 border-gray-300 border-2 rounded-lg shadow-sm ${todo.completed ? 'bg-green-200 line-through' : todo.important ? 'bg-yellow-100' : 'bg-gray-200'}`;

    const titleElement = document.createElement('div');
    titleElement.className = 'text-lg border-black text-blue-800';

    if (editingTodoId === todo.id) {
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = todo.title;
      editInput.id = 'edit-input';
      editInput.className = 'edit-input text-lg flex-1 text-gray-700 px-2 py-1 border rounded-lg w-full';
      titleElement.appendChild(editInput);
      editInput.focus();

      editInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') saveTodoTitle(todo.id, editInput.value.trim());
      });

      editInput.onblur = () => saveTodoTitle(todo.id, editInput.value.trim());
    } else {
      titleElement.textContent = todo.title;
    }

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'flex space-x-2 justify-center';

    if (editingTodoId === todo.id) {
      const saveButton = createButton(
        'Save',
        'bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600',
        () => saveTodoTitle(todo.id, (titleElement.querySelector('input') as HTMLInputElement).value.trim())
      );
      saveButton.id = 'save-button';  // Set an ID for the button
      buttonGroup.append(saveButton);
    } else {
      if (!todo.completed) {
        buttonGroup.append(
          createButton(
            'Mark as Done',
            'bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600',
            () => toggleTodoProperty(todo.id, 'completed')
          )
        );

        const editButton = createButton(
          'Edit',
          'bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600',
          () => {
            editingTodoId = todo.id;
            updateTodoList();
          }
        );
        editButton.id = 'edit-button';  // Set the ID for "Edit" button
        buttonGroup.append(editButton);

        buttonGroup.append(
          createButton(
            todo.important ? 'Unmark Important' : 'Mark Important',
            'bg-blue-500 text-white px-10 py-1 rounded-lg hover:bg-blue-600',
            () => toggleTodoProperty(todo.id, 'important')
          )
        );
      } else {
        buttonGroup.append(
          createButton(
            'Undo',
            'bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600',
            () => toggleTodoProperty(todo.id, 'completed')
          )
        );
      }

      buttonGroup.append(
        createButton(
          'Remove',
          'bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600',
          () => removeTodoById(todo.id)
        )
      );
    }

    li.append(titleElement, buttonGroup);
    todoList.appendChild(li);
  });

  updateAddButton();
}

// Save the title of a todo
function saveTodoTitle(id: number, newTitle: string) {
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.title = newTitle;
    editingTodoId = null;
    saveTodosToLocalStorage();
    updateTodoList();
  }
}

// Toggle the completed or important status of a todo
function toggleTodoProperty(id: number, property: 'completed' | 'important') {
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    if (property === 'completed') {
      todo.completed = !todo.completed;
      if (todo.completed) {
        todo.important = false;
      }
    } else if (property === 'important') {
      todo.important = !todo.important;
    }
    saveTodosToLocalStorage();
    updateTodoList();
  }
}

// Add a new todo
function updateTodoTitle() {
  todos.push({ id: Date.now(), title: todoInput.value.trim(), completed: false, important: false });
  todoInput.value = '';
  saveTodosToLocalStorage();
  updateTodoList();
}

// Update the state of the add button
function updateAddButton() {
  const isEditing = editingTodoId !== null;
  todoInput.disabled = isEditing;
  addButton.disabled = isEditing;
  addButton.className = isEditing
    ? 'bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed'
    : 'bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600';
}

// Remove a todo by its ID
function removeTodoById(id: number) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodosToLocalStorage();
  updateTodoList();
}

// Handle form submission
todoForm.onsubmit = (event) => {
  event.preventDefault();
  const text = todoInput.value.trim();
  if (!text) {
    errorMessage.style.display = 'block';
    return;
  }
  errorMessage.style.display = 'none';
  updateTodoTitle();
};

// Handle filter button clicks
filterButtons.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('filter-btn')) {
    currentFilter = target.getAttribute('data-filter') as Filter;
    updateTodoList();
    updateFilterButtons();
  }
});

// Update filter button styles based on the current filter
function updateFilterButtons() {
  filterButtons.querySelectorAll('.filter-btn').forEach(button => {
    button.classList.toggle('bg-blue-700', button.getAttribute('data-filter') === currentFilter);
    button.classList.toggle('bg-blue-500', button.getAttribute('data-filter') !== currentFilter);
  });
}

// Initialize filter button styles on page load
function initializeFilterButtons() {
  updateFilterButtons();
}

// Get the container and toggle button elements
const containerDiv = document.querySelector('.container') as HTMLElement;
const toggleButton = document.getElementById('toggle') as HTMLButtonElement;

// Load background state from localStorage on page load
function loadBackgroundState() {
  const savedBackground = localStorage.getItem('backgroundColor');
  if (savedBackground) {
    containerDiv.classList.remove('bg-white', 'bg-black');
    containerDiv.classList.add(savedBackground);
  }
}

// Toggle background color and save the state to localStorage
toggleButton.addEventListener('click', () => {
  const isWhiteBackground = containerDiv.classList.contains('bg-white');
  containerDiv.classList.toggle('bg-white', !isWhiteBackground);
  containerDiv.classList.toggle('bg-black', isWhiteBackground);

  // Save the new background color state to localStorage
  const newBackground = isWhiteBackground ? 'bg-black' : 'bg-white';
  localStorage.setItem('backgroundColor', newBackground);
});

// Initialize by loading the saved background state
loadBackgroundState();



// Initialize the app on load
initializeFilterButtons();
updateTodoList();

// Add event listener for the "Delete All Todos" button
deleteAllButton.addEventListener('click', () => {
  todos = [];
  saveTodosToLocalStorage();
  updateTodoList();
});
