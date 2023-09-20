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

function validateUuid(uuid) {
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    return uuidPattern.test(uuid);
}

function generateCustomUuid() {
    const chars = 'abcdef0123456789';
    return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/x/g, () => chars[Math.floor(Math.random() * chars.length)]);
}

app.get('/todo', (req, res) => {
    const { complete } = req.query;

    if (complete === 'true' || complete === 'false') {
        const filteredTasks = tasks.filter(task => task.complete === (complete === 'true'));
        res.json(filteredTasks);
    } else {
        // If 'complete' parameter is not provided or not 'true' or 'false', return all tasks
        res.json(tasks);
    }
})

app.get('/todo/:uuid', (req, res) => {
    const { uuid } = req.params;

    // Validate the UUID
    if (!validateUuid(uuid)) {
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: req.url,
        });
    }

    // Find the task by UUID or return UNKNOWN_TASK if not found
    const task = tasks.find(task => task.uuid === uuid);

    if (task) {
        res.json(task);
    } else {
        // If the task with the provided UUID doesn't exist, return UNKNOWN_TASK
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

app.put('/todo/completed/:uuid', (req, res) => {
    const { uuid } = req.params;

    // Validate the UUID
    if (!validateUuid(uuid)) {
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: req.url,
        });
    }

    // Find the task by UUID
    const task = tasks.find(task => task.uuid === uuid);

    if (!task) {
        // If the task with the provided UUID doesn't exist, return "Task not found."
        return res.status(200).json({
            success: false,
            message: 'Task not found.',
        });
    }

    if (task.complete) {
        // If the task is already marked as completed, return "Task already marked complete."
        return res.status(200).json({
            success: false,
            message: 'Task already marked complete.',
        });
    }

    // Mark the task as complete
    task.complete = true;
    task.completed = new Date().toISOString();

    // Return a success response
    return res.status(200).json({
        success: true,
        message: 'This task has now been completed.',
    });
});

app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;

    if (!name || !description) {
        // If both name and description parameters are not supplied, return a 400 Bad Request response.
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: req.url,
        });
    }

    // Generate a new UUID for the task
    const taskId = generateCustomUuid();

    // Create a new task object
    const newTask = {
        uuid: taskId,
        name,
        description,
        created: new Date().toISOString(),
        completed: null,
        complete: false,
    };

    // Add the new task to the tasks array
    tasks.push(newTask);

    // Return a success response with the newly created task ID
    return res.status(201).json({
        taskId,
        message: `Task ${name} added successfully.`,
    });
});


app.listen(8080, () => console.log('Example app listening on port 8080!'));