const STORAGE_KEY = 'todo-app-tasks';

function loadTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error('Could not parse saved tasks, starting fresh.', e);
        return [];
    }
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

let tasks = loadTasks();

function render() {
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.dataset.id = task.id;

        const taskSpan = document.createElement('span');
        taskSpan.textContent = task.text;
        if (task.completed) taskSpan.classList.add('completed');
        taskSpan.title = 'Double click to edit';
        taskSpan.ondblclick = () => startEdit(task.id, listItem, taskSpan);

        const completeButton = document.createElement('button');
        completeButton.innerHTML = '&#9989;';
        completeButton.onclick = () => toggleTask(task.id);

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-btn';
        removeButton.onclick = () => removeTask(task.id);

        listItem.appendChild(completeButton);
        listItem.appendChild(taskSpan);
        listItem.appendChild(removeButton);
        taskList.appendChild(listItem);
    });

    emptyState.hidden = tasks.length !== 0;
}

function startEdit(id, listItem, taskSpan) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = taskSpan.textContent;

    listItem.replaceChild(input, taskSpan);
    input.focus();
    input.select();

    let finished = false;
    const commit = () => {
        if (finished) return;
        finished = true;
        const newText = input.value.trim();
        const task = tasks.find(t => t.id === id);
        if (task && newText !== '') {
            task.text = newText;
            saveTasks();
        }
        render();
    };
    const cancel = () => {
        if (finished) return;
        finished = true;
        render();
    };

    input.addEventListener('blur', commit);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') cancel();
    });
}

function addTask() {
    const taskInput = document.getElementById('task-input');
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task');
        return;
    }

    tasks.push({
        id: Date.now().toString(),
        text: taskText,
        completed: false
    });

    saveTasks();
    render();

    taskInput.value = '';
    taskInput.focus();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        render();
    }
}

function removeTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
}

document.addEventListener('DOMContentLoaded', () => {
    render();

    const taskInput = document.getElementById('task-input');
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTask();
    });
});