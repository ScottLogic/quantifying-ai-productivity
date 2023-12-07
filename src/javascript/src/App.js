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

// Get all tasks or filter based on the 'complete' parameter
app.get('/todo', (req, res) => {
    const { complete } = req.query;
  
    // If complete parameter is provided
    if (complete !== undefined) {
      const isComplete = complete.toLowerCase() === 'true'; // Convert to boolean
  
      // Filter tasks based on the 'complete' parameter
      const filteredTasks = tasks.filter(task => task.complete === isComplete);
  
      res.json(filteredTasks);
    } else {
      // If no 'complete' parameter provided, return all tasks
      res.json(tasks);
    }
  });

// Get task by UUID
app.get('/todo/:uuid', (req, res) => {
    const { uuid } = req.params;
  
    // Validate UUID format
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(uuid)) {
      return res.status(400).json({
        timestamp: new Date().toISOString(),
        status: 400,
        error: 'Bad Request',
        path: req.path
      });
    }
  
    // Find the task with the given UUID
    const foundTask = tasks.find(task => task.uuid === uuid);
  
    if (foundTask) {
      // Return the task with HTTP status 200
      res.json(foundTask);
    } else {
      // If task not found, return a fixed UNKNOWN_TASK with HTTP status 200
      const unknownTask = {
        "uuid": "00000000-0000-0000-0000-000000000000",
        "name": "Unknown Task",
        "description": "Unknown Task",
        "created": "1970-01-01T00:00:00.000Z",
        "completed": null,
        "complete": false
      };
      res.json(unknownTask);
    }
  });

// Mark a task as complete
app.put('/todo/completed/:uuid', (req, res) => {
    const { uuid } = req.params;
  
    // Validate UUID format
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(uuid)) {
      return res.status(400).json({
        timestamp: new Date().toISOString(),
        status: 400,
        error: 'Bad Request',
        path: req.path
      });
    }
  
    // Find the task with the given UUID
    const foundTaskIndex = tasks.findIndex(task => task.uuid === uuid);
  
    if (foundTaskIndex !== -1) {
      const foundTask = tasks[foundTaskIndex];
  
      // If the task is not already completed
      if (!foundTask.complete) {
        // Mark the task as complete
        foundTask.completed = new Date().toISOString();
        foundTask.complete = true;
  
        res.json({
          success: true,
          message: "This task has now been completed."
        });
      } else {
        // If the task is already completed
        res.json({
          success: false,
          message: "Task already marked complete."
        });
      }
    } else {
      // If task not found
      res.json({
        success: false,
        message: "Task not found."
      });
    }
  });

  // Create a new task and add it to the list
app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;
  
    // Check if both name and description parameters are supplied
    if (!name || !description) {
        const queryParams = Object.entries(req.query)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

      return res.status(400).json({
        timestamp: new Date().toISOString(),
        status: 400,
        error: 'Bad Request',
        path: `${req.path}?${queryParams}`
      });
    }
  
    // Generate a random UUID
    const newUuid = generateRandomUuid();
  
    // Create a new task
    const newTask = {
      uuid: newUuid,
      name: name,
      description: description,
      created: new Date().toISOString(),
      completed: null,
      complete: false
    };
  
    // Add the new task to the list
    tasks.push(newTask);
  
    res.status(201).json({
      taskId: newUuid,
      message: `Task ${name} added successfully.`
    });
  });
  
  function generateRandomUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

app.listen(8080, () => console.log('Example app listening on port 8080!'));