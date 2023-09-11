package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.response.CompleteResponse;
import com.scottlogic.quantifying.ai.model.web.*;
import com.scottlogic.quantifying.ai.response.CreateResponse;
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
    public List<ToDoTask> getAllTasks(@RequestParam(name = "complete", required = false) Boolean complete) {
        if (complete == null) return taskListService.getToDoTaskList();

        return taskListService.getCompleteTaskList(complete);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<ToDoTask> getById(@PathVariable("taskId") UUID id) {
        ToDoTask task = taskListService.getTaskById(id);

        if (task != null) {
            return new ResponseEntity<>(task, HttpStatus.OK);
        }

        return new ResponseEntity<>(ToDoTask.UNKNOWN_TASK, HttpStatus.OK);
    }

    @PutMapping("completed/{taskId}")
    public CompleteResponse setComplete(@PathVariable("taskId")UUID id) {
        ToDoTask task = taskListService.getTaskById(id);

        if (task == null) return new CompleteResponse(false, "Task not found");
        if (task.isComplete()) return new CompleteResponse(false, "Task already marked as complete");

        task.setComplete(true);
        taskListService.setComplete(task);
        return new CompleteResponse(true, "This task has now been completed");
    }

    @PostMapping("/addTask")
    public ResponseEntity<CreateResponse> createTask(@RequestParam String name, @RequestParam String description) {
        ToDoTask createdTask = taskListService.createTask(name, description);
        CreateResponse response =  new CreateResponse(createdTask.getUuid(), String.format("Task %s added " +
                        "successfully",
            createdTask.getName()));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


}
