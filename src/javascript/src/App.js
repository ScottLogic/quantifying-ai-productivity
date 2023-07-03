const express = require('express');
const { v4: uuidv4, validate: uuidValidate} = require('uuid');

const app = express();
app.use(express.json());

const tasks = [
    {
      uuid: "f360ba09-4682-448b-b32f-0a9e538502fa",
      name: "Walk the dog",
      description: "Walk the dog for forty five minutes",
      created: new Date("2023-06-23T09:30:00Z").toISOString(),
      completed: null,
      complete: false
    },
    {
    uuid: "fd5ff9df-f194-4c6e-966a-71b38f95e14f",
    name: "Mow the lawn",
    description: "Mow the lawn in the back garden",
    created: new Date("2023-06-23T09:00:00Z").toISOString(),
    completed: null,
    complete: false
    },
    {
    uuid: "5c3ec8bc-6099-4cd5-b6da-8e2956db3a34",
    name: "Test generative AI",
    description: "Use generative AI technology to write a simple web service",
    created: new Date("2023-06-23T09:00:00Z").toISOString(),
    completed: null,
    complete: false
    }
 ];

 const UNKNOWN_TASK = {
    uuid: "00000000-0000-0000-0000-000000000000", 
    name: "Unknown Task",
    description: "Unknown Task",
    created: new Date(0).toISOString(),
    completed: null,
    complete: false
 }

// Get all tasks
app.get('/todo', (req, res) => {
    const { complete } = req.query;
  
    let filteredTasks = tasks;
    
    if (complete !== undefined) {
        const isComplete = complete === 'true';
        filteredTasks = tasks.filter(task => task.complete === isComplete);
    }
    
    res.json(filteredTasks);
});

// Get a specific task based on the given uuid
app.get('/todo/:taskId', (req, res) => {
    const { taskId } = req.params;

    // Invalid uuid.
    if (!uuidValidate(taskId)) {
        res.status(400).json(badRequest(req.url));
        return;
    }

    const task = tasks.find((task) => task.uuid === taskId);

    // If the task is found return it, otherwise return UNKNOWN_TASK.
    if (task) {
        res.json(task);
    } else {
        res.json(UNKNOWN_TASK)
    }
});
  
// Mark a task as completed
app.put('/todo/completed/:taskId', (req, res) => {
    const { taskId } = req.params;
        
    // Invalid uuid.
    if (!uuidValidate(taskId)) {
        res.status(400).json(badRequest(req.url));
        return;
    }

    const task = tasks.find((task) => task.uuid === taskId);

    // If the task is not found return BAD_REQUEST.
    if (!task) {
        res.status(400).json({ 
            success: false, 
            message: "Task not found." });
        return;
    }

    // If the task is already complete return BAD_REQUEST.
    if (task.complete) {
        res.status(400).json({
            success: false,
            message: "Task already marked complete.",
        });
        return;
    }

    // Mark the task as complete and return success.
    task.completed = new Date().toISOString();
    task.complete = true;
    res.json({ 
        success: true, 
        message: 'This task has now been completed.' 
    });
});

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
    tasks.push(newTask);
    res.status(201).json({ 
        taskId, 
        message: `Task ${newTask.name} added successfully.` 
    });
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));

const badRequest = (url) => ({
    timestamp: new Date().toISOString(),
    status: 400,
    error: "Bad Request",
    path: url
});