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
            uuid: '00000000-0000-0000-0000-000000000000',
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
// A completed task should not be able to be marked as complete again.
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
        if (task.complete) {
            res.json({
                success: false,
                message: `Task already marked complete.`
            });
            return;
        }
        task.completed = new Date().toISOString();
        task.complete = true;
        res.json({
            success: true,
            message: `This task has now been completed.`
        });
    } else {
        res.json({
            success: false,
            message: `Task not found.`
        });
    }
});

// Adds a new POST endpoint to create a new task taking the name and description in the body of the request or query parameters.
// Create a uuid that passes our validation, the created field should be set to the current date and time.
// The completed and complete fields should be set to null and false respectively.
// The success response should be a 201 that contains a success boolean and a message string.
// If the name or description are not supplied return a 400 Bad Request error.
app.post('/todo/addTask', (req, res) => {
    const { name: bodyName, description: bodyDescription } = req.body;
    const name = bodyName || req.query.name;
    const description = bodyDescription || req.query.description;
    if (!name || !description) {
        res.status(400).json({
            success: false,
            message: `Name and description are required.`
        });
        return;
    }
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        // eslint-disable-next-line no-bitwise
        const r = Math.random() * 16 | 0;
        // eslint-disable-next-line no-bitwise
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    const created = new Date().toISOString();
    const completed = null;
    const complete = false;
    const newTask = {
        uuid,
        name,
        description,
        created,
        completed,
        complete
    };
    tasks.push(newTask);
    res.status(201).json({
        success: true,
        message: `Task ${name} added successfully.`,
        taskId: uuid
    });
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));