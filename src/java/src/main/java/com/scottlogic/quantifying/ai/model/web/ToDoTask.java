package com.scottlogic.quantifying.ai.model.web;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

public class ToDoTask implements java.io.Serializable {

    public static ToDoTask UNKNOWN_TASK = new ToDoTask(UUID.fromString("00000000-0000-0000-0000-000000000000"),
            "Unknown Task", "Unknown Task", Instant.EPOCH, null, false);

    private UUID uuid;

    private String name;

    private String description;

    private Instant created;

    private Instant completed;

    private boolean complete;

    public ToDoTask() {
        // JSON Serialization
    }

    public ToDoTask(String name, String description) {
        this(UUID.randomUUID(), name, description, Instant.now(), null, false);
    }

    public ToDoTask(String name, String description, Instant created, Instant completed, boolean complete) {
        this(UUID.randomUUID(), name, description, created, completed, complete);
    }

    public ToDoTask(UUID uuid, String name, String description, Instant created, Instant completed, boolean complete) {
        if (Objects.nonNull(uuid)) {
            this.uuid = uuid;
        } else {
            this.uuid = UUID.randomUUID();
        }
        this.name = name;
        this.description = description;
        this.created = created;
        this.completed = completed;
        this.complete = complete;
    }

    public UUID getUuid() {
        return uuid;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Instant getCreated() {
        return created;
    }

    public Instant getCompleted() {
        return completed;
    }

    public boolean isComplete() {
        return complete;
    }

    public void setCompleted(Instant completed) {
        this.completed = completed;
    }

    public void setComplete(boolean complete) {
        this.complete = complete;
    }
}
