package com.scottlogic.quantifying.ai.responses;

public class SetCompletedResponse {
    private boolean success;
    private String message;

    public SetCompletedResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Getters and setters (if needed)

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}