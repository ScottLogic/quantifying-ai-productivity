package com.scottlogic.quantifying.ai.dtos;

public class TaskCreatedDTO {
    private final String taskId;
    private final String message;

    public TaskCreatedDTO(String taskId, String message) {
        this.taskId = taskId;
        this.message = message;
    }

    public String getTaskId() {
        return taskId;
    }

    public String getMessage() {
        return message;
    }
}
