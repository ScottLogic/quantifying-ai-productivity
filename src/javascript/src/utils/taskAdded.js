function taskAdded(task) {
    return {
        "taskId": task.uuid,
        "message": `Task ${task.name} added successfully.`
    }
}

module.exports = { taskAdded }