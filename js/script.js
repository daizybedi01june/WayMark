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

function addTask() {
    const title = prompt("Enter task name:");
    if (!title) {
        return;
    }
    const priority = prompt("Enter priority:\n1. High\n2. Medium\n3. Low");
    let selectedPriority;
    if (priority === "1") {
        selectedPriority = "High";
    } else if (priority === "2") {
        selectedPriority = "Medium";
    } else if (priority === "3") {
        selectedPriority = "Low";
    } else {
        alert("Please enter 1, 2 or 3.");
        return;
    }
    const dueDate = prompt("Enter due date:");
    const task = new Task(title, selectedPriority, dueDate);
    tasks.push(task);
    renderTasks();
    updatePriorityCounts();
}

function renderTasks() {
    const container = document.getElementById("taskListContainer");
    container.innerHTML = "";
    if (tasks.length === 0) {
        container.innerHTML = `<div id="noTasksMsg">No Tasks Planned For Today!</div>`;
        return;
    }
    for (const task of tasks) {
        const row = document.createElement("div");
        row.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:8px 12px; border-bottom:1px solid #eee;";
        row.innerHTML = `
            <div>
                <span style="${task.completed ? "text-decoration:line-through;color:gray;" : ""}">
                    ${task.title}
                </span>
                <small style="margin-left:10px;color:gray;">
                    ${task.priority}
                </small>
                <small style="margin-left:10px;color:gray;">
                    ${task.dueDate}
                </small>
            </div>
            <button class="completeBtn" data-id="${task.id}" style="border-radius:4px;">
                ${task.completed ? "↩" : "✓"}
            </button>`;
        container.appendChild(row);
    }
    document.querySelectorAll(".completeBtn").forEach(button => {
        button.addEventListener("click", () => {
            const task = tasks.find(task => task.id == button.dataset.id);
            task.toggleComplete();
            renderTasks();
            updatePriorityCounts();
        });
    });
}

function updatePriorityCounts() {
    const highTasks = tasks.filter(task => task.priority === "High");
    const mediumTasks = tasks.filter(task => task.priority === "Medium");
    const lowTasks = tasks.filter(task => task.priority === "Low");

    const highCompleted = highTasks.filter(task => task.completed);
    const mediumCompleted = mediumTasks.filter(task => task.completed);
    const lowCompleted = lowTasks.filter(task => task.completed);

    document.getElementById("priorityCompleted").textContent = highCompleted.length;
    document.getElementById("priorityTotal").textContent = highTasks.length;

    document.getElementById("mediumCompleted").textContent = mediumCompleted.length;
    document.getElementById("mediumTotal").textContent = mediumTasks.length;

    document.getElementById("lowCompleted").textContent = lowCompleted.length;
    document.getElementById("lowTotal").textContent = lowTasks.length;
}

document.getElementById("addTaskBtn").addEventListener("click", addTask);

renderTasks();
updatePriorityCounts();

