package com.scottlogic.quantifying.ai.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.scottlogic.quantifying.ai.model.web.MarkTaskResult;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TaskListService {
    List<ToDoTask> toDoTaskList = new ArrayList<>();

    @PostConstruct
    private void loadToDoList() {
        try {
            File file = new File("../static_data/ToDoList.json");
            ObjectMapper objectMapper = JsonMapper.builder().findAndAddModules().build();
            InputStream inputStream = new FileInputStream(file);
            toDoTaskList = objectMapper.readValue(inputStream, new TypeReference<>() {
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<ToDoTask> getToDoTaskList() {
        return toDoTaskList;
    }

    // Get completed tasks
    public List<ToDoTask> getCompletedTasks() {
        return toDoTaskList.stream()
                .filter(ToDoTask::isComplete) // Assumes ToDoTask has a boolean 'isComplete' method
                .collect(Collectors.toList());
    }

    // Get incomplete tasks
    public List<ToDoTask> getIncompleteTasks() {
        return toDoTaskList.stream()
                .filter(task -> !task.isComplete()) // Assumes ToDoTask has a boolean 'isComplete' method
                .collect(Collectors.toList());
    }

    public ToDoTask getTaskByUUID(UUID taskUUID) {
        for (ToDoTask task : toDoTaskList) {
            if (task.getUuid().equals(taskUUID)) {
                return task; // Found the task with the specified UUID
            }
        }
        return null; // Task with the specified UUID not found
    }

    public MarkTaskResult markTaskAsComplete(UUID taskUUID) {
        for (ToDoTask task : toDoTaskList) {
            if (task.getUuid().equals(taskUUID)) {
                if (task.isComplete()) {
                    return new MarkTaskResult(false, "Task already marked complete.");
                }
                task.setComplete(true);
                task.setCompleted(Instant.now());
                return new MarkTaskResult(true, "This task has now been completed.");
            }
        }
        return new MarkTaskResult(false, "Task not found.");
    }

    public void addTask(ToDoTask newTask) {
        toDoTaskList.add(newTask);
    }

}
