function Task(title, priority, dueDate) {
    this.id = Date.now() + Math.random();
    this.title = title;
    this.priority = priority;
    this.dueDate = dueDate;
    this.completed = false;
}

Task.prototype.toggleComplete = function () {
    this.completed = !this.completed;
};