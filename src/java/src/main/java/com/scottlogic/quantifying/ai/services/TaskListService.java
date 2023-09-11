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

    public List<ToDoTask> getCompleteTaskList(Boolean completed) {
        return toDoTaskList
                .stream()
                .filter(task -> task.isComplete() == completed)
                .collect(Collectors.toList());
    }

    public ToDoTask getTaskById(UUID taskId) {
        for (ToDoTask task : toDoTaskList) {
            if (task.getUuid().equals(taskId)) {
                return task;
            }
        }
        return null; // Task not found
    }

    public void setComplete(ToDoTask completeTask) {
        for (int i = 0; i < toDoTaskList.size(); i++) {
            ToDoTask task = toDoTaskList.get(i);
            if (task.getUuid().equals(completeTask.getUuid())) {
                toDoTaskList.set(i, completeTask);
                return;
            }
        }
    }

    public ToDoTask createTask (String name, String description) {
        ToDoTask newTask = new ToDoTask(name, description);
        toDoTaskList.add(newTask);
        return newTask;
    }

}
