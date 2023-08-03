package com.scottlogic.quantifying.ai.controllers;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import com.scottlogic.quantifying.ai.services.TaskListService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/todo")
public class TaskListController {
    @Autowired
    private HttpServletRequest request;

    @Autowired
    private TaskListService taskService;

    @GetMapping
    public ResponseEntity<List<ToDoTask>> getAllTasks(@RequestParam(required = false) Boolean complete) {
        List<ToDoTask> filteredTasks = taskService.filterTasks(complete);
        return ResponseEntity.ok(filteredTasks);
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<Object> getTaskByUuid(@PathVariable String uuid) {
        ToDoTask task;

        try {
            UUID.fromString(uuid); // Check if the provided UUID is valid
            task = taskService.getTaskByUuid(uuid);
        } catch (IllegalArgumentException e) {
            // Return a 400 Bad Request response for an invalid UUID
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("timestamp", new Date());
            errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
            errorResponse.put("error", "Bad Request");
            errorResponse.put("message", "Invalid UUID format: " + uuid);
            errorResponse.put("path", "/todo/" + uuid);

            return ResponseEntity.badRequest().body(errorResponse);
        }

        if (task != null) {
            return ResponseEntity.ok(task);
        } else {
            // Return the generic response for a UUID that doesn't exist
            ToDoTask unknownTask = new ToDoTask();
            unknownTask.setUuid("00000000-0000-0000-0000-000000000000");
            unknownTask.setName("Unknown Task");
            unknownTask.setDescription("Unknown Task");
            unknownTask.setCreated(new Date(0));
            unknownTask.setCompleted(null);
            unknownTask.setComplete(false);

            return ResponseEntity.ok(unknownTask);
        }
    }

    @PutMapping("/completed/{uuid}")
    public ResponseEntity<Object> markTaskAsComplete(@PathVariable String uuid) {

        try {
            UUID.fromString(uuid); // Check if the provided UUID is valid
        } catch (IllegalArgumentException e) {
            // Return a 400 Bad Request response for an invalid UUID
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("timestamp", new Date());
            errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
            errorResponse.put("error", "Bad Request");
            errorResponse.put("message", "Invalid UUID format: " + uuid);
            errorResponse.put("path", "/todo/completed/" + uuid);

            return ResponseEntity.badRequest().body(errorResponse);
        }

        ToDoTask task = taskService.getTaskByUuid(uuid);

        if (task == null) {
            // Task not found, return 200 OK with an error message
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Task not found.");
            return ResponseEntity.ok(response);
        }

        if (task.isComplete()) {
            // Task is already completed, return 200 OK with an error message
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Task already marked complete.");
            return ResponseEntity.ok(response);
        }

        // Mark the task as complete
        task.setCompleted(new Date());
        task.setComplete(true);

        // Return success response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "This task has now been completed.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/addTask")
    public ResponseEntity<Object> addTask(@RequestParam(required = false) String name,
            @RequestParam(required = false) String description) {
        if (name == null || name.trim().isEmpty() || description == null || description.trim().isEmpty()) {
            // Return 400 Bad Request with an error message for missing name or description
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("timestamp", new Date());
            errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
            errorResponse.put("error", "Bad Request");
            errorResponse.put("message", "Both 'name' and 'description' parameters are required.");
            errorResponse.put("path", getRequestPathWithParameters(request));

            return ResponseEntity.badRequest().body(errorResponse);
        }

        // Both name and description are provided and not empty, proceed to add the task
        ToDoTask newTask = new ToDoTask();
        newTask.setUuid(UUID.randomUUID().toString());
        newTask.setName(name);
        newTask.setDescription(description);
        newTask.setCreated(new Date());
        newTask.setComplete(false);

        taskService.addTask(newTask);

        // Return success response with the created task ID
        Map<String, Object> response = new HashMap<>();
        response.put("taskId", newTask.getUuid());
        response.put("message", "Task " + name + " added successfully.");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Helper method to get the relative request path with parameters
    private String getRequestPathWithParameters(HttpServletRequest request) {
        String path = request.getRequestURI();
        String query = request.getQueryString();
        if (query != null && !query.isEmpty()) {
            path += "?" + query;
        }
        return path;
    }
}
