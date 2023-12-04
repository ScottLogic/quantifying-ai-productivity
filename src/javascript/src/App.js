const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const validate = require('uuid-validate');

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

// Save tasks to the JSON file
const saveTasksToFile = () => {
    fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8', err => {
        if (err) {
            console.error('Error writing tasks file:', err);
        }
    });
};

// Load tasks from the file when the server starts
loadTasksFromFile();

// Get all tasks
app.get('/todo', (req, res) => {
    const completeParam = req.query.complete;

    // Filter the todo list based on the 'complete' parameter
    const filteredTodos = tasks.filter(todo => {
      return completeParam ? todo.complete === (completeParam === 'true') : true;
    });

    res.json(filteredTodos);
});

// Get a specific task by UUID
app.get('/todo/:uuid', (req, res) => {
    const requestedUUID = req.params.uuid;

    // Validate the UUID format
    if (!validate(requestedUUID)) {
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: req.originalUrl,
        });
    }

    // Find the task with the given UUID
    const foundTask = tasks.find(task => task.uuid === requestedUUID);

    if (foundTask) {
        res.json(foundTask);
    } else {
        // If the UUID is valid but not associated with a todo, return UNKNOWN_TASK
        res.json({
            uuid: '00000000-0000-0000-0000-000000000000',
            name: 'Unknown Task',
            description: 'Unknown Task',
            created: '1970-01-01T00:00:00.000Z',
            completed: null,
            complete: false,
        });
    }
});

// Mark a task as complete
app.put('/todo/completed/:uuid', (req, res) => {
    const requestedUUID = req.params.uuid;

    // Validate the UUID format
    if (!validate(requestedUUID)) {
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: req.originalUrl,
        });
    }

    // Find the task with the given UUID
    const foundTaskIndex = tasks.findIndex(task => task.uuid === requestedUUID);

    if (foundTaskIndex !== -1) {
        const foundTask = tasks[foundTaskIndex];

        // Check if the task is already completed
        if (foundTask.complete) {
            return res.json({
                success: false,
                message: 'Task already marked complete.',
            });
        }

        // Mark the task as complete
        foundTask.completed = new Date().toISOString();
        foundTask.complete = true;

        // Save tasks to the file
        saveTasksToFile();

        res.json({
            success: true,
            message: 'This task has now been completed.',
        });
    } else {
        // If the UUID is valid but not associated with a todo, return UNKNOWN_TASK
        res.json({
            success: false,
            message: 'Task not found.',
        });
    }
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));