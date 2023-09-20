package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.model.web.*;
import com.scottlogic.quantifying.ai.services.TaskListService;
import org.springframework.http.HttpStatus;
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
    public List<ToDoTask> getAllTasks(@RequestParam(required = false) Boolean complete) {
        return taskListService.getToDoTaskList(complete);
    }

    @GetMapping("{uuid}")
    public ToDoTask getTask(@PathVariable UUID uuid) {
        return taskListService.getToDoTask(uuid);
    }

    @PutMapping("completed/{uuid}")
    public CompleteTaskResponse completeTask(@PathVariable UUID uuid) {
        return taskListService.completeTask(uuid);
    }

    @PostMapping("addTask")
    @ResponseStatus(HttpStatus.CREATED)
    public CreateTaskResponse createTask(@RequestParam(required = false) String name,
                                         @RequestParam(required = false) String description) {
        return taskListService.createTask(name, description);
    }
}
