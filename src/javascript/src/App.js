const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const tasksFilePath = path.join(__dirname, '../../static_data', 'ToDoList.json');
const unknownTaskFilePath = path.join(__dirname, '../../static_data', 'unknownTask.json');
const badRequestFilePath = path.join(__dirname, '../../static_data', 'badRequestBody.json');

let tasks = [];
let unknownTask = [];
let badRequestBody = [];

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
    fs.readFile(badRequestFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading tasks file:', err);
            return;
        }
        try {
            badRequestBody = JSON.parse(data);
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
const getBadRequestResponseWithTimestamp = () => {
    let response = badRequestBody;
    response.timestamp = new Date();
    return response;
};

// Get task by UUID parsed
app.get('/todo/:uuid', (req, res) => {
    if (!validUuidRegex.test(req.params.uuid)) {
        res.json(getBadRequestResponseWithTimestamp())
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

app.listen(8080, () => console.log('Example app listening on port 8080!'));