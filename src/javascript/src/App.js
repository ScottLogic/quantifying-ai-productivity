const express = require('express');
const fs = require('fs');
const path = require('path');
const { isValidUUID } = require('./utils/uuidChecker');
const unknownTask = require('./utils/unknownTask.json');
const completedJson = require('./utils/completed.json');
const { badRequest } = require('./utils/badRequest');
const { makeTimestamp } = require('./utils/makeTimestamp');
const { makeTask } = require('./utils/makeTask');
const { taskAdded } = require('./utils/taskAdded');

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
    const todoComplete = req.query.complete || null;
    const completeTasks = [...tasks].filter(task => `${task.complete}` === todoComplete);
    res.json(todoComplete != null ? completeTasks : tasks);
});

app.get('/todo/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    if (!isValidUUID(uuid)) {
        res.status(400).json(badRequest(fullPath(req)));
    } else {
        const taskWithUuid = [...tasks].find(task => task.uuid == uuid);
        res.json(taskWithUuid ?? unknownTask)
    }
})

app.put('/todo/completed/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    if (!isValidUUID(uuid)) {
        res.status(400).json(badRequest(fullPath(req)));
    } else {
        const taskWithUuid = tasks.find(task => task.uuid == uuid);
        if (taskWithUuid) {
            if (!taskWithUuid.complete) {
                taskWithUuid.completed = makeTimestamp();
                taskWithUuid.complete = true;
                res.json(completedJson.completed);
            } else {
                res.json(completedJson.already);
            }
        } else {
            res.json(completedJson.notFound);
        }
    }
})

app.post('/todo/addTask', (req, res) => {
    const name = req.query.name;
    const description = req.query.description;
    if (name && description) {
        const taskToAdd = makeTask(name, description);
        tasks.push(taskToAdd);
        res.status(201).json(taskAdded(taskToAdd));
    } else {
        res.status(400).json(badRequest(fullPath(req)));
    }
})

app.listen(8080, () => console.log('Example app listening on port 8080!'));