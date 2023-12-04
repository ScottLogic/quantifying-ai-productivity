const { randomUUID } = require('crypto');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const tasksFilePath = path.join(__dirname, '../../static_data', 'ToDoList.json');
const unknownTaskFilePath = path.join(__dirname, '../../static_data', 'unknownTask.json');

let tasks = [];
let unknownTask = [];

// Load tasks from the JSON file. Inefficient but gave up on making better
const loadTasksFromFile = () => {
    fs.readFile(tasksFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading tasks file:', err);
            return;
        }
        try {
            tasks = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing tasks JSON:', error);
            return;
        }
    });
    fs.readFile(unknownTaskFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading tasks file:', err);
            return;
        }
        try {
            unknownTask = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing tasks JSON:', error);
            return;
        }
    });
};

// Load tasks from the file when the server starts
loadTasksFromFile();

// Returns tasks filtered on "complete" property.
const returnTaskWithComplete = (bool) => {
    let completedTasks = [];
    for (i in tasks) {
        if ('complete' in tasks[i] && tasks[i].complete === bool) {
            completedTasks.push(tasks[i]);
        }
    }
    return completedTasks;
};

// Get all tasks. Filters on ?complete param
app.get('/todo', (req, res) => {
    switch(req.query.complete) {
        case 'true':
            res.json(returnTaskWithComplete(true));
            break;
        case 'false':
            res.json(returnTaskWithComplete(false));
            break;
        default:
            res.json(tasks);
            break;
    }
});

const validUuidRegex = new RegExp(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

// Returns bad request body with up to date timestamp
const getBadRequestResponseWithTimestamp = (requestPath) => {
    let response = {
        "timestamp": null,
        "status": 400,
        "error": "Bad Request",
        "path": null
    }
    response.timestamp = new Date();
    response.path = requestPath;
    return response;
};

// Get task by UUID parsed
app.get('/todo/:uuid', (req, res) => {
    if (!validUuidRegex.test(req.params.uuid)) {
        res.status(400);
        res.json(getBadRequestResponseWithTimestamp(req.originalUrl))
        return;
    }

    let taskNotFound = true;
    for (i in tasks) {
        if ('uuid' in tasks[i] && tasks[i].uuid === req.params.uuid) {
            res.json(tasks[i]);
            taskNotFound = false;
        }
    }
    if (taskNotFound) {
        res.json(unknownTask);
    }
});

let taskCompletedObject = {
    "success": true,
    "message": "This task has now been completed."
}
let taskAlreadyCompletedObject = {
    "success": false,
    "message": "Task already marked complete."
}
let taskNotFoundObject = {
    "success": false,
    "message": "Task not found."
}

// Mark task as completed
app.put('/todo/completed/:uuid', (req, res) => {
    if (!validUuidRegex.test(req.params.uuid)) {
        res.status(400);
        res.json(getBadRequestResponseWithTimestamp(req.originalUrl))
        return;
    }

    let taskNotFound = true;
    for (i in tasks) {
        if ('uuid' in tasks[i] && tasks[i].uuid === req.params.uuid) {
            taskNotFound = false;

            if (tasks[i].completed === null) {
                tasks[i].completed = new Date();
                tasks[i].complete = true;
                res.json(taskCompletedObject);
                return;
            }

            if (tasks[i].complete === true) {
                res.json(taskAlreadyCompletedObject);
                return;
            }
        }
    }
    if (taskNotFound) {
        res.json(taskNotFoundObject);
        return;
    }
});

// Creates new Task
const createNewTask = (name, desc) => {
    let newTask = {
        "uuid": randomUUID(),
        "name": name,
        "description": desc,
        "created": new Date(),
        "completed": null,
        "complete": false
    }
    return newTask;
};

// Add new task to ToDoList
app.post('/todo/addTask', (req, res) => {
    if (!req.query.name || !req.query.description) {
        res.status(400);
        res.json(getBadRequestResponseWithTimestamp(req.originalUrl))
        return;
    }

    let newTask = createNewTask(req.query.name, req.query.description);
    tasks.push(newTask);
    let taskCreatedObject = {
        "taskId": newTask.uuid,
        "message": `Task ${newTask.name} added successfully.`
    }
    res.status(201);
    res.json(taskCreatedObject);
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));