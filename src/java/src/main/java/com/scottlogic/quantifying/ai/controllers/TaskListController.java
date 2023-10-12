package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.model.web.TaskApiError;
import com.scottlogic.quantifying.ai.model.web.TaskCreated;
import com.scottlogic.quantifying.ai.model.web.TaskUpdate;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import com.scottlogic.quantifying.ai.services.TaskListService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
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
        return taskListService.getToDoTaskByUUID(uuid);
    }

    @PutMapping("/completed/{uuid}")
    public TaskUpdate putTaskUpdate(@PathVariable String uuid) {
        return taskListService.markTaskComplete(uuid);
    }

    @PostMapping("/addTask")
    @ResponseStatus(HttpStatus.CREATED)
    public TaskCreated addTask(@RequestParam String name, @RequestParam String description) {
        if (name.isBlank() || description.isBlank()) {
            throw new IllegalArgumentException();
        }
        return taskListService.createTask(name, description);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(IllegalArgumentException.class)
    public TaskApiError handleError(HttpServletRequest request) {
        String path;
        if (request.getQueryString() == null) {
            path = String.format("%s", request.getRequestURI());
        } else {
            path = String.format("%s?%s", request.getRequestURI(), request.getQueryString());
        }
        return new TaskApiError(Instant.now(), HttpStatus.BAD_REQUEST.value(), HttpStatus.BAD_REQUEST.getReasonPhrase(), path);
    }

}
