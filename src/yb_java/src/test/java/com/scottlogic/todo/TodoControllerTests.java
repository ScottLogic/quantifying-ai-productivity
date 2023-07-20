package com.scottlogic.todo;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.scottlogic.todo.controllers.TodoController;
import com.scottlogic.todo.interfaces.ITodoTaskService;
import com.scottlogic.todo.models.Todo;

import java.util.*;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class TodoControllerTests {

    private MockMvc mockMvc;

    @Mock
    private ITodoTaskService todoTaskService;

    @InjectMocks
    private TodoController todoController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(todoController).build();
    }

    @Test
    public void testGetAllTodos() throws Exception {
        List<Todo> todos = new ArrayList<>();
        todos.add(new Todo(UUID.randomUUID(), "Task 1", "Description 1", null, null, false));
        todos.add(new Todo(UUID.randomUUID(), "Task 2", "Description 2", null, null, true));

        when(todoTaskService.getAllTodos(null)).thenReturn(todos);

        mockMvc.perform(MockMvcRequestBuilders.get("/todo"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(todos.size()))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Task 1"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("Task 2"));

        verify(todoTaskService, times(1)).getAllTodos(null);
    }

    @Test
    public void testGetTodoById() throws Exception {
        UUID todoId = UUID.randomUUID();
        Todo todo = new Todo(todoId, "Task", "Description", null, null, false);

        when(todoTaskService.getById(todoId)).thenReturn(todo);

        mockMvc.perform(MockMvcRequestBuilders.get("/todo/{id}", todoId))
                .andExpect(MockMvcResultMatchers.status().isOk())
                //.andExpect(MockMvcResultMatchers.jsonPath("$.id").value(todoId.toString()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Task"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.complete").value(false));

        verify(todoTaskService, times(1)).getById(todoId);
    }

    @Test
    public void testCreateTodo() throws Exception {
        String name = "New Task";
        String description = "New Description";

        Map<String, Object> response = new HashMap<>();
        response.put("taskId", UUID.randomUUID());
        response.put("message", "Task " + name + " added successfully.");

        when(todoTaskService.createTodo(name, description)).thenReturn(response);

        mockMvc.perform(MockMvcRequestBuilders.post("/todo/addTask")
                .param("name", name)
                .param("description", description))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.taskId").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("Task " + name + " added successfully."));

        verify(todoTaskService, times(1)).createTodo(name, description);
    }

    @Test
    public void testCreateTodoWithInvalidParameters() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/todo/addTask")
                .param("name", "")
                .param("description", ""))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());

        verify(todoTaskService, never()).createTodo(anyString(), anyString());
    }

    @Test
    public void testUpdateTodo() throws Exception {
        UUID todoId = UUID.randomUUID();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "This task has now been completed.");

        when(todoTaskService.updateTodo(todoId)).thenReturn(response);

        mockMvc.perform(MockMvcRequestBuilders.put("/todo/completed/{id}", todoId))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.success").value(true))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value("This task has now been completed."));

        verify(todoTaskService, times(1)).updateTodo(todoId);
    }
}
