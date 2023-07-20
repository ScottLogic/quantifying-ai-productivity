package com.scottlogic.todo.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.scottlogic.todo.controllers.TodoController;
import com.scottlogic.todo.interfaces.ITodoTaskService;
import com.scottlogic.todo.models.Todo;

import java.util.*;

@RestController
public class TodoController {

    private final ITodoTaskService todoTaskService;

    public TodoController(ITodoTaskService todoTaskService) {
        this.todoTaskService = todoTaskService;
    }

    @GetMapping("/todo")
    public List<Todo> getAllTodos(@RequestParam(required = false) Boolean complete) {
        return todoTaskService.getAllTodos(complete);
    }

    @GetMapping("/todo/{id}")
    public ResponseEntity<Todo> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(todoTaskService.getById(id));
    }

    @PostMapping("/todo/addTask")
    public ResponseEntity<Map<String, Object>> createTodo(@RequestParam(required = true) String name,
            @RequestParam(required = true) String description) {
        try {
            if (name.isBlank() || description.isBlank()) {
                return ResponseEntity.badRequest().build();
            }

            Map<String, Object> response = todoTaskService.createTodo(name, description);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/todo/completed/{id}")
    public ResponseEntity<Map<String, Object>> updateTodo(@PathVariable UUID id) {
        return ResponseEntity.ok(todoTaskService.updateTodo(id));
    }

}
