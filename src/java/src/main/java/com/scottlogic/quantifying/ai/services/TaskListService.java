package com.scottlogic.quantifying.ai.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.scottlogic.quantifying.ai.model.web.AddTaskErrorResponse;
import com.scottlogic.quantifying.ai.model.web.AddTaskResponse;
import com.scottlogic.quantifying.ai.model.web.CompletionResponse;
import com.scottlogic.quantifying.ai.model.web.ToDoTask;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    public List<ToDoTask> getToDoTaskList(Optional<Boolean> completed) {
        if (completed.isPresent()) {
            return toDoTaskList.stream()
                    .filter(t -> t.isComplete() == completed.get())
                    .toList();
        }
        return toDoTaskList;
    }

    /**
     * Returns the ToDoTask with the given uuid.
     * If no task is found with the given uuid then the ToDoTask.UNKNOWN_TASK is returned.
     * @param uuid The supplied uuid.
     * @return The ToDoTask with the given uuid, if found, otherwise ToDoTask.UNKNOWN_TASK is returned.
     */
    public ToDoTask getToDoTaskById(UUID uuid) {
        return toDoTaskList.stream()
                .filter(t -> t.getUuid().equals(uuid))
                .findFirst().orElse(ToDoTask.UNKNOWN_TASK);
    }

    /**
     * Add the given ToDoTask to the list of tasks.
     * @param name The name for the new task.
     * @param description The description for the new task.
     */
    public ResponseEntity<Object> addTask(String name, String description, HttpServletRequest request) {
        if (name.isEmpty() || description.isEmpty()) {
            AddTaskErrorResponse errorResponse = new AddTaskErrorResponse("Bad Request",
                    request.getRequestURI() + (request.getQueryString() != null ? "?" + request.getQueryString() : ""));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }

        ToDoTask newTask = new ToDoTask(name, description);
        toDoTaskList.add(newTask);
        return ResponseEntity.status(HttpStatus.CREATED).body(new AddTaskResponse(newTask.getUuid(),
                "Task " + newTask.getName() + " added successfully."));
    }

    /**
     * Marks the ToDoTask with the given uuid as complete.
     * If no task is found with the given uuid then "Task not found." is returned.
     * If the task is found and is already marked complete then "Task already marked complete." is returned.
     * @param uuid The uuid of the task to be marked complete.
     */
    public ResponseEntity<CompletionResponse> completeToDoTask(UUID uuid) {
        ToDoTask toDoTask = getToDoTaskById(uuid);

        if (Objects.nonNull(toDoTask)) {
            if (toDoTask == ToDoTask.UNKNOWN_TASK) {
                return ResponseEntity.ok().body(new CompletionResponse(false, "Task not found."));
            } else if (toDoTask.isComplete()) {
                return ResponseEntity.ok().body(new CompletionResponse(false, "Task already marked complete."));
            }

            toDoTask.setComplete(true);
            return ResponseEntity.ok().body(new CompletionResponse(true, "This task has now been completed."));
        }

        return ResponseEntity.badRequest().body(new CompletionResponse(false, "Unexpected error."));
    }

}
