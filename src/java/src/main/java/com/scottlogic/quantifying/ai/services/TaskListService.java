package com.scottlogic.quantifying.ai.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
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
            toDoTaskList = objectMapper.readValue(inputStream, new TypeReference<>() {});
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<ToDoTask> getToDoTaskList() {
        return toDoTaskList;
    }

    public List<ToDoTask> getCompletedTasks() {
    // Filter the list to only include completed tasks
    return toDoTaskList.stream()
        .filter(ToDoTask::isComplete)
        .collect(Collectors.toList());
    }

    public ToDoTask getTaskByUuid(UUID uuid) {
        return toDoTaskList.stream()
                .filter(task -> task.getUuid().equals(uuid))
                .findFirst()
                .orElse(null);
    }

    public boolean markTaskAsComplete(UUID uuid) {
        for (ToDoTask task : toDoTaskList) {
            if (task.getUuid().equals(uuid)) {
                task.setComplete(true);
                task.setCompleted(Instant.now());
                return true;
            }
        }
        return false;
    }
    
    public void addTask(ToDoTask task) {
        toDoTaskList.add(task);
    }

}
