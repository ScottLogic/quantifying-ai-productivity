package com.scottlogic.quantifying.ai.responses;

import java.time.Instant;

public class BadRequestResponse {
    private Instant timestamp;
    private int status;
    private String error;
    private String path;

    public BadRequestResponse(int status, String error, String path) {
        this.timestamp = Instant.now();
        this.status = status;
        this.error = error;
        this.path = path;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}