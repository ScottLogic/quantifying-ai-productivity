
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
public class AddTaskCompletionResponse {

    private UUID taskId;
    private String message;

}
