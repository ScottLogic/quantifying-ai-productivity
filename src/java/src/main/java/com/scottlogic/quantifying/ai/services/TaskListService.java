package com.scottlogic.quantifying.ai.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.scottlogic.quantifying.ai.exceptions.BadRequestException;
import com.scottlogic.quantifying.ai.model.web.CompleteTaskResponse;
import com.scottlogic.quantifying.ai.model.web.CreateTaskResponse;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.*;

import static com.scottlogic.quantifying.ai.model.web.ToDoTask.UNKNOWN_TASK;

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

    public ToDoTask getToDoTask(UUID uuid) {
        Optional<ToDoTask> result = toDoTaskList.stream()
                .filter(task -> task.getUuid().equals(uuid))
                .findFirst();

        return result.orElseGet(() -> UNKNOWN_TASK);
    }

    public CompleteTaskResponse completeTask(UUID uuid) {
        ToDoTask task = getToDoTask(uuid);

        if (task.equals(UNKNOWN_TASK)) {
            return new CompleteTaskResponse(false, "Task not found.");
        }

        if (task.isComplete()) {
            return new CompleteTaskResponse(false, "Task already marked complete.");
        }

        task.setComplete(true);
        task.setCompleted(Instant.now());

        return new CompleteTaskResponse(true, "This task has now been completed.");
    }

    public CreateTaskResponse createTask(String name, String description) {
        if (isBlank(name) || isBlank(description)) {
            throw new BadRequestException("At least one of name and description must be provided.");
        }

        ToDoTask task = new ToDoTask(name, description);
        toDoTaskList.add(task);
        return CreateTaskResponse.fromToDoTask(task);
    }

    private boolean isBlank(String s) {
        return s == null || s.equals("");
    }
}
