package com.scottlogic.quantifying.ai.model.web;

import java.time.Instant;

public class AddTaskErrorResponse {

    private final String error;
    private final String path;
    private final Instant timestamp;

    public AddTaskErrorResponse(String error, String path, Instant timestamp) {
        this.error = error;
        this.path = path;
        this.timestamp = timestamp;
    }

    public String getError() {
        return error;
    }

    public String getPath() {
        return path;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

}
