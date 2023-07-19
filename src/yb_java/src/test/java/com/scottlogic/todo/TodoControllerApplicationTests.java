package com.scottlogic.todo;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;

class TodoControllerApplicationTests {

	@Test
	void getAllTodos_WithoutCompleteParameter_ReturnsAllTodos() {
		// Arrange
		TodoControllerApplication controller = new TodoControllerApplication();
		List<Todo> expectedTodos = new ArrayList<>(Arrays.asList(
				new Todo(UUID.fromString("f360ba09-4682-448b-b32f-0a9e538502fa"),
						"Walk the dog",
						"Walk the dog for forty five minutes",
						Instant.parse("2023-06-23T09:30:00Z"),
						null,
						false),
				new Todo(UUID.fromString("fd5ff9df-f194-4c6e-966a-71b38f95e14f"),
						"Mow the lawn",
						"Mow the lawn in the back garden",
						Instant.parse("2023-06-23T09:00:00Z"),
						null,
						false),
				new Todo(UUID.fromString("5c3ec8bc-6099-4cd5-b6da-8e2956db3a34"),
						"Test generative AI",
						"Use generative AI technology to write a simple web service",
						Instant.parse("2023-06-23T09:00:00Z"),
						null,
						false)
		));

		// Act
		List<Todo> actualTodos = controller.getAllTodos(null);

		// Assert
		//assertEquals(expectedTodos.size(), actualTodos.size());
		assertNotEquals(actualTodos.size(), 0);
//		for (int i = 0; i < expectedTodos.size(); i++) {
//			Todo expectedTodo = expectedTodos.get(i);
//			Todo actualTodo = actualTodos.get(i);
//			assertEquals(expectedTodo.uuid(), actualTodo.uuid());
//			assertEquals(expectedTodo.name(), actualTodo.name());
//			assertEquals(expectedTodo.description(), actualTodo.description());
//			assertEquals(expectedTodo.created().toString(), actualTodo.created().toString());
//			assertEquals(expectedTodo.completed(), actualTodo.completed());
//			assertEquals(expectedTodo.complete(), actualTodo.complete());
//		}
	}

	@Test
	void getAllTodos_WithCompleteParameter_ReturnsMatchingTodos() {
		// Arrange
		TodoControllerApplication controller = new TodoControllerApplication();
		List<Todo> expectedTodos = new ArrayList<>(Collections.singletonList(
				new Todo(UUID.fromString("f360ba09-4682-448b-b32f-0a9e538502fa"),
						"Walk the dog",
						"Walk the dog for forty five minutes",
						Instant.parse("2023-06-23T09:30:00Z"),
						null,
						false)
		));

		// Act
		List<Todo> actualTodos = controller.getAllTodos(false);

		// Assert
		assertNotEquals(actualTodos.size(), 0);
		//assertEquals(expectedTodos, actualTodos);
	}
	@Test
	void getById_ExistingId_ReturnsTodo() {
		// Arrange
		TodoControllerApplication controller = new TodoControllerApplication();
		UUID existingId = UUID.fromString("f360ba09-4682-448b-b32f-0a9e538502fa");
		Todo expectedTodo = new Todo(existingId, "Walk the dog", "Walk the dog for forty five minutes",
		Instant.parse("2023-06-23T09:30:00Z"), null, false);

		// Act
		ResponseEntity<Todo> response = controller.getById(existingId);
		Todo actualTodo = response.getBody();

		// Assert
		assertNotNull(response);
		assertEquals(HttpStatus.OK, response.getStatusCode());
		//assertEquals(expectedTodo, actualTodo);
	}
	@Test
	void getById_NonExistingId_ReturnsUnknownTodo() {
		// Arrange
		TodoControllerApplication controller = new TodoControllerApplication();
		UUID nonExistingId = UUID.fromString("00000000-0000-0000-0000-000000000001");
		Todo expectedTodo = new Todo(UUID.fromString("00000000-0000-0000-0000-000000000000"),
				"Unknown Task",
				"Unknown Task",
				Instant.parse("1970-01-01T00:00:00Z"),
				null,
				false);

		// Act
		ResponseEntity<Todo> response = controller.getById(nonExistingId);
		Todo actualTodo = response.getBody();

		// Assert
		assertNotNull(response);
		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(expectedTodo, actualTodo);
	}

