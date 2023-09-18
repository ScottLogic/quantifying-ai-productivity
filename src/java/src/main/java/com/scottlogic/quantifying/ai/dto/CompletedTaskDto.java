package com.scottlogic.quantifying.ai.dto;

public class CompletedTaskDto {

    private boolean success;
    private String message;

    public CompletedTaskDto(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean getSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public static CompletedTaskDto success() {
        return new CompletedTaskDto(true, "This task has now been completed.");
    }

    public static CompletedTaskDto failure(String message) {
        return new CompletedTaskDto(false, message);
    }
}
