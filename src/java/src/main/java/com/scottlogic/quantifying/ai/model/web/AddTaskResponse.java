package com.scottlogic.quantifying.ai.model.web;

import java.util.UUID;

public class AddTaskResponse {

    private UUID taskId;

    private String message;

    public AddTaskResponse(UUID taskId, String message) {
        this.taskId = taskId;
        this.message = message;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public String getMessage() {
        return message;
    }
}
