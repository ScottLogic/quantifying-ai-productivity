package com.scottlogic.quantifying.ai.model.web;

import java.util.Date;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

public class ToDoTask {
    private String uuid;
    private String name;
    private String description;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Date created;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC")
    private Date completed;
    private boolean complete;

    public ToDoTask() {
    }

    public ToDoTask(String uuid, String name, String description, Date created, Date completed, boolean complete) {
        this.uuid = uuid;
        this.name = name;
        this.description = description;
        this.created = created;
        this.completed = completed;
        this.complete = complete;
    }

    public ToDoTask(String name, String description) {
        this.uuid = UUID.randomUUID().toString();
        this.name = name;
        this.description = description;
        this.created = new Date();
        this.complete = false;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Date getCompleted() {
        return completed;
    }

    public void setCompleted(Date completed) {
        this.completed = completed;
    }

    public boolean isComplete() {
        return complete;
    }

    public void setComplete(boolean complete) {
        this.complete = complete;
    }

}