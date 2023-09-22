package com.scottlogic.quantifying.ai.model.dto;

import java.util.UUID;

public record CreateTaskResponse(UUID taskId, String message) {
}
