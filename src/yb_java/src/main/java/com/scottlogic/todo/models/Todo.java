package com.scottlogic.todo.models;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.Instant;
import java.util.UUID;

public record Todo(UUID uuid, String name, String description,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC") Instant created,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'", timezone = "UTC") Instant completed,
        boolean complete) {

    public Todo {
        // Constructor
    }

    public Todo(String name, String description) {
        this(UUID.randomUUID(), name, description, Instant.now(), null, false);
    }

    public Todo updateComplete(Boolean complete) {
        return new Todo(uuid(), name(), description(), created(), Instant.now(), complete);
    }
}
