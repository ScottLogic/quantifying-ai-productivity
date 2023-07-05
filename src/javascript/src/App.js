const express = require('express');

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

// Get all tasks
app.get('/todo', (req, res) => {
    res.json(tasks);
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));