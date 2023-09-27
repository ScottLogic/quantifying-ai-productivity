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

// Validates uuids are in the correct format of xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.
const validateTaskUuid = (uuid) => {
    const uuidRegex = /^[a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8}$/i;
    return uuidRegex.test(uuid);
};


// Load tasks from the file when the server starts
loadTasksFromFile();

// Change the existing GET endpoint to accept an optional boolean parameter named complete. The returned list of tasks should be filtered based on the value given for the parameter, if supplied.
app.get('/todo', (req, res) => {
    const { complete } = req.query;
    if (complete === 'true' || complete === 'false') {
        const filteredTasks = tasks.filter(task => task.complete.toString() === complete);
        res.json(filteredTasks);
    } else {
        res.json(tasks);
    }
});

// A GET endpoint that uses a uuid as a path parameter to return the task with the supplied uuid from the list of tasks.
// If an invalid uuid is supplied the endpoint will return a 400 Bad Request error.
// If the uuid is valid but not present return the following JSON response: {
//     "uuid": "00000000-0000-0000-0000-000000000000",
//     "name": "Unknown Task",
//     "description": "Unknown Task",
//     "created": "1970-01-01T00:00:00.000Z",
//     "completed": null,
//     "complete": false
// }
app.get('/todo/:uuid', (req, res) => {
    const { uuid } = req.params;
    if (!validateTaskUuid(uuid)) {
        res.status(400).json({
            success: false,
            message: `Invalid uuid ${uuid}`
        });
        return;
    }
    const task = tasks.find(task => task.uuid === uuid);
    if (task) {
        res.json(task);
    } else {
        res.json({
            uuid: uuid,
            name: 'Unknown Task',
            description: 'Unknown Task',
            created: '1970-01-01T00:00:00.000Z',
            completed: null,
            complete: false
        });
    }
});

// Add a new PUT endpoint to update an existing task.
// The endpoint should accept a valid uuid as a path parameter to mark the task with the supplied uuid as complete.
// The completed field should be set to the current date and time and the complete field should be set to true.
// The body of the response should contain a success boolean and a message string.
// If the uuid is valid uuid but not found return a 200 with message "Task not found".
app.put('/todo/completed/:uuid', (req, res) => {
    const { uuid } = req.params;
    if (!validateTaskUuid(uuid)) {
        res.status(400).json({
            success: false,
            message: `Invalid uuid ${uuid}`
        });
        return;
    }
    const task = tasks.find(task => task.uuid === uuid);
    if (task) {
        task.completed = new Date().toISOString();
        task.complete = true;
        res.json({
            success: true,
            message: `Task ${uuid} updated`
        });
    } else {
        res.json({
            success: false,
            message: `Task ${uuid} not found`
        });
    }
});


app.listen(8080, () => console.log('Example app listening on port 8080!'));