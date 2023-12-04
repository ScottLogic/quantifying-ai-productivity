const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

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

// Get task by UUID parsed
app.get('/todo/:uuid', (req, res) => {
    let taskNotFound = true;
    for (i in tasks) {
        if ('uuid' in tasks[i] && tasks[i].uuid === req.params.uuid) {
            res.json(tasks[i]);
            taskNotFound = false;
        }
    }
    if (taskNotFound) {
        res.status(404).send('Task ' + req.params.uuid + ' was not found')
    }
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));