package com.scottlogic.quantifying.ai.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TaskListService {
    List<ToDoTask> toDoTasks = new ArrayList<>();

    @PostConstruct
    private void loadToDoList() {
        try {
            File file = new File("../static_data/ToDoList.json");
            ObjectMapper objectMapper = JsonMapper.builder().findAndAddModules().build();
            InputStream inputStream = new FileInputStream(file);
            toDoTasks = objectMapper.readValue(inputStream, new TypeReference<>() {
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<ToDoTask> getAllTasks() {
        return toDoTasks;
    }

    public List<ToDoTask> getCompletedTasks() {
        List<ToDoTask> completedTasks = new ArrayList<>();

        for (ToDoTask task : toDoTasks) {
            if (task.isComplete()) {
                completedTasks.add(task);
            }
        }

        return completedTasks;
    }

    public List<ToDoTask> getIncompleteTasks() {
        List<ToDoTask> incompleteTasks = new ArrayList<>();

        for (ToDoTask task : toDoTasks) {
            if (!task.isComplete()) {
                incompleteTasks.add(task);
            }
        }

        return incompleteTasks;
    }

    public ToDoTask getTask(UUID uuid) {
        for (ToDoTask task : toDoTasks) {
            if (task.getUuid().equals(uuid)) {
                return task;
            }
        }

        return ToDoTask.UNKNOWN_TASK;
    }

    public void markTaskAsComplete(UUID uuid) {
        ToDoTask task = getTask(uuid);

        if (task == null || task.getName().equals(ToDoTask.UNKNOWN_TASK.getName())) {
            throw new RuntimeException("Task not found.");
        } else if (task.isComplete()) {
            throw new RuntimeException("Task already marked complete.");
        }

        task.setComplete(true);
    }

    public ToDoTask addTask(String name, String description) {
        ToDoTask task = new ToDoTask(name, description);
        toDoTasks.add(task);
        return task;
    }
}
