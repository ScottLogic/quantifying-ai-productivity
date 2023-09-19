const express = require('express');
const fs = require('fs');
const path = require('path');
// Import uuid module
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

// Define a fixed UNKNOWN_TASK object
const UNKNOWN_TASK = {
    uuid: '00000000-0000-0000-0000-000000000000',
    name: 'Unknown Task',
    description: 'Unknown Task',
    created: '1970-01-01T00:00:00.000Z',
    completed: null,
    complete: false
  };


// Get all tasks
app.get('/todo', (req, res) => {
    // Get the value of the complete parameter from the query string
  const complete = req.query.complete;

  // If the parameter is not given, return the whole list of tasks
  if (complete === undefined) {
    res.status(200).json(tasks);
    return;
  }

  // Convert the parameter value to a boolean
  const isComplete = complete.toLowerCase() === 'true';

  // Filter the list of tasks based on the parameter value
  const filteredTasks = tasks.filter(task => task.complete === isComplete);

  // Return the filtered list of tasks
  res.status(200).json(filteredTasks);
});

// Define a GET end point to accept a uuid as a path parameter and return a specific task
app.get('/todo/:uuid', (req, res) => {
    // Get the value of the uuid parameter from the path
    const uuid = req.params.uuid;
  
    // Validate the uuid format using a regular expression
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) {
        // Return a bad request error if the uuid is invalid
        // Use the current timestamp and the request path to create a dynamic error response
        res.status(400).json({
          timestamp: new Date().toISOString(),
          status: 400,
          error: 'Bad Request',
          path: req.path
        });
        return;
      }
  
    // Find the task with the given uuid in the list of tasks
    const task = tasks.find(task => task.uuid === uuid);
  
    // If the task is not found, return the UNKNOWN_TASK object
    if (!task) {
      res.status(200).json(UNKNOWN_TASK);
      return;
    }
  
    // Return the task with the given uuid
    res.status(200).json(task);
  });

  // Define a PUT end point to accept a uuid as a path parameter and mark a specific task as complete
app.put('/todo/completed/:uuid', (req, res) => {
    // Get the value of the uuid parameter from the path
    const uuid = req.params.uuid;
  
    // Validate the uuid format using a regular expression
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(uuid)) {
      // Return a bad request error if the uuid is invalid
      // Use the current timestamp and the request path to create a dynamic error response
      res.status(400).json({
        timestamp: new Date().toISOString(),
        status: 400,
        error: 'Bad Request',
        path: req.path
      });
      return;
    }
  
    // Find the task with the given uuid in the list of tasks
    const task = tasks.find(task => task.uuid === uuid);
  
    // If the task is not found, return an error response
    if (!task) {
      res.status(200).json({
        success: false,
        message: 'Task not found.'
      });
      return;
    }
  
    // If the task is already marked as complete, return an error response
    if (task.complete) {
      res.status(200).json({
        success: false,
        message: 'Task already marked complete.'
      });
      return;
    }
  
    // Mark the task as complete by setting the completed field to the current time and the complete boolean to true
    task.completed = new Date().toISOString();
    task.complete = true;
  
    // Return a success response
    res.status(200).json({
      success: true,
      message: 'This task has now been completed.'
    });
  });

  // Define a POST end point to accept two parameters, name and description, and create a new task with them
app.post('/todo/addTask', (req, res) => {
    // Get the value of the name and description parameters from the query string
    const name = req.query.name;
    const description = req.query.description;
  
    // Validate that both name and description are given
    if (!name || !description) {
      // Return a bad request error if either name or description is missing
      // Use the current timestamp and the request path to create a dynamic error response
      res.status(400).json({
        timestamp: new Date().toISOString(),
        status: 400,
        error: 'Bad Request',
        path: req.path
      });
      return;
    }
  
    // Create a new task object with the given name and description, and assign a random uuid and the current time as the id and created fields
    const newTask = {
      uuid: uuidv4(),
      name: name,
      description: description,
      created: new Date().toISOString(),
      completed: null,
      complete: false
    };
  
    // Add the new task to the list of tasks
    tasks.push(newTask);
  
    // Return a success response with the id of the new task and a message
    res.status(201).json({
      taskId: newTask.uuid,
      message: `Task ${name} added successfully.`
    });
  });
  

app.listen(8080, () => console.log('Example app listening on port 8080!'));