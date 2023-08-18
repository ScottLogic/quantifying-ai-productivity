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

// mark a task as completed by uuid
app.put('/todo/completed/:uuid', (req, res) => {
    const { uuid } = req.params;
    // validate whether uuid is a valid uuid
    if (!validateUuid(uuid)) {
        // if not, return a 400 Bad Request with and object containing the error
        res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: '/todo/completed/' + uuid,
        });
        return;
    }

    const task = tasks.find(task => task.uuid === uuid);
    if (task) {
        // if task is already completed, return 200 with object describing the error
        if (task.complete) {
            res.status(200).json({
                success: false,
                message: 'Task already marked complete.',
            });
            return;
        }
        // mark task as complete and set completed to current time
        task.complete = true;
        task.completed = new Date().toISOString();
        // return 200 with object describing the success
        res.status(200).json({
            success: true,
            message: 'This task has now been completed.',
        });
    } else {
        // return 200 with object describing the error
        res.status(200).json({
            success: false,
            message: 'Task not found.',
        });
    }
});

// Add a new POST endpoint that takes two query parameters, task name and task description, that creates a new task item with the given name and description. The uuid of the new task will be assigned by the server as a random uuid and the created timestamp should be set to the current time. The new item will have no value for the completed timestamp and a value of false for the complete flag. The body of the response should include the uuid of the new task and a string message.
app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;
    // validate whether name and description are provided
    if (!name || !description) {
        const wasNameEmptyString = name === '';
        const wasDescriptionEmptyString = description === '';

        // html encode the name and description if they were defined - even an empty string
        const encodedName = name || wasNameEmptyString ? encodeURIComponent(name) : undefined;
        const encodedDescription = description || wasDescriptionEmptyString ? encodeURIComponent(description) : undefined;

        // if not, return a 400 Bad Request with and object containing the error
        // path should contain encoded query parameters only if they were provided
        res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: '/todo/addTask?' + (encodedName || wasNameEmptyString ? 'name=' + encodedName + (!encodedDescription && !wasDescriptionEmptyString ? '' : '&') : '') + (encodedDescription || wasDescriptionEmptyString ? 'description=' + encodedDescription : ''),
        });
        return;
    }

    // create a new task object
    const newTask = {
        uuid: require('uuid').v4(),
        name,
        description,
        created: new Date().toISOString(),
        completed: null,
        complete: false
    };

    // add the new task to the tasks array
    tasks.push(newTask);

    // return 201 with object containing taskId and message with the name of the new task
    res.status(201).json({
        taskId: newTask.uuid,
        message: 'Task ' + newTask.name + ' added successfully.', 
    });
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));