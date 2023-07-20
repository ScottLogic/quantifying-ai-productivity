package com.scottlogic.todo.interfaces;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.scottlogic.todo.models.Todo;

public interface ITodoTaskService {
    public List<Todo> getAllTodos(Boolean complete);
    public Todo getById(UUID id);
    public Map<String, Object> createTodo(String name, String description);
    public Map<String, Object> updateTodo(UUID id);
    
}
