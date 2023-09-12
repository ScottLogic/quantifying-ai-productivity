package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.dtos.TaskCompletionResponse;
import com.scottlogic.quantifying.ai.dtos.TaskCreationResponse;
import com.scottlogic.quantifying.ai.exceptions.InvalidUuidException;
import com.scottlogic.quantifying.ai.model.web.*;
import com.scottlogic.quantifying.ai.services.TaskListService;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("todo")
public class TaskListController {

  private final TaskListService taskListService;

  public TaskListController(TaskListService taskListService) {
    this.taskListService = taskListService;
  }

  @GetMapping("")
  public List<ToDoTask> getAllTasks(
      @RequestParam(name = "complete", required = false) Boolean complete) {
    if (complete != null) {
      if (complete) {
        return taskListService.getCompletedTaskList();
      } else {
        return taskListService.getIncompleteTaskList();
      }
    } else {
      return taskListService.getToDoTaskList();
    }
  }

  @GetMapping("/{uuid}")
  public ToDoTask getTaskByUuid(@PathVariable String uuid) {
    try {
      UUID.fromString(uuid);
    } catch (IllegalArgumentException e) {
      throw new InvalidUuidException();
    }

    return taskListService.getTaskByUuid(UUID.fromString(uuid));
  }

  @PutMapping("/completed/{uuid}")
  public TaskCompletionResponse markTaskAsComplete(@PathVariable String uuid) {
    try {
      UUID.fromString(uuid);
    } catch (IllegalArgumentException e) {
      throw new InvalidUuidException();
    }

    ToDoTask task = getTaskByUuid(uuid);

    if (task.isComplete()) {
      return new TaskCompletionResponse(false, "Task already marked complete.");
    }

    if (task == ToDoTask.UNKNOWN_TASK) {
      return new TaskCompletionResponse(false, "Task not found.");
    }

    taskListService.markTaskAsComplete(task);

    return new TaskCompletionResponse(true, "This task has now been completed.");
  }

  @PostMapping("/addTask")
  public ResponseEntity<TaskCreationResponse> addTask(
      @RequestParam String name, @RequestParam String description) {
    ToDoTask task = taskListService.addTask(name, description);

    return ResponseEntity.status(HttpStatus.CREATED)
        .body(
            new TaskCreationResponse(
                task.getUuid().toString(), "Task " + task.getName() + " added successfully."));
  }
}
