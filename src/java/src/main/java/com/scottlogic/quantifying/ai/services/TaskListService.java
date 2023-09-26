package com.scottlogic.quantifying.ai.services;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;

import jakarta.annotation.PostConstruct;

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

    public List<ToDoTask> getAllTasks() {
        return toDoTaskList;
    }

    public List<ToDoTask> getFilteredTasksByCompletion(Boolean isComplete) {
        if (isComplete) {
            return toDoTaskList.stream().filter(task -> task.isComplete()).toList();
        } else if (!isComplete)
            return toDoTaskList.stream().filter(task -> !task.isComplete()).toList();
        else {
            return toDoTaskList;
        }
    }

    public ToDoTask getToDoTaskById(UUID uuid) {
        if (uuid != null) {
            return toDoTaskList.stream().filter(t -> t.getUuid().equals(uuid)).findFirst().get();
        } else {
            return ToDoTask.UNKNOWN_TASK;
        }
    }

    public void markTaskComplete(UUID id) {
        ToDoTask toDoTask = getToDoTaskById(id);

        if (id != null && toDoTask != null || toDoTask.getName().equals(ToDoTask.UNKNOWN_TASK.getName())) {
            throw new RuntimeException("Task was not found");
        } else if (toDoTask.isComplete()) {
            throw new RuntimeException("Task already is already complete");
        }
        toDoTask.setCompleted(Instant.now());
        toDoTask.setComplete(true);
    }

    public ToDoTask addTask(String name, String description) {
        ToDoTask task = new ToDoTask(name, description, Instant.now(), null, false);
        toDoTaskList.add(task);
        return task;
    }

}
