// Wait until DOM is loaded before accessing/manipulating elements
document.addEventListener('DOMContentLoaded', function () {

  // Select important DOM elements
  const addButton = document.getElementById('add-task-btn');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const clearAllButton = document.getElementById('clear-all-btn');
  const emptyState = document.getElementById('empty-state');

  // Helper: update empty-state visibility
  function refreshEmptyState() {
    emptyState.style.display = taskList.children.length === 0 ? 'block' : 'none';
  }

  // Persist current tasks to localStorage
  function saveTasks() {
    const tasks = Array.from(taskList.children).map(li => li.querySelector('.text').textContent);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Rebuild tasks from storage
  function loadTasks() {
    const stored = JSON.parse(localStorage.getItem('tasks') || '[]');
    stored.forEach(text => {
      createTaskItem(text);
    });
    refreshEmptyState();
  }

  // Create a single task list item (does not trigger alerts)
  function createTaskItem(taskText) {
    const li = document.createElement('li');
    li.className = 'task-item';

    // Task text container
    const span = document.createElement('span');
    span.className = 'text';
    span.textContent = taskText;

    // Remove button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className = 'remove-btn';
    removeButton.setAttribute('aria-label', `Remove task: ${taskText}`);
    removeButton.dataset.action = 'remove'; // for delegation

    li.appendChild(span);
    li.appendChild(removeButton);
    taskList.appendChild(li);
  }

  // Add task logic (called from UI)
  function addTask() {
    const taskText = taskInput.value.trim();

    // Prevent empty input
    if (taskText === '') {
      alert('Please enter a task.'); 
      return;
    }

    // Prevent duplicates
    const existing = Array.from(taskList.children).map(li => li.querySelector('.text').textContent);
    if (existing.includes(taskText)) {
      alert('This task already exists.');
      return;
    }

    // Create and attach
    createTaskItem(taskText);

    // Clear & refocus
    taskInput.value = '';
    taskInput.focus();

    // Persist & update UI
    saveTasks();
    refreshEmptyState();
  }

  // Event delegation for remove buttons
  taskList.addEventListener('click', function (e) {
    if (e.target && e.target.dataset.action === 'remove') {
      const li = e.target.closest('li');
      if (!li) return;
      const text = li.querySelector('.text')?.textContent || '';
      // Optional confirmation
      if (confirm(`Delete task: "${text}"?`)) {
        li.remove();
        saveTasks();
        refreshEmptyState();
      }
    }
  });

  // Click handler for Add button
  addButton.addEventListener('click', function () {
    addTask();
  });

  // Keydown for Enter on input
  taskInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      addTask();
    }
  });

  // Clear all tasks
  clearAllButton.addEventListener('click', function () {
    if (taskList.children.length === 0) return;
    if (confirm('Remove all tasks?')) {
      taskList.innerHTML = '';
      saveTasks();
      refreshEmptyState();
    }
  });

  // Initial load from persistence
  loadTasks();
});
