package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.model.web.*;
import com.scottlogic.quantifying.ai.responses.AddTaskResponse;
import com.scottlogic.quantifying.ai.responses.BadRequestResponse;
import com.scottlogic.quantifying.ai.responses.SetCompletedResponse;
import com.scottlogic.quantifying.ai.services.TaskListService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
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
        if (complete != null && complete) {
            // Return only completed tasks
            return taskListService.getCompletedTasks();
        } else {
            // Return all tasks
            return taskListService.getToDoTaskList();
        }
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<?> getTaskByUuid(@PathVariable String uuid) {
        try {
            UUID taskUuid = UUID.fromString(uuid);

            ToDoTask task = taskListService.getTaskByUuid(taskUuid);

            if (task != null) {
                return ResponseEntity.ok(task);
            } else {
                return ResponseEntity.ok(ToDoTask.UNKNOWN_TASK);
            }
        } catch (IllegalArgumentException e) {
            BadRequestResponse errorResponse = new BadRequestResponse(400, "Bad Request", "/todo/" + uuid);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PutMapping("/completed/{uuid}")
    public ResponseEntity<?> markTaskAsComplete(@PathVariable String uuid) {
        try {
            UUID taskUuid = UUID.fromString(uuid);

            SetCompletedResponse errorResponse;
            ToDoTask task = taskListService.getTaskByUuid(taskUuid);

            if (task != null && task.isComplete()) {
                errorResponse = new SetCompletedResponse(false, "Task already marked complete.");
                return ResponseEntity.status(HttpStatus.OK).body(errorResponse);
            } 
           
            boolean success = taskListService.markTaskAsComplete(taskUuid);

            if (success) {
                SetCompletedResponse response = new SetCompletedResponse(true, "This task has now been completed.");
                return ResponseEntity.ok(response);
            } else {
                errorResponse = new SetCompletedResponse(false, "Task not found.");
                return ResponseEntity.status(HttpStatus.OK).body(errorResponse);
            }
        } catch (IllegalArgumentException e) {
            BadRequestResponse errorResponse = new BadRequestResponse(400, "Bad Request", "/todo/completed/" + uuid);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PostMapping("/addTask")
    public ResponseEntity<?> addTask(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String description
    ) {
        boolean isNameNullOrEmpty = name == null || name == "";
        boolean isDescriptionNullOrEmpty = description == null || description == "";

        if (isNameNullOrEmpty || isDescriptionNullOrEmpty) {
            BadRequestResponse errorResponse = new BadRequestResponse(400, "Bad Request", "/todo/addTask");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }

        UUID taskId = UUID.randomUUID();
        Instant createdTimestamp = Instant.now();

        ToDoTask newTask = new ToDoTask(taskId, name, description, createdTimestamp, null, false);

        taskListService.addTask(newTask);

        String message = "Task " + name + " added successfully.";
        AddTaskResponse response = new AddTaskResponse(taskId.toString(), message);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
