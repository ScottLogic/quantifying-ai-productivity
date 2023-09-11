package com.scottlogic.quantifying.ai.controllers;

import org.springframework.http.ResponseEntity;
import com.scottlogic.quantifying.ai.model.web.*;
import com.scottlogic.quantifying.ai.services.TaskListService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import javax.servlet.http.HttpServletRequest;


import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("todo")
public class TaskListController {
    @Autowired // Inject the HttpServletRequest
    private HttpServletRequest request;

    private static final ToDoTask UNKNOWN_TASK = new ToDoTask(
            UUID.fromString("00000000-0000-0000-0000-000000000000"),
            "Unknown Task",
            "Unknown Task",
            Instant.ofEpochMilli(0),
            null,
            false
    );
    private final TaskListService taskListService;

    public TaskListController(TaskListService taskListService) {
        this.taskListService = taskListService;
    }

    @GetMapping("")
    public List<ToDoTask> getAllTasks(@RequestParam(name = "complete", required = false) Boolean complete) {
        if (complete != null) {
            // Filter tasks based on the 'complete' parameter
            return taskListService.getToDoTasksByComplete(complete);
        } else {
            // If 'complete' parameter is not provided, return all tasks
            return taskListService.getToDoTaskList();
        }
    }

    @GetMapping("/{uuid}")
    public ToDoTask getTaskByUuid(@PathVariable UUID uuid) {
        ToDoTask task = taskListService.getToDoTaskByUuid(uuid);

        return Optional.ofNullable(task).orElse(UNKNOWN_TASK);
   }

    @PutMapping("/completed/{uuid}")
    public TaskCompleted completeTask(@PathVariable UUID uuid) {
        ToDoTask task = taskListService.getToDoTaskByUuid(uuid);

        if (task == null) {
            // Task not found
            return new TaskCompleted(false, "Task not found.");
        }

        if (task.isComplete()) {
            // Task is already completed
            return new TaskCompleted(false, "Task already marked complete.");
        }

        // Mark the task as complete
        task.setComplete(true);
        task.setCompleted(Instant.now());

        // Return success response
        return new TaskCompleted(true, "This task has now been completed.");
    }

    @PostMapping("/addTask")
    public ResponseEntity<?> addTask(
            @RequestParam(name = "name", required = false) String name,
            @RequestParam(name = "description", required = false) String description) {

        if (name == null || name.isEmpty() || description == null || description.isEmpty()) {
            // build the parameters from the request

            final ErrorResponse errorResponse = new ErrorResponse(
                    HttpStatus.BAD_REQUEST,
                    "/todo/addTask",
                    Instant.now()
            );
            return ResponseEntity
                    .badRequest()
                    .body(errorResponse);
        }

        UUID taskId = UUID.randomUUID();
        ToDoTask newTask = new ToDoTask(taskId, name, description, Instant.now(), null, false);

        taskListService.addTask(newTask);

        String message = "Task " + name + " added successfully.";
        TaskAdded response = new TaskAdded(taskId, message);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}