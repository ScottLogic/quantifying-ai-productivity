package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.model.web.*;
import com.scottlogic.quantifying.ai.services.TaskListService;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

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
        } else {
            return taskListService.getToDoTaskList()
                    .stream()
                    .filter(todo -> todo.isComplete() == complete)
                    .collect(Collectors.toList());
        }
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<ToDoTask> getTodoByUuid(@PathVariable String uuid) {
        try {
            ToDoTask todo = taskListService.findTodoByUuid(uuid);
            if (todo != null) {
                return ResponseEntity.ok(todo);
            } else {
                return ResponseEntity.ok(taskListService.UNKNOWN_TASK);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }

    }

    @PutMapping("/completed/{uuid}")
    public ResponseEntity<ApiResponse> markTodoAsCompleted(@PathVariable String uuid) {
        try {
            ApiResponse response = taskListService.updateToDoAsCompleted(uuid);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

}
