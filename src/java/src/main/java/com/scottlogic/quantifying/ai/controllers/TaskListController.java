package com.scottlogic.quantifying.ai.controllers;


import com.scottlogic.quantifying.ai.dtos.TaskCompletedDTO;
import com.scottlogic.quantifying.ai.dtos.TaskCreatedDTO;
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
    public List<ToDoTask> getAllTasks(@RequestParam(required = false) String complete) {
        if (complete != null) {
            if (complete.equals("true")) {
                return taskListService.getCompletedTaskList();
            } else {
                return taskListService.getIncompleteTaskList();
            }
        }
        return taskListService.getToDoTaskList();
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<ToDoTask> getTask(@PathVariable String uuid) {
        try {
            UUID taskUuid = UUID.fromString(uuid);
            return ResponseEntity.ok(taskListService.getTask(taskUuid));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/completed/{uuid}")
    public ResponseEntity<TaskCompletedDTO> completeTask(@PathVariable String uuid) {
        try {
            UUID taskUuid = UUID.fromString(uuid);
            return ResponseEntity.ok(taskListService.completeTask(taskUuid));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/addTask")
    public ResponseEntity<TaskCreatedDTO> addTask(@RequestParam String name, @RequestParam String description) {
        if (name.isBlank() && description.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(taskListService.addTask(name, description));
    }
}
