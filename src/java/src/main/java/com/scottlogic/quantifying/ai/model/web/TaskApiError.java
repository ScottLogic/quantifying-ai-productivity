package com.scottlogic.quantifying.ai.model.web;

import java.time.Instant;

public record TaskApiError(Instant timestamp, int status, String error, String path) {
}
