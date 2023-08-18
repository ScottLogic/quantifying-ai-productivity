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

// validate a uuid
const validateUuid = (uuid) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};

// Load tasks from the file when the server starts
loadTasksFromFile();

// Get tasks - parameter complete is optional to filter by complete status
app.get('/todo', (req, res) => {
    const { complete } = req.query;
    if (complete) {
        res.json(tasks.filter(task => task.complete === (complete === 'true')));
    } else {
        res.json(tasks);
    }
});

// Get task by uuid
app.get('/todo/:uuid', (req, res) => {
    const { uuid } = req.params;
    // validate whether uuid is a valid uuid
    if (!validateUuid(uuid)) {
        // if not, return a 400 Bad Request
        res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: '/todo/' + uuid,
        });
        return;
    }

    const task = tasks.find(task => task.uuid === uuid);
    if (task) {
        res.json(task);
    } else {
        // return an UNKNOWN_TASK object with 200 status
        res.status(200).json({
            uuid: "00000000-0000-0000-0000-000000000000",
            name: "Unknown Task",
            description: "Unknown Task",
            created: "1970-01-01T00:00:00.000Z",
            completed: null,
            complete: false
        });
    }
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));