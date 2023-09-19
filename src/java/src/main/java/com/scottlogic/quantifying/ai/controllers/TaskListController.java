package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.model.web.CompletionResponse;
import com.scottlogic.quantifying.ai.model.web.TaskResponse;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import com.scottlogic.quantifying.ai.services.TaskListService;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("todo")
@Validated
public class TaskListController {

    private final TaskListService taskListService;

    public TaskListController(TaskListService taskListService) {
        this.taskListService = taskListService;
    }

    @GetMapping("")
    public List<ToDoTask> getAllTasks(@RequestParam(required = false) Boolean complete) {
        if (complete == null) {
            return taskListService.getAllTasks();
        } else if (complete) {
            return taskListService.getCompletedTasks();
        } else {
            return taskListService.getIncompleteTasks();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskByUUID(@PathVariable String id) {
        UUID uuid = convertToUUID(id);

        return ResponseEntity.ok(new TaskResponse(taskListService.getTask(uuid)));
    }


    @PutMapping("/completed/{id}")
    public ResponseEntity<CompletionResponse> markTaskAsComplete(@PathVariable String id) {
        UUID uuid = convertToUUID(id);

        try {
            taskListService.markTaskAsComplete(uuid);
            return ResponseEntity.ok(CompletionResponse.builder()
                    .success(true)
                    .message("This task has now been completed.")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(CompletionResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    @PostMapping("/addTask")
    public ResponseEntity<CompletionResponse> addTask(@RequestParam @NotBlank String name,
                                                      @RequestParam @NotBlank String description) {

        ToDoTask toDoTask = taskListService.addTask(name, description);

        return new ResponseEntity<>(CompletionResponse.builder()
                .success(true)
                .message(String.format("Task %s added successfully.", toDoTask.getName()))
                .build(), HttpStatusCode.valueOf(HttpStatus.CREATED.value()));
    }

    private UUID convertToUUID(String id) {
        UUID uuid;
        try {
            uuid = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            throw new ConstraintViolationException("Invalid UUID", null);
        }
        return uuid;
    }
}


