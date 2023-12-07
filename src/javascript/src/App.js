const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const tasksFilePath = path.join(__dirname, '../../static_data', 'ToDoList.json');

let tasks = [];

const UNKNOWN_TASK = {
    "uuid": "00000000-0000-0000-0000-000000000000",
    "name": "Unknown Task",
    "description": "Unknown Task",
    "created": "1970-01-01T00:00:00.000Z",
    "completed": null,
    "complete": false
};

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

app.get('/todo', (req, res) => {
    const completeParam = req.query.complete;

    // If 'complete' parameter is provided, filter tasks based on the value
    const filteredTasks = typeof completeParam === 'string' ?
        tasks.filter(task => task.complete === (completeParam.toLowerCase() === 'true')) :
        tasks;

    res.json(filteredTasks);
});

app.get('/todo/:uuid', (req, res) => {
    const { uuid } = req.params;

    // Validate if the uuid is a valid UUID format
    const validUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

    if (!validUUID.test(uuid)) {
        // If invalid uuid is provided, return 400 Bad Request
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: "Bad Request",
            path: req.path
        });
    }

    // Find the task with the given uuid
    const foundTask = tasks.find(task => task.uuid === uuid);

    if (foundTask) {
        // If task with the given uuid exists, return the task with status 200
        return res.status(200).json(foundTask);
    } else {
        // If task with the given uuid doesn't exist, return the default UNKNOWN_TASK with status 200
        return res.status(200).json(UNKNOWN_TASK);
    }
});

app.put('/todo/completed/:uuid', (req, res) => {
    const { uuid } = req.params;

    // Validate if the uuid is a valid UUID format
    const validUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

    if (!validUUID.test(uuid)) {
        // If invalid uuid is provided, return 400 Bad Request
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: "Bad Request",
            path: req.path
        });
    }

    // Find the task with the given uuid
    const foundTaskIndex = tasks.findIndex(task => task.uuid === uuid);

    if (foundTaskIndex !== -1) {
        // If task with the given uuid is found, mark it as complete
        if (tasks[foundTaskIndex].complete) {
            // If the task is already marked complete, return success false with message
            return res.status(200).json({
                success: false,
                message: "Task already marked complete."
            });
        } else {
            // Mark the task as complete
            tasks[foundTaskIndex].completed = new Date().toISOString();
            tasks[foundTaskIndex].complete = true;

            return res.status(200).json({
                success: true,
                message: "This task has now been completed."
            });
        }
    } else {
        // If task with the given uuid is not found, return success false with message
        return res.status(200).json({
            success: false,
            message: "Task not found."
        });
    }
});

app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;

    if (!name && !description) {
        // If both name and description parameters are not supplied, return 400 Bad Request
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: "Bad Request",
            path: req.path + `?name=${name}&description=${description}`
        });
    }

    if (!name || !description) {
        // If both name and description parameters are not supplied, return 400 Bad Request
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: "Bad Request",
            path: req.path,
        });
    }

    const newTask = {
        uuid: uuidv4(),
        name: name,
        description: description,
        created: new Date().toISOString(),
        completed: null,
        complete: false
    };

    tasks.push(newTask);

    res.status(201).json({
        taskId: newTask.uuid,
        message: `Task ${name} added successfully.`
    });
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));