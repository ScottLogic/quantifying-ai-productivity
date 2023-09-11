package com.scottlogic.quantifying.ai.model.web;
import org.springframework.http.HttpStatus;

import java.time.Instant;

public class ErrorResponse {
    private final Instant timestamp;
    private final int status;
    private final String error;
    private final String path;

    public ErrorResponse(HttpStatus status, String path, Instant timestamp) {
        this.timestamp = timestamp;
        this.status = status.value();
        this.error = status.getReasonPhrase();
        this.path = path;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public int getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }

    public String getPath() {
        return path;
    }
}
