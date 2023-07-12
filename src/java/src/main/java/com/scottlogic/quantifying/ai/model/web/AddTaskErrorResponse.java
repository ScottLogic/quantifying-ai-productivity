package com.scottlogic.quantifying.ai.model.web;

public class AddTaskErrorResponse {

    private final String error;
    private final String path;

    public AddTaskErrorResponse(String error, String path) {
        this.error = error;
        this.path = path;
    }

    public String getError() {
        return error;
    }

    public String getPath() {
        return path;
    }

}
