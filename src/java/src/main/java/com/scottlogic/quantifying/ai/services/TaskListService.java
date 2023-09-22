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
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskListService {
    List<ToDoTask> toDoTaskList = new ArrayList<>();

    private static final ToDoTask UNKNOWN_TASK = new ToDoTask(
            UUID.fromString("00000000-0000-0000-0000-000000000000"),
            "Unknown Task",
            "Unknown Task",
            Instant.parse("1970-01-01T00:00:00.000Z"),
            null,
            false
    );

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
        var tasks = toDoTaskList.stream()
                .filter(toDoTask -> toDoTask.isComplete() == complete.booleanValue())
                .collect(Collectors.toList());
        return tasks;
    }

    public ToDoTask getTaskByUuid(UUID uuid) {

        return toDoTaskList.stream()
                .filter(toDoTask -> toDoTask.getUuid().equals(uuid))
                .findFirst()
                .orElse(UNKNOWN_TASK);
    }

    public ToDoTask createNewTask(String name, String description) {

        if (name == null || name.isBlank() || description == null || description.isBlank()) {
            throw new IllegalArgumentException("Missing name or description");
        }

        var task = new ToDoTask(name, description);
        toDoTaskList.add(task);
        return task;
    }
}
