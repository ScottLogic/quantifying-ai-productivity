const { randomUUID } = require('crypto');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const UNKNOWN_TASK = {
    "uuid": "00000000-0000-0000-0000-000000000000",
    "name": "Unknown Task",
    "description": "Unknown Task",
    "created": "1970-01-01T00:00:00.000Z",
    "completed": null,
    "complete": false
};

const tasksFilePath = path.join(__dirname, '../../static_data', 'ToDoList.json');

let tasks = [];

// Load tasks from the JSON file
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
        }
    });
};

// Load tasks from the file when the server starts
loadTasksFromFile();

// Get all tasks
app.get('/todo', (req, res) => {
    let complete = req.query.complete;
    let tasksFilter = tasks;
    if (complete !== undefined) {
        complete = complete === "true";
        tasksFilter = tasksFilter.filter((t) => !complete ^ t.complete);
    }
    res.json(tasksFilter);
});

// Get task by id
app.get('/todo/:uuid', (req, res) => {
    let uuid = req.params.uuid;
    if (invalidUUID(uuid)) {
        res.status(400);
        res.json({"timestamp": new Date().toJSON(), "status": "400", "error": "Bad Request", "path":"/todo/" + uuid})
    } else {
        let tasksFilter = tasks.filter((t) => t.uuid === uuid);
        if (tasksFilter.length == 1) {
            res.json(tasksFilter[0]);
        } else {
            res.json(UNKNOWN_TASK);
        }
    }
});

let invalidUUID = (uuid) => {
    let regex = /^[A-Z,a-z,0-9]{8}-[A-Z,a-z,0-9]{4}-[A-Z,a-z,0-9]{4}-[A-Z,a-z,0-9]{4}-[A-Z,a-z,0-9]{12}$/g;
    return !uuid.match(regex);
}

// Put with a completed task
app.put('/todo/completed/:uuid', (req, res) => {
    let uuid = req.params.uuid;
    if (invalidUUID(uuid)) {
        res.status(400);
        res.json({"timestamp": new Date().toJSON(), "status": "400", "error": "Bad Request", "path":"/todo/completed/" + uuid})
    } else {
        let tasksFilter = tasks.filter((t) => t.uuid === uuid);
        if (tasksFilter.length == 1 && !tasksFilter[0].complete) {
            tasks.find((t) => t.uuid === uuid).complete = true;
            tasks.find((t) => t.uuid === uuid).completed = new Date().toJSON();
            res.json({"success": true, "message": "This task has now been completed."});
        } else {
            if (tasksFilter.length == 1) {
                res.json({"success": false, "message": "Task already marked complete."});
            } else {
                res.json({"success": false, "message": "Task not found."});
            }
        }
    }
});

// Post a new task
app.post('/todo/addTask', (req, res) => {
    let taskName = req.query.name;
    let description = req.query.description;
    if (taskName == undefined || description == undefined || taskName.length < 1 || description.length < 1) {
        res.status(400);
        res.json({"timestamp": new Date().toJSON(), "status": "400", "error": "Bad Request", "path": req.originalUrl});
    } else {
        let newUUID;
        do {
            newUUID = randomUUID();
        } while (tasks.filter((t) => t.uuid === newUUID).length > 0)
        let newTask = {
            "uuid": newUUID,
            "name": taskName,
            "description": description,
            "created": new Date().toJSON(),
            "completed": null,
            "complete": false
        };
        tasks.push(newTask);
        res.status(201);
        res.json({"taskId": newUUID, "message": "Task " + taskName + " added successfully."});
    }
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));