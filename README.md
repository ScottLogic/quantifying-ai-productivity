# quantifying-ai

The aim of this experiment is to gain an understanding of the productivity gains that are possible when using generative AI technologies to aid with development and testing work.

## This is the code race branch of the project

This branch is intended to introduce more control to the experiment. Participants should develop the web server in JavaScript (nodejs). The treatment group should use [ChatGPT](https://chat.openai.com/) to aid development. If you have GitHub Copilot installed, disable it before beginning development. The control group should develop as usual and should not use any generative AI tooling, regular sources of information such as Google and StackOverflow are fine. You should know if you are in the control group, so ask if you aren't sure.

The aim is to develop the web server so that the entire suite of Cypress tests, 15 tests in total, all pass on a fresh run of the web server.

Make sure you have completed the following pre-requisite steps before you begin the development task. You should only record the time taken to implement the web server, time taken to complete the pre-requisite steps should not be included in the implementation time.

### Install nodejs

[Download](https://nodejs.org/en/download) and install nodejs.

### Run the skeleton web server

Follow the instructions in `src\javascript\README.md`. Once the server is running you should see:
```
Example app listening on port 8080!
```

Leave the skeleton server running while you complete the next steps.

### Install Cypress and run the Cypress test suite

The Cypress test suite contains fifteen tests that should all pass when the web service implementation is complete. To use Cypress first [download](https://nodejs.org/en/download) and install nodejs. Once installed, open a new terminal, change directory into the `test` directory and run:
```
npm install
npx cypress open
```

Once Cypress opens, click on `E2E Testing` and select a browser (eg. Chrome). On the next screen you can run the tests.

The tests can be also run from the command line:
```
npx cypress run
```

Three tests will pass against the skeleton version of the web server.

### Install Postman and import the Postman test collection

[Download](https://www.postman.com/downloads/) and install Postman. After opening Postman, sign-in or register an account. You can then import the Postman collection by clicking `Import`. The `postmanCollection.json` file can be found under the `test\postman` folder.

The Postman suite is intended as an aid for development and testing.

### A note on repository branches

You should create your own branch to work on, commit your code and push it to the repository on your branch. We may wish to analyse the code that the generative AI helped produce as part of the outcomes of this experiment.
```
git checkout -b <new-branch-name>
```

### Using ChatGPT

You should register for ChatGPT if you have not done so previously. You should save your chat history with ChatGPT. We may wish to analyse the prompts entered into ChatGPT to achieve success.

## Developer task - Development of a simple web service

The development task is to implement a web service that provides endpoints to manage a to do list, using [ChatGPT](https://chat.openai.com/) to complete the development in the shortest time possible. The choice of implementation language is JavaScript. A skeleton implementation has been provided in JavaScript under the `src\javascript` directory. The implementation is considered complete when the suite of fifteen Cypress tests all pass.

For this version of the experiment we are interested in the speed of implementation that can be achieved using generative AI technology to develop code.

You should begin with the skeleton application code open in an IDE and with ChatGPT open in a browser window. Start timing the implementation time when you begin making changes to the code and record how long it took to implement the complete web server.

### Static data

The server data will be initialised with a list containing three tasks:
```
[
    {
        "uuid": "f360ba09-4682-448b-b32f-0a9e538502fa",
        "name": "Walk the dog",
        "description": "Walk the dog for forty five minutes",
        "created": "2023-06-23T09:30:00Z",
        "completed": null,
        "complete": false
    },
    {
        "uuid": "fd5ff9df-f194-4c6e-966a-71b38f95e14f",
        "name": "Mow the lawn",
        "description": "Mow the lawn in the back garden",
        "created": "2023-06-23T09:00:00Z",
        "completed": null,
        "complete": false
    },
    {
        "uuid": "5c3ec8bc-6099-4cd5-b6da-8e2956db3a34",
        "name": "Test generative AI",
        "description": "Use generative AI technology to write a simple web service",
        "created": "2023-06-23T09:00:00Z",
        "completed": null,
        "complete": false
    }
]
```

The intial GET endpoint returns the list of tasks held by the server.

The data above is stored in the file `quantifying-ai/static_data/ToDoList.json` within the project. The static data is loaded into the skeleton implementation from the file.

### Changes required

#### Change the GET endpoint.

Change the existing GET endpoint to accept an optional boolean parameter named `complete`. The returned list of tasks should be filtered based on the value given for the parameter, if supplied.

http://localhost:8080/todo{?complete=true}

A GET endpoint that takes an optional boolean parameter `complete`. If the parameter is given then the endpoint returns a list of tasks that have been filtered based on the value supplied for the parameter:

| URI                                       | Required behaviour                                                   |
| ----------------------------------------- | -------------------------------------------------------------------- |
| http://localhost:8080/todo                | Return a list of all tasks with HTTP status 200.                     |
| http://localhost:8080/todo?complete=true  | Return a list only containing completed tasks with HTTP status 200.  |
| http://localhost:8080/todo?complete=false | Return a list only containing incomplete tasks with HTTP status 200. |

#### Add a new GET endpoint to obtain a task by uuid.

Add a new GET endpoint that uses a `uuid` as a path parameter to return a specific task from the list of tasks.

http://localhost:8080/todo/{uuid}

A GET endpoint that uses a `uuid` as a path parameter to return the task with the supplied uuid from the list of tasks. The endpoint returns the task with the given uuid if it exists, otherwise a fixed `UNKNOWN_TASK` is returned. If an invalid uuid is supplied the endpoint will return a bad request error.

| URI                               | Required behaviour                                       |
| --------------------------------- | -------------------------------------------------------- |
| http://localhost:8080/todo/{uuid} | Return the task with supplied uuid with HTTP status 200. |

Given the static data data above:

http://localhost:8080/todo/5c3ec8bc-6099-4cd5-b6da-8e2956db3a34 returns
```
{
    "uuid": "5c3ec8bc-6099-4cd5-b6da-8e2956db3a34",
    "name": "Test generative AI",
    "description": "Use generative AI technology to write a simple web service",
    "created": "2023-06-23T09:00:00Z",
    "completed": null,
    "complete": false
}
```

with HTTP status 200.

http://localhost:8080/todo/5c3ec8bc-6099-1a2b-b6da-8e2956db3a34 returns
```
{
    "uuid": "00000000-0000-0000-0000-000000000000",
    "name": "Unknown Task",
    "description": "Unknown Task",
    "created": "1970-01-01T00:00:00.000Z",
    "completed": null,
    "complete": false
}
```

with HTTP status 200.

http://localhost:8080/todo/invalid-uuid returns HTTP status 400 Bad Request. A meaningful response may also be returned, e.g.
```
{
    "timestamp": "2023-06-27T12:32:05.590Z",
    "status": 400,
    "error": "Bad Request",
    "path": "/todo/invalid-uuid"
}
```

#### Add a new PUT endpoint to mark a task as complete.

Add a new PUT endpoint that uses a `uuid` as a path parameter to mark a specific task from the list of tasks as complete. To mark the task as complete the `completed` field should be set to the current time and the `complete` boolean should be set to true. The body of the response should indicate if the request was successful and should contain a boolean `success` flag and a string `message`.
```
{
    "success": true,
    "message": "This task has now been completed."
}
```

If the task is already marked as completed, or the task is not found, then no change is made and the problem should be indicated in the response. If an invalid uuid is supplied the endpoint will return a bad request error.

| URI                                         | Required behaviour                                                                                                                                                                                                                              |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| http://localhost:8080/todo/completed/{uuid} | Mark the task with supplied uuid as complete and return a meaningful response with HTTP status 200. To mark a task as complete the `completed` fields should be set to the current time and the `complete` boolean value should be set to true. |

Given the static data above:

http://localhost:8080/todo/completed/5c3ec8bc-6099-4cd5-b6da-8e2956db3a34 returns
```
{
    "success": true,
    "message": "This task has now been completed."
}
```

with HTTP status 200.

A further call to http://localhost:8080/todo/completed/5c3ec8bc-6099-4cd5-b6da-8e2956db3a34 returns
```
{
    "success": false,
    "message": "Task already marked complete."
}
```

with HTTP status 200.

http://localhost:8080/todo/completed/5c3ec8bc-6099-1a2b-b6da-8e2956db3a34 returns
```
{
    "success": false,
    "message": "Task not found."
}
```

with HTTP status 200.

http://localhost:8080/todo/completed/invalid-uuid returns HTTP status 400 Bad Request. A meaningful response may also be returned, e.g.
```
{
    "timestamp": "2023-06-27T12:32:05.590Z",
    "status": 400,
    "error": "Bad Request",
    "path": "/todo/completed/invalid-uuid"
}
```

#### Add a new POST endpoint to create a new task and add it to the list of tasks.

Add a new POST endpoint that takes two parameters, task `name` and task `description`, that creates a new task item with the given name and description. The `uuid` of the new task will be assigned by the server as a random uuid and the `created` timestamp should be set to the current time. The new item will have no value for the `completed` timestamp and a value of false for the `complete` flag. The body of the response should include the uuid of the new task and a string message.
```
{
    "taskId": "13f8e57c-49dc-4301-afe9-0bcf2e840056",
    "message": "Task {task name} added successfully."
}
```

The status of the response should be 201 (CREATED) for a successful operation. If both name and description parameters are not supplied the endpoint will return a bad request error.

| URI                                                                    | Required behaviour                                                                                             |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| http://localhost:8080/todo/addTask{?name=TaskName&description=Description} | Create a new task with the given name and description, add it to the list of tasks and return HTTP status 201. |

http://localhost:8080/todo/addTask?name=TaskName&description=Description returns:
```
{
    "taskId": "13f8e57c-49dc-4301-afe9-0bcf2e840056",
    "message": "Task TaskName added successfully."
}
```

with HTTP status 201 (CREATED). Note that the uuid will be randomly generated.

http://localhost:8080/todo/addTask?name=Name returns HTTP status 400 Bad Request. A meaningful response may also be returned, e.g.
```
{
    "timestamp": "2023-06-27T12:32:05.590Z",
    "status": 400,
    "error": "Bad Request",
    "path": "/todo/addTask?name=Name"
}
```

### Testing the web service

You can test your web service implementation using Postman and Cypress test suites. The implementation is considered complete when the suite of fifteen Cypress tests all pass.

### More information

For more detailed information check the [Quantifying Generative AI](https://scottlogic.atlassian.net/l/cp/C5VDmLC5) pages on Confluence.