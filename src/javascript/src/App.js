const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4, validate } = require('uuid')

const app = express();
app.use(express.json());

const tasksFilePath = path.join(__dirname, '../../static_data', 'ToDoList.json');

let tasks = [];

const badRequestJSON = (url) => ({
    "timestamp": new Date().toISOString(),
    "status": 400,
    "error": "Bad Request",
    "path": url
})

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

    let filteredTasks = tasks;

    if (complete !== undefined) {
        filteredTasks = filteredTasks.filter(task => task.complete.toString() === complete)
    }

    res.json(filteredTasks);
});

// Get task by uuid
app.get('/todo/:uuid', (req, res) => {
    const { uuid } = req.params;

    const isValidUUID = validate(uuid)

    if (!isValidUUID) {
        res.status(400).send(badRequestJSON(req.url))
        return
    }

    const foundTask = tasks.find(task => task.uuid === uuid)

    if (!foundTask) {
        res.json({
            uuid: "00000000-0000-0000-0000-000000000000",
            name: "Unknown Task",
            description: "Unknown Task",
            created: new Date(0).toISOString(),
            completed: null,
            complete: false
        })
    }
    else {
        res.json(foundTask);
    }
});

// Mark task as complete
app.put('/todo/completed/:uuid', (req, res) => {
    const { uuid } = req.params;

    const isValidUUID = validate(uuid)

    if (!isValidUUID) {
        res.status(400).send(badRequestJSON(req.url))
        return
    }

    const foundTask = tasks.find(task => task.uuid === uuid)

    if (!foundTask) {
        res.json({
            success: false,
            message: "Task not found."
        })
        return
    }
    if (foundTask.complete) {
        res.json({
            success: false,
            message: "Task already marked complete."
        })
        return
    }

    foundTask.complete = true;
    foundTask.completed = new Date().toISOString();

    res.json({
        success: true,
        message: "This task has now been completed."
    });
});

// Create task
app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;

    const id = uuidv4()

    if (!name || !description) {
        res.status(400).send(badRequestJSON(req.url))
        return
    }

    tasks.push({
        name,
        description,
        uuid: id,
        created: new Date().toISOString(),
        complete: false
    })

    res.status(201).json({
        id,
        message: "Task " + name + " added successfully."
    })
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));