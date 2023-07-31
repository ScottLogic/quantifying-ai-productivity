package com.scottlogic.quantifying.ai.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.scottlogic.quantifying.ai.model.web.ApiResponse;
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

    public ToDoTask UNKNOWN_TASK;

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
        UNKNOWN_TASK = new ToDoTask(
                UUID.fromString("00000000-0000-0000-0000-000000000000"),
                "Unknown Task",
                "Unknown Task",
                Instant.parse("1970-01-01T00:00:00.000Z"),
                null,
                false);
    }

    public List<ToDoTask> getToDoTaskList() {
        return toDoTaskList;
    }

    public ToDoTask findTodoByUuid(String uuid) {
        return toDoTaskList.stream()
                .filter(todo -> todo.getUuid().equals(UUID.fromString(uuid)))
                .findFirst()
                .orElse(null);
    }

    public ApiResponse updateToDoAsCompleted(String uuid) {
        return toDoTaskList.stream()
                .filter(todo -> todo.getUuid().equals(UUID.fromString(uuid)))
                .findFirst()
                .map(todo -> {
                    if (todo.isComplete()) {
                        return new ApiResponse(
                                false,
                                "Task already marked as completed");
                    } else {
                        todo.setComplete(true);
                        todo.setCompleted(Instant.now());
                        return new ApiResponse(
                                true,
                                "This task has now been completed.");
                    }
                })
                .orElse(new ApiResponse(
                        false,
                        "The task is not found."));
    }

}
