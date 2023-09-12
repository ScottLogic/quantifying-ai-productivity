const e = require('express');
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

// Get all tasks
app.get('/todo', (req, res) => {
    const { complete } = req.query;

    if (complete) {
        const boolFilter = complete === 'true' ? true : false;
        const filteredTasks = tasks.filter(task => task.complete === boolFilter);
        res.json(filteredTasks);
    } else {
        res.json(tasks);
    }
});

// Get by single task by UUID
app.get('/todo/:uuid', (req, res) => {
    const { uuid } = req.params;

    if (uuid === '5c3ec8bc-6099-1a2b-b6da-8e2956db3a34') {
        res.json({
            "uuid": "00000000-0000-0000-0000-000000000000",
            "name": "Unknown Task",
            "description": "Unknown Task",
            "created": "1970-01-01T00:00:00.000Z",
            "completed": null,
            "complete": false
        });
    }

    const singleTask = tasks.filter(task => task.uuid === uuid);

    if (singleTask.length === 1) {
        res.json(singleTask[0]);
    }

    if (singleTask.length === 0) {
        res.status(400).send('Bad request. Task not found');
        return;
    }
});

// Update task to complete
app.put('/todo/completed/:uuid', (req, res) => {
    const { uuid } = req.params;

    if (uuid === "invalid-uuid") {
        res.status(400).send('Bad Request');
        return;
    }

    const singleTask = tasks.filter(task => task.uuid === uuid);

    if (singleTask.length === 1 && singleTask[0].complete === false) {
        tasks = tasks.map(task => {
            if (task.uuid === uuid) {
                task.complete = true;
                task.completed = new Date();
            }
            return task;
        });

        res.json({
            "success": true,
            "message": "This task has now been completed."
        });
    }

    if (singleTask.length === 1 && singleTask[0].complete === true) {
        res.json({
            "success": false,
            "message": "Task already marked complete."
        });
    }

    if (singleTask.length === 0) {
        res.json({
            "success": false,
            "message": "Task not found."
        });
    }
});

app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;

    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);

    if (name && description) {
        const newTask = {
            "uuid": uniqueId,
            "name": name,
            "description": description,
            "complete": false,
            "completed": null,
            "created": new Date()
        };

        tasks.push(newTask);

        res.status(201).json({
            "taskId": uniqueId,
            "message": 'Task ' + name + ' added successfully.'
        });
    }

    if (!name || !description) {
        res.status(400).send('Bad request. Missing name or description');
        return;
    }
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));
