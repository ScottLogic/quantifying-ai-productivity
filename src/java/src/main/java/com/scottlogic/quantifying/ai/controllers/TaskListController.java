package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import com.scottlogic.quantifying.ai.services.TaskListService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static com.scottlogic.quantifying.ai.model.web.ToDoTask.UNKNOWN_TASK;
import static java.lang.String.format;

@RestController
@RequestMapping("todo")
public class TaskListController {

    private final TaskListService taskListService;

    public TaskListController(TaskListService taskListService) {
        this.taskListService = taskListService;
    }

    @GetMapping("")
    public List<ToDoTask> getAllTasks(@RequestParam(name = "complete", required = false) Boolean complete) {
        return taskListService.getToDoTaskList(complete);
    }

    @GetMapping("/{uuid}")
    public ToDoTask getTaskByUuid(@PathVariable String uuid) {
        return taskListService.getTaskByUuid(UUID.fromString(uuid));
    }

    @PutMapping("/completed/{uuid}")
    public CompleteStatus markTaskAsComplete(@PathVariable String uuid) {

        var task = taskListService.getTaskByUuid(UUID.fromString(uuid));

        if (task.equals(UNKNOWN_TASK)) {
            return new CompleteStatus(false, "Task not found.");
        }

        if (task.isComplete()) {
            return new CompleteStatus(false, "Task already marked complete.");
        }

        task.setComplete(true);
        task.setCompleted(Instant.now());

        return new CompleteStatus(true, "This task has now been completed.");
    }

    @PostMapping("addTask")
    @ResponseStatus(HttpStatus.CREATED)
    public CreateStatus createNewTask(
            @RequestParam(name = "name") String name,
            @RequestParam(name = "description") String description) {

        var task = taskListService.createNewTask(name, description);

        return new CreateStatus(task.getUuid(), format("Task %s added successfully.", task.getName()));

    }

    public record CompleteStatus(boolean success, String message){}

    public record CreateStatus(UUID taskId, String message){}
}
