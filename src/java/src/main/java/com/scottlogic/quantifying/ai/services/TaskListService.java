package com.scottlogic.quantifying.ai.services;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;

import jakarta.annotation.PostConstruct;

@Service
public class TaskListService {
    private List<ToDoTask> tasks;

    @PostConstruct
    private void initTasks() {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Resource resource = new ClassPathResource("/static/ToDoList.json");
            InputStream inputStream = resource.getInputStream();
            byte[] jsonData = FileCopyUtils.copyToByteArray(inputStream);

            tasks = objectMapper.readValue(jsonData, new TypeReference<List<ToDoTask>>() {
            });

        } catch (IOException e) {
            // Handle the exception, e.g., log an error and initialize tasks to an empty
            // list
            e.printStackTrace();
            tasks = new ArrayList<>();
        }
    }

    public List<ToDoTask> filterTasks(Boolean complete) {
        if (complete == null) {
            return tasks;
        } else {
            return tasks.stream()
                    .filter(task -> task.isComplete() == complete)
                    .collect(Collectors.toList());
        }
    }

    public ToDoTask getTaskByUuid(String uuid) {
        return tasks.stream()
                .filter(task -> task.getUuid().equals(uuid))
                .findFirst()
                .orElse(null);
    }

    public boolean markTaskAsComplete(String uuid) {
        ToDoTask task = getTaskByUuid(uuid);
        if (task != null && !task.isComplete()) {
            task.setCompleted(new Date());
            task.setComplete(true);
            return true;
        }
        return false;
    }

    public void addTask(ToDoTask task) {
        tasks.add(task);
    }
}
