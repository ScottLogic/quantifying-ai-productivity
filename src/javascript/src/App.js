const express = require('express');
const fs = require('fs');
const { v4: uuidv4, validate: validateUUID } = require('uuid');
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

// Endpoint for "/todo" with optional 'complete' parameter
app.get('/todo', (req, res) => {
    // Get the 'complete' parameter from the request query
    const { complete } = req.query;
  
    // Filter tasks based on the 'complete' parameter, if provided
    let filteredTasks = tasks;
    if (complete !== undefined) {
      const isComplete = complete.toLowerCase() === 'true';
      filteredTasks = tasks.filter(task => task.complete === isComplete);
    }
  
    // Send the filtered tasks as a response with HTTP status 200
    res.status(200).json(filteredTasks);
  });

  app.get('/todo/:uuid', (req, res) => {
    const { uuid } = req.params;
  
    // Validate the UUID format
    if (!validateUUID(uuid)) {
      // Return bad request error if the UUID is invalid
      res.status(400).json({ error: 'Bad Request' });
      return;
    }
  
    // Find the task with the given UUID
    const foundTask = tasks.find(task => task.uuid === uuid);
  
    if (foundTask) {
      // Return the task with HTTP status 200
      res.status(200).json(foundTask);
    } else {
      // Return a fixed UNKNOWN_TASK with HTTP status 200 if the task is not found
      res.status(200).json({     uuid: "00000000-0000-0000-0000-000000000000",
      name: "Unknown Task",
      description: "Unknown Task",
      created: "1970-01-01T00:00:00.000Z",
      completed: null,
      complete: false });
    }
  });


  // PUT endpoint for "/todo/{uuid}" to mark a task as complete
app.put('/todo/completed/:uuid', (req, res) => {
    const { uuid } = req.params;
  
    // Validate the UUID format
    if (!validateUUID(uuid)) {
      // Return bad request error if the UUID is invalid
      res.status(400).json({ success: false, message: 'Bad Request' });
      return;
    }
  
    // Find the task with the given UUID
    const foundTaskIndex = tasks.findIndex(task => task.uuid === uuid);
  
    if (foundTaskIndex !== -1) {
      const foundTask = tasks[foundTaskIndex];
  
      // Check if the task is already marked as completed
      if (foundTask.complete) {
        res.status(200).json({ success: false, message: 'Task already marked complete.' });
      } else {
        // Mark the task as complete
        foundTask.complete = true;
        foundTask.completed = new Date().toISOString();
  
        // Update the task in the tasks array
        tasks[foundTaskIndex] = foundTask;
  
        res.status(200).json({ success: true, message: 'This task has now been completed.' });
      }
    } else {
      // Return a message if the task is not found
      res.status(200).json({ success: false, message: 'Task not found.' });
    }
  });

  // POST endpoint for "/todo" to create a new task
app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;

    // Check if both name and description are supplied
    if (!name || !description) {
      // Return bad request error if both parameters are not provided
      res.status(400).json({ error: 'Bad Request' });
      return;
    }
  
    // Create a new task
    const newTask = {
      uuid: uuidv4(),
      name: name,
      description: description,
      complete: false,
      completed: null,
      created: new Date().toISOString(),
    };
  
    // Add the new task to the tasks array
    tasks.push(newTask);

    // Return the response with the new task's UUID and a success message
    res.status(201).json({ taskId: newTask.uuid, message: 'Task ' + newTask.name + ' added successfully.' });
  });
  

app.listen(8080, () => console.log('Example app listening on port 8080!'));