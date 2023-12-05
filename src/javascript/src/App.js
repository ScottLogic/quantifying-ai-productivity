const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const uuid = require('uuid');
const path = require('path');

const app = express();
app.use(express.json());
app.use(bodyParser.json());

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

// Validate UUID function
const isValidUUID = (uuidParam) => {
    return uuid.validate(uuidParam);
};

// Get tasks based on the 'complete' query parameter
app.get('/todo', (req, res) => {
    const completeParam = req.query.complete;

    if (completeParam === 'true') {
        // Filter tasks where 'complete' is true
        const completedTasks = tasks.filter(task => task.complete === true);
        res.json(completedTasks);
    } else if (completeParam === 'false') {
        // Filter tasks where 'complete' is false
        const incompleteTasks = tasks.filter(task => task.complete === false);
        res.json(incompleteTasks);
    } else {
        // Return all tasks if no 'complete' parameter
        res.json(tasks);
    }
});

// Get a specific task by UUID
app.get('/todo/:uuid', (req, res) => {
    const uuidParam = req.params.uuid;

    if (!isValidUUID(uuidParam)) {
        res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: `/todo/${encodeURIComponent(uuidParam)}`
        });
        return;
    }

    const task = tasks.find(task => task.uuid === uuidParam);

    if (task) {
        res.json(task);
    } else {
        // Task not found, return a default task object
        const defaultTask = {
            uuid: '00000000-0000-0000-0000-000000000000',
            name: 'Unknown Task',
            description: 'Unknown Task',
            created: '1970-01-01T00:00:00.000Z',
            completed: null,
            complete: false
        };

        res.status(200).json(defaultTask);
    }
});

// Mark a specific task as complete by UUID
app.put('/todo/completed/:uuid', (req, res) => {
    const uuidParam = req.params.uuid;

    // Validate UUID format
    if (!isValidUUID(uuidParam)) {
        res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: `/todo/completed/${uuidParam}`
        });
        return;
    }

    const taskIndex = tasks.findIndex(task => task.uuid === uuidParam);

    if (taskIndex !== -1) {
        const task = tasks[taskIndex];

        if (task.complete) {
            // Task is already marked as completed
            res.json({
                success: false,
                message: "Task already marked complete."
            });
        } else {
            // Mark the task as completed
            tasks[taskIndex] = {
                ...task,
                completed: new Date().toISOString(),
                complete: true
            };

            // Write updated tasks to file
            try {
                fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
                res.json({
                    success: true,
                    message: "This task has now been completed."
                });
            } catch (error) {
                console.error('Error writing tasks file:', error.message);
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            }
        }
    } else {
        // Task not found
        res.status(200).json({
            success: false,
            message: "Task not found."
        });
    }
});

// Create a new task
app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;

    if (!name || !description) {
        res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: req.originalUrl
        });
        return;
    }

    const newTask = {
        uuid: uuid.v4(), // Generate a new UUID
        name: decodeURIComponent(name),
        description: decodeURIComponent(description),
        created: new Date().toISOString(),
        completed: null,
        complete: false
    };

    tasks.push(newTask);

    // Write updated tasks to file
    try {
        fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
        res.status(201).json({
            success: true,
            taskId: newTask.uuid,
            description: newTask.description,
            created: newTask.created,
            completed: newTask.completed,
            complete: newTask.complete,
            message: `Task ${decodeURIComponent(name)} added successfully.`
        });
    } catch (error) {
        console.error('Error writing tasks file:', error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));