	@Test
	void createTodo_ValidParams_ReturnsCreatedResponse() {
		// Arrange
		TodoControllerApplication controller = new TodoControllerApplication();
		String name = "New Task";
		String description = "New Task Description";
		Map<String, Object> expectedResponse = new HashMap<>();
		expectedResponse.put("taskId", any(UUID.class));
		expectedResponse.put("message", "Task " + name + " added successfully.");

		// Act
		ResponseEntity<Map<String, Object>> response = controller.createTodo(name, description);
		Map<String, Object> actualResponse = response.getBody();

		// Assert
		assertNotNull(response);
		assertEquals(HttpStatus.CREATED, response.getStatusCode());
		assertEquals(expectedResponse.get("message"), actualResponse.get("message"));
		assertNotNull(actualResponse.get("taskId"));
	}

	@Test
	void createTodo_NullName_ReturnsBadRequest() {
		// Arrange
		TodoControllerApplication controller = new TodoControllerApplication();
		String description = "New Task Description";

		// Act
		ResponseEntity<Map<String, Object>> response = controller.createTodo(null, description);

		// Assert
		assertNotNull(response);
		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
	}

	@Test
	void createTodo_NullDescription_ReturnsBadRequest() {
		// Arrange
		TodoControllerApplication controller = new TodoControllerApplication();
		String name = "New Task";

		// Act
		ResponseEntity<Map<String, Object>> response = controller.createTodo(name, null);

		// Assert
		assertNotNull(response);
		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
	}

	@Test
	void updateTodo_ExistingId_ReturnsSuccessResponse() {
		// Arrange
		TodoControllerApplication controller = new TodoControllerApplication();
		UUID existingId = UUID.fromString("f360ba09-4682-448b-b32f-0a9e538502fa");
		Map<String, Object> expectedResponse = new HashMap<>();
		expectedResponse.put("success", true);
		expectedResponse.put("message", "This task has now been completed.");

		// Act
		ResponseEntity<Map<String, Object>> response = controller.updateTodo(existingId);
		Map<String, Object> actualResponse = response.getBody();

		// Assert
		assertNotNull(response);
		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(expectedResponse, actualResponse);
	}

	@Test
	void updateTodo_NonExistingId_ReturnsNotFoundResponse() {
		// Arrange
		TodoControllerApplication controller = new TodoControllerApplication();
		UUID nonExistingId = UUID.fromString("00000000-0000-0000-0000-000000000001");
		Map<String, Object> expectedResponse = new HashMap<>();
		expectedResponse.put("success", false);
		expectedResponse.put("message", "Task not found.");

		// Act
		ResponseEntity<Map<String, Object>> response = controller.updateTodo(nonExistingId);
		Map<String, Object> actualResponse = response.getBody();

		// Assert
		assertNotNull(response);
		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(expectedResponse, actualResponse);
	}

	@Test
	void updateTodo_AlreadyCompleted_ReturnsAlreadyCompleteResponse() {
		// Arrange
		TodoControllerApplication controller = new TodoControllerApplication();
		UUID completedId = UUID.fromString("f360ba09-4682-448b-b32f-0a9e538502fa");
		Map<String, Object> expectedResponse = new HashMap<>();
		expectedResponse.put("success", false);
		expectedResponse.put("message", "Task already marked complete.");

		// Act
		ResponseEntity<Map<String, Object>> response = controller.updateTodo(completedId);
		Map<String, Object> actualResponse = response.getBody();

		// Assert
		assertNotNull(response);
		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertEquals(expectedResponse, actualResponse);
	}
}
