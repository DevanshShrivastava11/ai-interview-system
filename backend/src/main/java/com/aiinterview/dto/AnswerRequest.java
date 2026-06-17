package com.aiinterview.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerRequest {
    @NotBlank(message = "Answer text is required")
    private String answerText;
}
