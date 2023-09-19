package com.scottlogic.quantifying.ai.model.web;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

import java.time.Instant;

@JsonInclude
@Getter
public class TaskResponse {
    private final String uuid;
    private final String name;
    private final String description;
    private final Instant created;
    private final Instant completed;
    private final boolean complete;

    public TaskResponse(ToDoTask toDoTask) {
        this.uuid = toDoTask.getUuid().toString();
        this.name = toDoTask.getName();
        this.description = toDoTask.getDescription();
        this.created = toDoTask.getCreated();
        this.completed = toDoTask.getCompleted();
        this.complete = toDoTask.isComplete();
    }
}
