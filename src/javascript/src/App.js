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
// A valid uuid is a string of 36 characters, with 4 dashes in the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.
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
    if (uuid.length !== 36) {
        res.status(400).send('Invalid uuid');
        return;
    }
    const task = tasks.find(task => task.uuid === uuid);
    if (task) {
        res.json(task);
    } else {
        res.json({
            uuid: '00000000-0000-0000-0000-000000000000',
            name: 'Unknown Task',
            description: 'Unknown Task',
            created: '1970-01-01T00:00:00.000Z',
            completed: null,
            complete: false
        });
    }
});


app.listen(8080, () => console.log('Example app listening on port 8080!'));