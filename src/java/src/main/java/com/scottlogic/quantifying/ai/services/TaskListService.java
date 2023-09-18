package com.scottlogic.quantifying.ai.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.scottlogic.quantifying.ai.dto.AddedTaskDto;
import com.scottlogic.quantifying.ai.dto.CompletedTaskDto;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import io.micrometer.common.util.StringUtils;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

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
            ObjectMapper objectMapper = JsonMapper.builder().findAndAddModules().build();
            InputStream inputStream = getClass().getResourceAsStream("/static_data/ToDoList.json");
            toDoTaskList = objectMapper.readValue(inputStream, new TypeReference<>() {});
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<ToDoTask> getToDoTaskList() {
        return toDoTaskList;
    }

    public ToDoTask getToDoTask(String uuidString) throws Exception {
        UUID uuid = UUID.fromString(uuidString);
        ToDoTask foundTask = toDoTaskList.stream().filter(task -> task.getUuid().equals(uuid)).findFirst().orElse(null);
        if(foundTask == null) throw new Exception();
        return foundTask;
    }

    public CompletedTaskDto completeTask(String uuidString) throws Exception {
        ToDoTask foundTask = getToDoTask(uuidString);
        if(!foundTask.isComplete()) {
            foundTask.setCompleted(Instant.now());
            foundTask.setComplete(true);
            return CompletedTaskDto.success();
        }
        return CompletedTaskDto.failure("Task already marked complete.");
    }

    public AddedTaskDto addTask(String name, String description) throws Exception {
        String path = new StringBuilder("/todo/addTask")
                .append("?name=").append(StringUtils.isBlank(name) ? "" : name)
                .append("&description=").append(StringUtils.isBlank(description) ? "" : description)
                .toString();

        if(StringUtils.isBlank(name) || StringUtils.isBlank(description)) throw new Exception(path + " is not a valid request.");
        if(doesTaskExist(name)) throw new Exception("Task already exists.");

        ToDoTask newTask = new ToDoTask(name, description);
        toDoTaskList.add(newTask);
        return AddedTaskDto.created(newTask);
    }

    private boolean doesTaskExist(String taskName) {
        return toDoTaskList.stream().filter(task -> task.getName().equals(taskName)).findFirst().orElse(null) != null;
    }
}
