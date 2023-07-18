package com.scottlogic.todo;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

public record Todo(UUID uuid, String name, String description,
                   @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'") LocalDateTime created,
                   @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'") LocalDateTime completed, boolean complete) {

    public Todo {
        // Constructor
    }

    public Todo(String name, String description) {
        this(UUID.randomUUID(), name, description, LocalDateTime.now(), null, false);
    }

    public Todo updateComplete(Boolean complete) {
        return new Todo(uuid(), name(), description(), created(), LocalDateTime.now(), complete);
    }
}
