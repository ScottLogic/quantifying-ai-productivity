package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.model.web.*;
import com.scottlogic.quantifying.ai.services.TaskListService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("todo")
public class TaskListController {

    private final TaskListService taskListService;

    public TaskListController(TaskListService taskListService) {
        this.taskListService = taskListService;
    }

    @GetMapping("")
    public List<ToDoTask> getAllTasks(@RequestParam Optional<Boolean> complete) {
        return taskListService.getToDoTaskList(complete);
    }

    @GetMapping("/{uuid}")
    public ToDoTask getTaskById(@PathVariable UUID uuid) {
        return taskListService.getToDoTaskById(uuid);
    }

    @PutMapping("/completed/{uuid}")
    public ResponseEntity<CompletionResponse> markTaskAsCompleted(@PathVariable UUID uuid) {
        return taskListService.completeToDoTask(uuid);
    }

    @PostMapping("/addTask")
    public ResponseEntity<AddTaskResponse> addTask(@RequestParam() String name, @RequestParam String description) {
        return taskListService.addTask(name, description);
    }

}
