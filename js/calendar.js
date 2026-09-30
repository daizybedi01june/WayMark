const selectedDate = document.getElementById("selectedDate");
const calendarTasks = document.getElementById("calendarTasks");

selectedDate.addEventListener("change", showTasksForDate);
function showTasksForDate() {
    const selected = selectedDate.value;
    calendarTasks.innerHTML = "";
    const storedTasks = localStorage.getItem("waymark_tasks");
    if (!storedTasks) {
        calendarTasks.innerHTML = `
            <p style="color:gray;">
                No tasks have been added yet.
            </p>
        `;
        return;
    }
    const tasks = JSON.parse(storedTasks);
    const matchingTasks = tasks.filter(
        task => task.dueDate === selected
    );
    if (matchingTasks.length === 0) {
        calendarTasks.innerHTML = `
            <p style="color:gray;">
                No tasks planned for this date.
            </p>
        `;
        return;
    }
    for (const task of matchingTasks) {
        const taskItem = document.createElement("div");
        taskItem.style.cssText =
            "padding:10px;margin-bottom:8px;border-bottom:1px solid #eee;";
        taskItem.innerHTML = `
            <strong>${task.title}</strong>
            <span style="margin-left:15px;color:gray;">
                ${task.priority}
            </span>
            <span style="margin-left:15px;color:gray;">
                ${task.completed ? "Completed" : "Pending"}
            </span>
        `;
        calendarTasks.appendChild(taskItem);
    }
}