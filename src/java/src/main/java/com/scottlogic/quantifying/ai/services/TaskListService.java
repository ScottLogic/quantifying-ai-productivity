package com.scottlogic.quantifying.ai.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.*;
import org.springframework.stereotype.Service;

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
    return toDoTaskList.stream().filter(ToDoTask::isComplete).toList();
  }

  public List<ToDoTask> getIncompleteTaskList() {
    return toDoTaskList.stream().filter(task -> !task.isComplete()).toList();
  }

  public ToDoTask getTaskByUuid(UUID uuid) {
    return toDoTaskList.stream()
        .filter(task -> task.getUuid().equals(uuid))
        .findFirst()
        .orElse(ToDoTask.UNKNOWN_TASK);
  }

  public void markTaskAsComplete(ToDoTask task) {
    task.setCompleted(Instant.now());
    task.setComplete(true);
  }

  public ToDoTask addTask(String name, String description) {
    ToDoTask newTask = new ToDoTask(name, description, Instant.now(), null, false);
    toDoTaskList.add(newTask);
    return newTask;
  }
}
