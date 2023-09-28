package com.scottlogic.quantifying.ai.controllers;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scottlogic.quantifying.ai.model.web.CompletionResponse;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import com.scottlogic.quantifying.ai.services.TaskListService;

@RestController
@RequestMapping("todo")
public class TaskListController {

    private final TaskListService taskListService;

    public TaskListController(TaskListService taskListService) {
        this.taskListService = taskListService;
    }

    @GetMapping("")
    public List<ToDoTask> getTasks(@RequestParam(required = false) Boolean isComplete) {
        if (isComplete == null) {
            return taskListService.getAllTasks();
        } else {
            System.out.println("HERE VALUE FOR COMPLETE");
            return taskListService.getFilteredTasksByCompletion(isComplete);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ToDoTask> getTaskByUUID(@PathVariable String id) {
        try {
            UUID uuid = convertStringToUUID(id);
            ToDoTask task = taskListService.getToDoTaskById(uuid);
            return ResponseEntity.ok(task);
        } catch (IllegalArgumentException e) {
            System.out.println("HERE");
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/completed/{id}")
    public ResponseEntity<CompletionResponse> setTaskAsCompleted(@PathVariable String id) {

        try {
            UUID uuid = convertStringToUUID(id);
            taskListService.markTaskComplete(uuid);
            return ResponseEntity
                    .ok(CompletionResponse.builder().success(true).message("This task has now been completed")
                            .build());
        } catch (Exception e) {
            return ResponseEntity
                    .ok().body((CompletionResponse.builder().success(false).message(e.getMessage()).build()));
        }
    }

    @PostMapping("/addTask")
    public ResponseEntity<CompletionResponse> addTask(@RequestParam(required = true) String name,
            @RequestParam(required = true) String description) {
        if (isNullOrEmpty(name) || isNullOrEmpty(description)) {
            CompletionResponse response = CompletionResponse.builder()
                    .success(false)
                    .message("Task name or description cannot be empty.")
                    .build();

            return ResponseEntity.badRequest().body(response);
        }

        ToDoTask task = taskListService.addTask(name, description);

        return new ResponseEntity<>(
                CompletionResponse.builder().success(true).message("Task " + task.getName() + " added successfully.")
                        .taskId(task.getUuid()).build(),
                HttpStatusCode.valueOf(HttpStatus.CREATED.value()));

    }

    private UUID convertStringToUUID(String id) {
        UUID uuid;
        uuid = UUID.fromString(id);
        return uuid;
    }

    private boolean isNullOrEmpty(String value) {
        return Optional.ofNullable(value)
                .map(String::trim)
                .map(s -> s.isBlank() ? null : s)
                .isEmpty();
    }

}
