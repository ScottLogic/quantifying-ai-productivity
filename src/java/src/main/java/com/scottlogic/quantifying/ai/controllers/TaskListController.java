package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.model.web.*;
import com.scottlogic.quantifying.ai.services.TaskListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.CommandLinePropertySource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("todo")
public class TaskListController {

    @Autowired
    TaskListService taskListService;

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
        CompletionResponse response = taskListService.completeToDoTask(uuid);

        if (response.isSuccess()) {
            return ResponseEntity.ok().body(response);
        }

        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/addTask")
    public ResponseEntity<AddTaskResponse> addTask(@RequestParam() String name, @RequestParam String description) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskListService.addTask(name, description));
    }

}
