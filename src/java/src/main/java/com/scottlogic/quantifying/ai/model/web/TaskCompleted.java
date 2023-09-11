package com.scottlogic.quantifying.ai.model.web;

public class TaskCompleted {
    private boolean success;
    private String message;

    public TaskCompleted(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Getters and setters (if needed)

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }
}
