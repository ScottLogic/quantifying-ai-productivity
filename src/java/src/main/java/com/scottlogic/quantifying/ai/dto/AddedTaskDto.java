package com.scottlogic.quantifying.ai.dto;

import com.scottlogic.quantifying.ai.model.web.ToDoTask;

public class AddedTaskDto {

    private String taskId;
    private String message;

    public AddedTaskDto(String taskId, String message) {
        this.taskId = taskId;
        this.message = message;
    }

    public String getTaskId() {
        return taskId;
    }

    public String getMessage() {
        return message;
    }

    public static AddedTaskDto created(ToDoTask newTask) {
        StringBuilder sb = new StringBuilder("Task ").append(newTask.getName()).append(" added successfully.");
        return new AddedTaskDto(newTask.getUuid().toString(), sb.toString());
    }

    public static AddedTaskDto failure(String message) {
        return new AddedTaskDto(null, "Bad Request - " + message);
    }
}
