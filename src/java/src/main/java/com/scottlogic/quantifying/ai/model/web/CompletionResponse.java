package com.scottlogic.quantifying.ai.model.web;

public class CompletionResponse
{
    private boolean success;
    private String description;

    public CompletionResponse(boolean success, String description)
    {
        this.success = success;
        this.description = description;
    }

    public boolean isSuccess()
    {
        return success;
    }

    public String getDescription()
    {
        return description;
    }
}
