package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.model.web.*;
import com.scottlogic.quantifying.ai.services.TaskListService;
import org.springframework.beans.factory.annotation.Autowired;
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
        ToDoTask toDoTask = taskListService.getToDoTaskById(uuid);

        if (Objects.nonNull(toDoTask)) {
            if (toDoTask == ToDoTask.UNKNOWN_TASK) {
                CompletionResponse response = new CompletionResponse(false, "Task not found.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            } else if (toDoTask.isComplete()) {
                CompletionResponse response = new CompletionResponse(false, "Task already marked complete.");
                return ResponseEntity.ok(response);
            }

            toDoTask.setComplete(true);
            CompletionResponse response = new CompletionResponse(true, "This task has now been completed.");
            return ResponseEntity.ok(response);
        }

        CompletionResponse response = new CompletionResponse(false, "Unexpected error.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @PostMapping("/addTask")
    public ResponseEntity<AddTaskResponse> addTask(@RequestParam() String name, @RequestParam String description) {
        ToDoTask newTask = new ToDoTask(name, description);
        taskListService.addTask(newTask);
        AddTaskResponse response = new AddTaskResponse(newTask.getUuid(), "Task " + newTask.getName() + " added successfully.");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
