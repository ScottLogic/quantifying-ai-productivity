package com.scottlogic.quantifying.ai.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.scottlogic.quantifying.ai.dtos.TaskCompletedDTO;
import com.scottlogic.quantifying.ai.dtos.TaskCreatedDTO;
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

    public List<ToDoTask> getCompletedTaskList() {
        List<ToDoTask> completedTaskList = new ArrayList<>();
        for (ToDoTask task : toDoTaskList) {
            if (task.isComplete()) {
                completedTaskList.add(task);
            }
        }
        return completedTaskList;
    }

    public List<ToDoTask> getIncompleteTaskList() {
        List<ToDoTask> incompleteTaskList = new ArrayList<>();
        for (ToDoTask task : toDoTaskList) {
            if (!task.isComplete()) {
                incompleteTaskList.add(task);
            }
        }
        return incompleteTaskList;
    }

    public ToDoTask getTask(UUID uuid) {
        for (ToDoTask task : toDoTaskList) {
            if (task.getUuid().equals(uuid)) {
                return task;
            }
        }
        return ToDoTask.UNKNOWN_TASK;
    }

    public TaskCompletedDTO completeTask(UUID uuid) {
        ToDoTask task = getTask(uuid);
        if (task.isComplete()) {
            return new TaskCompletedDTO(false, "Task already marked complete.");
        }

        if (task == ToDoTask.UNKNOWN_TASK) {
            return new TaskCompletedDTO(false, "Task not found.");
        }

        task.setComplete(true);
        return new TaskCompletedDTO(true, "This task has now been completed.");
    }

    public TaskCreatedDTO addTask(String name, String description) {
        ToDoTask newTask = new ToDoTask(name, description);
        toDoTaskList.add(newTask);
        return new TaskCreatedDTO(newTask.getUuid().toString(), "Task " + newTask.getName() + " added successfully.");
    }
}
