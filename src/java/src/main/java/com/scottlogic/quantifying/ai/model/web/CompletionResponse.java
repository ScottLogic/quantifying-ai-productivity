
package com.scottlogic.quantifying.ai.model.web;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@JsonInclude
@Getter
@Setter
@Builder
public class CompletionResponse {

    private UUID taskId;
    private boolean success;
    private String message;

}
