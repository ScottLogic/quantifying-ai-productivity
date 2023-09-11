const express = require('express');
const fs = require('fs');
const path = require('path');

const uuidv4 = require('./uuidv4');

const app = express();
app.use(express.json());

const tasksFilePath = path.join(__dirname, '../../static_data', 'ToDoList.json');

let tasks = [];

// Load tasks from the JSON file
const loadTasksFromFile = () => {
    try {
        const fileContents = fs.readFileSync(tasksFilePath, 'utf8');
        tasks = JSON.parse(fileContents);
    } catch (err) {
        console.error(err);
    }
}

// Load tasks from the file when the server starts
loadTasksFromFile();

// Get all tasks
app.get('/todo', (req, res) => {
    // filter tasks based on the complete query parameter
    const complete = req.query.complete === 'true'
    return res.json(tasks.filter(task => task.complete === complete));
});

// function that returns true if uuid is in a valid format
const isValidUuid = (uuid) => {
    return uuid.match(/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/);
}

// Get a task by uuid
app.get('/todo/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    // if an invalid uuid format has been provided, return 400
    if (!isValidUuid(uuid)) {
        return res.status(400).json({ error: 'Bad Request', path: `/todo/${uuid}` });
    }

    const task = tasks.find(task => task.uuid === uuid);
    if (task) {
        return res.json(task);
    } else {
        return res.json({
            uuid: "00000000-0000-0000-0000-000000000000",
            name: "Unknown Task",
            description: "Unknown Task",
            created: "1970-01-01T00:00:00.000Z",
            completed: null,
            complete: false
        });
    }
});

// Mark a task as complete
app.put('/todo/completed/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    // if uuid in an invalid format return 400 bad request
    if (!isValidUuid(uuid)) {
        return res.status(400).json({ error: 'Bad Request', path: `/todo/completed/${uuid}` });
    }

    const task = tasks.find(task => task.uuid === uuid);

    // if task not found return 200 success false with message stating 'task not found'
    if (!task) {
        return res.json({ message: 'Task not found.', success: false });
    }

    // if task is already complete return 200 false with message stating 'task already marked complete'
    if (task && task.complete) {
        return res.json({ message: 'Task already marked complete.', success: false });
    } else {
        task.complete = true;
        task.completed = new Date().toISOString();
        return res.json({ message: 'This task has now been completed.', success: true });
    }
});

// Add new POST endpoint to create a new task and add it to the list of tasks
app.post('/todo/addTask', (req, res) => {
    if (!req.query.name || !req.query.description) {
        let urlPath = '/todo/addTask?name=&description=';
        if (req.query.name) {
            urlPath = `/todo/addTask?name=${req.query.name}${req.query.description ? `&description=${req.query.description}` : ''}`;
        } else if (req.query.description) {
            urlPath = `/todo/addTask?description=${req.query.description}`;
        }

        return res.status(400).json({ error: 'Bad Request', path: encodeURI(urlPath) });
    }

    // create a new task object
    const newTask = {
        uuid: uuidv4(),
        name: req.query.name,
        description: req.query.description,
        created: new Date().toISOString(),
        completed: null,
        complete: false
    }
    tasks.push(newTask);

    return res.status(201).json({ taskId: newTask.uuid, message: `Task ${newTask.name} added successfully.` });

});

app.listen(8080, () => console.log('Example app listening on port 8080!'));
