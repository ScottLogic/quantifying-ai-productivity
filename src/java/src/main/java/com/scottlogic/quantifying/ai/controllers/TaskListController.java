package com.scottlogic.quantifying.ai.controllers;

import java.util.List;
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

import com.scottlogic.quantifying.ai.model.web.AddTaskCompletionResponse;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import com.scottlogic.quantifying.ai.model.web.UpdateTaskCompletionResponse;
import com.scottlogic.quantifying.ai.services.TaskListService;

import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("todo")
public class TaskListController {

    private final TaskListService taskListService;

    public TaskListController(TaskListService taskListService) {
        this.taskListService = taskListService;
    }

    @GetMapping("")
    public List<ToDoTask> getAllTasks(@RequestParam(required = false) Boolean isComplete) {
        if (isComplete == null) {
            return taskListService.getAllTasks();
        } else {
            return taskListService.getFilteredTasksByCompletion(isComplete);
        }
    }

    @GetMapping("/{completed}")
    public List<ToDoTask> getTaskByCompleted(@PathVariable boolean isComplete) {
        return taskListService.getFilteredTasksByCompletion(isComplete);
    }

    @GetMapping("/{uuid}")
    public ToDoTask getTaskByUUID(@PathVariable UUID uuid) {
        return taskListService.getToDoTaskById(uuid);
    }

    @PutMapping("/completed/{uuid}")
    public ResponseEntity<UpdateTaskCompletionResponse> setTaskAsCompleted(@PathVariable UUID uuid) {

        try {
            taskListService.markTaskComplete(uuid);
            return ResponseEntity
                    .ok(UpdateTaskCompletionResponse.builder().success(true).message("This task has now been completed")
                            .build());
        } catch (Exception e) {
            return ResponseEntity
                    .ok(UpdateTaskCompletionResponse.builder().success(false).message(e.getMessage()).build());
        }
    }

    @PostMapping("/addTask")
    public ResponseEntity<AddTaskCompletionResponse> addTask(@RequestParam @NotBlank String name,
            @RequestParam @NotBlank String description) {

        ToDoTask task = taskListService.addTask(name, description);

        return new ResponseEntity<>(
                AddTaskCompletionResponse.builder().taskId(task.getUuid())
                        .message("Task " + task.getName() + " added successfully.").build(),
                HttpStatusCode.valueOf(HttpStatus.CREATED.value()));

    }

}
