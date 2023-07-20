package com.scottlogic.todo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@SpringBootApplication
public class TodoControllerApplication {

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

    @GetMapping("/todo")
    public List<Todo> getAllTodos(@RequestParam(required = false) Boolean complete) {
        if (complete != null) {
            return todos.stream()
                    .filter(todo -> todo.complete() == complete)
                    .collect(Collectors.toList());
        } else {
            return todos;
        }
    }

    @GetMapping("/todo/{id}")
    public ResponseEntity<Todo> getById(@PathVariable UUID id) {
        Todo todo = todos.stream()
                .filter(t -> t.uuid().equals(id))
                .findFirst()
                .orElse(unknownTodo);

        return ResponseEntity.ok(todo);
    }

    @PostMapping("/todo/addTask")
    public ResponseEntity<Map<String, Object>> createTodo(@RequestParam(required = true) String name,
            @RequestParam(required = true) String description) {
        try {
            if (name.isBlank() || description.isBlank()) {
                return ResponseEntity.badRequest().build();
            }

            Todo todo = new Todo(name, description);
            todos.add(todo);

            Map<String, Object> response = new HashMap<>();
            response.put("taskId", todo.uuid());
            response.put("message", "Task " + name + " added successfully.");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/todo/completed/{id}")
    public ResponseEntity<Map<String, Object>> updateTodo(@PathVariable UUID id) {
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

            return ResponseEntity.ok(response);
        }

        response.put("success", false);
        response.put("message", "Task not found.");
        return ResponseEntity.ok(response);
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

    public static void main(String[] args) {
        SpringApplication.run(TodoControllerApplication.class, args);
    }

}
