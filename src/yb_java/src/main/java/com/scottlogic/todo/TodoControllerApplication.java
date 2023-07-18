package com.scottlogic.todo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@SpringBootApplication
public class TodoControllerApplication {

    private static List<Todo> todos = new ArrayList<>(List.of(
            new Todo(UUID.fromString("f360ba09-4682-448b-b32f-0a9e538502fa"),
                    "Walk the dog",
                    "Walk the dog for forty five minutes",
                    LocalDateTime.of(2023, 6, 23, 9, 30, 0),
                    null,
                    false),
            new Todo(UUID.fromString("fd5ff9df-f194-4c6e-966a-71b38f95e14f"),
                    "Mow the lawn",
                    "Mow the lawn in the back garden",
                    LocalDateTime.of(2023, 6, 23, 9, 0, 0),
                    null,
                    false),
            new Todo(UUID.fromString("5c3ec8bc-6099-4cd5-b6da-8e2956db3a34"),
                    "Test generative AI",
                    "Use generative AI technology to write a simple web service",
                    LocalDateTime.of(2023, 6, 23, 9, 0, 0),
                    null,
                    false)
    ));
    private static Todo unknownTodo = new Todo(UUID.fromString("00000000-0000-0000-0000-000000000000"),
            "Unknown Task",
            "Unknown Task",
            LocalDateTime.of(1970, 1, 1, 0, 0, 0),
            null,
            false);

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
                .filter(t -> t.id().equals(id))
                .findFirst()
                .orElse(unknownTodo);

        return ResponseEntity.ok(todo);
    }


    @PostMapping("/todo/addTask")
    public ResponseEntity<Map<String, Object>> createTodo(@RequestParam(required = true) String name, @RequestParam(required = true) String description) {
        try {
            if (name.isBlank() || description.isBlank()) {
                return ResponseEntity.badRequest().build();
            }

            Todo todo = new Todo(name, description);
            todos.add(todo);

            Map<String, Object> response = new HashMap<>();
            response.put("taskId", todo.id());
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
                .filter(todo -> todo.id().equals(id))
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



    public static void main(String[] args) {
        SpringApplication.run(TodoControllerApplication.class, args);
    }

}
