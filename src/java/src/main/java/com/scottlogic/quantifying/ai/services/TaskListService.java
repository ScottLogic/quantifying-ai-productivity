package com.scottlogic.quantifying.ai.services;
import java.util.stream.Collectors;

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

    public List<ToDoTask> getToDoTasksByComplete(boolean complete) {
        return toDoTaskList.stream()
                .filter(task -> task.isComplete() == complete)
                .collect(Collectors.toList());
    }

    public ToDoTask getToDoTaskByUuid(UUID uuid) {
        return toDoTaskList.stream()
                .filter(task -> task.getUuid().equals(uuid))
                .findFirst()
                .orElse(null);
    }

    public void addTask(ToDoTask newTask) {
        toDoTaskList.add(newTask);
    }

    public void resetTasks() {
        toDoTaskList.clear();
        loadToDoList();
    }
}
