function Task(title, priority, dueDate) {
    this.id = Date.now() + Math.random();
    this.title = title;
    this.priority = priority;
    this.dueDate = dueDate;
    this.completed = false;
}

Task.prototype.toggleComplete = function() {
    this.completed = !this.completed;
};

const tasks = [];

function showTaskForm() {
    document.getElementById("taskForm").style.display = "block";
}

function hideTaskForm() {
    document.getElementById("taskForm").style.display = "none";
}

function addTask() {
    const title = document.getElementById("taskTitle").value;
    const priority = document.getElementById("taskPriority").value;
    const dueDate = document.getElementById("taskDueDate").value;

    if (title === "") {
        alert("Please enter a task name.");
        return;
    }

    if (dueDate === "") {
        alert("Please select a due date.");
        return;
    }

    const task = new Task(title, priority, dueDate);
    tasks.push(task);
    saveTasks();
    renderTasks();
    updateSummary();

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskPriority").value = "High";
    document.getElementById("taskDueDate").value = "";

    hideTaskForm();
}

function saveTasks() {
    localStorage.setItem("waymark_tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const stored = localStorage.getItem("waymark_tasks");

    if (stored) {
        const savedTasks = JSON.parse(stored);

        savedTasks.forEach(function(taskData) {
            const task = new Task(taskData.title, taskData.priority, taskData.dueDate);
            task.id = taskData.id;
            task.completed = taskData.completed;
            tasks.push(task);
        });
    }
}

function updateSummary() {
    const completed = tasks.filter(function(task) {
        return task.completed;
    });

    const pending = tasks.filter(function(task) {
        return !task.completed;
    });

    const high = tasks.filter(function(task) {
        return task.priority === "High";
    });

    document.getElementById("totalTasks").textContent = tasks.length;
    document.getElementById("pendingTasks").textContent = pending.length;
    document.getElementById("completedTasks").textContent = completed.length;
    document.getElementById("highTasks").textContent = high.length;
}

function renderTasks() {
    const container = document.getElementById("taskListContainer");
    const searchText = document.getElementById("searchTask").value.toLowerCase();
    const filter = document.getElementById("filterTask").value;
    const sort = document.getElementById("sortTask").value;

    let filteredTasks = tasks.filter(function(task) {
        return task.title.toLowerCase().includes(searchText);
    });

    if (filter === "pending") {
        filteredTasks = filteredTasks.filter(function(task) {
            return !task.completed;
        });
    }

    if (filter === "completed") {
        filteredTasks = filteredTasks.filter(function(task) {
            return task.completed;
        });
    }

    if (filter === "high") {
        filteredTasks = filteredTasks.filter(function(task) {
            return task.priority === "High";
        });
    }

    if (sort === "date") {
        filteredTasks.sort(function(a, b) {
            return a.dueDate.localeCompare(b.dueDate);
        });
    }

    if (sort === "name") {
        filteredTasks.sort(function(a, b) {
            return a.title.localeCompare(b.title);
        });
    }

    if (sort === "priority") {
        const priorityOrder = {
            High: 1,
            Medium: 2,
            Low: 3
        };

        filteredTasks.sort(function(a, b) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }

    container.innerHTML = "";

    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div id="noTasksMsg">
                No Tasks Found!
            </div>
        `;
        return;
    }

    filteredTasks.forEach(function(task) {
        const row = document.createElement("div");

        row.style.cssText = "display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid #eee;";

        row.innerHTML = `
            <div>
                <span style="${task.completed ? "text-decoration:line-through;color:gray;" : ""}">
                    ${task.title}
                </span>
                <small style="margin-left:10px;color:gray;">
                    ${task.priority}
                </small>
                <small style="margin-left:10px;color:gray;">
                    Due: ${task.dueDate}
                </small>
            </div>
            <div style="display:flex;gap:5px;">
                <button class="completeBtn" data-id="${task.id}" style="border-radius:4px;width:30px;height:30px;padding:0;margin:0;box-sizing:border-box;">
                    ${task.completed ? "↩" : "✓"}
                </button>
                <button class="deleteBtn" data-id="${task.id}" style="border-radius:4px;width:30px;height:30px;padding:0;margin:0;box-sizing:border-box;">
                    X
                </button>
            </div>
        `;

        container.appendChild(row);
    });

    addButtonEvents();
}

function addButtonEvents() {
    document.querySelectorAll(".completeBtn").forEach(function(button) {
        button.addEventListener("click", function() {
            const id = button.dataset.id;

            const task = tasks.find(function(task) {
                return task.id == id;
            });

            if (task) {
                task.toggleComplete();
                saveTasks();
                renderTasks();
                updateSummary();
            }
        });
    });

    document.querySelectorAll(".deleteBtn").forEach(function(button) {
        button.addEventListener("click", function() {
            const id = button.dataset.id;

            const index = tasks.findIndex(function(task) {
                return task.id == id;
            });

            if (index !== -1) {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
                updateSummary();
                updatePriorityCounts();
            }
        });
    });
}

document.getElementById("addTaskBtn").addEventListener("click", showTaskForm);
document.getElementById("saveTaskBtn").addEventListener("click", addTask);
document.getElementById("cancelTaskBtn").addEventListener("click", hideTaskForm);
document.getElementById("searchTask").addEventListener("input", renderTasks);
document.getElementById("filterTask").addEventListener("change", renderTasks);
document.getElementById("sortTask").addEventListener("change", renderTasks);

loadTasks();
renderTasks();
updateSummary();