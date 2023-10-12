package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import com.scottlogic.quantifying.ai.services.TaskListService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

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
            return taskListService.getToDoTaskList();
        }
        return taskListService.getToDoTaskByIsCompleted(complete);
    }

    @GetMapping("/{uuid}")
    public ToDoTask getTaskByUUID(@PathVariable String uuid) {
        try {
            return taskListService.getToDoTaskByUUID(uuid);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
    }

}
