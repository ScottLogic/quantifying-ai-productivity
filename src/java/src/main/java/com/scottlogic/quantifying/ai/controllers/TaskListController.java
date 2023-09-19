package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.model.ApiNewTaskResponse;
import com.scottlogic.quantifying.ai.model.ApiResponse;
import com.scottlogic.quantifying.ai.model.web.*;
import com.scottlogic.quantifying.ai.services.TaskListService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("todo")
public class TaskListController {

    private final TaskListService taskListService;

    public TaskListController(TaskListService taskListService) {
        this.taskListService = taskListService;
    }

    @GetMapping("")
    public List<ToDoTask> getAllTasks(@RequestParam(required = false) Boolean complete) {
        if (complete == null) {
            // If 'complete' parameter is not provided, return all tasks
            return taskListService.getToDoTaskList();
        } else if (complete) {
            // If 'complete=true', return only completed tasks
            return taskListService.getCompletedTasks();
        } else {
            // If 'complete=false', return only incomplete tasks
            return taskListService.getIncompleteTasks();
        }
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<ToDoTask> getTaskByUUID(@PathVariable String uuid) {
        try {
            UUID taskUUID = UUID.fromString(uuid);
            ToDoTask task = taskListService.getTaskByUUID(taskUUID);

            if (task != null) {
                return ResponseEntity.ok(task); // Task found, return it with HTTP status 200 OK
            } else {
                return ResponseEntity.ok(ToDoTask.UNKNOWN_TASK);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // Invalid UUID, return 400 Bad Request
        }
    }

    @PutMapping("/completed/{uuid}")
    public ResponseEntity<ApiResponse> markTaskAsComplete(@PathVariable String uuid) {
        try {
            UUID taskUUID = UUID.fromString(uuid);
            MarkTaskResult result = taskListService.markTaskAsComplete(taskUUID);

            if (result.isSuccess()) {
                return ResponseEntity.ok(new ApiResponse(true, "This task has now been completed."));
            } else {
                return ResponseEntity.ok(new ApiResponse(false, result.getMessage()));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Invalid UUID format."));
        }
    }

    @PostMapping("/addTask")
    public ResponseEntity<ApiNewTaskResponse> addTask(@RequestParam(required = true) String name, @RequestParam(required = true) String description) {
        if (name == null || description == null || name == "" || description == "") {
            return ResponseEntity.badRequest().body(null);
        }

        UUID taskUUID = UUID.randomUUID(); // Generate a random UUID

        ToDoTask newTask = new ToDoTask(name, description);
        taskListService.addTask(newTask);

        ApiNewTaskResponse response = new ApiNewTaskResponse(taskUUID.toString(), "Task " + name + " added successfully.");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
