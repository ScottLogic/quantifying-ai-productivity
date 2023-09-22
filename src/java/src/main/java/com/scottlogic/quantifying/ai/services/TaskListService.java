package com.scottlogic.quantifying.ai.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;


@Service
@Slf4j
public class TaskListService {

    private final ConcurrentHashMap<UUID, ToDoTask> toDoTaskMap = new ConcurrentHashMap<>();

    // An enum TaskCompletionStatus that would be used to indicate if a task is completed, already completed or not found
    @Getter
    public enum TaskCompletionStatus {
        COMPLETED("This task has now been completed."),
        ALREADY_COMPLETED("Task already marked complete."),
        NOT_FOUND("Task not found.");

        private final String message;

        TaskCompletionStatus(String message) {
            this.message = message;
        }
    }

    @PostConstruct
    private void loadToDoList() {
        try {
            File file = new File("../static_data/ToDoList.json");
            ObjectMapper objectMapper = JsonMapper.builder().findAndAddModules().build();
            InputStream inputStream = new FileInputStream(file);
            List<ToDoTask> toDoTaskList = objectMapper.readValue(inputStream, new TypeReference<>() {});
            toDoTaskList.forEach(task -> toDoTaskMap.put(task.getUuid(), task));
        } catch (IOException e) {
            log.error("Error loading ToDoList.json", e);
        }
    }

    public List<ToDoTask> getToDoTaskList() {
        return new ArrayList<>(toDoTaskMap.values());
    }

    // Create a method that returns a list of ToDoTask objects filtered by the complete parameter.
    public List<ToDoTask> getToDoTaskList(boolean complete) {
        return toDoTaskMap.values().stream().filter(task -> task.isComplete() == complete).collect(Collectors.toList());
    }

    // Create a method that returns a ToDoTask object by uuid or UNKNOWN_TASKS if not found
    public ToDoTask getToDoTaskByUuid(UUID uuid) {
        return Optional.ofNullable(toDoTaskMap.get(uuid)).orElse(ToDoTask.UNKNOWN_TASK);
    }

    // Create a method that mark a task by uuid as complete and save it back to the map. It returns an enum indicating if the task was completed, already completed or not found.
    public TaskCompletionStatus markTaskAsComplete(UUID uuid) {
        ToDoTask toDoTask = toDoTaskMap.get(uuid);
        if (toDoTask == null) {
            return TaskCompletionStatus.NOT_FOUND;
        } else if (toDoTask.isComplete()) {
            return TaskCompletionStatus.ALREADY_COMPLETED;
        } else {
            toDoTask.setComplete(true);
            toDoTaskMap.put(uuid, toDoTask);
            return TaskCompletionStatus.COMPLETED;
        }
    }

    public ToDoTask createTask(String name, String description) {
        ToDoTask toDoTask = new ToDoTask(name, description);
        toDoTaskMap.put(toDoTask.getUuid(), toDoTask);
        return toDoTask;
    }

}
