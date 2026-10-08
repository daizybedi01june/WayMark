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
    updatePriorityCounts();
    updateDashboardCards();
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskPriority").value = "High";
    document.getElementById("taskDueDate").value = "";
    hideTaskForm();
}

function renderTasks() {
    const container = document.getElementById("taskListContainer");
    container.innerHTML = "";
    if (tasks.length === 0) {
        container.innerHTML = `<div id="noTasksMsg">No Tasks Planned!</div>`;
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
            <div style="display:flex; gap:5px;">
                <button class="completeBtn" data-id="${task.id}" style="border-radius:4px; width:30px; height:30px; padding:0; margin:0; box-sizing:border-box;">
                    ${task.completed ? "↩" : "✓"}
                </button>
                <button class="deleteBtn" data-id="${task.id}" style="border-radius:4px; width:30px; height:30px; padding:0; margin:0; box-sizing:border-box;">
                    X
                </button>
            </div>`;
        container.appendChild(row);
    }
    document.querySelectorAll(".completeBtn").forEach(button => {
        button.addEventListener("click", () => {
            const task = tasks.find(task => task.id == button.dataset.id);
            task.toggleComplete();
            saveTasks();
            renderTasks();
            updatePriorityCounts();
            updateDashboardCards();
        });
    });
    document.querySelectorAll(".deleteBtn").forEach(button => {
        button.addEventListener("click", () => {
            const taskId = button.dataset.id;
            const taskIndex = tasks.findIndex(
                task => task.id == taskId
            );
            if (taskIndex !== -1) {
                tasks.splice(taskIndex, 1);
                saveTasks();
                renderTasks();
                updatePriorityCounts();
                updateDashboardCards();
            }
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

function updateDashboardCards() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(function(task) {
        return task.completed;
    }).length;
    const inProgressTasks = tasks.filter(function(task) {
        return !task.completed;
    }).length;
    const today = new Date().toISOString().split("T")[0];
    const dueTasks = tasks.filter(function(task) {
        return task.dueDate === today && !task.completed;
    }).length;

    document.getElementById("dashboardTotalTasks").textContent = totalTasks;
    document.getElementById("dashboardPendingTasks").textContent = inProgressTasks;
    document.getElementById("dashboardCompletedTasks").textContent = completedTasks;
    document.getElementById("dashboardDueTasks").textContent = dueTasks;
}

function saveTasks() {
    localStorage.setItem("waymark_tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const stored = localStorage.getItem("waymark_tasks");
    if (stored) {
        const savedTasks = JSON.parse(stored);
        savedTasks.forEach(taskData => {
            const task = new Task(
                taskData.title,
                taskData.priority,
                taskData.dueDate
            );
            task.id = taskData.id;
            task.completed = taskData.completed;
            tasks.push(task);
        });
    }
}

function loadQuoteXHR() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://motivational-spark-api.vercel.app/api/quotes/random', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const subtitle = document.querySelector('.mainpage p[style*="gray"]');
            if (subtitle) subtitle.textContent = `"${data.quote}"`;
        }
    };
    xhr.onerror = function () {
    console.log("XHR failed");
    console.log("readyState:", xhr.readyState);
    console.log("status:", xhr.status);
    };
    xhr.send();
}

const notificationButton = document.getElementById("enableNotifications");
if (notificationButton) {
    if (Notification.permission === "granted") {
        notificationButton.style.display = "none";
    }
    notificationButton.addEventListener("click", async () => {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            console.log("Notifications enabled");
        }
    });
}

function checkDueTasks() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayDate = `${year}-${month}-${day}`;
    console.log("Today:", todayDate);
    const dueTasks = tasks.filter(function(task) {
        return task.dueDate === todayDate && !task.completed;
    });
    console.log("Due tasks:", dueTasks);
    if (dueTasks.length === 0) {
        return;
    }
    navigator.serviceWorker.ready.then(function(registration) {
        dueTasks.forEach(function(task) {
            const notifiedTasks =
                JSON.parse(localStorage.getItem("waymark_notified_tasks")) || [];
            if (notifiedTasks.includes(task.id)) {
                return;
            }
            registration.active.postMessage({
                type: "taskDue",
                title: task.title
            });
            notifiedTasks.push(task.id);
            localStorage.setItem(
                "waymark_notified_tasks",
                JSON.stringify(notifiedTasks)
            );
        });
    });
}

window.addEventListener("DOMContentLoaded", function () {

    loadTasks();
    renderTasks();
    updatePriorityCounts();
    updateDashboardCards();
    loadQuoteXHR();
    checkDueTasks();

    document.getElementById("addTaskBtn").addEventListener("click", showTaskForm);
    document.getElementById("saveTaskBtn").addEventListener("click", addTask);
    document.getElementById("cancelTaskBtn").addEventListener("click", hideTaskForm);

});

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/serviceWorker.js")
        .then(function() {
            console.log("Service Worker registered");
        })
        .catch(function(error) {
            console.log("Service Worker registration failed:", error);
        });
}