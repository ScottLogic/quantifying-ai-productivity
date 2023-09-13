package com.scottlogic.quantifying.ai.dtos;


public class TaskCompletedDTO {
    private final boolean success;
    private final String message;

    public TaskCompletedDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean getSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }
}

