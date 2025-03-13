document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const allFilterBtn = document.getElementById('all');
    const completedFilterBtn = document.getElementById('completed');
    const pendingFilterBtn = document.getElementById('pending');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderTasks(tasksToRender) {
        taskList.innerHTML = '';
        tasksToRender.forEach(task => {
            const li = document.createElement('li');
            li.classList.toggle('completed', task.completed);

            li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <button class="delete">❌</button>
            `;

            const deleteButton = li.querySelector('.delete');
            deleteButton.addEventListener('click', () => {
                deleteTask(task.id);
            });

            li.addEventListener('click', () => {
                toggleTaskCompletion(task.id);
            });

            taskList.appendChild(li);
        });
    }

    function addTask(text) {
        const task = {
            id: Date.now(),
            text,
            completed: false
        };
        tasks.push(task);
        saveTasks();
        renderTasks(tasks);
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks(tasks);
    }

    function toggleTaskCompletion(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks(tasks);
        }
    }

    function filterTasks(filter) {
        let filteredTasks = tasks;
        if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        } else if (filter === 'pending') {
            filteredTasks = tasks.filter(task => !task.completed);
        }
        renderTasks(filteredTasks);
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Add Task
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    // Keyboard Shortcuts
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const taskText = taskInput.value.trim();
            if (taskText) {
                addTask(taskText);
                taskInput.value = '';
            }
        }
    });

    // Filter Buttons
    allFilterBtn.addEventListener('click', () => {
        allFilterBtn.classList.add('active');
        completedFilterBtn.classList.remove('active');
        pendingFilterBtn.classList.remove('active');
        filterTasks('all');
    });

    completedFilterBtn.addEventListener('click', () => {
        completedFilterBtn.classList.add('active');
        allFilterBtn.classList.remove('active');
        pendingFilterBtn.classList.remove('active');
        filterTasks('completed');
    });

    pendingFilterBtn.addEventListener('click', () => {
        pendingFilterBtn.classList.add('active');
        allFilterBtn.classList.remove('active');
        completedFilterBtn.classList.remove('active');
        filterTasks('pending');
    });

    // Initial Render
    renderTasks(tasks);
});
