package com.scottlogic.quantifying.ai.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.scottlogic.quantifying.ai.model.web.TaskUpdate;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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

    public List<ToDoTask> getToDoTaskByIsCompleted(boolean isCompleted) {
        return toDoTaskList.stream()
            .filter(task -> task.isComplete() == isCompleted)
            .toList();
    }

    public ToDoTask getToDoTaskByUUID(String id) throws IllegalArgumentException {
        var uuid = UUID.fromString(id);
        return toDoTaskList.stream()
            .filter(task -> task.getUuid().equals(uuid))
            .findFirst()
            .orElse(ToDoTask.UNKNOWN_TASK);
    }

    public TaskUpdate markTaskComplete(String id) throws IllegalArgumentException {
        var task = getToDoTaskByUUID(id);

        if(task.equals(ToDoTask.UNKNOWN_TASK)) {
            return new TaskUpdate(false, "Task not found.");
        }

        if(task.isComplete()) {
            return new TaskUpdate(false, "Task already marked complete.");
        }

        task.setCompleted(Instant.now());
        task.setComplete(true);
        return new TaskUpdate(true, "This task has now been completed.");
    }

}
