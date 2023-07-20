package com.scottlogic.todo.services;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.scottlogic.todo.interfaces.ITodoTaskService;
import com.scottlogic.todo.models.Todo;

@Service
public class TodoTaskService implements ITodoTaskService {
    private static List<Todo> todos = new ArrayList<>();
    private static Todo unknownTodo = new Todo(UUID.fromString("00000000-0000-0000-0000-000000000000"),
            "Unknown Task",
            "Unknown Task",
            Instant.parse("1970-01-01T00:00:00Z"),
            null,
            false);

    static {
        if (todos.isEmpty()) {
            todos.addAll(readTodoFromJsonFile());
        }
    }

    private static List<Todo> readTodoFromJsonFile() {
        List<Todo> todoList = new ArrayList<Todo>();
        try {

            File jsonfile = new File("../static_data/ToDoList.json");
            if (!jsonfile.exists()) {
                throw new IOException("File not found: " + jsonfile.getAbsolutePath());
            }
            var filePath = Paths.get(jsonfile.getAbsolutePath());

            byte[] jsonData = Files.readAllBytes(filePath);

            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.findAndRegisterModules();
            objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
            objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"));

            todoList = objectMapper.readValue(jsonData, new TypeReference<>() {
            });

        } catch (IOException e) {
            e.printStackTrace();
        }
        return todoList;
    }

    public Todo getUnknownTodo() {
        return unknownTodo;
    }

    public List<Todo> getTodoList(Boolean complete) {
        if (complete != null) {
            return todos.stream()
                    .filter(todo -> todo.complete() == complete)
                    .collect(Collectors.toList());
        } else {
            return todos;
        }
    }

    public List<Todo> getAllTodos(Boolean complete) {
        return getTodoList(complete);
    }

    public Todo getById(UUID id) {
        Todo todo = todos.stream()
                .filter(t -> t.uuid().equals(id))
                .findFirst()
                .orElse(unknownTodo);

        return todo;
    }

    public Map<String, Object> createTodo(String name, String description) {

        Todo todo = new Todo(name, description);
        todos.add(todo);

        Map<String, Object> response = new HashMap<>();
        response.put("taskId", todo.uuid());
        response.put("message", "Task " + name + " added successfully.");

        return response;
    }

    public Map<String, Object> updateTodo(UUID id) {
        Map<String, Object> response = new HashMap<>();

        Optional<Todo> todoToUpdate = todos.stream()
                .filter(todo -> todo.uuid().equals(id))
                .findFirst();

        if (todoToUpdate.isPresent()) {
            Todo todo = todoToUpdate.get();

            if (todo.complete()) {
                response.put("success", false);
                response.put("message", "Task already marked complete.");
            } else {
                Todo updatedTodo = todo.updateComplete(true);
                int index = todos.indexOf(todo);
                todos.set(index, updatedTodo);

                response.put("success", true);
                response.put("message", "This task has now been completed.");
            }

            return response;
        }

        response.put("success", false);
        response.put("message", "Task not found.");
        return response;
    }
}
