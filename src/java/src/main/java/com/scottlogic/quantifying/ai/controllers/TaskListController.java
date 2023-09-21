package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.model.web.*;
import com.scottlogic.quantifying.ai.services.TaskListService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.*;

@RestController
@RequestMapping("todo")
public class TaskListController
{

    private final TaskListService taskListService;

    public TaskListController(TaskListService taskListService)
    {
        this.taskListService = taskListService;
    }

    @GetMapping("")
    public ResponseEntity<List<ToDoTask>> getAllTasks(@RequestParam(required = false) Boolean complete)
    {
        return ResponseEntity.ok(taskListService.getToDoTaskList(complete));
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<ToDoTask> getTask(@PathVariable String uuid)
    {
        try
        {
            return ResponseEntity.ok(taskListService.getToDoTask(UUID.fromString(uuid)));
        }
        catch (IllegalArgumentException e)
        {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/completed/{uuid}")
    public ResponseEntity<CompletionResponse> completeTask(@PathVariable String uuid)
    {
        try
        {
            return ResponseEntity.ok(taskListService.completeTask(UUID.fromString(uuid)));
        }
        catch (IllegalArgumentException e)
        {
            return ResponseEntity.badRequest()
                    .body(new CompletionResponse(false, String.format("Invalid UUID: %s.", uuid)));
        }
    }

    @PostMapping("addTask")
    public ResponseEntity<CompletionResponse> addTask(
            @RequestParam(required = true) String name,
            @RequestParam(required = true) String description)
    {
        if (Optional.ofNullable(name).isEmpty() || Optional.ofNullable(description).isEmpty())
        {
            return ResponseEntity.badRequest()
                    .body(new CompletionResponse(false, "Task name or description cannot be empty."));
        }

        final UUID uuid = taskListService.addTask(name, description);

        return ResponseEntity.created(URI.create(String.format("/todo/%s", uuid)))
                .body(new CompletionResponse(true, String.format("Task %s added successfully.", name)));
    }

}
