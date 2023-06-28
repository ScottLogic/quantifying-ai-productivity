package com.scottlogic.quantifying.ai.model.web;

public class CompletionResponse {

    private boolean success;

    private String message;

    public CompletionResponse(boolean success, String message) {
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
