const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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
    const completeParam = req.query.complete;
    if (completeParam === undefined) {
        // If no "complete" query parameter is provided, return all tasks
        res.json(tasks);
    } else {
        // If "complete" query parameter is provided, filter tasks based on its value
        const isComplete = completeParam === 'true'; // Convert string to boolean
        const filteredTasks = tasks.filter((task) => task.complete === isComplete);
        res.json(filteredTasks);
    }
});

// Endpoint to get a specific task by UUID path parameter
app.get('/todo/:taskId', (req, res) => {
    const taskId = req.params.taskId;

    // Check if the taskId is a valid UUID using a regular expression
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(taskId)) {
        res.status(400).json({
            timestamp: new Date(),
            status: 400,
            error: 'Bad Request',
            path: `/todo/${taskId}`
        });
    } else {
        const task = tasks.find((task) => task.uuid === taskId);

        if (task) {
            res.json(task);
        } else {
            // Return a fixed "Unknown Task" with a 200 status code
            res.status(200).json({
                uuid: '00000000-0000-0000-0000-000000000000',
                name: 'Unknown Task',
                description: 'Unknown Task',
                created: '1970-01-01T00:00:00.000Z',
                completed: null,
                complete: false
            });
        }
    }
});

// Endpoint to mark a task as complete
app.put('/todo/completed/:taskId', (req, res) => {
    const taskId = req.params.taskId;
    const task = tasks.find((task) => task.uuid === taskId);

    // Check if the taskId is a valid UUID using a regular expression
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(taskId)) {
        res.status(400).json({
            timestamp: new Date(),
            status: 400,
            error: 'Bad Request',
            path: `/todo/completed/${taskId}`
        });
    }
    else {
        if (task) {
            if (task.complete) {
                res.json({
                    success: false,
                    message: 'Task already marked complete.'
                });
            } else {
                task.complete = true;
                task.completed = new Date().toISOString();

                res.json({
                    success: true,
                    message: 'This task has now been completed.'
                });
            }
        } else {
            res.json({
                success: false,
                message: 'Task not found.'
            });
        }
    }
});

// Endpoint to add a new task with name and description query parameters
app.post('/todo/addTask', (req, res) => {
    const name = req.query.name;
    const description = req.query.description;

    if (!name || !description) {
        res.status(400).json({
            timestamp: new Date(),
            status: 400,
            error: 'Bad Request',
            path: req.originalUrl
        });
    } else {
        const newTask = {
            uuid: uuidv4(),
            name: name,
            description: description,
            complete: false,
            completed: null,
            created: new Date().toISOString()
        };

        tasks.push(newTask);

        res.status(201).json({
            taskId: newTask.uuid,
            message: `Task ${name} added successfully.`
        });
    }
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));