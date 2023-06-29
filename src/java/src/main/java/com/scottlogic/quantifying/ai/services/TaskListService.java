package com.scottlogic.quantifying.ai.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
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

    public List<ToDoTask> getToDoTaskList(Optional<Boolean> completed) {
        if (completed.isPresent()) {
            return toDoTaskList.stream()
                    .filter(t -> t.isComplete() == completed.get())
                    .collect(Collectors.toList());
        }
        return toDoTaskList;
    }

    /**
     * Returns the ToDoTask with the given uuid.
     * If no task is found with the given uuid then the ToDoTask.UNKNOWN_TASK is returned.
     * @param uuid
     * @return The ToDoTask with the given uuid, if found, otherwise ToDoTask.UNKNOWN_TASK is returned.
     */
    public ToDoTask getToDoTaskById(UUID uuid) {
        return toDoTaskList.stream()
                .filter(t -> t.getUuid().equals(uuid))
                .findFirst().orElse(ToDoTask.UNKNOWN_TASK);
    }

    /**
     * Add the given ToDoTask to the list of tasks.
     * @param newTask
     */
    public void addTask(ToDoTask newTask) {
        toDoTaskList.add(newTask);
    }

    /**
     * Marks the ToDoTask with the given uuid as complete.
     * If no task is found with the given uuid then the ToDoTask.UNKNOWN_TASK is returned.
     * @param toDoTask
     */
    public void completeToDoTask(ToDoTask toDoTask) {
        if(toDoTask != ToDoTask.UNKNOWN_TASK) {
            toDoTask.setComplete(true);
        }
    }

}
