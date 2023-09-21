package com.scottlogic.quantifying.ai.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.scottlogic.quantifying.ai.model.web.CompletionResponse;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.*;

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

    public List<ToDoTask> getToDoTaskList(Boolean complete) {
        if (complete == null) {
            return toDoTaskList;
        }

        return toDoTaskList.stream()
                .filter(task -> task.isComplete() == complete)
                .toList();
    }

    public ToDoTask getToDoTask(UUID uuid)
    {
        return toDoTaskList.stream()
                .filter(task -> task.getUuid().equals(uuid))
                .findFirst()
                .orElse(ToDoTask.UNKNOWN_TASK);
    }

    public CompletionResponse completeTask(UUID uuid)
    {
        ToDoTask task = getToDoTask(uuid);
        if (task == ToDoTask.UNKNOWN_TASK) {
            return new CompletionResponse(false, "Task not found.");
        }

        if (task.isComplete()) {
            return new CompletionResponse(false, "Task already marked complete.");
        }

        task.setComplete(true);
        task.setCompleted(Instant.now());
        return new CompletionResponse(true, "This task has now been completed.");
    }

    public UUID addTask(String name, String description)
    {
        ToDoTask task = new ToDoTask(name, description);
        toDoTaskList.add(task);
        return task.getUuid();
    }
}
