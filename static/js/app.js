const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Fetch tasks from server
async function fetchTasks() {
  const response = await fetch('/tasks');
  const tasks = await response.json();
  displayTasks(tasks);
}

// Display tasks in the list
function displayTasks(tasks) {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = task.important ? 'important' : '';
    taskItem.innerHTML = `
      <span>${task.text}</span>
      <button onclick="editTask(${task.id})">Edit</button>
      <button onclick="toggleImportant(${task.id})">${task.important ? 'Unstar' : 'Star'}</button>
      <button onclick="deleteTask(${task.id})">Remove</button>
    `;
    taskList.appendChild(taskItem);
  });
}

// Add a new task
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newTask = { text: taskInput.value };
  await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask),
  });
  taskInput.value = '';
  fetchTasks();
});

// Edit a task
async function editTask(id) {
  const newText = prompt('Edit your task:');
  if (newText) {
    await fetch(`/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newText }),
    });
    fetchTasks();
  }
}

// Toggle importance
async function toggleImportant(id) {
  const task = (await (await fetch('/tasks')).json()).find(t => t.id === id);
  await fetch(`/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ important: !task.important }),
  });
  fetchTasks();
}

// Delete a task
async function deleteTask(id) {
  await fetch(`/tasks/${id}`, { method: 'DELETE' });
  fetchTasks();
}

// Initial fetch
fetchTasks();
