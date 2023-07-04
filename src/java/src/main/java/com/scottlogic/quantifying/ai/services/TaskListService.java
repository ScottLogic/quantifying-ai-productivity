package com.scottlogic.quantifying.ai.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.scottlogic.quantifying.ai.model.web.AddTaskResponse;
import com.scottlogic.quantifying.ai.model.web.CompletionResponse;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
            ObjectMapper objectMapper = JsonMapper.builder().findAndAddModules().build();
            ClassPathResource resource = new ClassPathResource("static/data/ToDoTasks.json");
            InputStream inputStream = resource.getInputStream();
            toDoTaskList = objectMapper.readValue(inputStream, new TypeReference<List<ToDoTask>>() {});
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public List<ToDoTask> getToDoTaskList() {
        return toDoTaskList;
    }

}
