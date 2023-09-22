package com.scottlogic.quantifying.ai.model.dto;

public record ErrorResponse(String timestamp, int status, String error, String path) {
}
