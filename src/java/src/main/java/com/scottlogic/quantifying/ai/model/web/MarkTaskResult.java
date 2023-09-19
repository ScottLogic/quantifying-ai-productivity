package com.scottlogic.quantifying.ai.model.web;

public class MarkTaskResult {
    private boolean success;
    private String message;

    public MarkTaskResult(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }
}
