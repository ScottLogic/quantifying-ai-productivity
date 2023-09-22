package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.model.dto.CreateTaskResponse;
import com.scottlogic.quantifying.ai.model.dto.SuccessResponse;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import com.scottlogic.quantifying.ai.services.TaskListService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.scottlogic.quantifying.ai.services.TaskListService.TaskCompletionStatus.COMPLETED;

@RestController
@RequestMapping("todo")
@Slf4j
@AllArgsConstructor
public class TaskListController {

    private final TaskListService taskListService;

    // A GET endpoint that returns all tasks in the list of tasks. The query parameter complete is optional. It should return all task if not provided otherwise it should be filtered by the complete parameter.
    @GetMapping
    public List<ToDoTask> getAllTasks(@RequestParam Optional<Boolean> complete) {
        return complete.map(taskListService::getToDoTaskList).orElse(taskListService.getToDoTaskList());
    }

    // A GET endpoint that uses a string as a path parameter representing a UUID and use it to return the task with the supplied uuid from the list of tasks. The endpoint returns the task with the given uuid if it exists, otherwise a fixed UNKNOWN_TASK is returned. If an invalid uuid is supplied the endpoint will return a bad request error with a well-formed json response body.
    @GetMapping("/{uuid}")
    public ToDoTask getTaskByUuid(@PathVariable String uuid) {
        return taskListService.getToDoTaskByUuid(UUID.fromString(uuid));
    }

    // Could not find a nice prompt... :S
    // None would yield a good result at all :(
    @PutMapping("/completed/{uuid}")
    public ResponseEntity<SuccessResponse> markTaskAsComplete(@PathVariable String uuid) {
        TaskListService.TaskCompletionStatus taskCompletionStatus = taskListService.markTaskAsComplete(UUID.fromString(uuid));
        return ResponseEntity.ok(new SuccessResponse(taskCompletionStatus == COMPLETED, taskCompletionStatus.getMessage()));
    }

    // Add a new POST endpoint to create a new task and add it to the list of tasks.
    // Add a new POST endpoint that takes two parameters, task name and task description, that creates a new task item with the given name and description. The uuid of the new task will be assigned by the server as a random uuid and the created timestamp should be set to the current time. The new item will have no value for the completed timestamp and a value of false for the complete flag. The body of the response should include the uuid of the new task and a string message.
    // http://localhost:8080/todo/addTask{?name=TaskName&description=Description} will Create a new task with the given name and description, add it to the list of tasks and return HTTP status 201.
    // For eg: http://localhost:8080/todo/addTask?name=TaskName&description=Description returns: will return:
    // {
    //    "taskId": "13f8e57c-49dc-4301-afe9-0bcf2e840056",
    //    "message": "Task TaskName added successfully."
    // }
    @PostMapping("/addTask")
    public ResponseEntity<CreateTaskResponse> createTask(@RequestParam String name, @RequestParam String description) {
        if (!StringUtils.hasText(name) || !StringUtils.hasText(description)) {
            throw new IllegalArgumentException("Name and description cannot be empty");
        }
        ToDoTask toDoTask = taskListService.createTask(name, description);
        return ResponseEntity.status(HttpStatus.CREATED).body(new CreateTaskResponse(toDoTask.getUuid(), "Task " + name + " added successfully."));
    }

}
