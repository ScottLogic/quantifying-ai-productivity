const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json());

const tasksFilePath = path.join(__dirname, '../../static_data', 'ToDoList.json');

let tasks = [];

const UNKNONW_TASK = {
    uuid: "00000000-0000-0000-0000-000000000000",
    name: "Unknown Task",
    description: "Unknown Task",
    created: "1970-01-01T00:00:00.000Z",
    completed: null,
    complete: false
}

const UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/


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

const stringToBool = sBool => {
    if(sBool === 'true') {
        return true;
    }else if(sBool === 'false') {
        return false;
    }
    return null;
}

// Get all tasks
app.get('/todo', (req, res) => {
    const completeFilter = stringToBool(req.query.complete);
    if (completeFilter != undefined) {
        
        const filteredTasks = tasks.filter(task => task.complete === completeFilter);
        console.log(tasks, filteredTasks)
        res.json(filteredTasks)
    } else {
        res.json(tasks);
    }
});


// Get a task by id
app.get('/todo/:uuid', (req, res) => {
    const { uuid } = req.params;

    if (!UUID_REGEX.test(uuid)) {
        res.sendStatus(400)
        return;
    }

    const todoToReturn = tasks.find(task => task.uuid === uuid);
    if (todoToReturn) {
        res.json(todoToReturn)
    } else {
        res.json(UNKNONW_TASK)
    }
});



// Mark a task as complete
app.put('/todo/completed/:uuid', (req, res) => {
    const { uuid } = req.params;

    if (!UUID_REGEX.test(uuid)) {
        res.sendStatus(400)
        return;
    }

    const todoToReturn = tasks.find(task => task.uuid === uuid);
    if (todoToReturn) {
        if (!todoToReturn.complete) {
            todoToReturn.complete = true;
            todoToReturn.completed = (new Date()).toISOString();
            res.json({ success: true, message: "This task has now been completed." })
        } else {
            res.json({ success: false, message: "Task already marked complete." })
        }

    } else {
        res.json({ success: false, message: "Task not found." })
    }
});


// Create a task
app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;
    if (!name || !description) {
        res.sendStatus(400)
        return;
    }

    const date = new Date();
    const created = date.toISOString();
    const uuid = uuidv4();
    const complete = false;
    const completed = null;
    const newTask = { name, description, created, uuid, complete, completed }

    tasks.push(newTask);

    res.status(201).json({ taskId: uuid, message: `Task ${name} added successfully.` })
});


app.listen(8080, () => console.log('Example app listening on port 8080!'));