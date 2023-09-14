package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.model.web.*;
import com.scottlogic.quantifying.ai.services.TaskListService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("todo")
@Validated
public class TaskListController {

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

    @PostMapping("/reset")
    public void resetTasks() {
        taskListService.resetTasks();
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
    public ResponseEntity<TaskAdded> addTask(
            @Valid @RequestParam(name = "name") @NotBlank String name,
            @Valid @RequestParam(name = "description") @NotBlank String description) {
        UUID taskId = UUID.randomUUID();
        ToDoTask newTask = new ToDoTask(taskId, name, description, Instant.now(), null, false);

        taskListService.addTask(newTask);

        String message = "Task " + name + " added successfully.";

        TaskAdded result = new TaskAdded(taskId, message);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}