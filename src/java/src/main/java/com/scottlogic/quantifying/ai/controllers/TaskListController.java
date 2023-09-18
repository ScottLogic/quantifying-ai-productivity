package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.dto.AddedTaskDto;
import com.scottlogic.quantifying.ai.dto.CompletedTaskDto;
import com.scottlogic.quantifying.ai.model.web.*;
import com.scottlogic.quantifying.ai.services.TaskListService;
import io.micrometer.common.util.StringUtils;
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
    public ResponseEntity<List<ToDoTask>> getAllTasks(@RequestParam(required = false) String complete) {
        if(StringUtils.isBlank(complete)) return ResponseEntity.ok(taskListService.getToDoTaskList());
        return ResponseEntity.ok(taskListService.getToDoTaskList().stream().filter(task -> task.isComplete() == Boolean.parseBoolean(complete)).toList());
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<ToDoTask> getTask(@PathVariable String uuid) {
        try {
            return ResponseEntity.ok(taskListService.getToDoTask(uuid));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ToDoTask.UNKNOWN_TASK);
        }
    }

    @PutMapping("/completed/{uuid}")
    public ResponseEntity<CompletedTaskDto> completeTask(@PathVariable String uuid) {
        try {
            return ResponseEntity.ok(taskListService.completeTask(uuid));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(CompletedTaskDto.failure("Task not found."));
        }
    }

    @PostMapping("/addTask")
    public ResponseEntity<AddedTaskDto> addTask(@RequestParam(required = false) String name, @RequestParam(required = false) String description) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(taskListService.addTask(name, description));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(AddedTaskDto.failure(e.getMessage()));
        }
    }
}
