# quantifying-ai

The aim of this experiment is to gain an understanding of the productivity gains that are possible when using generative AI technologies to aid with development and testing work.

## Developers

The development task is to implement a web service that provides endpoints to manage a ToDo list. The choice of implementation language is at your discretion. Skeleton implementations have been provided in C#, Java and JavaScript on the start-here branch. It is also valid to start completely from scratch if you wish.

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

The intial GET endpoint returns the list of tasks held by the server. If you are starting from scratch you need to implement this endpoint before continuing.

## Changes required

### Change the GET endpoint.

Change the existing GET endpoint to accept an optional boolean parameter named complete. The returned list of tasks should be filtered based on the value supplied for the parameter, if supplied.

http://localhost:8080/todo{?complete=true}

A GET endpoint that takes an optional boolean parameter “complete”.
If the parameter is given then the endpoint returns a list of tasks that have been filtered based on the value supplied for the parameter:

| URI                                       | Required behaviour                               |
|-------------------------------------------|--------------------------------------------------|
| http://localhost:8080/todo                | Return a list of all tasks with HTTP status 200. |
| http://localhost:8080/todo?complete=true  | Return a list only containing completed tasks with HTTP status 200. |
| http://localhost:8080/todo?complete=false | Return a list only containing incomplete tasks with HTTP status 200. | 

### Add a new GET endpoint to obtain a task by uuid.

Add a new GET endpoint that uses a uuid as a path parameter to return a specific task from the list of tasks.

http://localhost:8080/todo/{uuid}

A GET endpoint that uses a uuid as a path parameter to return the task with the supplied uuid from the list of tasks. The endpoint returns the task with the given uuid if it exists, otherwise a fixed UNKNOWN_TASK is returned. If an invalid uuid is supplied the endpoint will return a bad request error.

| URI                                       | Required behaviour                               |
|-------------------------------------------|--------------------------------------------------|
| http://localhost:8080/todo/{uuid}         | Return the task with supplied uuid with HTTP status 200. |                                           

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

http://localhost:8080/todo/invalid-uuid returns

```
{
"timestamp": "2023-06-27T12:32:05.590Z",
"status": 400,
"error": "Bad Request",
"path": "/todo/invalid-uuid"
}
```
with HTTP status 400.

### Add a new PUT endpoint to mark a task as complete.

Add a new PUT endpoint that uses a uuid as a path parameter to mark a specific task from the list of tasks as complete. To mark the task as complete the “completed” field should be set to the current time and the “complete” boolean should be set to true. The body of the response should indicate if the request was successful and should contain a boolean success flag and a string message.

```
{
"success": true,
"message": "This task has now been completed."
}
```

 If the task is already marked as completed, or the task is not found, then no change is made and the problem should be indicated in the response. If an invalid uuid is supplied the endpoint will return a bad request error.

| URI                                                 | Required behaviour                               |
|-----------------------------------------------------|--------------------------------------------------|
| http://localhost:8080/todo/completed/{uuid}         | Mark the task with supplied uuid as complete and return a meaningful response with HTTP status 200.<br> To mark a task as complete the “completed” fields should be set to the current time and the<br> “complete” boolean value should be set to true.|

Given the static data above:

http://localhost:8080/todo/5c3ec8bc-6099-4cd5-b6da-8e2956db3a34 returns

```
{
"success": true,
"message": "This task has now been completed."
}
```
with HTTP status 200.

A further call to http://localhost:8080/todo/5c3ec8bc-6099-4cd5-b6da-8e2956db3a34 returns

```
{
"success": false,
"message": "Task already marked complete."
}
```
with HTTP status 200.

http://localhost:8080/todo/5c3ec8bc-6099-1a2b-b6da-8e2956db3a34 returns

```
{
"success": false,
"message": "Task not found."
}
```
with HTTP status 200.

http://localhost:8080/todo/completed/invalid-uuid returns

```
{
"timestamp": "2023-06-27T12:32:05.590Z",
"status": 400,
"error": "Bad Request",
"path": "/todo/completed/invalid-uuid"
}
```
with HTTP status 400.

### Add a new POST endpoint to create a new task and add it to the list of tasks.

Add a new POST endpoint that takes two parameters, task name and task description, that creates a new task item with the given name and description. The uuid of the new task will be assigned by the server as a random uuid and the created timestamp should be set to the current time. The new item will have no value for the completed timestamp and a value of false for the complete flag. The body of the response should include the uuid of the new task and a string message.

```
{
"taskId": "13f8e57c-49dc-4301-afe9-0bcf2e840056",
"message": "Task {task name} added successfully."
}
```

 The status of the response should be 201 (CREATED) for a successful operation. If both name and description parameters are not supplied the endpoint will return a bad request error.


| URI                                                                                      | Required behaviour                               |
|------------------------------------------------------------------------------------------|--------------------------------------------------|
| http://localhost:8080/todo/addTask{?name=Task%20Four&description=Description%20Four}     | Create a new task with the given name and description, <br>add it to the list of tasks and return HTTP status 201.|

http://localhost:8080/todo/addTask?name=Task%20Four&description=Description%20Four returns:

```
{
"taskId": "13f8e57c-49dc-4301-afe9-0bcf2e840056",
"message": "Task Task Four added successfully."
}
```

with HTTP status 201 (CREATED). Note that the uuid will be randomly generated.

http://localhost:8080/todo/addTask?name=Thing%20One returns:

```
{
"timestamp": "2023-06-27T12:32:05.590Z",
"status": 400,
"error": "Bad Request",
"path": "/todo/addTask?name=Thing%20One"
}
```

with HTTP status 400.

# Testers
