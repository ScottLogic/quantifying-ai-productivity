const express = require('express');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const tasksFilePath = path.join(__dirname, '../../static_data', 'ToDoList.json');

let tasks = [];

const UNKNOWN_TASK = {
    uuid: "00000000-0000-0000-0000-000000000000",
    name: "Unknown Task",
    description: "Unknown Task",
    created: new Date(0).toISOString(),
    completed: null,
    complete: false
}

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
    if (complete === 'true' || complete === 'false') {
        const isComplete = complete === 'true';
        const filteredTasks = tasks.filter(task => task.complete === isComplete);
        res.json(filteredTasks);
    } else {
        // If 'complete' parameter is not provided or has an invalid value, return all tasks.
        res.json(tasks);
    }
});

// // Get a specific task based on the given uuid
// app.get('/todo/:taskId', (req, res) => {
//     const { taskId } = req.params;

//     // Invalid uuid.
//     if (!uuidValidate(taskId)) {
//         res.status(400).json(badRequest(req.url));
//         return;
//     }

//     const task = tasks.find((task) => task.uuid === taskId);

//     // If the task is found return it, otherwise return UNKNOWN_TASK.
//     if (task) {
//         res.json(task);
//     } else {
//         res.json(UNKNOWN_TASK)
//     }
// });

// New GET endpoint to retrieve a task by UUID
app.get('/todo/:uuid', (req, res) => {
    const { uuid } = req.params;

    // Invalid uuid.
    if (!uuidValidate(uuid)) {
        res.status(400).json(badRequest(req.url));
        return;
    }

    const task = tasks.find((task) => task.uuid === uuid);

    // If the task is found return it, otherwise return UNKNOWN_TASK.
    if (task) {
        res.json(task);
    } else {
        res.json(UNKNOWN_TASK)
    }
});

// // Mark a task as completed
// app.put('/todo/completed/:taskId', (req, res) => {
//     const { taskId } = req.params;

//     // Invalid uuid.
//     if (!uuidValidate(taskId)) {
//         res.status(400).json(badRequest(req.url));
//         return;
//     }

//     const task = tasks.find((task) => task.uuid === taskId);

//     // If the task is not found return an error message and SUCCESS.
//     if (!task) {
//         res.json({
//             success: false,
//             message: "Task not found."
//         });
//         return;
//     }

//     // If the task is already complete return an error message and SUCCESS.
//     if (task.complete) {
//         res.json({
//             success: false,
//             message: "Task already marked complete.",
//         });
//         return;
//     }

//     // Mark the task as complete and return success.
//     task.completed = new Date().toISOString();
//     task.complete = true;
//     res.json({
//         success: true,
//         message: 'This task has now been completed.'
//     });
// });


// Mark a task as completed based on UUID
app.put('/todo/completed/:uuid', (req, res) => {
    const { uuid } = req.params;

    // Invalid uuid.
    if (!uuidValidate(uuid)) {
        res.status(400).json(badRequest(req.url));
        return;
    }

    const task = tasks.find((task) => task.uuid === uuid);
    // If the task is not found return an error message and SUCCESS.
    if (!task) {
        res.json({
            success: false,
            message: "Task not found.",
        });
        return;
    }

    // If the task is already complete return an error message and SUCCESS.
    if (task.complete) {
        res.json({
            success: false,
            message: "Task already marked complete.",
        });
        return;
    }

    // Mark the task as complete and return success.
    task.completed = new Date().toISOString();
    task.complete = true;

    // Update the JSON file with the new task data

    fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 4), (err) => {
        if (err) {
            console.error('Error writing tasks file:', err);
            res.status(500).json({ success: false, message: "Internal Server Error" });
            return;
        }
        res.json({
            success: true,
            message: 'This task has now been completed.',
        });
    });
});

// // Add a new task
// app.post('/todo/addTask', (req, res) => {
//     console.log('Coming ehre');
//     const { name, description } = req.query;

//     if (!name || !description) {
//         res.status(400).json(badRequest(req.url));
//         return;
//     }

//     const taskId = uuidv4();
//     const newTask = {
//         uuid: taskId,
//         name,
//         description,
//         created: new Date().toISOString(),
//         completed: null,
//         complete: false,
//     };
//     tasks.push(newTask);
//     res.status(201).json({
//         taskId,
//         message: `Task ${newTask.name} added successfully.`
//     });
// });

// Add a new task
app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;

    if (!name || !description) {
        res.status(400).json(badRequest(req.url));
        return;
    }

    const taskId = uuidv4();
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

    // Save the updated tasks array to the file
    fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), (err) => {
        if (err) {
            console.error('Error saving tasks to file:', err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
            return;
        }

        res.status(201).json({
            taskId,
            message: `Task ${name} added successfully.`
        });
    });
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));

const badRequest = (url) => ({
    timestamp: new Date().toISOString(),
    status: 400,
    error: "Bad Request",
    path: url
});